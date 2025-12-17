import { NextRequest, NextResponse } from 'next/server'
import { validateAdminAccess } from '@/lib/auth'
import { readdir, readFile, stat } from 'fs/promises'
import { join } from 'path'
import { createAPIHandler, validateMethod } from '@/lib/api-error-handler'
import { AppError } from '@/lib/error-handling'
import { ErrorCodes } from '@/types'

export const GET = createAPIHandler(async (req: NextRequest) => {
  validateMethod(['GET'])(req)
  
  const validation = await validateAdminAccess()
  
  if (!validation.isValid) {
    throw new AppError(
      validation.error || 'Admin access required',
      ErrorCodes.UNAUTHORIZED,
      401
    )
  }

  // Get basic stats
  const stats = await getDashboardStats()
  
  return {
    ...stats,
    user: {
      email: validation.session.user?.email,
      name: validation.session.user?.name,
      role: validation.session.user?.role || 'admin'
    },
    lastUpdated: new Date().toISOString()
  }
}, {
  context: 'admin-dashboard'
})

async function getDashboardStats() {
  const stats = {
    content: {
      blogPosts: 0,
      pages: 0,
      totalContent: 0
    },
    newsletter: {
      subscribers: 0,
      campaigns: 0
    },
    contributors: {
      total: 0,
      lastSync: null as string | null
    },
    system: {
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      uptime: process.uptime()
    }
  }

  try {
    // Count blog posts
    const blogDir = join(process.cwd(), 'content', 'blog')
    try {
      const blogFiles = await readdir(blogDir)
      stats.content.blogPosts = blogFiles.filter(file => file.endsWith('.mdx')).length
    } catch {
      // Directory doesn't exist yet
    }

    // Count pages
    const pagesDir = join(process.cwd(), 'content', 'pages')
    try {
      const pageFiles = await readdir(pagesDir)
      stats.content.pages = pageFiles.filter(file => file.endsWith('.mdx')).length
    } catch {
      // Directory doesn't exist yet
    }

    stats.content.totalContent = stats.content.blogPosts + stats.content.pages

    // Count newsletter subscribers
    const subscribersFile = join(process.cwd(), 'data', 'newsletter-subscribers.json')
    try {
      const subscribersData = await readFile(subscribersFile, 'utf-8')
      const subscribers = JSON.parse(subscribersData)
      stats.newsletter.subscribers = Array.isArray(subscribers) ? subscribers.length : 0
    } catch {
      // File doesn't exist yet
    }

    // Get contributors info
    const contributorsFile = join(process.cwd(), 'data', 'contributors.json')
    try {
      const contributorsData = await readFile(contributorsFile, 'utf-8')
      const contributors = JSON.parse(contributorsData)
      stats.contributors.total = Array.isArray(contributors) ? contributors.length : 0
      
      // Get last modified time as sync time
      const fileStat = await stat(contributorsFile)
      stats.contributors.lastSync = fileStat.mtime.toISOString()
    } catch {
      // File doesn't exist yet
    }

  } catch (error) {
    console.error('Error gathering stats:', error)
  }

  return stats
}