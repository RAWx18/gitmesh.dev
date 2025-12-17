import { runSiteDiagnostics } from '../diagnostics'

// Mock fs/promises
jest.mock('fs/promises', () => ({
  readdir: jest.fn(),
  readFile: jest.fn(),
  stat: jest.fn()
}))

// Mock fetch
global.fetch = jest.fn()

describe('Site Diagnostics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should run all diagnostics by default', async () => {
    const { readdir, readFile } = require('fs/promises')
    
    // Mock content files
    readdir.mockResolvedValue(['test-post.mdx'])
    readFile.mockResolvedValue(`---
title: Test Post
description: Test description
---
# Test Content
[Link](/test)`)

    const result = await runSiteDiagnostics()
    
    expect(result).toHaveProperty('overall')
    expect(result).toHaveProperty('results')
    expect(result).toHaveProperty('summary')
    expect(result.results.length).toBeGreaterThan(0)
  })

  it('should run specific diagnostic types', async () => {
    const { readdir, readFile } = require('fs/promises')
    
    readdir.mockResolvedValue([])
    readFile.mockResolvedValue('')

    const result = await runSiteDiagnostics(['links'])
    
    expect(result.results.some(r => r.type === 'links')).toBe(true)
    expect(result.results.some(r => r.type === 'metadata')).toBe(false)
  })

  it('should handle errors gracefully', async () => {
    const { readdir } = require('fs/promises')
    
    readdir.mockRejectedValue(new Error('File system error'))

    const result = await runSiteDiagnostics(['links'])
    
    // The function should still return results, even if some operations fail
    expect(result.results.length).toBeGreaterThan(0)
    expect(result).toHaveProperty('overall')
  })
})