import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createGitHubContentManager, handleGitHubError } from '@/lib/github-content'

/**
 * Test GitHub connection and permissions
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check admin permissions
    const adminEmails = process.env.GITMESH_CE_ADMIN_EMAILS?.split(',') || []
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Test GitHub connection
    const githubManager = createGitHubContentManager()
    const result = await githubManager.testConnection()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'GitHub connection successful',
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('GitHub test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: handleGitHubError(error)
      },
      { status: 500 }
    )
  }
}