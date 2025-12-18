import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { existsSync } from 'fs'
import { join } from 'path'

function checkMaintenanceMode(): boolean {
  try {
    const maintenanceFile = join(process.cwd(), '.maintenance')
    return existsSync(maintenanceFile)
  } catch {
    return false
  }
}

export default withAuth(
  function middleware(req) {
    // Check for maintenance mode
    const isMaintenanceMode = checkMaintenanceMode()
    const isMaintenancePage = req.nextUrl.pathname === '/maintenance'
    const isApiRoute = req.nextUrl.pathname.startsWith('/api')
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    
    // If maintenance mode is enabled and not already on maintenance page, API, or admin routes
    if (isMaintenanceMode && !isMaintenancePage && !isApiRoute && !isAdminRoute) {
      return NextResponse.redirect(new URL('/maintenance', req.url))
    }
    
    // Don't redirect away from maintenance page if it's being accessed directly for preview
    // Only redirect if maintenance mode is disabled AND user came from a redirect
    // This allows direct access to /maintenance for preview purposes
    
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Skip auth check during maintenance mode (except for maintenance page)
        const isMaintenanceMode = checkMaintenanceMode()
        if (isMaintenanceMode && req.nextUrl.pathname === '/maintenance') {
          return true
        }
        
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