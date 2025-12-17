'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ExternalLink,
  FileText,
  Globe,
  Zap,
  Clock
} from 'lucide-react'
import { DiagnosticResult, SiteDiagnostics } from '@/lib/diagnostics'

export function DiagnosticsView() {
  const [diagnostics, setDiagnostics] = useState<SiteDiagnostics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRun, setLastRun] = useState<Date | null>(null)

  const runDiagnostics = async (type?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const url = '/api/admin/diagnostics'
      const options: RequestInit = {
        method: type ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      
      if (type) {
        options.body = JSON.stringify({ type })
      }
      
      const response = await fetch(url, options)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to run diagnostics')
      }
      
      setDiagnostics(data.data)
      setLastRun(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: 'pass' | 'warning' | 'error') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusColor = (status: 'pass' | 'warning' | 'error') => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'links':
        return <ExternalLink className="h-4 w-4" />
      case 'metadata':
        return <FileText className="h-4 w-4" />
      case 'sitemap':
        return <Globe className="h-4 w-4" />
      case 'lighthouse':
        return <Zap className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4" />
        <AlertDescription className="text-red-800">
          {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Site Health Overview</h3>
          {lastRun && (
            <p className="text-sm text-gray-600">
              Last run: {lastRun.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => runDiagnostics()} 
            disabled={loading}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Run All Checks
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {diagnostics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={`border-2 ${getStatusColor(diagnostics.overall)}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {getStatusIcon(diagnostics.overall)}
                Overall Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{diagnostics.overall}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Passed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{diagnostics.summary.passed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{diagnostics.summary.warnings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                Errors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{diagnostics.summary.errors}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Individual Diagnostic Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Links Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Link Validation
            </CardTitle>
            <CardDescription>
              Check for broken internal and external links
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="space-y-3">
                {diagnostics?.results
                  .filter(r => r.type === 'links')
                  .map((result, index) => (
                    <DiagnosticResultCard key={index} result={result} />
                  ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => runDiagnostics('links')}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Links Only
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metadata Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Metadata Validation
            </CardTitle>
            <CardDescription>
              Validate page titles, descriptions, and SEO metadata
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="space-y-3">
                {diagnostics?.results
                  .filter(r => r.type === 'metadata')
                  .map((result, index) => (
                    <DiagnosticResultCard key={index} result={result} />
                  ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => runDiagnostics('metadata')}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Metadata Only
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sitemap Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Sitemap Validation
            </CardTitle>
            <CardDescription>
              Verify sitemap accessibility and structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="space-y-3">
                {diagnostics?.results
                  .filter(r => r.type === 'sitemap')
                  .map((result, index) => (
                    <DiagnosticResultCard key={index} result={result} />
                  ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => runDiagnostics('sitemap')}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Sitemap Only
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lighthouse Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Lighthouse performance, accessibility, and SEO scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="space-y-3">
                {diagnostics?.results
                  .filter(r => r.type === 'lighthouse')
                  .map((result, index) => (
                    <DiagnosticResultCard key={index} result={result} />
                  ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => runDiagnostics('lighthouse')}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Performance Only
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DiagnosticResultCard({ result }: { result: DiagnosticResult }) {
  const getStatusIcon = (status: 'pass' | 'warning' | 'error') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusColor = (status: 'pass' | 'warning' | 'error') => {
    switch (status) {
      case 'pass':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'error':
        return 'border-red-200 bg-red-50'
    }
  }

  return (
    <div className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}>
      <div className="flex items-start gap-2">
        {getStatusIcon(result.status)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {result.message}
          </p>
          {result.details && (
            <div className="mt-2 text-xs text-gray-600">
              {typeof result.details === 'string' ? (
                <p>{result.details}</p>
              ) : (
                <details className="cursor-pointer">
                  <summary className="font-medium">View Details</summary>
                  <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            <Clock className="h-3 w-3 inline mr-1" />
            {new Date(result.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  )
}