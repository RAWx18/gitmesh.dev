import { 
  createBlogPost as createBlogPostLocal,
  updateBlogPost as updateBlogPostLocal,
  deleteBlogPost as deleteBlogPostLocal,
  createPage as createPageLocal,
  updatePage as updatePageLocal,
  deletePage as deletePageLocal,
} from './content-manager'
import { createGitHubContentManager, ContentCommitResult } from './github-content'
import type { BlogPostFrontmatter, PageFrontmatter } from './content-parser'

/**
 * Enhanced content manager that integrates with GitHub
 * Provides both local file operations and GitHub commits
 */

export interface ContentOperationResult {
  success: boolean
  filename?: string
  error?: string
  github?: ContentCommitResult
}

export interface GitHubIntegrationOptions {
  enableGitHub?: boolean
  adminUser?: string
  branch?: string
}

export class ContentManagerWithGitHub {
  private githubManager = createGitHubContentManager()

  /**
   * Create a new blog post with optional GitHub integration
   */
  async createBlogPost(
    slug: string,
    frontmatter: BlogPostFrontmatter,
    content: string,
    options: GitHubIntegrationOptions = {}
  ): Promise<ContentOperationResult> {
    try {
      // Create locally first
      const filename = await createBlogPostLocal(slug, frontmatter, content)
      
      const result: ContentOperationResult = {
        success: true,
        filename,
      }

      // Optionally commit to GitHub
      if (options.enableGitHub) {
        try {
          const githubResult = await this.githubManager.createBlogPost(
            filename,
            frontmatter,
            content,
            {
              adminUser: options.adminUser,
              branch: options.branch,
            }
          )
          result.github = githubResult
        } catch (error: any) {
          console.warn('GitHub commit failed for blog post creation:', error.message)
          // Don't fail the entire operation if GitHub fails
          result.github = {
            success: false,
            error: error.message,
          }
        }
      }

      return result
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Update an existing blog post with optional GitHub integration
   */
  async updateBlogPost(
    slug: string,
    frontmatter: BlogPostFrontmatter,
    content: string,
    options: GitHubIntegrationOptions = {}
  ): Promise<ContentOperationResult> {
    try {
      // Update locally first
      await updateBlogPostLocal(slug, frontmatter, content)
      
      const result: ContentOperationResult = {
        success: true,
      }

      // Optionally commit to GitHub
      if (options.enableGitHub) {
        try {
          // We need to get the filename from the slug
          const { getBlogPost } = await import('./content-manager')
          const existingPost = await getBlogPost(slug)
          
          if (existingPost) {
            const githubResult = await this.githubManager.updateBlogPost(
              existingPost.filename,
              frontmatter,
              content,
              {
                adminUser: options.adminUser,
                branch: options.branch,
              }
            )
            result.github = githubResult
          }
        } catch (error: any) {
          console.warn('GitHub commit failed for blog post update:', error.message)
          result.github = {
            success: false,
            error: error.message,
          }
        }
      }

      return result
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Delete a blog post with optional GitHub integration
   */
  async deleteBlogPost(
    slug: string,
    options: GitHubIntegrationOptions = {}
  ): Promise<ContentOperationResult> {
    try {
      // Get the post info before deleting locally
      const { getBlogPost } = await import('./content-manager')
      const existingPost = await getBlogPost(slug)
      
      if (!existingPost) {
        return {
          success: false,
          error: 'Blog post not found',
        }
      }

      // Delete locally first
      await deleteBlogPostLocal(slug)
      
      const result: ContentOperationResult = {
        success: true,
      }

      // Optionally commit to GitHub
      if (options.enableGitHub) {
        try {
          const githubResult = await this.githubManager.deleteBlogPost(
            existingPost.filename,
            existingPost.frontmatter.title,
            {
              adminUser: options.adminUser,
              branch: options.branch,
            }
          )
          result.github = githubResult
        } catch (error: any) {
          console.warn('GitHub commit failed for blog post deletion:', error.message)
          result.github = {
            success: false,
            error: error.message,
          }
        }
      }

      return result
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Create a new page with optional GitHub integration
   */
  async createPage(
    slug: string,
    frontmatter: PageFrontmatter,
    content: string,
    options: GitHubIntegrationOptions = {}
  ): Promise<ContentOperationResult> {
    try {
      // Create locally first
      const filename = await createPageLocal(slug, frontmatter, content)
      
      const result: ContentOperationResult = {
        success: true,
        filename,
      }

      // Optionally commit to GitHub
      if (options.enableGitHub) {
        try {
          const githubResult = await this.githubManager.createPage(
            filename,
            frontmatter,
            content,
            {
              adminUser: options.adminUser,
              branch: options.branch,
            }
          )
          result.github = githubResult
        } catch (error: any) {
          console.warn('GitHub commit failed for page creation:', error.message)
          result.github = {
            success: false,
            error: error.message,
          }
        }
      }

      return result
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Update an existing page with optional GitHub integration
   */
  async updatePage(
    slug: string,
    frontmatter: PageFrontmatter,
    content: string,
    options: GitHubIntegrationOptions = {}
  ): Promise<ContentOperationResult> {
    try {
      // Update locally first
      await updatePageLocal(slug, frontmatter, content)
      
      const result: ContentOperationResult = {
        success: true,
      }

      // Optionally commit to GitHub
      if (options.enableGitHub) {
        try {
          // We need to get the filename from the slug
          const { getPage } = await import('./content-manager')
          const existingPage = await getPage(slug)
          
          if (existingPage) {
            const githubResult = await this.githubManager.updatePage(
              existingPage.filename,
              frontmatter,
              content,
              {
                adminUser: options.adminUser,
                branch: options.branch,
              }
            )
            result.github = githubResult
          }
        } catch (error: any) {
          console.warn('GitHub commit failed for page update:', error.message)
          result.github = {
            success: false,
            error: error.message,
          }
        }
      }

      return result
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Commit data file changes to GitHub
   */
  async commitDataFile(
    filename: string,
    content: string,
    dataType: 'contributors' | 'newsletter' | 'config',
    description?: string,
    options: GitHubIntegrationOptions = {}
  ): Promise<ContentCommitResult> {
    try {
      return await this.githubManager.commitDataFile(
        filename,
        content,
        dataType,
        description,
        {
          adminUser: options.adminUser,
          branch: options.branch,
        }
      )
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Test GitHub connection
   */
  async testGitHubConnection(): Promise<{ success: boolean; error?: string }> {
    return await this.githubManager.testConnection()
  }
}

/**
 * Create a content manager with GitHub integration
 */
export function createContentManagerWithGitHub(): ContentManagerWithGitHub {
  return new ContentManagerWithGitHub()
}

/**
 * Utility function to check if GitHub integration is enabled
 */
export function isGitHubIntegrationEnabled(): boolean {
  return !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO)
}