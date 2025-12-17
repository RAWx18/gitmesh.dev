import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"

interface EmailDeliveryLog {
  id: string
  timestamp: Date
  type: 'newsletter' | 'confirmation' | 'welcome'
  subject: string
  recipientCount: number
  successCount: number
  failureCount: number
  failures: Array<{
    email: string
    error: string
  }>
  tags: string[]
  adminUser: string
}

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
    const limit = parseInt(searchParams.get('limit') || '50')
    const type = searchParams.get('type')

    // Read email delivery logs
    const logsPath = join(process.cwd(), "data", "email-delivery-logs.json")
    let logs: EmailDeliveryLog[] = []
    
    try {
      const data = await readFile(logsPath, "utf-8")
      logs = JSON.parse(data)
    } catch (error) {
      logs = []
    }

    // Filter by type if specified
    let filteredLogs = logs
    if (type && ['newsletter', 'confirmation', 'welcome'].includes(type)) {
      filteredLogs = logs.filter(log => log.type === type)
    }

    // Sort by timestamp (newest first) and limit
    filteredLogs = filteredLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

    // Calculate statistics
    const stats = {
      totalLogs: logs.length,
      totalEmails: logs.reduce((sum, log) => sum + log.recipientCount, 0),
      totalSuccessful: logs.reduce((sum, log) => sum + log.successCount, 0),
      totalFailed: logs.reduce((sum, log) => sum + log.failureCount, 0),
      recentActivity: logs.filter(log => 
        new Date(log.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
      ).length
    }

    return NextResponse.json({
      logs: filteredLogs,
      stats
    })

  } catch (error) {
    console.error("Get email status error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint is for internal use to log email delivery status
    // In a production environment, you might want to add API key authentication
    
    const body = await request.json()
    const {
      type,
      subject,
      recipientCount,
      successCount,
      failureCount,
      failures = [],
      tags = [],
      adminUser
    } = body

    // Validate required fields
    if (!type || !subject || recipientCount === undefined || successCount === undefined || failureCount === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Read existing logs
    const logsPath = join(process.cwd(), "data", "email-delivery-logs.json")
    let logs: EmailDeliveryLog[] = []
    
    try {
      const data = await readFile(logsPath, "utf-8")
      logs = JSON.parse(data)
    } catch (error) {
      logs = []
    }

    // Create new log entry
    const newLog: EmailDeliveryLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type,
      subject,
      recipientCount,
      successCount,
      failureCount,
      failures,
      tags,
      adminUser: adminUser || 'system'
    }

    // Add to logs (keep only last 1000 entries)
    logs.unshift(newLog)
    if (logs.length > 1000) {
      logs = logs.slice(0, 1000)
    }

    // Save updated logs
    await writeFile(logsPath, JSON.stringify(logs, null, 2))

    return NextResponse.json({
      message: "Email delivery status logged successfully",
      logId: newLog.id
    })

  } catch (error) {
    console.error("Log email status error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}