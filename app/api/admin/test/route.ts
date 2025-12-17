import { NextRequest, NextResponse } from 'next/server'
import { validateAdminAccess } from '@/lib/auth'

export async function GET(req: NextRequest) {
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

  return NextResponse.json({
    message: 'Admin access granted',
    user: {
      email: validation.session.user?.email,
      name: validation.session.user?.name,
      role: validation.session.user?.role
    },
    timestamp: new Date().toISOString()
  })
}

export async function POST(req: NextRequest) {
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

  const body = await req.json()
  
  return NextResponse.json({
    message: 'Admin POST request processed',
    user: validation.session.user?.email,
    data: body,
    timestamp: new Date().toISOString()
  })
}