import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-protection'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const UpdateContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['blog', 'announcement', 'welfare']).default('blog'),
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

// GET /api/admin/content/blog/[slug] - Get single content item
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  try {
    await requireAdmin()

    const { data: item, error } = await supabase
      .from('content')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !item) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        slug: item.slug,
        type: item.type,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        author: item.author,
        publishedAt: item.published_at,
        tags: item.tags,
        featured: item.featured,
        newsletter: item.newsletter,
        wordCount: item.content.split(/\s+/).length,
      }
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch content'
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

// PUT /api/admin/content/blog/[slug] - Update content
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = UpdateContentSchema.parse(body)

    const { data, error } = await supabase
      .from('content')
      .update({
        type: validatedData.type,
        title: validatedData.title,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        author: validatedData.author,
        published_at: validatedData.publishedAt,
        tags: validatedData.tags,
        featured: validatedData.featured,
        newsletter: validatedData.newsletter,
      })
      .eq('slug', slug)
      .select()
      .single()

    if (error) throw error

    let newsletterResult = null

    // Send newsletter if requested and newsletter flag is true
    if (validatedData.sendNewsletter && validatedData.newsletter) {
      try {
        newsletterResult = await sendNewsletterForContent(slug, validatedData)
      } catch (newsletterError) {
        console.error('Newsletter sending failed:', newsletterError)
        // Don't fail the content update if newsletter fails
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
        message: 'Content updated successfully'
      },
      newsletterResult
    })
  } catch (error) {
    console.error('Error updating content:', error)

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
        error: error instanceof Error ? error.message : 'Failed to update content'
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

async function sendNewsletterForContent(slug: string, postData: any) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/admin/newsletter/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: `Updated ${postData.type}: ${postData.title}`,
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

// DELETE /api/admin/content/blog/[slug] - Delete content
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  try {
    await requireAdmin()

    const { error } = await supabase
      .from('content')
      .delete()
      .eq('slug', slug)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: {
        slug,
        message: 'Content deleted successfully'
      }
    })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete content'
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
