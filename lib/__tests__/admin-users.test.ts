import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { promises as fs } from 'fs'
import path from 'path'
import { 
  getAdminUsers, 
  addAdminUser, 
  updateAdminUser, 
  removeAdminUser, 
  logAdminActivity, 
  getAuditLogs 
} from '../admin-users'

// Mock the auth module
jest.mock('../auth', () => ({
  getAdminEmails: jest.fn(() => ['test@example.com', 'admin@example.com'])
}))

const TEST_DATA_DIR = path.join(process.cwd(), 'test-data')
const TEST_USERS_FILE = path.join(TEST_DATA_DIR, 'admin-users.json')
const TEST_AUDIT_FILE = path.join(TEST_DATA_DIR, 'admin-audit-logs.json')

describe('Admin Users Management', () => {
  beforeEach(async () => {
    // Ensure test data directory exists
    try {
      await fs.access(TEST_DATA_DIR)
    } catch {
      await fs.mkdir(TEST_DATA_DIR, { recursive: true })
    }
    
    // Clean up test files
    try {
      await fs.unlink(TEST_USERS_FILE)
    } catch {}
    try {
      await fs.unlink(TEST_AUDIT_FILE)
    } catch {}
    
    // Mock the file paths
    jest.doMock('path', () => ({
      ...jest.requireActual('path'),
      join: jest.fn((...args) => {
        if (args.includes('admin-users.json')) {
          return TEST_USERS_FILE
        }
        if (args.includes('admin-audit-logs.json')) {
          return TEST_AUDIT_FILE
        }
        return jest.requireActual('path').join(...args)
      })
    }))
  })

  afterEach(async () => {
    // Clean up test files
    try {
      await fs.unlink(TEST_USERS_FILE)
    } catch {}
    try {
      await fs.unlink(TEST_AUDIT_FILE)
    } catch {}
    
    jest.clearAllMocks()
  })

  it('should get admin users from environment', async () => {
    const users = await getAdminUsers()
    
    expect(users).toHaveLength(2)
    expect(users[0].email).toBe('admin@example.com')
    expect(users[1].email).toBe('test@example.com')
    expect(users[0].status).toBe('pending')
  })

  it('should add a new admin user', async () => {
    const result = await addAdminUser('newuser@example.com', 'admin', 'test@example.com')
    
    expect(result.success).toBe(true)
    expect(result.user?.email).toBe('newuser@example.com')
    expect(result.user?.role).toBe('admin')
    expect(result.user?.addedBy).toBe('test@example.com')
  })

  it('should not add duplicate admin user', async () => {
    // First addition should succeed
    const result1 = await addAdminUser('test@example.com', 'admin')
    expect(result1.success).toBe(false)
    expect(result1.error).toContain('already exists')
  })

  it('should update admin user role', async () => {
    // Add a user first
    await addAdminUser('updateuser@example.com', 'admin', 'test@example.com')
    
    // Update the role
    const result = await updateAdminUser('updateuser@example.com', { role: 'super_admin' }, 'test@example.com')
    
    expect(result.success).toBe(true)
    expect(result.user?.role).toBe('super_admin')
    expect(result.previousRole).toBe('admin')
  })

  it('should remove admin user', async () => {
    // Add a user first
    await addAdminUser('removeuser@example.com', 'admin', 'test@example.com')
    
    // Remove the user
    const result = await removeAdminUser('removeuser@example.com', 'test@example.com')
    
    expect(result.success).toBe(true)
    expect(result.removedUser?.email).toBe('removeuser@example.com')
  })

  it('should log admin activity', async () => {
    // Clear any existing logs first
    try {
      await fs.unlink(TEST_AUDIT_FILE)
    } catch {}
    
    await logAdminActivity({
      action: 'TEST_ACTION',
      adminUser: 'test@example.com',
      targetUser: 'target@example.com',
      details: 'Test activity log',
      timestamp: new Date(),
      metadata: { test: true }
    })
    
    const logs = await getAuditLogs({ limit: 10 })
    
    expect(logs).toHaveLength(1)
    expect(logs[0].action).toBe('TEST_ACTION')
    expect(logs[0].adminUser).toBe('test@example.com')
    expect(logs[0].targetUser).toBe('target@example.com')
  })

  it('should get audit logs with pagination', async () => {
    // Clear any existing logs first
    try {
      await fs.unlink(TEST_AUDIT_FILE)
    } catch {}
    
    // Add multiple log entries
    for (let i = 0; i < 5; i++) {
      await logAdminActivity({
        action: `TEST_ACTION_${i}`,
        adminUser: 'test@example.com',
        details: `Test activity ${i}`,
        timestamp: new Date()
      })
    }
    
    const logs = await getAuditLogs({ limit: 3, offset: 0 })
    expect(logs).toHaveLength(3)
    
    const logs2 = await getAuditLogs({ limit: 3, offset: 3 })
    expect(logs2).toHaveLength(2)
  })
})