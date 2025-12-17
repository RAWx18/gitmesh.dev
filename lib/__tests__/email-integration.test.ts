import { SendGridProvider, SESProvider, createEmailProvider } from '../email-service'
import { getEmailTemplateService } from '../email-templates'
import { createEmailRetryService, BulkEmailService } from '../email-retry'

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  jest.resetModules()
  process.env = {
    ...originalEnv,
    EMAIL_PROVIDER: 'sendgrid',
    SENDGRID_API_KEY: 'test-sendgrid-key',
    FROM_EMAIL: 'test@gitmesh.dev',
    NEXTAUTH_URL: 'http://localhost:3000'
  }
})

afterEach(() => {
  process.env = originalEnv
})

describe('Email Service Integration', () => {
  describe('SendGrid Provider', () => {
    let provider: SendGridProvider

    beforeEach(() => {
      provider = new SendGridProvider('test-api-key', 'test@gitmesh.dev')
      global.fetch = jest.fn()
    })

    it('should send email successfully', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('test-message-id')
        }
      }
      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await provider.sendEmail({
        to: 'user@example.com',
        subject: 'Test Email',
        html: '<p>Test content</p>',
        text: 'Test content',
        tags: ['test']
      })

      expect(result.success).toBe(true)
      expect(result.messageId).toBe('test-message-id')
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.sendgrid.com/v3/mail/send',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json'
          }
        })
      )
    })

    it('should handle email sending failure', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({
          errors: [{ message: 'Invalid email address' }]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await provider.sendEmail({
        to: 'invalid-email',
        subject: 'Test Email',
        html: '<p>Test content</p>'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid email address')
      expect(result.statusCode).toBe(400)
    })

    it('should send bulk emails', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('bulk-message-id')
        }
      }
      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await provider.sendBulkEmail({
        recipients: [
          { email: 'user1@example.com', name: 'User 1' },
          { email: 'user2@example.com', name: 'User 2' }
        ],
        subject: 'Bulk Test Email',
        html: '<p>Bulk test content</p>',
        tags: ['bulk', 'test']
      })

      expect(result.success).toBe(true)
      expect(result.totalSent).toBe(2)
      expect(result.failed).toEqual([])
    })
  })

  describe('SES Provider', () => {
    let provider: SESProvider

    beforeEach(() => {
      provider = new SESProvider('us-east-1', 'test-key', 'test-secret', 'test@gitmesh.dev')
    })

    it('should simulate SES email sending', async () => {
      const result = await provider.sendEmail({
        to: 'user@example.com',
        subject: 'Test Email',
        html: '<p>Test content</p>',
        text: 'Test content'
      })

      expect(result.success).toBe(true)
      expect(result.messageId).toMatch(/^ses-\d+-[a-z0-9]+$/)
    })

    it('should handle bulk email sending', async () => {
      const result = await provider.sendBulkEmail({
        recipients: [
          { email: 'user1@example.com' },
          { email: 'user2@example.com' }
        ],
        subject: 'Bulk Test Email',
        html: '<p>Bulk test content</p>'
      })

      expect(result.success).toBe(true)
      expect(result.totalSent).toBe(2)
      expect(result.messageIds).toHaveLength(2)
    })
  })

  describe('Email Provider Factory', () => {
    it('should create SendGrid provider by default', () => {
      const provider = createEmailProvider()
      expect(provider).toBeInstanceOf(SendGridProvider)
    })

    it('should create SES provider when configured', () => {
      process.env.EMAIL_PROVIDER = 'ses'
      process.env.AWS_ACCESS_KEY_ID = 'test-key'
      process.env.AWS_SECRET_ACCESS_KEY = 'test-secret'

      const provider = createEmailProvider()
      expect(provider).toBeInstanceOf(SESProvider)
    })

    it('should throw error for missing SendGrid API key', () => {
      delete process.env.SENDGRID_API_KEY

      expect(() => createEmailProvider()).toThrow('SENDGRID_API_KEY environment variable is required')
    })

    it('should throw error for missing SES credentials', () => {
      process.env.EMAIL_PROVIDER = 'ses'
      delete process.env.AWS_ACCESS_KEY_ID

      expect(() => createEmailProvider()).toThrow('AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are required for SES')
    })
  })

  describe('Email Templates', () => {
    let templateService: any

    beforeEach(() => {
      templateService = getEmailTemplateService()
    })

    it('should generate confirmation email template', () => {
      const template = templateService.generateConfirmationEmail({
        email: 'user@example.com',
        name: 'Test User',
        confirmUrl: 'http://localhost:3000/confirm?token=abc123'
      })

      expect(template.subject).toBe('Confirm your GitMesh CE newsletter subscription')
      expect(template.html).toContain('Test User')
      expect(template.html).toContain('http://localhost:3000/confirm?token=abc123')
      expect(template.text).toContain('Test User')
      expect(template.text).toContain('http://localhost:3000/confirm?token=abc123')
    })

    it('should generate welcome email template', () => {
      const template = templateService.generateWelcomeEmail({
        email: 'user@example.com',
        name: 'Test User',
        unsubscribeUrl: 'http://localhost:3000/unsubscribe?token=xyz789'
      })

      expect(template.subject).toBe('Welcome to GitMesh CE! 🚀')
      expect(template.html).toContain('Test User')
      expect(template.html).toContain('http://localhost:3000/unsubscribe?token=xyz789')
      expect(template.text).toContain('Test User')
    })

    it('should generate newsletter email template', () => {
      const template = templateService.generateNewsletterEmail({
        subscriber: {
          email: 'user@example.com',
          name: 'Test User',
          subscribedAt: new Date(),
          confirmed: true,
          tags: ['developer'],
          unsubscribeToken: 'xyz789'
        },
        posts: [{
          slug: 'test-post',
          title: 'Test Blog Post',
          author: 'Test Author',
          excerpt: 'This is a test blog post excerpt.',
          content: 'Full content here...',
          publishedAt: new Date(),
          tags: ['test'],
          featured: false,
          newsletter: true
        }],
        unsubscribeUrl: 'http://localhost:3000/unsubscribe?token=xyz789'
      })

      expect(template.subject).toContain('1 New Post')
      expect(template.html).toContain('Test User')
      expect(template.html).toContain('Test Blog Post')
      expect(template.html).toContain('Test Author')
      expect(template.text).toContain('Test Blog Post')
    })

    it('should generate URLs correctly', () => {
      const unsubscribeUrl = templateService.generateUnsubscribeUrl('user@example.com', 'token123')
      const confirmUrl = templateService.generateConfirmUrl('user@example.com', 'token456')

      expect(unsubscribeUrl).toBe('http://localhost:3000/api/newsletter/unsubscribe?email=user%40example.com&token=token123')
      expect(confirmUrl).toBe('http://localhost:3000/api/newsletter/confirm?email=user%40example.com&token=token456')
    })
  })

  describe('Email Retry Service', () => {
    let mockProvider: any
    let retryService: any

    beforeEach(() => {
      mockProvider = {
        sendEmail: jest.fn()
      }
      retryService = createEmailRetryService({ maxRetries: 2, baseDelay: 10 })
      // Override the provider for testing
      retryService.emailProvider = mockProvider
    })

    it('should succeed on first attempt', async () => {
      mockProvider.sendEmail.mockResolvedValue({ success: true, messageId: 'test-id' })

      const result = await retryService.sendEmailWithRetry({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>'
      })

      expect(result.success).toBe(true)
      expect(mockProvider.sendEmail).toHaveBeenCalledTimes(1)
    })

    it('should retry on retryable errors', async () => {
      mockProvider.sendEmail
        .mockResolvedValueOnce({ success: false, error: 'Network timeout', statusCode: 500 })
        .mockResolvedValueOnce({ success: true, messageId: 'test-id' })

      const result = await retryService.sendEmailWithRetry({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>'
      })

      expect(result.success).toBe(true)
      expect(mockProvider.sendEmail).toHaveBeenCalledTimes(2)
    })

    it('should not retry on non-retryable errors', async () => {
      mockProvider.sendEmail.mockResolvedValue({ 
        success: false, 
        error: 'Invalid email address', 
        statusCode: 400 
      })

      const result = await retryService.sendEmailWithRetry({
        to: 'invalid-email',
        subject: 'Test',
        html: '<p>Test</p>'
      })

      expect(result.success).toBe(false)
      expect(mockProvider.sendEmail).toHaveBeenCalledTimes(1)
    })

    it('should exhaust retries and fail', async () => {
      mockProvider.sendEmail.mockResolvedValue({ 
        success: false, 
        error: 'Server error', 
        statusCode: 500 
      })

      const result = await retryService.sendEmailWithRetry({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>'
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('All retry attempts exhausted')
      expect(mockProvider.sendEmail).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })
  })

  describe('Bulk Email Service', () => {
    let mockRetryService: any
    let bulkService: BulkEmailService

    beforeEach(() => {
      mockRetryService = {
        sendEmailWithRetry: jest.fn()
      }
      bulkService = new BulkEmailService(mockRetryService, 2, 10) // Small batch size and delay for testing
    })

    it('should send bulk emails successfully', async () => {
      mockRetryService.sendEmailWithRetry.mockResolvedValue({ 
        success: true, 
        messageId: 'test-id' 
      })

      const emailParams = [
        { to: 'user1@example.com', subject: 'Test 1', html: '<p>Test 1</p>' },
        { to: 'user2@example.com', subject: 'Test 2', html: '<p>Test 2</p>' },
        { to: 'user3@example.com', subject: 'Test 3', html: '<p>Test 3</p>' }
      ]

      const result = await bulkService.sendBulkEmails(emailParams)

      expect(result.successful).toHaveLength(3)
      expect(result.failed).toHaveLength(0)
      expect(mockRetryService.sendEmailWithRetry).toHaveBeenCalledTimes(3)
    })

    it('should handle mixed success and failure', async () => {
      mockRetryService.sendEmailWithRetry
        .mockResolvedValueOnce({ success: true, messageId: 'test-id-1' })
        .mockResolvedValueOnce({ success: false, error: 'Invalid email' })
        .mockResolvedValueOnce({ success: true, messageId: 'test-id-3' })

      const emailParams = [
        { to: 'user1@example.com', subject: 'Test 1', html: '<p>Test 1</p>' },
        { to: 'invalid-email', subject: 'Test 2', html: '<p>Test 2</p>' },
        { to: 'user3@example.com', subject: 'Test 3', html: '<p>Test 3</p>' }
      ]

      const result = await bulkService.sendBulkEmails(emailParams)

      expect(result.successful).toHaveLength(2)
      expect(result.failed).toHaveLength(1)
      expect(result.failed[0].error).toBe('Invalid email')
    })
  })
})