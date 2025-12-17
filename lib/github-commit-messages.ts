/**
 * GitHub commit message generation utilities
 */

export interface CommitMetadata {
  type: 'blog' | 'page' | 'data' | 'config'
  action: 'create' | 'update' | 'delete'
  title?: string
  author?: string
  timestamp: Date
  adminUser?: string
}

export interface BlogPostMetadata extends CommitMetadata {
  type: 'blog'
  title: string
  author: string
  tags?: string[]
  featured?: boolean
}

export interface PageMetadata extends CommitMetadata {
  type: 'page'
  title: string
  slug: string
}

export interface DataMetadata extends CommitMetadata {
  type: 'data'
  dataType: 'contributors' | 'newsletter' | 'config'
  description?: string
}

/**
 * Generate a commit message for blog post operations
 */
export function generateBlogCommitMessage(
  action: 'create' | 'update' | 'delete',
  metadata: {
    title: string
    author: string
    adminUser?: string
    tags?: string[]
    featured?: boolean
  }
): string {
  const { title, author, adminUser, tags, featured } = metadata
  
  let message = ''
  
  switch (action) {
    case 'create':
      message = `feat(blog): add new blog post "${title}"`
      break
    case 'update':
      message = `feat(blog): update blog post "${title}"`
      break
    case 'delete':
      message = `feat(blog): remove blog post "${title}"`
      break
  }
  
  // Add metadata in commit body
  const details = []
  details.push(`Author: ${author}`)
  
  if (tags && tags.length > 0) {
    details.push(`Tags: ${tags.join(', ')}`)
  }
  
  if (featured) {
    details.push('Featured: true')
  }
  
  if (adminUser) {
    details.push(`Admin: ${adminUser}`)
  }
  
  details.push(`Timestamp: ${new Date().toISOString()}`)
  
  return `${message}\n\n${details.join('\n')}`
}

/**
 * Generate a commit message for page operations
 */
export function generatePageCommitMessage(
  action: 'create' | 'update' | 'delete',
  metadata: {
    title: string
    slug: string
    adminUser?: string
  }
): string {
  const { title, slug, adminUser } = metadata
  
  let message = ''
  
  switch (action) {
    case 'create':
      message = `feat(pages): add new page "${title}"`
      break
    case 'update':
      message = `feat(pages): update page "${title}"`
      break
    case 'delete':
      message = `feat(pages): remove page "${title}"`
      break
  }
  
  // Add metadata in commit body
  const details = []
  details.push(`Slug: ${slug}`)
  
  if (adminUser) {
    details.push(`Admin: ${adminUser}`)
  }
  
  details.push(`Timestamp: ${new Date().toISOString()}`)
  
  return `${message}\n\n${details.join('\n')}`
}

/**
 * Generate a commit message for data file operations
 */
export function generateDataCommitMessage(
  action: 'create' | 'update' | 'delete',
  metadata: {
    dataType: 'contributors' | 'newsletter' | 'config'
    description?: string
    adminUser?: string
  }
): string {
  const { dataType, description, adminUser } = metadata
  
  let message = ''
  
  switch (action) {
    case 'create':
      message = `feat(data): add ${dataType} data`
      break
    case 'update':
      message = `feat(data): update ${dataType} data`
      break
    case 'delete':
      message = `feat(data): remove ${dataType} data`
      break
  }
  
  if (description) {
    message += ` - ${description}`
  }
  
  // Add metadata in commit body
  const details = []
  details.push(`Data type: ${dataType}`)
  
  if (description) {
    details.push(`Description: ${description}`)
  }
  
  if (adminUser) {
    details.push(`Admin: ${adminUser}`)
  }
  
  details.push(`Timestamp: ${new Date().toISOString()}`)
  
  return `${message}\n\n${details.join('\n')}`
}

/**
 * Generate a commit message for automated operations
 */
export function generateAutomatedCommitMessage(
  operation: string,
  metadata: {
    description?: string
    source?: string
  }
): string {
  const { description, source } = metadata
  
  let message = `chore(automation): ${operation}`
  
  if (description) {
    message += ` - ${description}`
  }
  
  // Add metadata in commit body
  const details = []
  
  if (source) {
    details.push(`Source: ${source}`)
  }
  
  details.push(`Automated: true`)
  details.push(`Timestamp: ${new Date().toISOString()}`)
  
  return `${message}\n\n${details.join('\n')}`
}

/**
 * Parse commit metadata from a commit message
 */
export function parseCommitMetadata(commitMessage: string): Partial<CommitMetadata> {
  const lines = commitMessage.split('\n')
  const metadata: Partial<CommitMetadata> = {}
  
  // Parse the first line for type and action
  const firstLine = lines[0]
  
  if (firstLine.includes('feat(blog)')) {
    metadata.type = 'blog'
    if (firstLine.includes('add new')) {
      metadata.action = 'create'
    } else if (firstLine.includes('update')) {
      metadata.action = 'update'
    } else if (firstLine.includes('remove')) {
      metadata.action = 'delete'
    }
  } else if (firstLine.includes('feat(pages)')) {
    metadata.type = 'page'
    if (firstLine.includes('add new')) {
      metadata.action = 'create'
    } else if (firstLine.includes('update')) {
      metadata.action = 'update'
    } else if (firstLine.includes('remove')) {
      metadata.action = 'delete'
    }
  } else if (firstLine.includes('feat(data)')) {
    metadata.type = 'data'
    if (firstLine.includes('add')) {
      metadata.action = 'create'
    } else if (firstLine.includes('update')) {
      metadata.action = 'update'
    } else if (firstLine.includes('remove')) {
      metadata.action = 'delete'
    }
  }
  
  // Parse metadata from commit body
  for (const line of lines) {
    if (line.startsWith('Author: ')) {
      metadata.author = line.replace('Author: ', '')
    } else if (line.startsWith('Admin: ')) {
      metadata.adminUser = line.replace('Admin: ', '')
    } else if (line.startsWith('Timestamp: ')) {
      metadata.timestamp = new Date(line.replace('Timestamp: ', ''))
    }
  }
  
  return metadata
}

/**
 * Validate commit message format
 */
export function validateCommitMessage(message: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!message || message.trim().length === 0) {
    errors.push('Commit message cannot be empty')
    return { isValid: false, errors }
  }
  
  const lines = message.split('\n')
  const firstLine = lines[0]
  
  // Check first line format
  if (firstLine.length > 72) {
    errors.push('First line should be 72 characters or less')
  }
  
  // Check for conventional commit format
  const conventionalCommitRegex = /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+/
  if (!conventionalCommitRegex.test(firstLine)) {
    errors.push('Commit message should follow conventional commit format')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}