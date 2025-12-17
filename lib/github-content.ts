import { GitHubClient, GitHubError, createGitHubClient } from './github-client'
import {
  generateBlogCommitMessage,
  generatePageCommitMessage,
  generateDataCommitMessage,
  generateAutomatedCommitMessage,
  validateCommitMessage,
} from './github-commit-messages'
import type { BlogPostFrontmatter, PageFrontmatter } from './content-parser'

/**
 * GitHub content management integration
 * Handles committing content changes to the repository
 */

export interface GitHubContentOptions {
  adminUser?: string
  branch?: string
}

export interface ContentCommitResult {
  success: boolean
  sha?: string
  url?: string
  message?: string
  error?: string
}

export class GitHubContentManager {
  private client: GitHubClient

  constructor(client?: GitHubClient) {
    this.client = client || createGitHubClient()
  }

  /**
   * Test the GitHub connection
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      return await this.client.testConnection()
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to connect to GitHub',
      }
    }
  }

  /**
   * Commit a new blog post to the repository
   */
  async createBlogPost(
    filename: string,
    frontmatter: BlogPostFrontmatter,
    content: string,
    options: GitHubContentOptions = {}
  ): Promise<ContentCommitResult> {
    try {
      const { adminUser, branch = 'main' } = options
      
      // Generate the full MDX content
      const fullContent = this.generateMDXContent(frontmatter, content, 'blog')
      
      // Generate commit message
      const commitMessage = generateBlogCommitMessage('create', {
        title: frontmatter.title,
        author: frontmatter.author,
        adminUser,
        tags: frontmatter.tags,
        featured: frontmatter.featured,
      })
      
      // Validate commit message
      const validation = validateCommitMessage(commitMessage)
      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid commit message: ${validation.errors.join(', ')}`,
        }
      }
      
      // Check if file already exists
      const filePath = `content/blog/${filename}`
      const exists = await this.client.fileExists(filePath, branch)
      if (exists) {
        return {
          success: false,
          error: `Blog post ${filename} already exists`,
        }
      }
      
      // Commit the file
      const result = await this.client.commitFile({
        path: filePath,
        content: fullContent,
        message: commitMessage,
        branch,
      })
      
      return {
        success: true,
        sha: result.sha,
        url: result.url,
        message: result.message,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error instanceof GitHubError ? error.message : 'Failed to create blog post',
      }
    }
  }

  /**
   * Update an existing blog post in the repository
   */
  async updateBlogPost(
    filename: string,
    frontmatter: BlogPostFrontmatter,
    content: string,
    options: GitHubContentOptions = {}
  ): Promise<ContentCommitResult> {
    try {
      const { adminUser, branch = 'main' } = options
      
      // Generate the full MDX content
      const fullContent = this.generateMDXContent(frontmatter, content, 'blog')
      
      // Generate commit message
      const commitMessage = generateBlogCommitMessage('update', {
        title: frontmatter.title,
        author: frontmatter.author,
        adminUser,
        tags: frontmatter.tags,
        featured: frontmatter.featured,
      })
      
      // Validate commit message
      const validation = validateCommitMessage(commitMessage)
      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid commit message: ${validation.errors.join(', ')}`,
        }
      }
      
      // Get current file SHA
      const filePath = `content/blog/${filename}`
      const sha = await this.client.getFileSha(filePath, branch)
      if (!sha) {
        return {
          success: false,
          error: `Blog post ${filename} does not exist`,
        }
      }
      
      // Commit the updated file
      const result = await this.client.commitFile({
        path: filePath,
        content: fullContent,
        message: commitMessage,
        branch,
        sha,
      })
      
      return {
        success: true,
        sha: result.sha,
        url: result.url,
        message: result.message,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error instanceof GitHubError ? error.message : 'Failed to update blog post',
      }
    }
  }

  /**
   * Delete a blog post from the repository
   */
  async deleteBlogPost(
    filename: string,
    title: string,
    options: GitHubContentOptions = {}
  ): Promise<ContentCommitResult> {
    try {
      const { adminUser, branch = 'main' } = options
      
      // Generate commit message
      const commitMessage = generateBlogCommitMessage('delete', {
        title,
        author: 'Unknown', // We don't have author info when deleting
        adminUser,
      })
      
      // Validate commit message
      const validation = validateCommitMessage(commitMessage)
      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid commit message: ${validation.errors.join(', ')}`,
        }
      }
      
      // Delete the file
      const filePath = `content/blog/${filename}`
      const result = await this.client.deleteFile(filePath, commitMessage, branch)
      
      return {
        success: true,
        sha: result.sha,
        url: result.url,
        message: result.message,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error instanceof GitHubError ? error.message : 'Failed to delete blog post',
      }
    }
  }

  /**
   * Commit a new page to the repository
   */
  async createPage(
    filename: string,
    frontmatter: PageFrontmatter,
    content: string,
    options: GitHubContentOptions = {}
  ): Promise<ContentCommitResult> {
    try {
      const { adminUser, branch = 'main' } = options
      
      // Generate the full MDX content
      const fullContent = this.generateMDXContent(frontmatter, content, 'page')
      
      // Generate commit message
      const commitMessage = generatePageCommitMessage('create', {
        title: frontmatter.title,
        slug: filename.replace('.mdx', ''),
        adminUser,
      })
      
      // Validate commit message
      const validation = validateCommitMessage(commitMessage)
      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid commit message: ${validation.errors.join(', ')}`,
        }
      }
      
      // Check if file already exists
      const filePath = `content/pages/${filename}`
      const exists = await this.client.fileExists(filePath, branch)
      if (exists) {
        return {
          success: false,
          error: `Page ${filename} already exists`,
        }
      }
      
      // Commit the file
      const result = await this.client.commitFile({
        path: filePath,
        content: fullContent,
        message: commitMessage,
        branch,
      })
      
      return {
        success: true,
        sha: result.sha,
        url: result.url,
        message: result.message,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error instanceof GitHubError ? error.message : 'Failed to create page',
      }
    }
  }

  /**
   * Update an existing page in the repository
   */
  async updatePage(
    filename: string,
    frontmatter: PageFrontmatter,
    content: string,
    options: GitHubContentOptions = {}
  ): Promise<ContentCommitResult> {
    try {
      const { adminUser, branch = 'main' } = options
      
      // Generate the full MDX content
      const fullContent = this.generateMDXContent(frontmatter, content, 'page')
      
      // Generate commit message
      const commitMessage = generatePageCommitMessage('update', {
        title: frontmatter.title,
        slug: filename.replace('.mdx', ''),
        adminUser,
      })
      
      // Validate commit message
      const validation = validateCommitMessage(commitMessage)
      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid commit message: ${validation.errors.join(', ')}`,
        }
      }
      
      // Get current file SHA
      const filePath = `content/pages/${filename}`
      const sha = await this.client.getFileSha(filePath, branch)
      if (!sha) {
        return {
          success: false,
          error: `Page ${filename} does not exist`,
        }
      }
      
      // Commit the updated file
      const result = await this.client.commitFile({
        path: filePath,
        content: fullContent,
        message: commitMessage,
        branch,
        sha,
      })
      
      return {
        success: true,
        sha: result.sha,
        url: result.url,
        message: result.message,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error instanceof GitHubError ? error.message : 'Failed to update page',
      }
    }
  }

  /**
   * Commit data file changes (contributors, newsletter, etc.)
   */
  async commitDataFile(
    filename: string,
    content: string,
    dataType: 'contributors' | 'newsletter' | 'config',
    description?: string,
    options: GitHubContentOptions = {}
  ): Promise<ContentCommitResult> {
    try {
      const { adminUser, branch = 'main' } = options
      
      // Generate commit message
      const commitMessage = generateDataCommitMessage('update', {
        dataType,
        description,
        adminUser,
      })
      
      // Validate commit message
      const validation = validateCommitMessage(commitMessage)
      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid commit message: ${validation.errors.join(', ')}`,
        }
      }
      
      // Get current file SHA (if it exists)
      const filePath = `data/${filename}`
      const sha = await this.client.getFileSha(filePath, branch)
      
      // Commit the file
      const result = await this.client.commitFile({
        path: filePath,
        content,
        message: commitMessage,
        branch,
        sha: sha || undefined,
      })
      
      return {
        success: true,
        sha: result.sha,
        url: result.url,
        message: result.message,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error instanceof GitHubError ? error.message : 'Failed to commit data file',
      }
    }
  }

  /**
   * Generate MDX content with frontmatter
   */
  private generateMDXContent(
    frontmatter: BlogPostFrontmatter | PageFrontmatter,
    content: string,
    type: 'blog' | 'page'
  ): string {
    const frontmatterLines = ['---']
    
    if (type === 'blog') {
      const blogFrontmatter = frontmatter as BlogPostFrontmatter
      frontmatterLines.push(`title: "${blogFrontmatter.title}"`)
      frontmatterLines.push(`excerpt: "${blogFrontmatter.excerpt}"`)
      frontmatterLines.push(`author: "${blogFrontmatter.author}"`)
      frontmatterLines.push(`publishedAt: "${blogFrontmatter.publishedAt}"`)
      frontmatterLines.push(`tags: [${blogFrontmatter.tags.map(tag => `"${tag}"`).join(', ')}]`)
      frontmatterLines.push(`featured: ${blogFrontmatter.featured}`)
      frontmatterLines.push(`newsletter: ${blogFrontmatter.newsletter}`)
    } else {
      const pageFrontmatter = frontmatter as PageFrontmatter
      frontmatterLines.push(`title: "${pageFrontmatter.title}"`)
      if (pageFrontmatter.description) {
        frontmatterLines.push(`description: "${pageFrontmatter.description}"`)
      }
    }
    
    frontmatterLines.push('---', '')
    
    return frontmatterLines.join('\n') + content
  }
}

/**
 * Create a GitHub content manager instance
 */
export function createGitHubContentManager(): GitHubContentManager {
  return new GitHubContentManager()
}

/**
 * Utility function to handle GitHub API errors gracefully
 */
export function handleGitHubError(error: any): string {
  if (error instanceof GitHubError) {
    // Handle specific GitHub API errors
    switch (error.status) {
      case 401:
        return 'GitHub authentication failed. Please check your token.'
      case 403:
        return 'GitHub access forbidden. Please check your token permissions.'
      case 404:
        return 'GitHub repository not found. Please check your repository configuration.'
      case 422:
        return 'GitHub validation error. Please check your content format.'
      default:
        return error.message
    }
  }
  
  return error.message || 'An unknown error occurred'
}