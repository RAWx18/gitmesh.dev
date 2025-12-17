'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export interface AdminSession {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

/**
 * Hook for checking admin access on client side
 */
export function useAdmin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const isAdmin = session?.user?.role === 'admin'
  const isAuthenticated = status === 'authenticated'

  useEffect(() => {
    if (status === 'loading') return

    setIsLoading(false)

    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (isAuthenticated && !isAdmin) {
      router.push('/auth/error?error=AccessDenied')
      return
    }
  }, [status, isAuthenticated, isAdmin, router])

  return {
    session: session as AdminSession | null,
    isAdmin,
    isAuthenticated,
    isLoading: status === 'loading' || isLoading,
    user: session?.user
  }
}

/**
 * Hook for admin access without automatic redirects
 */
export function useAdminCheck() {
  const { data: session, status } = useSession()

  const isAdmin = session?.user?.role === 'admin'
  const isAuthenticated = status === 'authenticated'

  return {
    session: session as AdminSession | null,
    isAdmin,
    isAuthenticated,
    isLoading: status === 'loading',
    user: session?.user
  }
}

/**
 * Hook for requiring admin access with loading state
 */
export function useRequireAdmin() {
  const { session, isAdmin, isAuthenticated, isLoading } = useAdmin()

  if (isLoading) {
    return { session: null, isLoading: true }
  }

  if (!isAuthenticated || !isAdmin) {
    return { session: null, isLoading: false }
  }

  return { session, isLoading: false }
}