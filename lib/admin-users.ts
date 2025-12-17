import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { AdminUser } from '@/types'
import { getAdminEmails } from './auth'

// File paths for data storage
const ADMIN_USERS_FILE = path.join(process.cwd(), 'data', 'admin-users.json')
const AUDIT_LOGS_FILE = path.join(process.cwd(), 'data', 'admin-audit-logs.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Admin user interface with activity tracking
interface AdminUserWithActivity extends AdminUser {
  lastActivity?: Date
  status: 'active' | 'inactive' | 'pending'
  addedBy?: string
  addedAt: Date
}

// Audit log interface
interface AuditLog {
  id: string
  action: string
  adminUser: string
  targetUser?: string
  details: string
  timestamp: Date
  metadata?: any
}

/**
 * Load admin users from file storage
 */
async function loadAdminUsers(): Promise<AdminUserWithActivity[]> {
  await ensureDataDirectory()
  
  try {
    const data = await fs.readFile(ADMIN_USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or is invalid, return empty array
    return []
  }
}

/**
 * Save admin users to file storage
 */
async function saveAdminUsers(users: AdminUserWithActivity[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(ADMIN_USERS_FILE, JSON.stringify(users, null, 2))
}

/**
 * Load audit logs from file storage
 */
async function loadAuditLogs(): Promise<AuditLog[]> {
  await ensureDataDirectory()
  
  try {
    const data = await fs.readFile(AUDIT_LOGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or is invalid, return empty array
    return []
  }
}

/**
 * Save audit logs to file storage
 */
async function saveAuditLogs(logs: AuditLog[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(AUDIT_LOGS_FILE, JSON.stringify(logs, null, 2))
}

/**
 * Get all admin users with their current status
 */
export async function getAdminUsers(): Promise<AdminUserWithActivity[]> {
  const storedUsers = await loadAdminUsers()
  const envEmails = getAdminEmails()
  
  // Merge environment emails with stored user data
  const users: AdminUserWithActivity[] = []
  
  for (const email of envEmails) {
    const existingUser = storedUsers.find(u => u.email === email)
    
    if (existingUser) {
      // Update status based on recent activity
      const daysSinceActivity = existingUser.lastActivity 
        ? (Date.now() - new Date(existingUser.lastActivity).getTime()) / (1000 * 60 * 60 * 24)
        : Infinity
      
      users.push({
        ...existingUser,
        status: daysSinceActivity < 30 ? 'active' : 'inactive'
      })
    } else {
      // Create new user entry for environment email
      users.push({
        email,
        name: email.split('@')[0], // Default name from email
        avatar: `https://www.gravatar.com/avatar/${crypto.createHash('md5').update(email.toLowerCase()).digest('hex')}?d=identicon`,
        role: 'admin',
        lastLogin: new Date(),
        permissions: [
          { resource: 'blog', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'newsletter', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'diagnostics', actions: ['read'] }
        ],
        status: 'pending',
        addedAt: new Date()
      })
    }
  }
  
  return users.sort((a, b) => a.email.localeCompare(b.email))
}

/**
 * Add a new admin user
 */
export async function addAdminUser(
  email: string, 
  role: 'admin' | 'super_admin' = 'admin',
  addedBy?: string
): Promise<{ success: boolean; user?: AdminUserWithActivity; error?: string }> {
  try {
    const envEmails = getAdminEmails()
    
    // Check if email is already in environment
    if (envEmails.includes(email)) {
      return { success: false, error: 'User already exists in admin allowlist' }
    }
    
    // For now, we'll store the user data but note that they need to be added to env
    const storedUsers = await loadAdminUsers()
    
    // Check if user already exists in stored data
    if (storedUsers.find(u => u.email === email)) {
      return { success: false, error: 'User already exists in stored data' }
    }
    
    const newUser: AdminUserWithActivity = {
      email,
      name: email.split('@')[0],
      avatar: `https://www.gravatar.com/avatar/${crypto.createHash('md5').update(email.toLowerCase()).digest('hex')}?d=identicon`,
      role,
      lastLogin: new Date(),
      permissions: role === 'super_admin' ? [
        { resource: 'blog', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'newsletter', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'diagnostics', actions: ['create', 'read', 'update', 'delete'] }
      ] : [
        { resource: 'blog', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'newsletter', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'diagnostics', actions: ['read'] }
      ],
      status: 'pending',
      addedBy,
      addedAt: new Date()
    }
    
    storedUsers.push(newUser)
    await saveAdminUsers(storedUsers)
    
    return { 
      success: true, 
      user: newUser,
      error: 'User added to stored data. Remember to add their email to GITMESH_CE_ADMIN_EMAILS environment variable.'
    }
  } catch (error) {
    console.error('Error adding admin user:', error)
    return { success: false, error: 'Failed to add user' }
  }
}

/**
 * Update an admin user
 */
export async function updateAdminUser(
  email: string,
  updates: Partial<AdminUserWithActivity>,
  updatedBy?: string
): Promise<{ success: boolean; user?: AdminUserWithActivity; previousRole?: string; error?: string }> {
  try {
    const storedUsers = await loadAdminUsers()
    const userIndex = storedUsers.findIndex(u => u.email === email)
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' }
    }
    
    const previousRole = storedUsers[userIndex].role
    
    // Update user data
    storedUsers[userIndex] = {
      ...storedUsers[userIndex],
      ...updates,
      lastActivity: new Date()
    }
    
    // Update permissions based on role if role changed
    if (updates.role && updates.role !== previousRole) {
      storedUsers[userIndex].permissions = updates.role === 'super_admin' ? [
        { resource: 'blog', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'newsletter', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'diagnostics', actions: ['create', 'read', 'update', 'delete'] }
      ] : [
        { resource: 'blog', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'newsletter', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'diagnostics', actions: ['read'] }
      ]
    }
    
    await saveAdminUsers(storedUsers)
    
    return { 
      success: true, 
      user: storedUsers[userIndex],
      previousRole
    }
  } catch (error) {
    console.error('Error updating admin user:', error)
    return { success: false, error: 'Failed to update user' }
  }
}

/**
 * Remove an admin user
 */
export async function removeAdminUser(
  email: string,
  removedBy?: string
): Promise<{ success: boolean; removedUser?: AdminUserWithActivity; error?: string }> {
  try {
    const storedUsers = await loadAdminUsers()
    const userIndex = storedUsers.findIndex(u => u.email === email)
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' }
    }
    
    const removedUser = storedUsers[userIndex]
    storedUsers.splice(userIndex, 1)
    
    await saveAdminUsers(storedUsers)
    
    return { 
      success: true, 
      removedUser,
      error: 'User removed from stored data. Remember to remove their email from GITMESH_CE_ADMIN_EMAILS environment variable.'
    }
  } catch (error) {
    console.error('Error removing admin user:', error)
    return { success: false, error: 'Failed to remove user' }
  }
}

/**
 * Log admin activity for audit trail
 */
export async function logAdminActivity(activity: Omit<AuditLog, 'id'>): Promise<void> {
  try {
    const logs = await loadAuditLogs()
    
    const newLog: AuditLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...activity
    }
    
    logs.unshift(newLog) // Add to beginning
    
    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.splice(1000)
    }
    
    await saveAuditLogs(logs)
  } catch (error) {
    console.error('Error logging admin activity:', error)
  }
}

/**
 * Get audit logs with pagination
 */
export async function getAuditLogs(options: { 
  limit?: number; 
  offset?: number; 
  adminUser?: string;
  action?: string;
}): Promise<AuditLog[]> {
  try {
    const logs = await loadAuditLogs()
    let filteredLogs = logs
    
    // Filter by admin user if specified
    if (options.adminUser) {
      filteredLogs = filteredLogs.filter(log => log.adminUser === options.adminUser)
    }
    
    // Filter by action if specified
    if (options.action) {
      filteredLogs = filteredLogs.filter(log => log.action === options.action)
    }
    
    // Apply pagination
    const limit = options.limit || 50
    const offset = options.offset || 0
    
    return filteredLogs.slice(offset, offset + limit)
  } catch (error) {
    console.error('Error getting audit logs:', error)
    return []
  }
}

/**
 * Update user activity timestamp (called on login/action)
 */
export async function updateUserActivity(email: string): Promise<void> {
  try {
    const storedUsers = await loadAdminUsers()
    const userIndex = storedUsers.findIndex(u => u.email === email)
    
    if (userIndex !== -1) {
      storedUsers[userIndex].lastActivity = new Date()
      storedUsers[userIndex].lastLogin = new Date()
      storedUsers[userIndex].status = 'active'
      await saveAdminUsers(storedUsers)
    }
  } catch (error) {
    console.error('Error updating user activity:', error)
  }
}