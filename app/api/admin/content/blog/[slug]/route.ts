import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-protection'
import { getBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/content-manager'
import { z } from 'zod'

const UpdateBlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  publishedAt: z.string().datetime(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  newsletter: z.boolean().default(false),
  sendNewsletter: z.boolean().default(false),
})

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

// GET /api/admin/content/blog/[slug] - Get single blog post
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  try {
    await requireAdmin()
    
    const post = await getBlogPost(slug)
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        slug: post.slug,
        title: post.frontmatter.title,
        excerpt: post.frontmatter.excerpt,
        content: post.content,
        author: post.frontmatter.author,
        publishedAt: post.frontmatter.publishedAt,
        tags: post.frontmatter.tags,
        featured: post.frontmatter.featured,
        newsletter: post.frontmatter.newsletter,
        filename: post.filename,
        wordCount: post.content.split(/\s+/).length,
      }
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch blog post' 
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

// PUT /api/admin/content/blog/[slug] - Update blog post
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  try {
    await requireAdmin()
    
    const body = await request.json()
    const validatedData = UpdateBlogPostSchema.parse(body)
    
    await updateBlogPost(
      slug,
      {
        title: validatedData.title,
        excerpt: validatedData.excerpt,
        author: validatedData.author,
        publishedAt: validatedData.publishedAt,
        tags: validatedData.tags,
        featured: validatedData.featured,
        newsletter: validatedData.newsletter,
      },
      validatedData.content
    )

    let newsletterResult = null
    
    // Send newsletter if requested and newsletter flag is true
    if (validatedData.sendNewsletter && validatedData.newsletter) {
      try {
        newsletterResult = await sendNewsletterForBlogPost(slug, validatedData)
      } catch (newsletterError) {
        console.error('Newsletter sending failed:', newsletterError)
        // Don't fail the blog post update if newsletter fails
        newsletterResult = {
          success: false,
          error: newsletterError instanceof Error ? newsletterError.message : 'Newsletter sending failed'
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        slug,
        message: 'Blog post updated successfully'
      },
      newsletterResult
    })
  } catch (error) {
    console.error('Error updating blog post:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update blog post' 
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

async function sendNewsletterForBlogPost(slug: string, postData: any) {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/newsletter/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: `Updated Blog Post: ${postData.title}`,
      includePosts: [slug],
      tags: postData.tags,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to send newsletter')
  }

  return await response.json()
}

// DELETE /api/admin/content/blog/[slug] - Delete blog post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  try {
    await requireAdmin()
    
    await deleteBlogPost(slug)
    
    return NextResponse.json({
      success: true,
      data: {
        slug,
        message: 'Blog post deleted successfully'
      }
    })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete blog post' 
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}