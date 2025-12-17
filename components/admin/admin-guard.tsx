'use client'

import { useAdmin } from '@/hooks/use-admin'
import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

interface AdminGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Client-side admin route protection component
 */
export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { isAdmin, isLoading, isAuthenticated } = useAdmin()

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Spinner />
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  if (!isAuthenticated || !isAdmin) {
    // The useAdmin hook will handle redirects
    return null
  }

  return <>{children}</>
}

/**
 * Simple admin check component without redirects
 */
export function AdminOnly({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading } = useAdmin()

  if (isLoading || !isAdmin) {
    return null
  }

  return <>{children}</>
}