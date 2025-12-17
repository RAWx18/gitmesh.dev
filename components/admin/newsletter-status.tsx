'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  TrendingUp,
  Users,
  AlertTriangle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface EmailDeliveryLog {
  id: string
  timestamp: string
  type: 'newsletter' | 'confirmation' | 'welcome'
  subject: string
  recipientCount: number
  successCount: number
  failureCount: number
  failures: Array<{
    email: string
    error: string
  }>
  tags: string[]
  adminUser: string
}

interface EmailStats {
  totalLogs: number
  totalEmails: number
  totalSuccessful: number
  totalFailed: number
  recentActivity: number
}

export function NewsletterStatus() {
  const [logs, setLogs] = useState<EmailDeliveryLog[]>([])
  const [stats, setStats] = useState<EmailStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'newsletter' | 'confirmation' | 'welcome'>('all')
  const { toast } = useToast()

  const loadStatus = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.set('type', filter)
      }
      
      const response = await fetch(`/api/admin/newsletter/status?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to load newsletter status')
      }
      
      const data = await response.json()
      setLogs(data.logs)
      setStats(data.stats)
    } catch (error) {
      toast({
        title: 'Error loading status',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [filter])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'newsletter':
        return <Mail className="h-4 w-4 text-blue-600" />
      case 'confirmation':
        return <Clock className="h-4 w-4 text-orange-600" />
      case 'welcome':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const getSuccessRate = (log: EmailDeliveryLog) => {
    if (log.recipientCount === 0) return 0
    return Math.round((log.successCount / log.recipientCount) * 100)
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmails}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalSuccessful}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.totalFailed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalEmails > 0 ? Math.round((stats.totalSuccessful / stats.totalEmails) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Email History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Delivery History</CardTitle>
              <CardDescription>
                Track newsletter and email delivery status
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="newsletter">Newsletters</option>
                <option value="confirmation">Confirmations</option>
                <option value="welcome">Welcome Emails</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={loadStatus}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading email history...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No email history found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(log.type)}
                        <span className="font-medium">{log.subject}</span>
                        <Badge variant="outline" className="capitalize">
                          {log.type}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        Sent by {log.adminUser} • {formatDate(log.timestamp)}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {log.recipientCount} recipients
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          {log.successCount} successful
                        </div>
                        {log.failureCount > 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <XCircle className="h-4 w-4" />
                            {log.failureCount} failed
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-blue-600">
                          <TrendingUp className="h-4 w-4" />
                          {getSuccessRate(log)}% success rate
                        </div>
                      </div>

                      {log.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {log.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {log.failures.length > 0 && (
                        <details className="mt-3">
                          <summary className="cursor-pointer text-sm text-red-600 flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            View {log.failures.length} failure{log.failures.length > 1 ? 's' : ''}
                          </summary>
                          <div className="mt-2 space-y-1">
                            {log.failures.slice(0, 5).map((failure, index) => (
                              <div key={index} className="text-xs bg-red-50 p-2 rounded border-l-2 border-red-200">
                                <div className="font-mono">{failure.email}</div>
                                <div className="text-red-600">{failure.error}</div>
                              </div>
                            ))}
                            {log.failures.length > 5 && (
                              <div className="text-xs text-muted-foreground">
                                ... and {log.failures.length - 5} more failures
                              </div>
                            )}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}