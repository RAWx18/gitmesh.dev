import { NextRequest, NextResponse } from 'next/server'
import { validateAdminAccess } from '@/lib/auth'
import { getAdminUsers, addAdminUser, logAdminActivity } from '@/lib/admin-users'

// GET /api/admin/users - List all admin users
export async function GET() {
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
    const users = await getAdminUsers()
    
    return NextResponse.json({
      success: true,
      users
    })
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch admin users',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/admin/users - Add new admin user
export async function POST(request: NextRequest) {
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
    const body = await request.json()
    const { email, role = 'admin' } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation Error',
          message: 'Valid email is required' 
        },
        { status: 400 }
      )
    }

    if (!['admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation Error',
          message: 'Role must be admin or super_admin' 
        },
        { status: 400 }
      )
    }

    const result = await addAdminUser(email.trim(), role, validation.session.user?.email)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Operation Failed',
          message: result.error 
        },
        { status: 400 }
      )
    }

    // Log the activity
    await logAdminActivity({
      action: 'USER_ADDED',
      adminUser: validation.session.user?.email || 'unknown',
      targetUser: email,
      details: `Added user with role: ${role}`,
      timestamp: new Date(),
      metadata: { role }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully added ${email} as ${role}`,
      user: result.user
    })
  } catch (error) {
    console.error('Error adding admin user:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}