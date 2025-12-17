import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import { NewsletterSubscriber } from "@/types"
import { getEmailService } from "@/lib/email-service"
import { getEmailTemplateService } from "@/lib/email-templates"
import { createEmailRetryService } from "@/lib/email-retry"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const email = searchParams.get("email")

    if (!token || !email) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Invalid Confirmation Link</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #dc2626; }
          </style>
        </head>
        <body>
          <h1 class="error">Invalid Confirmation Link</h1>
          <p>The confirmation link is invalid or expired. Please try subscribing again.</p>
          <a href="/">Return to GitMesh CE</a>
        </body>
        </html>`,
        { 
          status: 400,
          headers: { "Content-Type": "text/html" }
        }
      )
    }

    // Read existing subscribers
    const subscribersPath = join(process.cwd(), "data", "newsletter-subscribers.json")
    let subscribers: NewsletterSubscriber[] = []
    
    try {
      const data = await readFile(subscribersPath, "utf-8")
      subscribers = JSON.parse(data)
    } catch (error) {
      throw new Error("Subscribers file not found")
    }

    // Find subscriber by email and token
    const subscriberIndex = subscribers.findIndex(
      sub => sub.email === email && sub.unsubscribeToken === token
    )

    if (subscriberIndex === -1) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Invalid Confirmation</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #dc2626; }
          </style>
        </head>
        <body>
          <h1 class="error">Confirmation Failed</h1>
          <p>We couldn't find a matching subscription for this confirmation link. The link may be expired or already used.</p>
          <a href="/">Return to GitMesh CE</a>
        </body>
        </html>`,
        { 
          status: 404,
          headers: { "Content-Type": "text/html" }
        }
      )
    }

    // Check if already confirmed
    if (subscribers[subscriberIndex].confirmed) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Already Confirmed</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .success { color: #16a34a; }
          </style>
        </head>
        <body>
          <h1 class="success">Already Subscribed</h1>
          <p>Your email address is already confirmed and subscribed to our newsletter.</p>
          <a href="/">Return to GitMesh CE</a>
        </body>
        </html>`,
        { 
          status: 200,
          headers: { "Content-Type": "text/html" }
        }
      )
    }

    // Confirm the subscription
    subscribers[subscriberIndex].confirmed = true

    // Save updated subscribers
    await writeFile(subscribersPath, JSON.stringify(subscribers, null, 2))

    // Send welcome email
    try {
      await sendWelcomeEmail(subscribers[subscriberIndex])
    } catch (error) {
      console.error('Failed to send welcome email:', error)
      // Don't fail the confirmation if welcome email fails
    }

    // Return success page
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Subscription Confirmed</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .success { color: #16a34a; }
          .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1 class="success">✅ Subscription Confirmed!</h1>
        <p>Thank you for subscribing to the GitMesh CE newsletter. You'll receive updates about new features, tutorials, and community news.</p>
        <a href="/" class="button">Return to GitMesh CE</a>
      </body>
      </html>`,
      { 
        status: 200,
        headers: { "Content-Type": "text/html" }
      }
    )

  } catch (error) {
    console.error("Newsletter confirmation error:", error)
    
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Confirmation Error</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .error { color: #dc2626; }
        </style>
      </head>
      <body>
        <h1 class="error">Something went wrong</h1>
        <p>We encountered an error while confirming your subscription. Please try again or contact support.</p>
        <a href="/">Return to GitMesh CE</a>
      </body>
      </html>`,
      { 
        status: 500,
        headers: { "Content-Type": "text/html" }
      }
    )
  }
}

async function sendWelcomeEmail(subscriber: NewsletterSubscriber) {
  try {
    const retryService = createEmailRetryService()
    const templateService = getEmailTemplateService()
    
    const unsubscribeUrl = templateService.generateUnsubscribeUrl(subscriber.email, subscriber.unsubscribeToken)
    const emailTemplate = templateService.generateWelcomeEmail({
      email: subscriber.email,
      name: subscriber.name,
      unsubscribeUrl
    })
    
    const result = await retryService.sendEmailWithRetry({
      to: subscriber.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
      tags: ['newsletter', 'welcome']
    })
    
    if (!result.success) {
      console.error('Failed to send welcome email:', result.error)
      throw new Error(result.error || 'Failed to send welcome email')
    }
    
    console.log(`Welcome email sent to ${subscriber.email} (Message ID: ${result.messageId})`)
    
    // Log delivery status
    try {
      await logEmailDelivery({
        type: 'welcome',
        subject: emailTemplate.subject,
        recipientCount: 1,
        successCount: 1,
        failureCount: 0,
        failures: [],
        tags: ['newsletter', 'welcome'],
        adminUser: 'system'
      })
    } catch (logError) {
      console.error('Failed to log welcome email delivery:', logError)
    }
    
    return result
  } catch (error) {
    console.error('Error sending welcome email:', error)
    
    // Log delivery failure
    try {
      await logEmailDelivery({
        type: 'welcome',
        subject: 'Welcome Email',
        recipientCount: 1,
        successCount: 0,
        failureCount: 1,
        failures: [{ email: subscriber.email, error: error instanceof Error ? error.message : 'Unknown error' }],
        tags: ['newsletter', 'welcome'],
        adminUser: 'system'
      })
    } catch (logError) {
      console.error('Failed to log welcome email failure:', logError)
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