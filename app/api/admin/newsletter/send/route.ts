import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { readFile } from "fs/promises"
import { join } from "path"
import { NewsletterSubscriber, BlogPost } from "@/types"
import { getEmailService } from "@/lib/email-service"
import { getEmailTemplateService } from "@/lib/email-templates"
import { createEmailRetryService, BulkEmailService } from "@/lib/email-retry"

const sendNewsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required").optional(),
  customContent: z.string().optional(),
  includePosts: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  testEmail: z.string().email().optional()
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin access
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const adminEmails = process.env.GITMESH_CE_ADMIN_EMAILS?.split(',') || []
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json(
        { message: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { subject, customContent, includePosts = [], tags = [], testEmail } = sendNewsletterSchema.parse(body)

    // Read subscribers
    const subscribersPath = join(process.cwd(), "data", "newsletter-subscribers.json")
    let subscribers: NewsletterSubscriber[] = []
    
    try {
      const data = await readFile(subscribersPath, "utf-8")
      subscribers = JSON.parse(data)
    } catch (error) {
      return NextResponse.json(
        { message: "No subscribers found" },
        { status: 404 }
      )
    }

    // Filter confirmed subscribers
    let targetSubscribers = subscribers.filter(sub => sub.confirmed)

    // Filter by tags if specified
    if (tags.length > 0) {
      targetSubscribers = targetSubscribers.filter(sub => 
        tags.some(tag => sub.tags.includes(tag))
      )
    }

    // If test email is provided, only send to that email
    if (testEmail) {
      const testSubscriber = targetSubscribers.find(sub => sub.email === testEmail)
      if (!testSubscriber) {
        // Create a temporary subscriber for testing
        targetSubscribers = [{
          email: testEmail,
          name: 'Test User',
          subscribedAt: new Date(),
          confirmed: true,
          tags: [],
          unsubscribeToken: 'test-token'
        }]
      } else {
        targetSubscribers = [testSubscriber]
      }
    }

    if (targetSubscribers.length === 0) {
      return NextResponse.json(
        { message: "No subscribers match the criteria" },
        { status: 400 }
      )
    }

    // Load blog posts if specified
    let posts: BlogPost[] = []
    if (includePosts.length > 0) {
      try {
        for (const postSlug of includePosts) {
          const postPath = join(process.cwd(), "content", "blog", `${postSlug}.mdx`)
          try {
            const postContent = await readFile(postPath, "utf-8")
            // Parse frontmatter and content (simplified for now)
            const lines = postContent.split('\n')
            const frontmatterEnd = lines.findIndex((line, index) => index > 0 && line === '---')
            
            if (frontmatterEnd > 0) {
              const frontmatter = lines.slice(1, frontmatterEnd).join('\n')
              const content = lines.slice(frontmatterEnd + 1).join('\n')
              
              // Simple frontmatter parsing (in production, use gray-matter)
              const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/)
              const authorMatch = frontmatter.match(/author:\s*["']?([^"'\n]+)["']?/)
              const excerptMatch = frontmatter.match(/excerpt:\s*["']?([^"'\n]+)["']?/)
              const dateMatch = frontmatter.match(/publishedAt:\s*["']?([^"'\n]+)["']?/)
              
              posts.push({
                slug: postSlug,
                title: titleMatch?.[1] || 'Untitled',
                author: authorMatch?.[1] || 'GitMesh CE Team',
                excerpt: excerptMatch?.[1] || content.substring(0, 200) + '...',
                content,
                publishedAt: dateMatch?.[1] ? new Date(dateMatch[1]) : new Date(),
                tags: [],
                featured: false,
                newsletter: true
              })
            }
          } catch (postError) {
            console.warn(`Could not load post ${postSlug}:`, postError)
          }
        }
      } catch (error) {
        console.error('Error loading blog posts:', error)
      }
    }

    // Send emails with retry logic
    const retryService = createEmailRetryService()
    const bulkEmailService = new BulkEmailService(retryService)
    const templateService = getEmailTemplateService()
    
    // Prepare email parameters
    const emailParams = targetSubscribers.map(subscriber => {
      const unsubscribeUrl = templateService.generateUnsubscribeUrl(subscriber.email, subscriber.unsubscribeToken)
      const emailTemplate = templateService.generateNewsletterEmail({
        subscriber,
        posts,
        customContent,
        unsubscribeUrl
      })

      // Use custom subject if provided
      const finalSubject = subject || emailTemplate.subject

      return {
        to: subscriber.email,
        subject: finalSubject,
        html: emailTemplate.html,
        text: emailTemplate.text,
        tags: ['newsletter', 'campaign', ...tags]
      }
    })

    // Send bulk emails with retry and rate limiting
    const { successful, failed } = await bulkEmailService.sendBulkEmails(emailParams)

    // Log delivery status
    if (!testEmail) {
      try {
        await logEmailDelivery({
          type: 'newsletter',
          subject: subject || (posts.length > 0 ? `GitMesh CE Newsletter - ${posts.length} New Post${posts.length > 1 ? 's' : ''}` : 'GitMesh CE Newsletter'),
          recipientCount: targetSubscribers.length,
          successCount: successful.length,
          failureCount: failed.length,
          failures: failed,
          tags,
          adminUser: session.user.email
        })
      } catch (logError) {
        console.error('Failed to log email delivery status:', logError)
      }
    }

    const response = {
      success: failed.length === 0,
      totalSent: successful.length,
      totalFailed: failed.length,
      totalSubscribers: targetSubscribers.length,
      failed: failed.length > 0 ? failed : undefined,
      isTest: !!testEmail
    }

    console.log(`Newsletter sent: ${successful.length}/${targetSubscribers.length} successful`)
    if (failed.length > 0) {
      console.error('Failed sends:', failed)
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error("Newsletter send error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

async function logEmailDelivery(logData: {
  type: string
  subject: string
  recipientCount: number
  successCount: number
  failureCount: number
  failures: Array<{ email: string; error: string }>
  tags: string[]
  adminUser: string
}) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/newsletter/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData)
    })

    if (!response.ok) {
      throw new Error(`Failed to log delivery status: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error logging email delivery:', error)
    throw error
  }
}