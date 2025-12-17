import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createGitHubContentManager, handleGitHubError } from '@/lib/github-content'
import { z } from 'zod'

/**
 * Commit content to GitHub repository
 */

const commitRequestSchema = z.object({
  type: z.enum(['blog', 'page', 'data']),
  action: z.enum(['create', 'update', 'delete']),
  filename: z.string().min(1),
  frontmatter: z.object({}).optional(),
  content: z.string().optional(),
  title: z.string().optional(),
  dataType: z.enum(['contributors', 'newsletter', 'config']).optional(),
  description: z.string().optional(),
})

export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json()
    const validation = commitRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validation.error.errors
        },
        { status: 400 }
      )
    }

    const { type, action, filename, frontmatter, content, title, dataType, description } = validation.data

    // Create GitHub manager
    const githubManager = createGitHubContentManager()
    const options = { adminUser: session.user.email }

    let result

    // Handle different content types and actions
    if (type === 'blog') {
      if (!frontmatter || !content) {
        return NextResponse.json(
          { error: 'Frontmatter and content are required for blog posts' },
          { status: 400 }
        )
      }

      switch (action) {
        case 'create':
          result = await githubManager.createBlogPost(filename, frontmatter as any, content, options)
          break
        case 'update':
          result = await githubManager.updateBlogPost(filename, frontmatter as any, content, options)
          break
        case 'delete':
          if (!title) {
            return NextResponse.json(
              { error: 'Title is required for deleting blog posts' },
              { status: 400 }
            )
          }
          result = await githubManager.deleteBlogPost(filename, title, options)
          break
      }
    } else if (type === 'page') {
      if (!frontmatter || !content) {
        return NextResponse.json(
          { error: 'Frontmatter and content are required for pages' },
          { status: 400 }
        )
      }

      switch (action) {
        case 'create':
          result = await githubManager.createPage(filename, frontmatter as any, content, options)
          break
        case 'update':
          result = await githubManager.updatePage(filename, frontmatter as any, content, options)
          break
        default:
          return NextResponse.json(
            { error: 'Page deletion not implemented' },
            { status: 400 }
          )
      }
    } else if (type === 'data') {
      if (!content || !dataType) {
        return NextResponse.json(
          { error: 'Content and dataType are required for data files' },
          { status: 400 }
        )
      }

      result = await githubManager.commitDataFile(filename, content, dataType, description, options)
    } else {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        sha: result.sha,
        url: result.url,
        message: result.message,
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('GitHub commit error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: handleGitHubError(error)
      },
      { status: 500 }
    )
  }
}