import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-protection'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const CONFIG_FILE = join(process.cwd(), 'data/admin-config.json')

interface AdminConfig {
  maintenance: boolean
  featuredPosts: string[]
  announcementBanner: {
    enabled: boolean
    message: string
    type: 'info' | 'warning' | 'success'
  } | null
  siteSettings: {
    siteName: string
    siteDescription: string
    contactEmail: string
    githubRepo: string
  }
  emailSettings: {
    provider: string
    fromEmail: string
    fromName: string
  }
  securitySettings: {
    requireEmailVerification: boolean
    sessionTimeout: number
    maxLoginAttempts: number
  }
}

const DEFAULT_CONFIG: AdminConfig = {
  maintenance: false,
  featuredPosts: [],
  announcementBanner: null,
  siteSettings: {
    siteName: 'GitMesh CE',
    siteDescription: 'Community Edition - Open-source platform for correlating market signals with engineering telemetry',
    contactEmail: 'support@gitmesh.dev',
    githubRepo: 'LF-Decentralized-Trust-labs/gitmesh'
  },
  emailSettings: {
    provider: 'sendgrid',
    fromEmail: 'support@gitmesh.dev',
    fromName: 'GitMesh CE'
  },
  securitySettings: {
    requireEmailVerification: true,
    sessionTimeout: 24,
    maxLoginAttempts: 5
  }
}

async function readConfig(): Promise<AdminConfig> {
  try {
    const data = await readFile(CONFIG_FILE, 'utf-8')
    const config = JSON.parse(data)
    
    // Merge with defaults to ensure all properties exist
    return {
      ...DEFAULT_CONFIG,
      ...config,
      siteSettings: { ...DEFAULT_CONFIG.siteSettings, ...config.siteSettings },
      emailSettings: { ...DEFAULT_CONFIG.emailSettings, ...config.emailSettings },
      securitySettings: { ...DEFAULT_CONFIG.securitySettings, ...config.securitySettings }
    }
  } catch (error) {
    // If file doesn't exist or is invalid, return defaults
    return DEFAULT_CONFIG
  }
}

async function writeConfig(config: AdminConfig): Promise<void> {
  await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
}

// GET /api/admin/settings - Get current settings
export async function GET() {
  try {
    await requireAdmin()
    
    const config = await readConfig()
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch settings' 
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    
    // Validate the config structure
    const config: AdminConfig = {
      maintenance: Boolean(body.maintenance),
      featuredPosts: Array.isArray(body.featuredPosts) ? body.featuredPosts : [],
      announcementBanner: body.announcementBanner || null,
      siteSettings: {
        siteName: body.siteSettings?.siteName || DEFAULT_CONFIG.siteSettings.siteName,
        siteDescription: body.siteSettings?.siteDescription || DEFAULT_CONFIG.siteSettings.siteDescription,
        contactEmail: body.siteSettings?.contactEmail || DEFAULT_CONFIG.siteSettings.contactEmail,
        githubRepo: body.siteSettings?.githubRepo || DEFAULT_CONFIG.siteSettings.githubRepo
      },
      emailSettings: {
        provider: body.emailSettings?.provider || DEFAULT_CONFIG.emailSettings.provider,
        fromEmail: body.emailSettings?.fromEmail || DEFAULT_CONFIG.emailSettings.fromEmail,
        fromName: body.emailSettings?.fromName || DEFAULT_CONFIG.emailSettings.fromName
      },
      securitySettings: {
        requireEmailVerification: Boolean(body.securitySettings?.requireEmailVerification ?? DEFAULT_CONFIG.securitySettings.requireEmailVerification),
        sessionTimeout: Number(body.securitySettings?.sessionTimeout) || DEFAULT_CONFIG.securitySettings.sessionTimeout,
        maxLoginAttempts: Number(body.securitySettings?.maxLoginAttempts) || DEFAULT_CONFIG.securitySettings.maxLoginAttempts
      }
    }
    
    await writeConfig(config)
    
    return NextResponse.json({
      success: true,
      data: config,
      message: 'Settings updated successfully'
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update settings' 
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}