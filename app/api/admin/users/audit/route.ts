import { NextRequest, NextResponse } from 'next/server'
import { validateAdminAccess } from '@/lib/auth'
import { getAuditLogs } from '@/lib/admin-users'

// GET /api/admin/users/audit - Get admin activity audit logs
export async function GET(request: NextRequest) {
  const validation = await validateAdminAccess()
  
  if (!validation.isValid) {
    return NextResponse.json(
      { 
        error: 'Unauthorized', 
        message: validation.error || 'Admin access required' 
      },
      { status: 401 }
    )
  }

  try {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    
    const logs = await getAuditLogs({ limit, offset })
    
    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        limit,
        offset,
        total: logs.length
      }
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch audit logs',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}