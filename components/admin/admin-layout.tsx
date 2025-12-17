'use client'

import { ReactNode } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { AdminGuard } from './admin-guard'
import { AdminErrorBoundary, ComponentErrorBoundary } from '@/components/error-boundary'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  FileText, 
  Mail, 
  Users, 
  Activity, 
  Settings, 
  LogOut,
  ArrowLeft,
  GitBranch,
  BarChart3
} from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Contributors', href: '/admin/contributors', icon: GitBranch },
  { name: 'Diagnostics', href: '/admin/diagnostics', icon: Activity },
  { name: 'Monitoring', href: '/admin/monitoring', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const { user } = useAdmin()
  const pathname = usePathname()

  return (
    <AdminGuard>
      <AdminErrorBoundary>
        <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Site
                </Link>
                <div className="h-6 border-l border-gray-300" />
                <h1 className="text-xl font-semibold text-gray-900">
                  GitMesh CE Admin
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user?.name || user?.email}
                </span>
                <Button asChild variant="outline" size="sm">
                  <Link href="/auth/signout">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <nav className="w-64 bg-white shadow-sm min-h-screen">
            <div className="p-4">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1 p-8">
            {title && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                {description && (
                  <p className="text-gray-600 mt-2">{description}</p>
                )}
              </div>
            )}
            <ComponentErrorBoundary componentName="AdminContent">
              {children}
            </ComponentErrorBoundary>
          </main>
        </div>
      </div>
      </AdminErrorBoundary>
    </AdminGuard>
  )
}

/**
 * Simple admin page wrapper
 */
export function AdminPage({ children, title, description }: AdminLayoutProps) {
  return (
    <AdminLayout title={title} description={description}>
      {children}
    </AdminLayout>
  )
}