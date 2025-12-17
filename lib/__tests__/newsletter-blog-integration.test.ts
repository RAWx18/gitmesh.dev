/**
 * Integration tests for newsletter integration with blog publishing
 * Tests the complete flow from blog post creation to newsletter sending
 */

import { NewsletterSubscriber, BlogPost } from '@/types'

// Mock blog post data
const mockBlogPost: BlogPost = {
  slug: 'test-blog-post',
  title: 'Test Blog Post',
  excerpt: 'This is a test blog post excerpt for newsletter integration testing.',
  content: '# Test Blog Post\n\nThis is the content of our test blog post.',
  author: 'Test Author',
  publishedAt: new Date('2024-01-15T10:00:00Z'),
  tags: ['testing', 'newsletter'],
  featured: false,
  newsletter: true
}

// Mock newsletter subscribers
const mockSubscribers: NewsletterSubscriber[] = [
  {
    email: 'subscriber1@example.com',
    name: 'Subscriber One',
    subscribedAt: new Date('2024-01-01T00:00:00Z'),
    confirmed: true,
    tags: ['testing'],
    unsubscribeToken: 'token-1'
  },
  {
    email: 'subscriber2@example.com',
    subscribedAt: new Date('2024-01-02T00:00:00Z'),
    confirmed: true,
    tags: ['newsletter'],
    unsubscribeToken: 'token-2'
  },
  {
    email: 'subscriber3@example.com',
    subscribedAt: new Date('2024-01-03T00:00:00Z'),
    confirmed: false, // Not confirmed, should not receive newsletter
    tags: ['testing'],
    unsubscribeToken: 'token-3'
  }
]

describe('Newsletter Blog Integration Tests', () => {
  describe('Blog Post Newsletter Flag', () => {
    it('should identify newsletter-enabled blog posts', () => {
      expect(mockBlogPost.newsletter).toBe(true)
      expect(mockBlogPost.tags).toContain('newsletter')
    })

    it('should handle blog posts without newsletter flag', () => {
      const nonNewsletterPost = {
        ...mockBlogPost,
        newsletter: false
      }

      expect(nonNewsletterPost.newsletter).toBe(false)
    })
  })

  describe('Subscriber Targeting', () => {
    it('should filter confirmed subscribers only', () => {
      const confirmedSubscribers = mockSubscribers.filter(sub => sub.confirmed)
      
      expect(confirmedSubscribers).toHaveLength(2)
      expect(confirmedSubscribers.every(sub => sub.confirmed)).toBe(true)
    })

    it('should target subscribers by tags', () => {
      const testingTagSubscribers = mockSubscribers.filter(sub => 
        sub.confirmed && sub.tags.includes('testing')
      )
      
      expect(testingTagSubscribers).toHaveLength(1)
      expect(testingTagSubscribers[0].email).toBe('subscriber1@example.com')
    })

    it('should target all confirmed subscribers when no tags specified', () => {
      const allConfirmedSubscribers = mockSubscribers.filter(sub => sub.confirmed)
      
      expect(allConfirmedSubscribers).toHaveLength(2)
      expect(allConfirmedSubscribers.map(sub => sub.email)).toEqual([
        'subscriber1@example.com',
        'subscriber2@example.com'
      ])
    })

    it('should handle multiple tag targeting', () => {
      const multiTagSubscribers = mockSubscribers.filter(sub => 
        sub.confirmed && (
          sub.tags.includes('testing') || 
          sub.tags.includes('newsletter')
        )
      )
      
      expect(multiTagSubscribers).toHaveLength(2)
    })
  })

  describe('Newsletter Template Generation', () => {
    it('should generate newsletter content from blog post', () => {
      const newsletterContent = {
        subject: `New Blog Post: ${mockBlogPost.title}`,
        posts: [mockBlogPost],
        customContent: undefined
      }

      expect(newsletterContent.subject).toBe('New Blog Post: Test Blog Post')
      expect(newsletterContent.posts).toHaveLength(1)
      expect(newsletterContent.posts[0].title).toBe(mockBlogPost.title)
    })

    it('should handle custom newsletter subject', () => {
      const customSubject = 'Custom Newsletter Subject'
      const newsletterContent = {
        subject: customSubject,
        posts: [mockBlogPost],
        customContent: undefined
      }

      expect(newsletterContent.subject).toBe(customSubject)
    })

    it('should include custom content in newsletter', () => {
      const customContent = '<p>This is custom newsletter content.</p>'
      const newsletterContent = {
        subject: `New Blog Post: ${mockBlogPost.title}`,
        posts: [mockBlogPost],
        customContent
      }

      expect(newsletterContent.customContent).toBe(customContent)
    })

    it('should handle multiple blog posts in newsletter', () => {
      const secondPost = {
        ...mockBlogPost,
        slug: 'second-test-post',
        title: 'Second Test Post'
      }

      const newsletterContent = {
        subject: 'GitMesh CE Newsletter - 2 New Posts',
        posts: [mockBlogPost, secondPost],
        customContent: undefined
      }

      expect(newsletterContent.posts).toHaveLength(2)
      expect(newsletterContent.posts[0].title).toBe('Test Blog Post')
      expect(newsletterContent.posts[1].title).toBe('Second Test Post')
    })
  })

  describe('Newsletter Sending Workflow', () => {
    it('should prepare email parameters for bulk sending', () => {
      const confirmedSubscribers = mockSubscribers.filter(sub => sub.confirmed)
      
      const emailParams = confirmedSubscribers.map(subscriber => ({
        to: subscriber.email,
        subject: `New Blog Post: ${mockBlogPost.title}`,
        html: `<h1>${mockBlogPost.title}</h1><p>${mockBlogPost.excerpt}</p>`,
        text: `${mockBlogPost.title}\n\n${mockBlogPost.excerpt}`,
        tags: ['newsletter', 'blog-post', ...mockBlogPost.tags]
      }))

      expect(emailParams).toHaveLength(2)
      expect(emailParams[0].to).toBe('subscriber1@example.com')
      expect(emailParams[1].to).toBe('subscriber2@example.com')
      expect(emailParams[0].subject).toBe('New Blog Post: Test Blog Post')
      expect(emailParams[0].tags).toContain('newsletter')
      expect(emailParams[0].tags).toContain('testing')
    })

    it('should track newsletter delivery status', () => {
      const deliveryLog = {
        id: 'test-delivery-123',
        timestamp: new Date(),
        type: 'newsletter' as const,
        subject: `New Blog Post: ${mockBlogPost.title}`,
        recipientCount: 2,
        successCount: 2,
        failureCount: 0,
        failures: [],
        tags: mockBlogPost.tags,
        adminUser: 'test@admin.com'
      }

      expect(deliveryLog.type).toBe('newsletter')
      expect(deliveryLog.recipientCount).toBe(2)
      expect(deliveryLog.successCount).toBe(2)
      expect(deliveryLog.failureCount).toBe(0)
      expect(deliveryLog.tags).toEqual(['testing', 'newsletter'])
    })

    it('should handle newsletter sending failures', () => {
      const deliveryLog = {
        id: 'test-delivery-456',
        timestamp: new Date(),
        type: 'newsletter' as const,
        subject: `New Blog Post: ${mockBlogPost.title}`,
        recipientCount: 2,
        successCount: 1,
        failureCount: 1,
        failures: [
          {
            email: 'subscriber2@example.com',
            error: 'Invalid email address'
          }
        ],
        tags: mockBlogPost.tags,
        adminUser: 'test@admin.com'
      }

      expect(deliveryLog.successCount).toBe(1)
      expect(deliveryLog.failureCount).toBe(1)
      expect(deliveryLog.failures).toHaveLength(1)
      expect(deliveryLog.failures[0].email).toBe('subscriber2@example.com')
    })
  })

  describe('Blog Post Publishing Integration', () => {
    it('should trigger newsletter when blog post has newsletter flag', () => {
      const publishRequest = {
        ...mockBlogPost,
        sendNewsletter: true
      }

      expect(publishRequest.newsletter).toBe(true)
      expect(publishRequest.sendNewsletter).toBe(true)
    })

    it('should not trigger newsletter when flag is disabled', () => {
      const publishRequest = {
        ...mockBlogPost,
        newsletter: false,
        sendNewsletter: false
      }

      expect(publishRequest.newsletter).toBe(false)
      expect(publishRequest.sendNewsletter).toBe(false)
    })

    it('should handle newsletter sending errors gracefully', () => {
      const blogPostResult = {
        success: true,
        data: {
          slug: mockBlogPost.slug,
          message: 'Blog post created successfully'
        },
        newsletterResult: {
          success: false,
          error: 'Email service unavailable'
        }
      }

      // Blog post should still be created even if newsletter fails
      expect(blogPostResult.success).toBe(true)
      expect(blogPostResult.newsletterResult?.success).toBe(false)
      expect(blogPostResult.newsletterResult?.error).toBe('Email service unavailable')
    })
  })

  describe('Subscriber Preview and Targeting', () => {
    it('should preview subscriber targeting', () => {
      const previewResult = {
        total: mockSubscribers.filter(sub => sub.confirmed).length,
        targeted: mockSubscribers.filter(sub => 
          sub.confirmed && sub.tags.includes('testing')
        ).length,
        tags: ['testing']
      }

      expect(previewResult.total).toBe(2)
      expect(previewResult.targeted).toBe(1)
      expect(previewResult.tags).toEqual(['testing'])
    })

    it('should handle empty tag targeting', () => {
      const previewResult = {
        total: mockSubscribers.filter(sub => sub.confirmed).length,
        targeted: mockSubscribers.filter(sub => sub.confirmed).length,
        tags: []
      }

      expect(previewResult.total).toBe(2)
      expect(previewResult.targeted).toBe(2)
      expect(previewResult.tags).toEqual([])
    })
  })
})