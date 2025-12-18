import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-protection'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const CONTRIBUTORS_FILE = join(process.cwd(), 'data/contributors.json')

interface Contributor {
  id: string
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  contributions: number
  type: 'User' | 'Bot'
  role: 'maintainer' | 'contributor' | 'community'
  first_contribution: string
  last_contribution: string
  total_commits: number
  total_prs: number
  total_issues: number
}

interface ContributorStats {
  total: number
  maintainers: number
  contributors: number
  community: number
  bots: number
}

async function readContributors(): Promise<Contributor[]> {
  try {
    const data = await readFile(CONTRIBUTORS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty array
    return []
  }
}

async function writeContributors(contributors: Contributor[]): Promise<void> {
  await writeFile(CONTRIBUTORS_FILE, JSON.stringify(contributors, null, 2), 'utf-8')
}

function calculateStats(contributors: Contributor[]): ContributorStats {
  return {
    total: contributors.length,
    maintainers: contributors.filter(c => c.role === 'maintainer').length,
    contributors: contributors.filter(c => c.role === 'contributor').length,
    community: contributors.filter(c => c.role === 'community').length,
    bots: contributors.filter(c => c.type === 'Bot').length
  }
}

// GET /api/admin/contributors - Get all contributors
export async function GET() {
  try {
    await requireAdmin()
    
    const contributors = await readContributors()
    const stats = calculateStats(contributors)
    
    return NextResponse.json({
      success: true,
      data: {
        contributors: contributors.sort((a, b) => b.contributions - a.contributions),
        stats
      }
    })
  } catch (error) {
    console.error('Error fetching contributors:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch contributors' 
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

// POST /api/admin/contributors - Add a new contributor manually
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const { login, role = 'community' } = body
    
    if (!login) {
      return NextResponse.json(
        { success: false, error: 'GitHub username is required' },
        { status: 400 }
      )
    }
    
    const contributors = await readContributors()
    
    // Check if contributor already exists
    if (contributors.find(c => c.login === login)) {
      return NextResponse.json(
        { success: false, error: 'Contributor already exists' },
        { status: 400 }
      )
    }
    
    // Fetch user data from GitHub API
    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      return NextResponse.json(
        { success: false, error: 'GitHub token not configured' },
        { status: 500 }
      )
    }
    
    const userResponse = await fetch(`https://api.github.com/users/${login}`, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    
    if (!userResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'GitHub user not found' },
        { status: 404 }
      )
    }
    
    const userData = await userResponse.json()
    
    const newContributor: Contributor = {
      id: userData.id.toString(),
      login: userData.login,
      name: userData.name,
      avatar_url: userData.avatar_url,
      html_url: userData.html_url,
      contributions: 0,
      type: userData.type === 'Bot' ? 'Bot' : 'User',
      role: role as 'maintainer' | 'contributor' | 'community',
      first_contribution: new Date().toISOString(),
      last_contribution: new Date().toISOString(),
      total_commits: 0,
      total_prs: 0,
      total_issues: 0
    }
    
    contributors.push(newContributor)
    await writeContributors(contributors)
    
    return NextResponse.json({
      success: true,
      data: newContributor,
      message: 'Contributor added successfully'
    })
  } catch (error) {
    console.error('Error adding contributor:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add contributor' 
      },
      { status: 500 }
    )
  }
}