'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, RefreshCw, Github } from 'lucide-react'

interface GitHubStatus {
  connected: boolean
  error?: string
  loading: boolean
}

export function GitHubStatus() {
  const [status, setStatus] = useState<GitHubStatus>({
    connected: false,
    loading: true,
  })

  const testConnection = async () => {
    setStatus(prev => ({ ...prev, loading: true, error: undefined }))
    
    try {
      const response = await fetch('/api/admin/github/test')
      const data = await response.json()
      
      if (data.success) {
        setStatus({
          connected: true,
          loading: false,
        })
      } else {
        setStatus({
          connected: false,
          loading: false,
          error: data.error || 'Connection failed',
        })
      }
    } catch (error: any) {
      setStatus({
        connected: false,
        loading: false,
        error: error.message || 'Network error',
      })
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Integration
        </CardTitle>
        <CardDescription>
          Status of GitHub repository connection for content commits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status.loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : status.connected ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="font-medium">
              {status.loading ? 'Testing...' : status.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Badge variant={status.connected ? 'default' : 'destructive'}>
            {status.connected ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {status.error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{status.error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Repository:</strong> {process.env.NEXT_PUBLIC_GITHUB_REPO || 'Not configured'}
          </p>
          <p>
            <strong>Token:</strong> {process.env.GITHUB_TOKEN ? 'Configured' : 'Not configured'}
          </p>
        </div>

        <Button 
          onClick={testConnection} 
          disabled={status.loading}
          variant="outline"
          size="sm"
        >
          {status.loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Test Connection
            </>
          )}
        </Button>

        {!status.connected && (
          <Alert>
            <AlertDescription>
              <strong>Setup Required:</strong> Configure GITHUB_TOKEN and GITHUB_REPO environment variables to enable automatic content commits.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}