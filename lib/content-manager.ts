import fs from 'fs/promises'
import path from 'path'
import { 
  parseBlogPost, 
  parsePage, 
  generateSlug, 
  extractDateFromFilename,
  validateMDXContent,
  type BlogPostFrontmatter,
  type PageFrontmatter,
  type ParsedContent 
} from './content-parser'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const BLOG_DIR = path.join(CONTENT_DIR, 'blog')
const PAGES_DIR = path.join(CONTENT_DIR, 'pages')

export interface BlogPost extends ParsedContent<BlogPostFrontmatter> {
  filename: string
  fileDate: Date | null
}

export interface Page extends ParsedContent<PageFrontmatter> {
  filename: string
}

/**
 * Check if a directory exists, create if it doesn't
 */
async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

/**
 * Get all MDX files from a directory
 */
async function getMDXFiles(dirPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dirPath)
    return files.filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
  } catch (error) {
    // Directory doesn't exist or is empty
    return []
  }
}

/**
 * Read and parse all blog posts
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const files = await getMDXFiles(BLOG_DIR)
  const posts: BlogPost[] = []
  
  for (const filename of files) {
    if (filename === '.gitkeep') continue
    
    try {
      const filePath = path.join(BLOG_DIR, filename)
      const content = await fs.readFile(filePath, 'utf-8')
      const slug = generateSlug(filename)
      const fileDate = extractDateFromFilename(filename)
      
      const parsed = parseBlogPost(content, slug)
      
      posts.push({
        ...parsed,
        filename,
        fileDate,
      })
    } catch (error) {
      console.error(`Error parsing blog post ${filename}:`, error)
      // Continue processing other files
    }
  }
  
  // Sort by published date (newest first)
  return posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.publishedAt)
    const dateB = new Date(b.frontmatter.publishedAt)
    return dateB.getTime() - dateA.getTime()
  })
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const files = await getMDXFiles(BLOG_DIR)
  
  for (const filename of files) {
    if (filename === '.gitkeep') continue
    
    const fileSlug = generateSlug(filename)
    if (fileSlug === slug) {
      try {
        const filePath = path.join(BLOG_DIR, filename)
        const content = await fs.readFile(filePath, 'utf-8')
        const fileDate = extractDateFromFilename(filename)
        
        const parsed = parseBlogPost(content, slug)
        
        return {
          ...parsed,
          filename,
          fileDate,
        }
      } catch (error) {
        console.error(`Error parsing blog post ${filename}:`, error)
        return null
      }
    }
  }
  
  return null
}

/**
 * Read and parse all pages
 */
export async function getAllPages(): Promise<Page[]> {
  const files = await getMDXFiles(PAGES_DIR)
  const pages: Page[] = []
  
  for (const filename of files) {
    if (filename === '.gitkeep') continue
    
    try {
      const filePath = path.join(PAGES_DIR, filename)
      const content = await fs.readFile(filePath, 'utf-8')
      const slug = generateSlug(filename)
      
      const parsed = parsePage(content, slug)
      
      pages.push({
        ...parsed,
        filename,
      })
    } catch (error) {
      console.error(`Error parsing page ${filename}:`, error)
      // Continue processing other files
    }
  }
  
  return pages
}

/**
 * Get a single page by slug
 */
export async function getPage(slug: string): Promise<Page | null> {
  const files = await getMDXFiles(PAGES_DIR)
  
  for (const filename of files) {
    if (filename === '.gitkeep') continue
    
    const fileSlug = generateSlug(filename)
    if (fileSlug === slug) {
      try {
        const filePath = path.join(PAGES_DIR, filename)
        const content = await fs.readFile(filePath, 'utf-8')
        
        const parsed = parsePage(content, slug)
        
        return {
          ...parsed,
          filename,
        }
      } catch (error) {
        console.error(`Error parsing page ${filename}:`, error)
        return null
      }
    }
  }
  
  return null
}

/**
 * Create a new blog post
 */
export async function createBlogPost(
  slug: string,
  frontmatter: BlogPostFrontmatter,
  content: string
): Promise<string> {
  await ensureDirectory(BLOG_DIR)
  
  // Generate filename with date prefix
  const date = new Date(frontmatter.publishedAt).toISOString().split('T')[0]
  const filename = `${date}-${slug}.mdx`
  const filePath = path.join(BLOG_DIR, filename)
  
  // Check if file already exists
  try {
    await fs.access(filePath)
    throw new Error(`Blog post with slug "${slug}" already exists`)
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw error
    }
    // File doesn't exist, which is what we want
  }
  
  // Create frontmatter
  const frontmatterLines = [
    '---',
    `title: "${frontmatter.title}"`,
    `excerpt: "${frontmatter.excerpt}"`,
    `author: "${frontmatter.author}"`,
    `publishedAt: "${frontmatter.publishedAt}"`,
    `tags: [${frontmatter.tags.map(tag => `"${tag}"`).join(', ')}]`,
    `featured: ${frontmatter.featured}`,
    `newsletter: ${frontmatter.newsletter}`,
    '---',
    '',
  ]
  
  const fullContent = frontmatterLines.join('\n') + content
  
  // Validate content before writing
  const validation = validateMDXContent(fullContent)
  if (!validation.isValid) {
    throw new Error(`Invalid MDX content: ${validation.errors.join(', ')}`)
  }
  
  await fs.writeFile(filePath, fullContent, 'utf-8')
  return filename
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(
  slug: string,
  frontmatter: BlogPostFrontmatter,
  content: string
): Promise<void> {
  const existingPost = await getBlogPost(slug)
  if (!existingPost) {
    throw new Error(`Blog post with slug "${slug}" not found`)
  }
  
  const filePath = path.join(BLOG_DIR, existingPost.filename)
  
  // Create frontmatter
  const frontmatterLines = [
    '---',
    `title: "${frontmatter.title}"`,
    `excerpt: "${frontmatter.excerpt}"`,
    `author: "${frontmatter.author}"`,
    `publishedAt: "${frontmatter.publishedAt}"`,
    `tags: [${frontmatter.tags.map(tag => `"${tag}"`).join(', ')}]`,
    `featured: ${frontmatter.featured}`,
    `newsletter: ${frontmatter.newsletter}`,
    '---',
    '',
  ]
  
  const fullContent = frontmatterLines.join('\n') + content
  
  // Validate content before writing
  const validation = validateMDXContent(fullContent)
  if (!validation.isValid) {
    throw new Error(`Invalid MDX content: ${validation.errors.join(', ')}`)
  }
  
  await fs.writeFile(filePath, fullContent, 'utf-8')
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(slug: string): Promise<void> {
  const existingPost = await getBlogPost(slug)
  if (!existingPost) {
    throw new Error(`Blog post with slug "${slug}" not found`)
  }
  
  const filePath = path.join(BLOG_DIR, existingPost.filename)
  await fs.unlink(filePath)
}

/**
 * Create a new page
 */
export async function createPage(
  slug: string,
  frontmatter: PageFrontmatter,
  content: string
): Promise<string> {
  await ensureDirectory(PAGES_DIR)
  
  const filename = `${slug}.mdx`
  const filePath = path.join(PAGES_DIR, filename)
  
  // Check if file already exists
  try {
    await fs.access(filePath)
    throw new Error(`Page with slug "${slug}" already exists`)
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw error
    }
    // File doesn't exist, which is what we want
  }
  
  // Create frontmatter
  const frontmatterLines = [
    '---',
    `title: "${frontmatter.title}"`,
  ]
  
  if (frontmatter.description) {
    frontmatterLines.push(`description: "${frontmatter.description}"`)
  }
  
  frontmatterLines.push('---', '')
  
  const fullContent = frontmatterLines.join('\n') + content
  
  // Validate content before writing
  const validation = validateMDXContent(fullContent)
  if (!validation.isValid) {
    throw new Error(`Invalid MDX content: ${validation.errors.join(', ')}`)
  }
  
  await fs.writeFile(filePath, fullContent, 'utf-8')
  return filename
}

/**
 * Update an existing page
 */
export async function updatePage(
  slug: string,
  frontmatter: PageFrontmatter,
  content: string
): Promise<void> {
  const existingPage = await getPage(slug)
  if (!existingPage) {
    throw new Error(`Page with slug "${slug}" not found`)
  }
  
  const filePath = path.join(PAGES_DIR, existingPage.filename)
  
  // Create frontmatter
  const frontmatterLines = [
    '---',
    `title: "${frontmatter.title}"`,
  ]
  
  if (frontmatter.description) {
    frontmatterLines.push(`description: "${frontmatter.description}"`)
  }
  
  frontmatterLines.push('---', '')
  
  const fullContent = frontmatterLines.join('\n') + content
  
  // Validate content before writing
  const validation = validateMDXContent(fullContent)
  if (!validation.isValid) {
    throw new Error(`Invalid MDX content: ${validation.errors.join(', ')}`)
  }
  
  await fs.writeFile(filePath, fullContent, 'utf-8')
}

/**
 * Delete a page
 */
export async function deletePage(slug: string): Promise<void> {
  const existingPage = await getPage(slug)
  if (!existingPage) {
    throw new Error(`Page with slug "${slug}" not found`)
  }
  
  const filePath = path.join(PAGES_DIR, existingPage.filename)
  await fs.unlink(filePath)
}