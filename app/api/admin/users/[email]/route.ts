import { NextRequest, NextResponse } from 'next/server'
import { validateAdminAccess } from '@/lib/auth'
import { removeAdminUser, updateAdminUser, logAdminActivity } from '@/lib/admin-users'

interface RouteParams {
  params: {
    email: string
  }
}

// PATCH /api/admin/users/[email] - Update admin user
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
    const email = decodeURIComponent(params.email)
    const body = await request.json()
    const { role } = body

    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation Error',
          message: 'Email parameter is required' 
        },
        { status: 400 }
      )
    }

    if (!role || !['admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation Error',
          message: 'Valid role is required (admin or super_admin)' 
        },
        { status: 400 }
      )
    }

    const result = await updateAdminUser(email, { role }, validation.session.user?.email)
    
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
      action: 'USER_UPDATED',
      adminUser: validation.session.user?.email || 'unknown',
      targetUser: email,
      details: `Updated role to: ${role}`,
      timestamp: new Date(),
      metadata: { role, previousRole: result.previousRole }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully updated role for ${email}`,
      user: result.user
    })
  } catch (error) {
    console.error('Error updating admin user:', error)
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

// DELETE /api/admin/users/[email] - Remove admin user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    const email = decodeURIComponent(params.email)

    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation Error',
          message: 'Email parameter is required' 
        },
        { status: 400 }
      )
    }

    // Prevent self-removal
    if (email === validation.session.user?.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Operation Not Allowed',
          message: 'Cannot remove yourself from admin list' 
        },
        { status: 400 }
      )
    }

    const result = await removeAdminUser(email, validation.session.user?.email)
    
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
      action: 'USER_REMOVED',
      adminUser: validation.session.user?.email || 'unknown',
      targetUser: email,
      details: `Removed user from admin allowlist`,
      timestamp: new Date(),
      metadata: { removedRole: result.removedUser?.role }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully removed ${email} from admin allowlist`
    })
  } catch (error) {
    console.error('Error removing admin user:', error)
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