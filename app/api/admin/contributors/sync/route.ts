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

async function readContributors(): Promise<Contributor[]> {
  try {
    const data = await readFile(CONTRIBUTORS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function writeContributors(contributors: Contributor[]): Promise<void> {
  await writeFile(CONTRIBUTORS_FILE, JSON.stringify(contributors, null, 2), 'utf-8')
}

function determineRole(contributions: number): 'maintainer' | 'contributor' | 'community' {
  if (contributions >= 50) return 'maintainer'
  if (contributions >= 10) return 'contributor'
  return 'community'
}

// POST /api/admin/contributors/sync - Sync contributors from GitHub
export async function POST() {
  try {
    await requireAdmin()
    
    const githubToken = process.env.GITHUB_TOKEN
    const githubRepo = process.env.GITHUB_REPO || 'LF-Decentralized-Trust-labs/gitmesh'
    
    if (!githubToken) {
      return NextResponse.json(
        { success: false, error: 'GitHub token not configured' },
        { status: 500 }
      )
    }
    
    // Fetch contributors from GitHub API
    const contributorsResponse = await fetch(
      `https://api.github.com/repos/${githubRepo}/contributors?per_page=100`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )
    
    if (!contributorsResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch contributors from GitHub' },
        { status: 500 }
      )
    }
    
    const githubContributors = await contributorsResponse.json()
    const existingContributors = await readContributors()
    const existingMap = new Map(existingContributors.map(c => [c.id, c]))
    
    const updatedContributors: Contributor[] = []
    let syncedCount = 0
    
    for (const ghContributor of githubContributors) {
      const existing = existingMap.get(ghContributor.id.toString())
      
      // Fetch additional user data for new contributors
      let userData = ghContributor
      if (!existing) {
        try {
          const userResponse = await fetch(`https://api.github.com/users/${ghContributor.login}`, {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          })
          
          if (userResponse.ok) {
            userData = await userResponse.json()
          }
        } catch (error) {
          console.error(`Failed to fetch user data for ${ghContributor.login}:`, error)
        }
      }
      
      // Fetch commit count for this contributor
      let commitCount = ghContributor.contributions
      try {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${githubRepo}/commits?author=${ghContributor.login}&per_page=1`,
          {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        )
        
        if (commitsResponse.ok) {
          const linkHeader = commitsResponse.headers.get('link')
          if (linkHeader) {
            const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/)
            if (lastPageMatch) {
              commitCount = parseInt(lastPageMatch[1])
            }
          }
        }
      } catch (error) {
        console.error(`Failed to fetch commit count for ${ghContributor.login}:`, error)
      }
      
      const contributor: Contributor = {
        id: ghContributor.id.toString(),
        login: ghContributor.login,
        name: userData.name || null,
        avatar_url: ghContributor.avatar_url,
        html_url: ghContributor.html_url,
        contributions: ghContributor.contributions,
        type: ghContributor.type === 'Bot' ? 'Bot' : 'User',
        role: existing?.role || determineRole(ghContributor.contributions),
        first_contribution: existing?.first_contribution || new Date().toISOString(),
        last_contribution: new Date().toISOString(),
        total_commits: commitCount,
        total_prs: 0, // Would need additional API calls to get accurate counts
        total_issues: 0, // Would need additional API calls to get accurate counts
      }
      
      updatedContributors.push(contributor)
      
      if (!existing) {
        syncedCount++
      }
    }
    
    // Add any existing contributors that weren't found in GitHub (manual additions)
    for (const existing of existingContributors) {
      if (!updatedContributors.find(c => c.id === existing.id)) {
        updatedContributors.push(existing)
      }
    }
    
    await writeContributors(updatedContributors)
    
    return NextResponse.json({
      success: true,
      data: {
        synced: syncedCount,
        total: updatedContributors.length
      },
      message: `Successfully synced ${syncedCount} new contributors`
    })
  } catch (error) {
    console.error('Error syncing contributors:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to sync contributors' 
      },
      { status: 500 }
    )
  }
}