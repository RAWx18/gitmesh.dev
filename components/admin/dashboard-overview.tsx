'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStats, formatUptime, formatLastSync } from '@/hooks/use-dashboard-stats'
import { 
  FileText, 
  Mail, 
  Users, 
  Activity, 
  RefreshCw,
  TrendingUp,
  Clock,
  Server
} from 'lucide-react'

export function DashboardOverview() {
  const { stats, loading, error, refetch } = useDashboardStats()

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Error Loading Dashboard</CardTitle>
          <CardDescription className="text-red-600">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Overview</h3>
          <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : `Last updated: ${stats ? new Date(stats.lastUpdated).toLocaleTimeString() : 'Unknown'}`}
          </p>
        </div>
        <Button 
          onClick={refetch} 
          variant="outline" 
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Content Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.content.totalContent || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.content.blogPosts || 0} posts, {stats?.content.pages || 0} pages
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Newsletter Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.newsletter.subscribers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.newsletter.campaigns || 0} campaigns sent
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Contributors Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contributors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.contributors.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Synced {formatLastSync(stats?.contributors.lastSync || null)}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* System Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold capitalize">{stats?.system.environment || 'Unknown'}</div>
                <p className="text-xs text-muted-foreground">
                  Uptime: {formatUptime(stats?.system.uptime || 0)}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button asChild variant="outline" size="sm" className="h-auto py-3">
              <a href="/admin/content" className="flex flex-col items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-xs">New Post</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-auto py-3">
              <a href="/admin/newsletter" className="flex flex-col items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-xs">Newsletter</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-auto py-3">
              <a href="/admin/contributors" className="flex flex-col items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-xs">Sync Contributors</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-auto py-3">
              <a href="/admin/diagnostics" className="flex flex-col items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="text-xs">Diagnostics</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}