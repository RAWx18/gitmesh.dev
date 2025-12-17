import { getAllBlogPosts, getAllPages, type BlogPost, type Page } from './content-manager'

export interface ContentStats {
  totalPosts: number
  totalPages: number
  featuredPosts: number
  newsletterPosts: number
  tags: TagStats[]
  authors: AuthorStats[]
  recentPosts: BlogPost[]
}

export interface TagStats {
  tag: string
  count: number
  posts: string[] // slugs
}

export interface AuthorStats {
  author: string
  count: number
  posts: string[] // slugs
}

export interface ContentSummary {
  slug: string
  title: string
  excerpt?: string
  publishedAt?: string
  tags?: string[]
  author?: string
  type: 'blog' | 'page'
}

/**
 * Extract reading time estimate from content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Extract all unique tags from blog posts
 */
export function extractTags(posts: BlogPost[]): string[] {
  const tagSet = new Set<string>()
  
  posts.forEach(post => {
    post.frontmatter.tags.forEach(tag => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
}

/**
 * Extract all unique authors from blog posts
 */
export function extractAuthors(posts: BlogPost[]): string[] {
  const authorSet = new Set<string>()
  
  posts.forEach(post => {
    authorSet.add(post.frontmatter.author)
  })
  
  return Array.from(authorSet).sort()
}

/**
 * Get tag statistics
 */
export function getTagStats(posts: BlogPost[]): TagStats[] {
  const tagMap = new Map<string, { count: number; posts: string[] }>()
  
  posts.forEach(post => {
    post.frontmatter.tags.forEach(tag => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, { count: 0, posts: [] })
      }
      const stats = tagMap.get(tag)!
      stats.count++
      stats.posts.push(post.slug)
    })
  })
  
  return Array.from(tagMap.entries())
    .map(([tag, stats]) => ({ tag, ...stats }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Get author statistics
 */
export function getAuthorStats(posts: BlogPost[]): AuthorStats[] {
  const authorMap = new Map<string, { count: number; posts: string[] }>()
  
  posts.forEach(post => {
    const author = post.frontmatter.author
    if (!authorMap.has(author)) {
      authorMap.set(author, { count: 0, posts: [] })
    }
    const stats = authorMap.get(author)!
    stats.count++
    stats.posts.push(post.slug)
  })
  
  return Array.from(authorMap.entries())
    .map(([author, stats]) => ({ author, ...stats }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Filter posts by tag
 */
export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter(post => 
    post.frontmatter.tags.some(postTag => 
      postTag.toLowerCase() === tag.toLowerCase()
    )
  )
}

/**
 * Filter posts by author
 */
export function filterPostsByAuthor(posts: BlogPost[], author: string): BlogPost[] {
  return posts.filter(post => 
    post.frontmatter.author.toLowerCase() === author.toLowerCase()
  )
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(post => post.frontmatter.featured)
}

/**
 * Get posts that should be included in newsletter
 */
export function getNewsletterPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(post => post.frontmatter.newsletter)
}

/**
 * Get recent posts (last N posts)
 */
export function getRecentPosts(posts: BlogPost[], limit: number = 5): BlogPost[] {
  return posts.slice(0, limit)
}

/**
 * Search posts by title, excerpt, or content
 */
export function searchContent(
  posts: BlogPost[], 
  pages: Page[], 
  query: string
): ContentSummary[] {
  const results: ContentSummary[] = []
  const searchTerm = query.toLowerCase()
  
  // Search blog posts
  posts.forEach(post => {
    const titleMatch = post.frontmatter.title.toLowerCase().includes(searchTerm)
    const excerptMatch = post.frontmatter.excerpt.toLowerCase().includes(searchTerm)
    const contentMatch = post.content.toLowerCase().includes(searchTerm)
    const tagMatch = post.frontmatter.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    )
    
    if (titleMatch || excerptMatch || contentMatch || tagMatch) {
      results.push({
        slug: post.slug,
        title: post.frontmatter.title,
        excerpt: post.frontmatter.excerpt,
        publishedAt: post.frontmatter.publishedAt,
        tags: post.frontmatter.tags,
        author: post.frontmatter.author,
        type: 'blog',
      })
    }
  })
  
  // Search pages
  pages.forEach(page => {
    const titleMatch = page.frontmatter.title.toLowerCase().includes(searchTerm)
    const descriptionMatch = page.frontmatter.description?.toLowerCase().includes(searchTerm)
    const contentMatch = page.content.toLowerCase().includes(searchTerm)
    
    if (titleMatch || descriptionMatch || contentMatch) {
      results.push({
        slug: page.slug,
        title: page.frontmatter.title,
        excerpt: page.frontmatter.description,
        type: 'page',
      })
    }
  })
  
  return results
}

/**
 * Get comprehensive content statistics
 */
export async function getContentStats(): Promise<ContentStats> {
  const [posts, pages] = await Promise.all([
    getAllBlogPosts(),
    getAllPages(),
  ])
  
  const featuredPosts = getFeaturedPosts(posts)
  const newsletterPosts = getNewsletterPosts(posts)
  const recentPosts = getRecentPosts(posts)
  const tags = getTagStats(posts)
  const authors = getAuthorStats(posts)
  
  return {
    totalPosts: posts.length,
    totalPages: pages.length,
    featuredPosts: featuredPosts.length,
    newsletterPosts: newsletterPosts.length,
    tags,
    authors,
    recentPosts,
  }
}

/**
 * Generate content sitemap data
 */
export async function generateSitemapData(): Promise<{
  posts: { slug: string; lastModified: string }[]
  pages: { slug: string; lastModified: string }[]
}> {
  const [posts, pages] = await Promise.all([
    getAllBlogPosts(),
    getAllPages(),
  ])
  
  return {
    posts: posts.map(post => ({
      slug: post.slug,
      lastModified: post.frontmatter.publishedAt,
    })),
    pages: pages.map(page => ({
      slug: page.slug,
      lastModified: new Date().toISOString(), // Pages don't have publish dates
    })),
  }
}

/**
 * Validate content integrity
 */
export async function validateContentIntegrity(): Promise<{
  isValid: boolean
  errors: string[]
  warnings: string[]
}> {
  const errors: string[] = []
  const warnings: string[] = []
  
  try {
    const [posts, pages] = await Promise.all([
      getAllBlogPosts(),
      getAllPages(),
    ])
    
    // Check for duplicate slugs
    const postSlugs = new Set<string>()
    posts.forEach(post => {
      if (postSlugs.has(post.slug)) {
        errors.push(`Duplicate blog post slug: ${post.slug}`)
      }
      postSlugs.add(post.slug)
    })
    
    const pageSlugs = new Set<string>()
    pages.forEach(page => {
      if (pageSlugs.has(page.slug)) {
        errors.push(`Duplicate page slug: ${page.slug}`)
      }
      if (postSlugs.has(page.slug)) {
        errors.push(`Page slug conflicts with blog post: ${page.slug}`)
      }
      pageSlugs.add(page.slug)
    })
    
    // Check for missing required fields
    posts.forEach(post => {
      if (!post.frontmatter.title.trim()) {
        errors.push(`Blog post ${post.slug} has empty title`)
      }
      if (!post.frontmatter.excerpt.trim()) {
        errors.push(`Blog post ${post.slug} has empty excerpt`)
      }
      if (!post.content.trim()) {
        warnings.push(`Blog post ${post.slug} has empty content`)
      }
    })
    
    pages.forEach(page => {
      if (!page.frontmatter.title.trim()) {
        errors.push(`Page ${page.slug} has empty title`)
      }
      if (!page.content.trim()) {
        warnings.push(`Page ${page.slug} has empty content`)
      }
    })
    
    // Check for future publish dates
    const now = new Date()
    posts.forEach(post => {
      const publishDate = new Date(post.frontmatter.publishedAt)
      if (publishDate > now) {
        warnings.push(`Blog post ${post.slug} has future publish date: ${post.frontmatter.publishedAt}`)
      }
    })
    
  } catch (error) {
    errors.push(`Failed to validate content: ${error}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}