/**
 * GitHub integration tests
 * These tests verify the GitHub integration functionality
 */

import { validateGitHubConfig, getGitHubConfig } from '../github-config'
import { validateCommitMessage, generateBlogCommitMessage } from '../github-commit-messages'

describe('GitHub Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  test('should validate GitHub config with missing token', () => {
    delete process.env.GITHUB_TOKEN
    process.env.GITHUB_REPO = 'owner/repo'

    const validation = validateGitHubConfig()
    expect(validation.isValid).toBe(false)
    expect(validation.errors).toContain('GITHUB_TOKEN environment variable is required')
  })

  test('should validate GitHub config with missing repo', () => {
    process.env.GITHUB_TOKEN = 'github_pat_test'
    delete process.env.GITHUB_REPO

    const validation = validateGitHubConfig()
    expect(validation.isValid).toBe(false)
    expect(validation.errors).toContain('GITHUB_REPO environment variable is required')
  })

  test('should validate GitHub config with invalid repo format', () => {
    process.env.GITHUB_TOKEN = 'github_pat_test'
    process.env.GITHUB_REPO = 'invalid-format'

    const validation = validateGitHubConfig()
    expect(validation.isValid).toBe(false)
    expect(validation.errors).toContain('GITHUB_REPO must be in format "owner/repository"')
  })

  test('should validate GitHub config successfully', () => {
    process.env.GITHUB_TOKEN = 'github_pat_test'
    process.env.GITHUB_REPO = 'owner/repo'

    const validation = validateGitHubConfig()
    expect(validation.isValid).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })

  test('should get GitHub config', () => {
    process.env.GITHUB_TOKEN = 'github_pat_test'
    process.env.GITHUB_REPO = 'owner/repo'

    const config = getGitHubConfig()
    expect(config.token).toBe('github_pat_test')
    expect(config.owner).toBe('owner')
    expect(config.repo).toBe('repo')
    expect(config.fullRepo).toBe('owner/repo')
  })
})

describe('Commit Messages', () => {
  test('should generate blog commit message for create action', () => {
    const message = generateBlogCommitMessage('create', {
      title: 'Test Blog Post',
      author: 'John Doe',
      adminUser: 'admin@example.com',
      tags: ['test', 'blog'],
      featured: true,
    })

    expect(message).toContain('feat(blog): add new blog post "Test Blog Post"')
    expect(message).toContain('Author: John Doe')
    expect(message).toContain('Tags: test, blog')
    expect(message).toContain('Featured: true')
    expect(message).toContain('Admin: admin@example.com')
  })

  test('should generate blog commit message for update action', () => {
    const message = generateBlogCommitMessage('update', {
      title: 'Updated Blog Post',
      author: 'Jane Doe',
    })

    expect(message).toContain('feat(blog): update blog post "Updated Blog Post"')
    expect(message).toContain('Author: Jane Doe')
  })

  test('should validate commit message format', () => {
    const validMessage = 'feat(blog): add new blog post "Test"'
    const validation = validateCommitMessage(validMessage)
    expect(validation.isValid).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })

  test('should reject invalid commit message format', () => {
    const invalidMessage = 'Invalid commit message'
    const validation = validateCommitMessage(invalidMessage)
    expect(validation.isValid).toBe(false)
    expect(validation.errors.length).toBeGreaterThan(0)
  })

  test('should reject empty commit message', () => {
    const validation = validateCommitMessage('')
    expect(validation.isValid).toBe(false)
    expect(validation.errors).toContain('Commit message cannot be empty')
  })
})