import { redirect } from 'next/navigation'
import { validateAdminAccess } from './auth'

/**
 * Server-side admin route protection for page components
 * Redirects to signin if not authenticated or not admin
 */
export async function requireAdmin() {
  const validation = await validateAdminAccess()
  
  if (!validation.isValid) {
    if (!validation.session) {
      // Not authenticated - redirect to signin
      redirect('/auth/signin')
    } else {
      // Authenticated but not admin - redirect to error
      redirect('/auth/error?error=AccessDenied')
    }
  }
  
  return validation.session
}

/**
 * Server-side admin check without redirects
 * Returns null if not admin, session if admin
 */
export async function checkAdmin() {
  const validation = await validateAdminAccess()
  return validation.isValid ? validation.session : null
}

/**
 * Middleware helper for protecting API routes
 */
export function createAdminApiHandler<T = any>(
  handler: (session: any) => Promise<Response> | Response
) {
  return async (): Promise<Response> => {
    const validation = await validateAdminAccess()
    
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized', 
          message: validation.error || 'Admin access required' 
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    try {
      return await handler(validation.session)
    } catch (error) {
      console.error('Admin API handler error:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Internal Server Error',
          message: 'An error occurred processing the request'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
}