'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Activity, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Zap,
  TrendingUp,
  Server,
  Database,
  Mail,
  Github
} from 'lucide-react'
import { useErrorHandler } from '@/components/error-boundary'

interface HealthCheck {
  name: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  message?: string
  responseTime?: number
  lastChecked: Date
  details?: Record<string, any>
}

interface SystemHealth {
  overall: 'healthy' | 'unhealthy' | 'degraded'
  checks: HealthCheck[]
  timestamp: Date
  uptime: number
  version: string
  environment: string
}

interface MonitoringData {
  health: SystemHealth
  metrics: {
    requestCount: number
    averageResponseTime: number
    errorRate: number
    lastReset: Date
    endpoints: Record<string, {
      count: number
      totalTime: number
      errors: number
    }>
  }
  uptime: {
    uptime: number
    uptimeFormatted: string
    availability: number
    totalChecks: number
    recentChecks: number
    successfulChecks: number
  }
  system: {
    nodeVersion: string
    platform: string
    arch: string
    memory: NodeJS.MemoryUsage
    cpuUsage: NodeJS.CpuUsage
    pid: number
    ppid: number
  }
  environment: {
    nodeEnv: string
    vercelEnv?: string
    vercelRegion?: string
    vercelUrl?: string
  }
}

export function MonitoringDashboard() {
  const [data, setData] = useState<MonitoringData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const handleError = useErrorHandler()

  const fetchMonitoringData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/monitoring')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch monitoring data')
      }
      
      setData(result.data)
      setLastRefresh(new Date())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      handleError(err as Error, { component: 'MonitoringDashboard', action: 'fetchData' })
    } finally {
      setLoading(false)
    }
  }

  const resetMetrics = async () => {
    try {
      const response = await fetch('/api/admin/monitoring/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset-metrics' })
      })
      
      if (!response.ok) {
        throw new Error('Failed to reset metrics')
      }
      
      // Refresh data after reset
      await fetchMonitoringData()
    } catch (err) {
      handleError(err as Error, { component: 'MonitoringDashboard', action: 'resetMetrics' })
    }
  }

  useEffect(() => {
    fetchMonitoringData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMonitoringData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'default' as const,
      degraded: 'secondary' as const,
      unhealthy: 'destructive' as const
    }
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    )
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 10000) / 100}%`
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Monitoring Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button 
            onClick={fetchMonitoringData} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">System Monitoring</h3>
          <p className="text-sm text-gray-600">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={resetMetrics} variant="outline" size="sm">
            Reset Metrics
          </Button>
          <Button 
            onClick={fetchMonitoringData} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {loading ? (
              <Skeleton className="h-4 w-4" />
            ) : (
              getStatusIcon(data?.health.overall || 'unknown')
            )}
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {getStatusBadge(data?.health.overall || 'unknown')}
              <span className="text-sm text-gray-600">
                {data?.health.checks.length} services monitored
              </span>
              <span className="text-sm text-gray-600">
                Uptime: {data?.uptime.uptimeFormatted}
              </span>
              <span className="text-sm text-gray-600">
                Availability: {data?.uptime.availability}%
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Service Health</CardTitle>
          <CardDescription>
            Status of individual system components
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {data?.health.checks.map((check) => (
                <div key={check.name} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <div className="font-medium">{check.name}</div>
                      {check.message && (
                        <div className="text-sm text-gray-600">{check.message}</div>
                      )}
                      {check.responseTime && (
                        <div className="text-xs text-gray-500">
                          Response time: {check.responseTime}ms
                        </div>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(check.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{data?.metrics.requestCount || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {Math.round(data?.metrics.averageResponseTime || 0)}ms
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {formatPercentage(data?.metrics.errorRate || 0)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {formatBytes(data?.system.memory.heapUsed || 0)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium">Environment</div>
                <div className="text-gray-600">{data?.environment.nodeEnv}</div>
              </div>
              <div>
                <div className="font-medium">Node Version</div>
                <div className="text-gray-600">{data?.system.nodeVersion}</div>
              </div>
              <div>
                <div className="font-medium">Platform</div>
                <div className="text-gray-600">{data?.system.platform} ({data?.system.arch})</div>
              </div>
              <div>
                <div className="font-medium">Memory Heap</div>
                <div className="text-gray-600">
                  {formatBytes(data?.system.memory.heapUsed || 0)} / {formatBytes(data?.system.memory.heapTotal || 0)}
                </div>
              </div>
              <div>
                <div className="font-medium">Process ID</div>
                <div className="text-gray-600">{data?.system.pid}</div>
              </div>
              {data?.environment.vercelRegion && (
                <div>
                  <div className="font-medium">Vercel Region</div>
                  <div className="text-gray-600">{data.environment.vercelRegion}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}