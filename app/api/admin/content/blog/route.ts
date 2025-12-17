import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-protection'
import { getAllBlogPosts, createBlogPost } from '@/lib/content-manager'
import { generateSlug } from '@/lib/content-parser'
import { z } from 'zod'

const CreateBlogPostSchema = z.object({
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

// GET /api/admin/content/blog - List all blog posts
export async function GET() {
  try {
    await requireAdmin()
    
    const posts = await getAllBlogPosts()
    
    return NextResponse.json({
      success: true,
      data: posts.map(post => ({
        slug: post.slug,
        title: post.frontmatter.title,
        excerpt: post.frontmatter.excerpt,
        author: post.frontmatter.author,
        publishedAt: post.frontmatter.publishedAt,
        tags: post.frontmatter.tags,
        featured: post.frontmatter.featured,
        newsletter: post.frontmatter.newsletter,
        filename: post.filename,
        wordCount: post.content.split(/\s+/).length,
      }))
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch blog posts' 
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

// POST /api/admin/content/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const validatedData = CreateBlogPostSchema.parse(body)
    
    // Generate slug from title
    const slug = generateSlug(validatedData.title)
    
    const filename = await createBlogPost(
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
        // Don't fail the blog post creation if newsletter fails
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
        filename,
        message: 'Blog post created successfully'
      },
      newsletterResult
    })
  } catch (error) {
    console.error('Error creating blog post:', error)
    
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
        error: error instanceof Error ? error.message : 'Failed to create blog post' 
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
      subject: `New Blog Post: ${postData.title}`,
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