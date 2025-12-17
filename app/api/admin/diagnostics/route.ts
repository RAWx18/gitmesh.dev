import { NextRequest, NextResponse } from 'next/server'
import { validateAdminAccess } from '@/lib/auth'
import { runSiteDiagnostics } from '@/lib/diagnostics'

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

  try {
    const diagnostics = await runSiteDiagnostics()
    
    return NextResponse.json({
      success: true,
      data: diagnostics,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Diagnostics error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to run diagnostics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
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

  try {
    const body = await req.json()
    const { type } = body

    let result
    switch (type) {
      case 'links':
        result = await runSiteDiagnostics(['links'])
        break
      case 'metadata':
        result = await runSiteDiagnostics(['metadata'])
        break
      case 'sitemap':
        result = await runSiteDiagnostics(['sitemap'])
        break
      case 'lighthouse':
        result = await runSiteDiagnostics(['lighthouse'])
        break
      default:
        result = await runSiteDiagnostics()
    }
    
    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Diagnostics error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to run diagnostics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}