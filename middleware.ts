import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // For now, disable maintenance mode check to avoid Edge Runtime issues
    // You can implement this via environment variables or API routes instead
    const isMaintenancePage = req.nextUrl.pathname === '/maintenance'
    const isApiRoute = req.nextUrl.pathname.startsWith('/api')
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token && token.role === 'admin'
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}