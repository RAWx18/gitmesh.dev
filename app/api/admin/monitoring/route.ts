import { NextRequest, NextResponse } from 'next/server'
import { validateAdminAccess } from '@/lib/auth'
import { healthChecker, uptimeMonitor } from '@/lib/monitoring'
import { createAPIHandler } from '@/lib/api-error-handler'

/**
 * Admin monitoring endpoint
 * GET /api/admin/monitoring - Returns detailed system monitoring data
 */
export const GET = createAPIHandler(async (req: NextRequest) => {
  const validation = await validateAdminAccess()
  
  if (!validation.isValid) {
    throw new Error('Admin access required')
  }

  const health = await healthChecker.runHealthChecks()
  const metrics = healthChecker.getMetrics()
  const uptimeStats = uptimeMonitor.getStats()
  
  return {
    health,
    metrics,
    uptime: uptimeStats,
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      pid: process.pid,
      ppid: process.ppid
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      vercelRegion: process.env.VERCEL_REGION,
      vercelUrl: process.env.VERCEL_URL
    }
  }
}, {
  context: 'admin-monitoring'
})

/**
 * Reset metrics endpoint
 * POST /api/admin/monitoring/reset - Resets performance metrics
 */
export const POST = createAPIHandler(async (req: NextRequest) => {
  const validation = await validateAdminAccess()
  
  if (!validation.isValid) {
    throw new Error('Admin access required')
  }

  const body = await req.json()
  const { action } = body

  if (action === 'reset-metrics') {
    healthChecker.resetMetrics()
    return { message: 'Performance metrics reset successfully' }
  }

  throw new Error('Invalid action')
}, {
  context: 'admin-monitoring-reset'
})