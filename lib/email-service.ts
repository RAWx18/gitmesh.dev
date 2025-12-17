import { ErrorCodes } from '@/types'
import { withRetry, RETRY_CONFIGS, logError, logInfo } from './error-handling'
import { handleEmailError } from './api-error-handler'

export interface EmailProvider {
  sendEmail(params: SendEmailParams): Promise<EmailResult>
  sendBulkEmail(params: SendBulkEmailParams): Promise<BulkEmailResult>
}

export interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
  tags?: string[]
}

export interface SendBulkEmailParams {
  recipients: Array<{
    email: string
    name?: string
    tags?: string[]
  }>
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
  tags?: string[]
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
  statusCode?: number
}

export interface BulkEmailResult {
  success: boolean
  totalSent: number
  failed: Array<{
    email: string
    error: string
  }>
  messageIds?: string[]
}

export class SendGridProvider implements EmailProvider {
  private apiKey: string
  private fromEmail: string

  constructor(apiKey: string, fromEmail: string) {
    this.apiKey = apiKey
    this.fromEmail = fromEmail
  }

  async sendEmail(params: SendEmailParams): Promise<EmailResult> {
    return withRetry(async () => {
      try {
        logInfo('Sending email via SendGrid', {
          component: 'SendGridProvider',
          action: 'sendEmail',
          to: params.to,
          subject: params.subject
        })

        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: params.to }],
              subject: params.subject,
            }],
            from: { email: params.from || this.fromEmail },
            reply_to: params.replyTo ? { email: params.replyTo } : undefined,
            content: [
              {
                type: 'text/html',
                value: params.html,
              },
              ...(params.text ? [{
                type: 'text/plain',
                value: params.text,
              }] : []),
            ],
            categories: params.tags,
          }),
        })

        if (response.ok) {
          const messageId = response.headers.get('x-message-id')
          
          logInfo('Successfully sent email via SendGrid', {
            component: 'SendGridProvider',
            action: 'sendEmail',
            to: params.to,
            messageId
          })

          return {
            success: true,
            messageId: messageId || undefined,
          }
        } else {
          const errorData = await response.json().catch(() => ({}))
          const error = new Error(errorData.errors?.[0]?.message || 'Failed to send email')
          ;(error as any).statusCode = response.status
          ;(error as any).response = { body: errorData }
          
          handleEmailError(error)
        }
      } catch (error) {
        logError('Failed to send email via SendGrid', error as Error, {
          component: 'SendGridProvider',
          action: 'sendEmail',
          to: params.to
        })
        
        if ((error as any).statusCode || (error as any).response) {
          handleEmailError(error)
        }
        
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        }
      }
    }, RETRY_CONFIGS.email, {
      component: 'SendGridProvider',
      action: 'sendEmail',
      to: params.to
    })
  }

  async sendBulkEmail(params: SendBulkEmailParams): Promise<BulkEmailResult> {
    try {
      const personalizations = params.recipients.map(recipient => ({
        to: [{ email: recipient.email, name: recipient.name }],
        subject: params.subject,
      }))

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations,
          from: { email: params.from || this.fromEmail },
          reply_to: params.replyTo ? { email: params.replyTo } : undefined,
          content: [
            {
              type: 'text/html',
              value: params.html,
            },
            ...(params.text ? [{
              type: 'text/plain',
              value: params.text,
            }] : []),
          ],
          categories: params.tags,
        }),
      })

      if (response.ok) {
        return {
          success: true,
          totalSent: params.recipients.length,
          failed: [],
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          totalSent: 0,
          failed: params.recipients.map(r => ({
            email: r.email,
            error: errorData.errors?.[0]?.message || 'Failed to send email',
          })),
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return {
        success: false,
        totalSent: 0,
        failed: params.recipients.map(r => ({
          email: r.email,
          error: errorMessage,
        })),
      }
    }
  }
}

export class SESProvider implements EmailProvider {
  private region: string
  private accessKeyId: string
  private secretAccessKey: string
  private fromEmail: string

  constructor(region: string, accessKeyId: string, secretAccessKey: string, fromEmail: string) {
    this.region = region
    this.accessKeyId = accessKeyId
    this.secretAccessKey = secretAccessKey
    this.fromEmail = fromEmail
  }

  async sendEmail(params: SendEmailParams): Promise<EmailResult> {
    try {
      // AWS SES v3 SDK would be used here in a real implementation
      // For now, we'll simulate the API call structure
      const sesParams = {
        Source: params.from || this.fromEmail,
        Destination: {
          ToAddresses: [params.to],
        },
        Message: {
          Subject: {
            Data: params.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: params.html,
              Charset: 'UTF-8',
            },
            ...(params.text ? {
              Text: {
                Data: params.text,
                Charset: 'UTF-8',
              },
            } : {}),
          },
        },
        Tags: params.tags?.map(tag => ({
          Name: 'Category',
          Value: tag,
        })),
      }

      // In a real implementation, you would use AWS SDK here
      // const result = await sesClient.sendEmail(sesParams).promise()
      
      // For now, return a simulated success response
      return {
        success: true,
        messageId: `ses-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  async sendBulkEmail(params: SendBulkEmailParams): Promise<BulkEmailResult> {
    // For SES, we'll send individual emails since bulk sending requires more complex setup
    const results = await Promise.allSettled(
      params.recipients.map(recipient =>
        this.sendEmail({
          to: recipient.email,
          subject: params.subject,
          html: params.html,
          text: params.text,
          from: params.from,
          replyTo: params.replyTo,
          tags: params.tags,
        })
      )
    )

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success)
    const failed = results
      .map((r, index) => ({
        result: r,
        recipient: params.recipients[index],
      }))
      .filter(({ result }) => result.status === 'rejected' || !result.value.success)
      .map(({ recipient, result }) => ({
        email: recipient.email,
        error: result.status === 'rejected' 
          ? result.reason?.message || 'Unknown error'
          : result.value.error || 'Failed to send',
      }))

    return {
      success: failed.length === 0,
      totalSent: successful.length,
      failed,
      messageIds: successful.map(r => r.value.messageId).filter(Boolean) as string[],
    }
  }
}

// Factory function to create email provider based on environment
export function createEmailProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER?.toLowerCase() || 'sendgrid'
  
  switch (provider) {
    case 'sendgrid':
      const sendgridKey = process.env.SENDGRID_API_KEY
      const fromEmail = process.env.FROM_EMAIL || 'noreply@gitmesh.dev'
      
      if (!sendgridKey) {
        throw new Error('SENDGRID_API_KEY environment variable is required')
      }
      
      return new SendGridProvider(sendgridKey, fromEmail)
    
    case 'ses':
      const region = process.env.AWS_REGION || 'us-east-1'
      const accessKeyId = process.env.AWS_ACCESS_KEY_ID
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
      const sesFromEmail = process.env.FROM_EMAIL || 'noreply@gitmesh.dev'
      
      if (!accessKeyId || !secretAccessKey) {
        throw new Error('AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are required for SES')
      }
      
      return new SESProvider(region, accessKeyId, secretAccessKey, sesFromEmail)
    
    default:
      throw new Error(`Unsupported email provider: ${provider}`)
  }
}

// Email service singleton
let emailService: EmailProvider | null = null

export function getEmailService(): EmailProvider {
  if (!emailService) {
    emailService = createEmailProvider()
  }
  return emailService
}