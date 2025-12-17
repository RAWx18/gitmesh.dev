import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { readFile } from "fs/promises"
import { join } from "path"
import { NewsletterSubscriber } from "@/types"

const previewSchema = z.object({
  tags: z.array(z.string()).optional(),
  targetingMode: z.enum(['all', 'tags', 'specific']).default('all')
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
    const { tags = [], targetingMode } = previewSchema.parse(body)

    // Read subscribers
    const subscribersPath = join(process.cwd(), "data", "newsletter-subscribers.json")
    let subscribers: NewsletterSubscriber[] = []
    
    try {
      const data = await readFile(subscribersPath, "utf-8")
      subscribers = JSON.parse(data)
    } catch (error) {
      return NextResponse.json({
        total: 0,
        targeted: 0,
        tags: []
      })
    }

    // Filter confirmed subscribers
    const confirmedSubscribers = subscribers.filter(sub => sub.confirmed)
    
    let targetedSubscribers = confirmedSubscribers

    // Apply targeting filters
    if (targetingMode === 'tags' && tags.length > 0) {
      targetedSubscribers = confirmedSubscribers.filter(sub => 
        tags.some(tag => sub.tags.includes(tag))
      )
    }

    return NextResponse.json({
      total: confirmedSubscribers.length,
      targeted: targetedSubscribers.length,
      tags: targetingMode === 'tags' ? tags : []
    })

  } catch (error) {
    console.error("Newsletter preview error:", error)
    
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