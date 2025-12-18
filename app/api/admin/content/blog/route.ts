import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-protection'
import { supabase } from '@/lib/supabase'
import { generateSlug } from '@/lib/content-parser'
import { z } from 'zod'

const CreateContentSchema = z.object({
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

// GET /api/admin/content/blog - List all content
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'blog'

    const { data: content, error } = await supabase
      .from('content')
      .select('*')
      .eq('type', type)
      .order('published_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: content.map(item => ({
        slug: item.slug,
        title: item.title,
        type: item.type,
        excerpt: item.excerpt,
        author: item.author,
        publishedAt: item.published_at,
        tags: item.tags,
        featured: item.featured,
        newsletter: item.newsletter,
        wordCount: item.content.split(/\s+/).length,
      }))
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

// POST /api/admin/content/blog - Create new content
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = CreateContentSchema.parse(body)

    // Generate slug from title
    const slug = generateSlug(validatedData.title)

    const { data, error } = await supabase
      .from('content')
      .insert({
        slug,
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
        // Don't fail the content creation if newsletter fails
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
        message: 'Content created successfully'
      },
      newsletterResult
    })
  } catch (error) {
    console.error('Error creating content:', error)

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
        error: error instanceof Error ? error.message : 'Failed to create content'
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

async function sendNewsletterForContent(slug: string, postData: any) {
  // Use a safer way to get the base URL
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/admin/newsletter/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: `New ${postData.type}: ${postData.title}`,
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