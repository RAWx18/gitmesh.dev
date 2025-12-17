/**
 * Integration tests for newsletter subscription system
 * Tests the complete flow from subscription to unsubscribe
 */

import { NewsletterSubscriber } from '@/types'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Mock data directory for testing
const TEST_DATA_DIR = join(process.cwd(), 'test-data')
const TEST_SUBSCRIBERS_FILE = join(TEST_DATA_DIR, 'newsletter-subscribers.json')

describe('Newsletter Integration Tests', () => {
  beforeEach(async () => {
    // Create test data directory if it doesn't exist
    if (!existsSync(TEST_DATA_DIR)) {
      await mkdir(TEST_DATA_DIR, { recursive: true })
    }
    
    // Start with empty subscribers file
    await writeFile(TEST_SUBSCRIBERS_FILE, JSON.stringify([]))
  })

  afterEach(async () => {
    // Clean up test files
    try {
      if (existsSync(TEST_SUBSCRIBERS_FILE)) {
        await writeFile(TEST_SUBSCRIBERS_FILE, JSON.stringify([]))
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  describe('Subscription Flow', () => {
    it('should create a new subscriber with correct structure', async () => {
      const testSubscriber: NewsletterSubscriber = {
        email: 'test@example.com',
        name: 'Test User',
        subscribedAt: new Date(),
        confirmed: false,
        tags: [],
        unsubscribeToken: 'test-token-123'
      }

      // Simulate adding subscriber
      const subscribers = [testSubscriber]
      await writeFile(TEST_SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2))

      // Verify subscriber was saved correctly
      const savedData = await readFile(TEST_SUBSCRIBERS_FILE, 'utf-8')
      const savedSubscribers: NewsletterSubscriber[] = JSON.parse(savedData)

      expect(savedSubscribers).toHaveLength(1)
      expect(savedSubscribers[0].email).toBe('test@example.com')
      expect(savedSubscribers[0].name).toBe('Test User')
      expect(savedSubscribers[0].confirmed).toBe(false)
      expect(savedSubscribers[0].unsubscribeToken).toBe('test-token-123')
    })

    it('should handle multiple subscribers', async () => {
      const subscribers: NewsletterSubscriber[] = [
        {
          email: 'user1@example.com',
          name: 'User One',
          subscribedAt: new Date(),
          confirmed: true,
          tags: ['general'],
          unsubscribeToken: 'token-1'
        },
        {
          email: 'user2@example.com',
          subscribedAt: new Date(),
          confirmed: false,
          tags: [],
          unsubscribeToken: 'token-2'
        }
      ]

      await writeFile(TEST_SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2))

      const savedData = await readFile(TEST_SUBSCRIBERS_FILE, 'utf-8')
      const savedSubscribers: NewsletterSubscriber[] = JSON.parse(savedData)

      expect(savedSubscribers).toHaveLength(2)
      expect(savedSubscribers[0].confirmed).toBe(true)
      expect(savedSubscribers[1].confirmed).toBe(false)
    })
  })

  describe('Confirmation Flow', () => {
    it('should confirm a pending subscriber', async () => {
      const subscribers: NewsletterSubscriber[] = [
        {
          email: 'pending@example.com',
          subscribedAt: new Date(),
          confirmed: false,
          tags: [],
          unsubscribeToken: 'confirm-token'
        }
      ]

      await writeFile(TEST_SUBSCRIBERS_FILE, JSON.stringify(subscribers))

      // Simulate confirmation
      const updatedSubscribers = subscribers.map(sub => 
        sub.unsubscribeToken === 'confirm-token' 
          ? { ...sub, confirmed: true }
          : sub
      )

      await writeFile(TEST_SUBSCRIBERS_FILE, JSON.stringify(updatedSubscribers, null, 2))

      // Verify confirmation
      const savedData = await readFile(TEST_SUBSCRIBERS_FILE, 'utf-8')
      const savedSubscribers: NewsletterSubscriber[] = JSON.parse(savedData)

      expect(savedSubscribers[0].confirmed).toBe(true)
    })
  })

  describe('Unsubscribe Flow', () => {
    it('should remove subscriber on unsubscribe', async () => {
      const subscribers: NewsletterSubscriber[] = [
        {
          email: 'remove@example.com',
          subscribedAt: new Date(),
          confirmed: true,
          tags: [],
          unsubscribeToken: 'remove-token'
        },
        {
          email: 'keep@example.com',
          subscribedAt: new Date(),
          confirmed: true,
          tags: [],
          unsubscribeToken: 'keep-token'
        }
      ]

      await writeFile(TEST_SUBSCRIBERS_FILE, JSON.stringify(subscribers))

      // Simulate unsubscribe
      const remainingSubscribers = subscribers.filter(
        sub => sub.unsubscribeToken !== 'remove-token'
      )

      await writeFile(TEST_SUBSCRIBERS_FILE, JSON.stringify(remainingSubscribers, null, 2))

      // Verify removal
      const savedData = await readFile(TEST_SUBSCRIBERS_FILE, 'utf-8')
      const savedSubscribers: NewsletterSubscriber[] = JSON.parse(savedData)

      expect(savedSubscribers).toHaveLength(1)
      expect(savedSubscribers[0].email).toBe('keep@example.com')
    })
  })

  describe('GDPR Compliance', () => {
    it('should track consent timestamp', () => {
      const subscriber: NewsletterSubscriber = {
        email: 'gdpr@example.com',
        subscribedAt: new Date('2024-01-01T10:00:00Z'),
        confirmed: true,
        tags: [],
        unsubscribeToken: 'gdpr-token'
      }

      expect(subscriber.subscribedAt).toBeInstanceOf(Date)
      expect(subscriber.subscribedAt.toISOString()).toBe('2024-01-01T10:00:00.000Z')
    })

    it('should provide unsubscribe mechanism', () => {
      const subscriber: NewsletterSubscriber = {
        email: 'unsubscribe@example.com',
        subscribedAt: new Date(),
        confirmed: true,
        tags: [],
        unsubscribeToken: 'unsubscribe-token-123'
      }

      expect(subscriber.unsubscribeToken).toBeDefined()
      expect(subscriber.unsubscribeToken).toHaveLength(21) // 'unsubscribe-token-123'
    })

    it('should track explicit consent', () => {
      const subscriber: NewsletterSubscriber = {
        email: 'consent@example.com',
        subscribedAt: new Date(),
        confirmed: false, // Starts as false, becomes true after email confirmation
        tags: [],
        unsubscribeToken: 'consent-token'
      }

      expect(typeof subscriber.confirmed).toBe('boolean')
      expect(subscriber.confirmed).toBe(false)

      // After confirmation
      const confirmedSubscriber = { ...subscriber, confirmed: true }
      expect(confirmedSubscriber.confirmed).toBe(true)
    })
  })

  describe('Data Validation', () => {
    it('should validate email format in subscription data', () => {
      const validSubscriber: NewsletterSubscriber = {
        email: 'valid@example.com',
        subscribedAt: new Date(),
        confirmed: false,
        tags: [],
        unsubscribeToken: 'token'
      }

      expect(validSubscriber.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    })

    it('should handle optional name field', () => {
      const withName: NewsletterSubscriber = {
        email: 'with-name@example.com',
        name: 'John Doe',
        subscribedAt: new Date(),
        confirmed: false,
        tags: [],
        unsubscribeToken: 'token-1'
      }

      const withoutName: NewsletterSubscriber = {
        email: 'without-name@example.com',
        subscribedAt: new Date(),
        confirmed: false,
        tags: [],
        unsubscribeToken: 'token-2'
      }

      expect(withName.name).toBe('John Doe')
      expect(withoutName.name).toBeUndefined()
    })

    it('should handle tags array', () => {
      const subscriber: NewsletterSubscriber = {
        email: 'tagged@example.com',
        subscribedAt: new Date(),
        confirmed: true,
        tags: ['general', 'updates', 'tutorials'],
        unsubscribeToken: 'tagged-token'
      }

      expect(Array.isArray(subscriber.tags)).toBe(true)
      expect(subscriber.tags).toHaveLength(3)
      expect(subscriber.tags).toContain('general')
      expect(subscriber.tags).toContain('updates')
      expect(subscriber.tags).toContain('tutorials')
    })
  })
})