import { EmailProvider, SendEmailParams, EmailResult } from './email-service'

export interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2
}

export class EmailRetryService {
  private emailProvider: EmailProvider
  private retryConfig: RetryConfig

  constructor(emailProvider: EmailProvider, retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG) {
    this.emailProvider = emailProvider
    this.retryConfig = retryConfig
  }

  async sendEmailWithRetry(params: SendEmailParams): Promise<EmailResult> {
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const result = await this.emailProvider.sendEmail(params)
        
        if (result.success) {
          if (attempt > 0) {
            console.log(`Email sent successfully on attempt ${attempt + 1} to ${params.to}`)
          }
          return result
        }
        
        // If it's not a retryable error, don't retry
        if (!this.isRetryableError(result)) {
          return result
        }
        
        lastError = new Error(result.error || 'Email sending failed')
        
        // Don't wait after the last attempt
        if (attempt < this.retryConfig.maxRetries) {
          const delay = this.calculateDelay(attempt)
          console.log(`Email send failed (attempt ${attempt + 1}), retrying in ${delay}ms: ${result.error}`)
          await this.sleep(delay)
        }
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        // Don't wait after the last attempt
        if (attempt < this.retryConfig.maxRetries) {
          const delay = this.calculateDelay(attempt)
          console.log(`Email send error (attempt ${attempt + 1}), retrying in ${delay}ms:`, error)
          await this.sleep(delay)
        }
      }
    }
    
    // All retries exhausted
    console.error(`Failed to send email to ${params.to} after ${this.retryConfig.maxRetries + 1} attempts`)
    return {
      success: false,
      error: `All retry attempts exhausted. Last error: ${lastError?.message || 'Unknown error'}`
    }
  }

  private isRetryableError(result: EmailResult): boolean {
    // Don't retry on client errors (4xx status codes) except for rate limiting
    if (result.statusCode) {
      if (result.statusCode >= 400 && result.statusCode < 500) {
        // Retry on rate limiting (429) and some temporary client errors
        return result.statusCode === 429 || result.statusCode === 408
      }
      
      // Retry on server errors (5xx status codes)
      if (result.statusCode >= 500) {
        return true
      }
    }
    
    // Retry on network errors or timeout errors
    const errorMessage = result.error?.toLowerCase() || ''
    const retryableErrors = [
      'timeout',
      'network',
      'connection',
      'econnreset',
      'enotfound',
      'econnrefused',
      'rate limit',
      'too many requests'
    ]
    
    return retryableErrors.some(error => errorMessage.includes(error))
  }

  private calculateDelay(attempt: number): number {
    const delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt)
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay
    
    return Math.min(delay + jitter, this.retryConfig.maxDelay)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Utility function to create a retry service with the default email provider
export function createEmailRetryService(retryConfig?: Partial<RetryConfig>): EmailRetryService {
  const { getEmailService } = require('./email-service')
  const emailProvider = getEmailService()
  
  const config = {
    ...DEFAULT_RETRY_CONFIG,
    ...retryConfig
  }
  
  return new EmailRetryService(emailProvider, config)
}

// Enhanced bulk email sending with retry and rate limiting
export class BulkEmailService {
  private retryService: EmailRetryService
  private concurrencyLimit: number
  private rateLimitDelay: number

  constructor(
    retryService: EmailRetryService, 
    concurrencyLimit: number = 5,
    rateLimitDelay: number = 100
  ) {
    this.retryService = retryService
    this.concurrencyLimit = concurrencyLimit
    this.rateLimitDelay = rateLimitDelay
  }

  async sendBulkEmails(emailParams: SendEmailParams[]): Promise<{
    successful: EmailResult[]
    failed: Array<{ params: SendEmailParams; error: string }>
  }> {
    const successful: EmailResult[] = []
    const failed: Array<{ params: SendEmailParams; error: string }> = []
    
    // Process emails in batches to respect rate limits
    for (let i = 0; i < emailParams.length; i += this.concurrencyLimit) {
      const batch = emailParams.slice(i, i + this.concurrencyLimit)
      
      const batchPromises = batch.map(async (params) => {
        try {
          const result = await this.retryService.sendEmailWithRetry(params)
          
          if (result.success) {
            successful.push(result)
          } else {
            failed.push({
              params,
              error: result.error || 'Unknown error'
            })
          }
        } catch (error) {
          failed.push({
            params,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })
      
      await Promise.all(batchPromises)
      
      // Rate limiting delay between batches
      if (i + this.concurrencyLimit < emailParams.length) {
        await this.sleep(this.rateLimitDelay)
      }
    }
    
    return { successful, failed }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}