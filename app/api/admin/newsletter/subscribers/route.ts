import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import { NewsletterSubscriber } from "@/types"

const updateSubscriberSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  tags: z.array(z.string()).optional(),
  confirmed: z.boolean().optional()
})

const bulkUpdateSchema = z.object({
  emails: z.array(z.string().email()),
  action: z.enum(['add_tags', 'remove_tags', 'set_tags', 'delete']),
  tags: z.array(z.string()).optional()
})

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')
    const confirmed = searchParams.get('confirmed')
    const search = searchParams.get('search')

    // Read subscribers
    const subscribersPath = join(process.cwd(), "data", "newsletter-subscribers.json")
    let subscribers: NewsletterSubscriber[] = []
    
    try {
      const data = await readFile(subscribersPath, "utf-8")
      subscribers = JSON.parse(data)
    } catch (error) {
      subscribers = []
    }

    // Apply filters
    let filteredSubscribers = subscribers

    if (tag) {
      filteredSubscribers = filteredSubscribers.filter(sub => sub.tags.includes(tag))
    }

    if (confirmed !== null) {
      const isConfirmed = confirmed === 'true'
      filteredSubscribers = filteredSubscribers.filter(sub => sub.confirmed === isConfirmed)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredSubscribers = filteredSubscribers.filter(sub => 
        sub.email.toLowerCase().includes(searchLower) ||
        (sub.name && sub.name.toLowerCase().includes(searchLower))
      )
    }

    // Get unique tags for filtering UI
    const allTags = [...new Set(subscribers.flatMap(sub => sub.tags))].sort()

    // Statistics
    const stats = {
      total: subscribers.length,
      confirmed: subscribers.filter(sub => sub.confirmed).length,
      unconfirmed: subscribers.filter(sub => !sub.confirmed).length,
      filtered: filteredSubscribers.length
    }

    return NextResponse.json({
      subscribers: filteredSubscribers,
      stats,
      availableTags: allTags
    })

  } catch (error) {
    console.error("Get subscribers error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
    const { email, name, tags, confirmed } = updateSubscriberSchema.parse(body)

    // Read subscribers
    const subscribersPath = join(process.cwd(), "data", "newsletter-subscribers.json")
    let subscribers: NewsletterSubscriber[] = []
    
    try {
      const data = await readFile(subscribersPath, "utf-8")
      subscribers = JSON.parse(data)
    } catch (error) {
      return NextResponse.json(
        { message: "Subscribers file not found" },
        { status: 404 }
      )
    }

    // Find subscriber
    const subscriberIndex = subscribers.findIndex(sub => sub.email === email)
    if (subscriberIndex === -1) {
      return NextResponse.json(
        { message: "Subscriber not found" },
        { status: 404 }
      )
    }

    // Update subscriber
    if (name !== undefined) {
      subscribers[subscriberIndex].name = name
    }
    if (tags !== undefined) {
      subscribers[subscriberIndex].tags = tags
    }
    if (confirmed !== undefined) {
      subscribers[subscriberIndex].confirmed = confirmed
    }

    // Save updated subscribers
    await writeFile(subscribersPath, JSON.stringify(subscribers, null, 2))

    return NextResponse.json({
      message: "Subscriber updated successfully",
      subscriber: subscribers[subscriberIndex]
    })

  } catch (error) {
    console.error("Update subscriber error:", error)
    
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
    const { emails, action, tags = [] } = bulkUpdateSchema.parse(body)

    // Read subscribers
    const subscribersPath = join(process.cwd(), "data", "newsletter-subscribers.json")
    let subscribers: NewsletterSubscriber[] = []
    
    try {
      const data = await readFile(subscribersPath, "utf-8")
      subscribers = JSON.parse(data)
    } catch (error) {
      return NextResponse.json(
        { message: "Subscribers file not found" },
        { status: 404 }
      )
    }

    let updatedCount = 0

    // Apply bulk action
    switch (action) {
      case 'add_tags':
        subscribers.forEach(sub => {
          if (emails.includes(sub.email)) {
            const newTags = [...new Set([...sub.tags, ...tags])]
            sub.tags = newTags
            updatedCount++
          }
        })
        break

      case 'remove_tags':
        subscribers.forEach(sub => {
          if (emails.includes(sub.email)) {
            sub.tags = sub.tags.filter(tag => !tags.includes(tag))
            updatedCount++
          }
        })
        break

      case 'set_tags':
        subscribers.forEach(sub => {
          if (emails.includes(sub.email)) {
            sub.tags = [...tags]
            updatedCount++
          }
        })
        break

      case 'delete':
        const originalLength = subscribers.length
        subscribers = subscribers.filter(sub => !emails.includes(sub.email))
        updatedCount = originalLength - subscribers.length
        break

      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        )
    }

    // Save updated subscribers
    await writeFile(subscribersPath, JSON.stringify(subscribers, null, 2))

    return NextResponse.json({
      message: `Bulk ${action} completed successfully`,
      updatedCount,
      totalSubscribers: subscribers.length
    })

  } catch (error) {
    console.error("Bulk update subscribers error:", error)
    
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