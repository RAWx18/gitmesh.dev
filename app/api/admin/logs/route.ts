import { NextRequest } from 'next/server'
import { validateAdminAccess } from '@/lib/auth'
import { errorLogger } from '@/lib/error-logger'
import { createAPIHandler, validateMethod } from '@/lib/api-error-handler'
import { AppError } from '@/lib/error-handling'
import { ErrorCodes } from '@/types'

/**
 * Get error logs
 * GET /api/admin/logs - Returns recent error logs
 */
export const GET = createAPIHandler(async (req: NextRequest) => {
  validateMethod(['GET'])(req)
  
  const validation = await validateAdminAccess()
  
  if (!validation.isValid) {
    throw new AppError(
      validation.error || 'Admin access required',
      ErrorCodes.UNAUTHORIZED,
      401
    )
  }

  const url = new URL(req.url)
  const limit = parseInt(url.searchParams.get('limit') || '50')
  const level = url.searchParams.get('level') || undefined
  
  const logs = await errorLogger.getRecentLogs(limit)
  
  // Filter by level if specified
  const filteredLogs = level 
    ? logs.filter(log => log.level === level)
    : logs
  
  return {
    logs: filteredLogs,
    total: filteredLogs.length,
    limit
  }
}, {
  context: 'admin-logs'
})

/**
 * Clear old logs
 * DELETE /api/admin/logs - Clears logs older than specified days
 */
export const DELETE = createAPIHandler(async (req: NextRequest) => {
  validateMethod(['DELETE'])(req)
  
  const validation = await validateAdminAccess()
  
  if (!validation.isValid) {
    throw new AppError(
      validation.error || 'Admin access required',
      ErrorCodes.UNAUTHORIZED,
      401
    )
  }

  const body = await req.json()
  const { olderThanDays = 30 } = body
  
  await errorLogger.clearLogs(olderThanDays)
  
  return {
    message: `Cleared logs older than ${olderThanDays} days`
  }
}, {
  context: 'admin-logs-clear'
})