import { Octokit } from '@octokit/rest'
import { withRetry, RETRY_CONFIGS, logError, logInfo } from './error-handling'
import { handleGitHubError } from './api-error-handler'

/**
 * GitHub API client configuration and utilities
 */

export interface GitHubConfig {
  token: string
  owner: string
  repo: string
}

export interface CommitOptions {
  path: string
  content: string
  message: string
  branch?: string
  sha?: string // For updates, the SHA of the file being updated
}

export interface CommitResult {
  sha: string
  url: string
  message: string
}

export class GitHubClient {
  private octokit: Octokit
  private config: GitHubConfig

  constructor(config: GitHubConfig) {
    this.config = config
    this.octokit = new Octokit({
      auth: config.token,
    })
  }

  /**
   * Get the current SHA of a file (needed for updates)
   */
  async getFileSha(path: string, branch: string = 'main'): Promise<string | null> {
    return withRetry(async () => {
      try {
        const response = await this.octokit.rest.repos.getContent({
          owner: this.config.owner,
          repo: this.config.repo,
          path,
          ref: branch,
        })

        if (Array.isArray(response.data)) {
          throw new Error(`Path ${path} is a directory, not a file`)
        }

        if ('sha' in response.data) {
          return response.data.sha
        }

        return null
      } catch (error: any) {
        if (error.status === 404) {
          // File doesn't exist
          return null
        }
        handleGitHubError(error)
      }
    }, RETRY_CONFIGS.github, {
      component: 'GitHubClient',
      action: 'getFileSha',
      path,
      branch
    })
  }

  /**
   * Check if a file exists in the repository
   */
  async fileExists(path: string, branch: string = 'main'): Promise<boolean> {
    return withRetry(async () => {
      try {
        await this.octokit.rest.repos.getContent({
          owner: this.config.owner,
          repo: this.config.repo,
          path,
          ref: branch,
        })
        return true
      } catch (error: any) {
        if (error.status === 404) {
          return false
        }
        handleGitHubError(error)
      }
    }, RETRY_CONFIGS.github, {
      component: 'GitHubClient',
      action: 'fileExists',
      path,
      branch
    })
  }

  /**
   * Create or update a file in the repository
   */
  async commitFile(options: CommitOptions): Promise<CommitResult> {
    const { path, content, message, branch = 'main', sha } = options

    return withRetry(async () => {
      try {
        logInfo('Committing file to GitHub', {
          component: 'GitHubClient',
          action: 'commitFile',
          path,
          branch,
          isUpdate: !!sha
        })

        // Convert content to base64
        const contentBase64 = Buffer.from(content, 'utf-8').toString('base64')

        const requestData: any = {
          owner: this.config.owner,
          repo: this.config.repo,
          path,
          message,
          content: contentBase64,
          branch,
        }

        // If SHA is provided, this is an update
        if (sha) {
          requestData.sha = sha
        }

        const response = await this.octokit.rest.repos.createOrUpdateFileContents(requestData)

        const result = {
          sha: response.data.content?.sha || '',
          url: response.data.content?.html_url || '',
          message: response.data.commit.message || message,
        }

        logInfo('Successfully committed file to GitHub', {
          component: 'GitHubClient',
          action: 'commitFile',
          path,
          sha: result.sha
        })

        return result
      } catch (error: any) {
        logError('Failed to commit file to GitHub', error, {
          component: 'GitHubClient',
          action: 'commitFile',
          path,
          branch
        })
        handleGitHubError(error)
      }
    }, RETRY_CONFIGS.github, {
      component: 'GitHubClient',
      action: 'commitFile',
      path,
      branch
    })
  }

  /**
   * Delete a file from the repository
   */
  async deleteFile(path: string, message: string, branch: string = 'main'): Promise<CommitResult> {
    try {
      // Get the current SHA of the file
      const sha = await this.getFileSha(path, branch)
      if (!sha) {
        throw new Error(`File ${path} does not exist`)
      }

      const response = await this.octokit.rest.repos.deleteFile({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        message,
        sha,
        branch,
      })

      return {
        sha: response.data.commit.sha || '',
        url: response.data.commit.html_url || '',
        message: response.data.commit.message || message,
      }
    } catch (error: any) {
      throw new GitHubError(`Failed to delete file ${path}`, error)
    }
  }

  /**
   * Get repository information
   */
  async getRepoInfo() {
    try {
      const response = await this.octokit.rest.repos.get({
        owner: this.config.owner,
        repo: this.config.repo,
      })

      return {
        name: response.data.name,
        fullName: response.data.full_name,
        defaultBranch: response.data.default_branch,
        private: response.data.private,
      }
    } catch (error: any) {
      throw new GitHubError('Failed to get repository information', error)
    }
  }

  /**
   * Test the GitHub connection and permissions
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.getRepoInfo()
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
      }
    }
  }
}

/**
 * Custom error class for GitHub API errors
 */
export class GitHubError extends Error {
  public readonly originalError: any
  public readonly status?: number

  constructor(message: string, originalError?: any) {
    super(message)
    this.name = 'GitHubError'
    this.originalError = originalError
    this.status = originalError?.status

    // Enhance error message with GitHub API details
    if (originalError?.response?.data?.message) {
      this.message = `${message}: ${originalError.response.data.message}`
    }
  }
}

/**
 * Create a GitHub client instance from environment variables
 */
export function createGitHubClient(): GitHubClient {
  const token = process.env.GITHUB_TOKEN
  const repoString = process.env.GITHUB_REPO

  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required')
  }

  if (!repoString) {
    throw new Error('GITHUB_REPO environment variable is required')
  }

  // Parse owner/repo from string like "owner/repo"
  const [owner, repo] = repoString.split('/')
  if (!owner || !repo) {
    throw new Error('GITHUB_REPO must be in format "owner/repo"')
  }

  return new GitHubClient({ token, owner, repo })
}