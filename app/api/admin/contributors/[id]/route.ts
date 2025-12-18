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

// PATCH /api/admin/contributors/[id] - Update contributor role
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    
    const { id } = params
    const body = await request.json()
    const { role } = body
    
    if (!role || !['maintainer', 'contributor', 'community'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role specified' },
        { status: 400 }
      )
    }
    
    const contributors = await readContributors()
    const contributorIndex = contributors.findIndex(c => c.id === id)
    
    if (contributorIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Contributor not found' },
        { status: 404 }
      )
    }
    
    contributors[contributorIndex].role = role
    await writeContributors(contributors)
    
    return NextResponse.json({
      success: true,
      data: contributors[contributorIndex],
      message: 'Contributor role updated successfully'
    })
  } catch (error) {
    console.error('Error updating contributor:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update contributor' 
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

// DELETE /api/admin/contributors/[id] - Remove contributor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    
    const { id } = params
    const contributors = await readContributors()
    const contributorIndex = contributors.findIndex(c => c.id === id)
    
    if (contributorIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Contributor not found' },
        { status: 404 }
      )
    }
    
    const removedContributor = contributors.splice(contributorIndex, 1)[0]
    await writeContributors(contributors)
    
    return NextResponse.json({
      success: true,
      data: removedContributor,
      message: 'Contributor removed successfully'
    })
  } catch (error) {
    console.error('Error removing contributor:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove contributor' 
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}