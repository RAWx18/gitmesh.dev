import { NextRequest, NextResponse } from 'next/server'
import { healthChecker, uptimeMonitor } from '@/lib/monitoring'
import { createAPIHandler } from '@/lib/api-error-handler'

/**
 * Health check endpoint
 * GET /api/health - Returns system health status
 */
export const GET = createAPIHandler(async (req: NextRequest) => {
  const health = await healthChecker.runHealthChecks()
  const uptimeStats = uptimeMonitor.getStats()
  
  return {
    ...health,
    uptime: uptimeStats
  }
}, {
  context: 'health-check'
})

/**
 * Simple liveness probe
 * GET /api/health?probe=liveness - Returns 200 if service is running
 */
export async function HEAD(req: NextRequest) {
  const url = new URL(req.url)
  const probe = url.searchParams.get('probe')
  
  if (probe === 'liveness') {
    return new NextResponse(null, { status: 200 })
  }
  
  // For readiness probe, check if critical services are healthy
  if (probe === 'readiness') {
    try {
      const health = await healthChecker.runHealthChecks()
      const criticalChecks = health.checks.filter(check => 
        ['Environment', 'File System'].includes(check.name)
      )
      
      const isReady = criticalChecks.every(check => check.status !== 'unhealthy')
      
      return new NextResponse(null, { 
        status: isReady ? 200 : 503,
        headers: {
          'X-Health-Status': health.overall
        }
      })
    } catch (error) {
      return new NextResponse(null, { status: 503 })
    }
  }
  
  return new NextResponse(null, { status: 200 })
}