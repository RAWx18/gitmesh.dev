import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import { NewsletterSubscriber } from "@/types"
import { getEmailService } from "@/lib/email-service"
import { getEmailTemplateService } from "@/lib/email-templates"
import { createEmailRetryService } from "@/lib/email-retry"
import crypto from "crypto"

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = subscribeSchema.parse(body)

    // Read existing subscribers
    const subscribersPath = join(process.cwd(), "data", "newsletter-subscribers.json")
    let subscribers: NewsletterSubscriber[] = []
    
    try {
      const data = await readFile(subscribersPath, "utf-8")
      subscribers = JSON.parse(data)
    } catch (error) {
      // File doesn't exist or is empty, start with empty array
      subscribers = []
    }

    // Check if email already exists
    const existingSubscriber = subscribers.find(sub => sub.email === email)
    
    if (existingSubscriber) {
      if (existingSubscriber.confirmed) {
        return NextResponse.json(
          { message: "Email is already subscribed" },
          { status: 400 }
        )
      } else {
        // Resend confirmation email
        await sendConfirmationEmail(email, name, existingSubscriber.unsubscribeToken)
        return NextResponse.json({
          message: "Confirmation email sent",
          alreadyExists: true
        })
      }
    }

    // Generate unsubscribe token
    const unsubscribeToken = crypto.randomBytes(32).toString("hex")

    // Create new subscriber
    const newSubscriber: NewsletterSubscriber = {
      email,
      name,
      subscribedAt: new Date(),
      confirmed: false,
      tags: [],
      unsubscribeToken
    }

    // Add to subscribers list
    subscribers.push(newSubscriber)

    // Save to file
    await writeFile(subscribersPath, JSON.stringify(subscribers, null, 2))

    // Send confirmation email
    await sendConfirmationEmail(email, name, unsubscribeToken)

    return NextResponse.json({
      message: "Confirmation email sent successfully"
    })

  } catch (error) {
    console.error("Newsletter subscription error:", error)
    
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

async function sendConfirmationEmail(email: string, name: string | undefined, token: string) {
  try {
    const retryService = createEmailRetryService()
    const templateService = getEmailTemplateService()
    
    const confirmUrl = templateService.generateConfirmUrl(email, token)
    const emailTemplate = templateService.generateConfirmationEmail({
      email,
      name,
      confirmUrl
    })
    
    const result = await retryService.sendEmailWithRetry({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
      tags: ['newsletter', 'confirmation']
    })
    
    if (!result.success) {
      console.error('Failed to send confirmation email:', result.error)
      throw new Error(result.error || 'Failed to send confirmation email')
    }
    
    console.log(`Confirmation email sent to ${email} (Message ID: ${result.messageId})`)
    
    // Log delivery status
    try {
      await logEmailDelivery({
        type: 'confirmation',
        subject: emailTemplate.subject,
        recipientCount: 1,
        successCount: 1,
        failureCount: 0,
        failures: [],
        tags: ['newsletter', 'confirmation'],
        adminUser: 'system'
      })
    } catch (logError) {
      console.error('Failed to log confirmation email delivery:', logError)
    }
    
    return result
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    
    // Log delivery failure
    try {
      await logEmailDelivery({
        type: 'confirmation',
        subject: 'Email Confirmation',
        recipientCount: 1,
        successCount: 0,
        failureCount: 1,
        failures: [{ email, error: error instanceof Error ? error.message : 'Unknown error' }],
        tags: ['newsletter', 'confirmation'],
        adminUser: 'system'
      })
    } catch (logError) {
      console.error('Failed to log confirmation email failure:', logError)
    }
    
    throw error
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
    // Don't throw here to avoid breaking the main flow
  }
}