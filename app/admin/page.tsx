import { requireAdmin } from '@/lib/admin-protection'
import { AdminPage } from '@/components/admin/admin-layout'
import { AdminTest } from '@/components/admin/admin-test'
import { DashboardOverview } from '@/components/admin/dashboard-overview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function Dashboard() {
  const session = await requireAdmin()

  return (
    <AdminPage 
      title="Dashboard" 
      description={`Welcome back, ${session.user?.name || session.user?.email}!`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>
              Manage blog posts, pages, and other content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/content">Manage Content</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Newsletter</CardTitle>
            <CardDescription>
              Manage subscribers and send newsletters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/newsletter">Newsletter</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contributors</CardTitle>
            <CardDescription>
              View contributor sync status and logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/contributors">Contributors</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Diagnostics</CardTitle>
            <CardDescription>
              Monitor site health and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/diagnostics">Diagnostics</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage admin users and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Configure site settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/settings">Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <DashboardOverview />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system information and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Admin Email:</span>
                <div className="text-gray-600">{session.user?.email}</div>
              </div>
              <div>
                <span className="font-medium">Role:</span>
                <div className="text-gray-600">{session.user?.role || 'admin'}</div>
              </div>
              <div>
                <span className="font-medium">Last Login:</span>
                <div className="text-gray-600">{new Date().toLocaleDateString()}</div>
              </div>
              <div>
                <span className="font-medium">Environment:</span>
                <div className="text-gray-600">{process.env.NODE_ENV}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <AdminTest />
      </div>
    </AdminPage>
  )
}