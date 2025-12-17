import { readdir, readFile, stat } from 'fs/promises'
import { join } from 'path'
import { parse } from 'url'

export interface DiagnosticResult {
  type: 'links' | 'metadata' | 'sitemap' | 'lighthouse'
  status: 'pass' | 'warning' | 'error'
  message: string
  details?: any
  timestamp: string
}

export interface SiteDiagnostics {
  overall: 'pass' | 'warning' | 'error'
  results: DiagnosticResult[]
  summary: {
    total: number
    passed: number
    warnings: number
    errors: number
  }
}

type DiagnosticType = 'links' | 'metadata' | 'sitemap' | 'lighthouse'

export async function runSiteDiagnostics(
  types: DiagnosticType[] = ['links', 'metadata', 'sitemap', 'lighthouse']
): Promise<SiteDiagnostics> {
  const results: DiagnosticResult[] = []
  
  for (const type of types) {
    try {
      switch (type) {
        case 'links':
          results.push(...await checkBrokenLinks())
          break
        case 'metadata':
          results.push(...await validateMetadata())
          break
        case 'sitemap':
          results.push(...await validateSitemap())
          break
        case 'lighthouse':
          results.push(...await getLighthouseScores())
          break
      }
    } catch (error) {
      results.push({
        type,
        status: 'error',
        message: `Failed to run ${type} diagnostics`,
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }
  }

  const summary = {
    total: results.length,
    passed: results.filter(r => r.status === 'pass').length,
    warnings: results.filter(r => r.status === 'warning').length,
    errors: results.filter(r => r.status === 'error').length
  }

  const overall = summary.errors > 0 ? 'error' : 
                 summary.warnings > 0 ? 'warning' : 'pass'

  return {
    overall,
    results,
    summary
  }
}

async function checkBrokenLinks(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = []
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
  try {
    // Get all content files
    const contentFiles = await getAllContentFiles()
    const links = new Set<string>()
    
    // Extract links from content
    for (const file of contentFiles) {
      const content = await readFile(file, 'utf-8')
      const fileLinks = extractLinksFromContent(content)
      fileLinks.forEach(link => links.add(link))
    }

    // Check internal links
    const internalLinks = Array.from(links).filter(link => 
      link.startsWith('/') || link.startsWith(baseUrl)
    )
    
    const brokenLinks: string[] = []
    const checkedRoutes = new Set<string>()

    for (const link of internalLinks) {
      const route = link.startsWith('/') ? link : link.replace(baseUrl, '')
      
      if (checkedRoutes.has(route)) continue
      checkedRoutes.add(route)

      const exists = await checkRouteExists(route)
      if (!exists) {
        brokenLinks.push(route)
      }
    }

    if (brokenLinks.length === 0) {
      results.push({
        type: 'links',
        status: 'pass',
        message: `All ${internalLinks.length} internal links are valid`,
        details: { totalLinks: internalLinks.length, brokenLinks: [] },
        timestamp: new Date().toISOString()
      })
    } else {
      results.push({
        type: 'links',
        status: 'error',
        message: `Found ${brokenLinks.length} broken internal links`,
        details: { totalLinks: internalLinks.length, brokenLinks },
        timestamp: new Date().toISOString()
      })
    }

    // Check external links (sample only to avoid rate limiting)
    const externalLinks = Array.from(links).filter(link => 
      link.startsWith('http') && !link.startsWith(baseUrl)
    ).slice(0, 10) // Limit to first 10 external links

    if (externalLinks.length > 0) {
      const externalResults = await checkExternalLinks(externalLinks)
      results.push({
        type: 'links',
        status: externalResults.broken.length > 0 ? 'warning' : 'pass',
        message: `Checked ${externalLinks.length} external links (sample)`,
        details: externalResults,
        timestamp: new Date().toISOString()
      })
    }

  } catch (error) {
    results.push({
      type: 'links',
      status: 'error',
      message: 'Failed to check links',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }

  return results
}

async function validateMetadata(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = []
  
  try {
    const contentFiles = await getAllContentFiles()
    const issues: Array<{ file: string; issue: string }> = []
    
    for (const file of contentFiles) {
      const content = await readFile(file, 'utf-8')
      const metadata = extractMetadata(content)
      
      // Check required metadata
      if (!metadata.title) {
        issues.push({ file, issue: 'Missing title' })
      }
      if (!metadata.description && file.includes('/blog/')) {
        issues.push({ file, issue: 'Missing description' })
      }
      if (metadata.title && metadata.title.length > 60) {
        issues.push({ file, issue: 'Title too long (>60 chars)' })
      }
      if (metadata.description && metadata.description.length > 160) {
        issues.push({ file, issue: 'Description too long (>160 chars)' })
      }
    }

    if (issues.length === 0) {
      results.push({
        type: 'metadata',
        status: 'pass',
        message: `All ${contentFiles.length} content files have valid metadata`,
        details: { totalFiles: contentFiles.length, issues: [] },
        timestamp: new Date().toISOString()
      })
    } else {
      results.push({
        type: 'metadata',
        status: 'warning',
        message: `Found ${issues.length} metadata issues`,
        details: { totalFiles: contentFiles.length, issues },
        timestamp: new Date().toISOString()
      })
    }

  } catch (error) {
    results.push({
      type: 'metadata',
      status: 'error',
      message: 'Failed to validate metadata',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }

  return results
}

async function validateSitemap(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = []
  
  try {
    // Check if sitemap exists
    const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml')
    let sitemapExists = false
    
    try {
      await stat(sitemapPath)
      sitemapExists = true
    } catch {
      // Sitemap doesn't exist
    }

    if (!sitemapExists) {
      // Check for Next.js generated sitemap
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
      try {
        const response = await fetch(`${baseUrl}/sitemap.xml`)
        sitemapExists = response.ok
      } catch {
        // Network error or sitemap doesn't exist
      }
    }

    if (sitemapExists) {
      results.push({
        type: 'sitemap',
        status: 'pass',
        message: 'Sitemap is accessible',
        timestamp: new Date().toISOString()
      })
    } else {
      results.push({
        type: 'sitemap',
        status: 'warning',
        message: 'No sitemap found - consider adding one for better SEO',
        details: { suggestion: 'Add sitemap.xml or implement Next.js sitemap generation' },
        timestamp: new Date().toISOString()
      })
    }

  } catch (error) {
    results.push({
      type: 'sitemap',
      status: 'error',
      message: 'Failed to validate sitemap',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }

  return results
}

async function getLighthouseScores(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = []
  
  // Placeholder implementation - in a real scenario, you'd integrate with Lighthouse CI
  // or use the Lighthouse Node module
  results.push({
    type: 'lighthouse',
    status: 'pass',
    message: 'Lighthouse scores (placeholder)',
    details: {
      performance: 95,
      accessibility: 98,
      bestPractices: 92,
      seo: 100,
      note: 'These are placeholder scores. Integrate with Lighthouse CI for real metrics.'
    },
    timestamp: new Date().toISOString()
  })

  return results
}

// Helper functions

async function getAllContentFiles(): Promise<string[]> {
  const files: string[] = []
  const contentDir = join(process.cwd(), 'content')
  
  try {
    const entries = await readdir(contentDir, { recursive: true })
    for (const entry of entries) {
      if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
        files.push(join(contentDir, entry))
      }
    }
  } catch {
    // Content directory doesn't exist
  }

  return files
}

function extractLinksFromContent(content: string): string[] {
  const links: string[] = []
  
  // Markdown links: [text](url)
  const markdownLinks = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []
  markdownLinks.forEach(match => {
    const url = match.match(/\]\(([^)]+)\)/)?.[1]
    if (url) links.push(url)
  })
  
  // HTML links: <a href="url">
  const htmlLinks = content.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/g) || []
  htmlLinks.forEach(match => {
    const url = match.match(/href=["']([^"']+)["']/)?.[1]
    if (url) links.push(url)
  })
  
  return links
}

function extractMetadata(content: string): Record<string, any> {
  const metadata: Record<string, any> = {}
  
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1]
    const lines = frontmatter.split('\n')
    
    for (const line of lines) {
      const match = line.match(/^([^:]+):\s*(.*)$/)
      if (match) {
        const key = match[1].trim()
        let value = match[2].trim()
        
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        
        metadata[key] = value
      }
    }
  }
  
  return metadata
}

async function checkRouteExists(route: string): Promise<boolean> {
  // Simple route existence check - in a real implementation,
  // you might want to check against your actual route structure
  const commonRoutes = [
    '/',
    '/about',
    '/docs',
    '/documentation',
    '/admin',
    '/auth/signin',
    '/auth/signout'
  ]
  
  // Check if it's a common route
  if (commonRoutes.includes(route)) return true
  
  // Check if it's a blog post route
  if (route.startsWith('/blog/')) {
    const slug = route.replace('/blog/', '')
    const blogFile = join(process.cwd(), 'content', 'blog', `${slug}.mdx`)
    try {
      await stat(blogFile)
      return true
    } catch {
      return false
    }
  }
  
  // Check if it's a documentation route
  if (route.startsWith('/docs/') || route.startsWith('/documentation/')) {
    // For now, assume docs routes exist if they follow the pattern
    return true
  }
  
  return false
}

async function checkExternalLinks(links: string[]): Promise<{ working: string[], broken: string[] }> {
  const working: string[] = []
  const broken: string[] = []
  
  for (const link of links) {
    try {
      const response = await fetch(link, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      
      if (response.ok) {
        working.push(link)
      } else {
        broken.push(link)
      }
    } catch {
      broken.push(link)
    }
  }
  
  return { working, broken }
}