import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import { NewsletterSubscriber } from "@/types"

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
          <title>Invalid Unsubscribe Link</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #dc2626; }
          </style>
        </head>
        <body>
          <h1 class="error">Invalid Unsubscribe Link</h1>
          <p>The unsubscribe link is invalid or expired.</p>
          <a href="/">Return to GitMesh CE</a>
        </body>
        </html>`,
        { 
          status: 400,
          headers: { "Content-Type": "text/html" }
        }
      )
    }

    // Show unsubscribe confirmation page
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribe from GitMesh CE Newsletter</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px; 
            text-align: center; 
            line-height: 1.6;
          }
          .card { 
            border: 1px solid #e5e7eb; 
            border-radius: 8px; 
            padding: 30px; 
            background: #f9fafb; 
          }
          .button { 
            display: inline-block; 
            background: #dc2626; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 10px; 
            border: none;
            cursor: pointer;
            font-size: 16px;
          }
          .button:hover { background: #b91c1c; }
          .button.secondary { 
            background: #6b7280; 
          }
          .button.secondary:hover { background: #4b5563; }
          .email { 
            background: #e5e7eb; 
            padding: 8px 12px; 
            border-radius: 4px; 
            font-family: monospace; 
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Unsubscribe from Newsletter</h1>
          <p>You are about to unsubscribe the email address:</p>
          <p class="email">${decodeURIComponent(email)}</p>
          <p>We're sorry to see you go! You will no longer receive updates about GitMesh CE features, tutorials, and community news.</p>
          
          <form method="POST" action="/api/newsletter/unsubscribe" style="margin-top: 30px;">
            <input type="hidden" name="token" value="${token}">
            <input type="hidden" name="email" value="${email}">
            <button type="submit" class="button">
              Yes, Unsubscribe Me
            </button>
            <a href="/" class="button secondary">
              Cancel
            </a>
          </form>
          
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            This action is immediate and cannot be undone. You can always resubscribe later if you change your mind.
          </p>
        </div>
      </body>
      </html>`,
      { 
        status: 200,
        headers: { "Content-Type": "text/html" }
      }
    )

  } catch (error) {
    console.error("Unsubscribe page error:", error)
    
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .error { color: #dc2626; }
        </style>
      </head>
      <body>
        <h1 class="error">Something went wrong</h1>
        <p>We encountered an error while processing your unsubscribe request. Please try again or contact support.</p>
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const token = formData.get("token") as string
    const email = formData.get("email") as string

    if (!token || !email) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Invalid Request</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #dc2626; }
          </style>
        </head>
        <body>
          <h1 class="error">Invalid Request</h1>
          <p>The unsubscribe request is missing required information.</p>
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
      sub => sub.email === decodeURIComponent(email) && sub.unsubscribeToken === token
    )

    if (subscriberIndex === -1) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribe Failed</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #dc2626; }
          </style>
        </head>
        <body>
          <h1 class="error">Unsubscribe Failed</h1>
          <p>We couldn't find a matching subscription for this unsubscribe request. The link may be expired or already used.</p>
          <a href="/">Return to GitMesh CE</a>
        </body>
        </html>`,
        { 
          status: 404,
          headers: { "Content-Type": "text/html" }
        }
      )
    }

    // Remove the subscriber
    const unsubscribedEmail = subscribers[subscriberIndex].email
    subscribers.splice(subscriberIndex, 1)

    // Save updated subscribers
    await writeFile(subscribersPath, JSON.stringify(subscribers, null, 2))

    // Return success page
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Successfully Unsubscribed</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px; 
            text-align: center; 
            line-height: 1.6;
          }
          .card { 
            border: 1px solid #e5e7eb; 
            border-radius: 8px; 
            padding: 30px; 
            background: #f0f9ff; 
          }
          .success { color: #16a34a; }
          .button { 
            display: inline-block; 
            background: #000; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin-top: 20px; 
          }
          .email { 
            background: #e5e7eb; 
            padding: 8px 12px; 
            border-radius: 4px; 
            font-family: monospace; 
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1 class="success">✅ Successfully Unsubscribed</h1>
          <p>The email address <span class="email">${unsubscribedEmail}</span> has been removed from our newsletter.</p>
          <p>You will no longer receive emails from GitMesh CE. We're sorry to see you go!</p>
          
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            If you change your mind, you can always resubscribe by visiting our website and signing up again.
          </p>
          
          <a href="/" class="button">Return to GitMesh CE</a>
        </div>
      </body>
      </html>`,
      { 
        status: 200,
        headers: { "Content-Type": "text/html" }
      }
    )

  } catch (error) {
    console.error("Unsubscribe processing error:", error)
    
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribe Error</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .error { color: #dc2626; }
        </style>
      </head>
      <body>
        <h1 class="error">Something went wrong</h1>
        <p>We encountered an error while processing your unsubscribe request. Please try again or contact support.</p>
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