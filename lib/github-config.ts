/**
 * GitHub configuration validation and utilities
 */

export interface GitHubConfigValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validate GitHub environment configuration
 */
export function validateGitHubConfig(): GitHubConfigValidation {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required environment variables
  if (!process.env.GITHUB_TOKEN) {
    errors.push('GITHUB_TOKEN environment variable is required')
  } else {
    // Basic token format validation
    const token = process.env.GITHUB_TOKEN
    if (!token.startsWith('github_pat_') && !token.startsWith('ghp_')) {
      warnings.push('GITHUB_TOKEN should be a fine-grained personal access token (github_pat_) or classic token (ghp_)')
    }
  }

  if (!process.env.GITHUB_REPO) {
    errors.push('GITHUB_REPO environment variable is required')
  } else {
    // Validate repo format
    const repo = process.env.GITHUB_REPO
    const parts = repo.split('/')
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      errors.push('GITHUB_REPO must be in format "owner/repository"')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Get GitHub configuration from environment
 */
export function getGitHubConfig(): {
  token?: string
  owner?: string
  repo?: string
  fullRepo?: string
} {
  const token = process.env.GITHUB_TOKEN
  const repoString = process.env.GITHUB_REPO

  if (!token || !repoString) {
    return {}
  }

  const [owner, repo] = repoString.split('/')

  return {
    token,
    owner,
    repo,
    fullRepo: repoString,
  }
}

/**
 * Check if GitHub integration is properly configured
 */
export function isGitHubConfigured(): boolean {
  const validation = validateGitHubConfig()
  return validation.isValid
}

/**
 * Get GitHub repository URL for display purposes
 */
export function getGitHubRepoUrl(): string | null {
  const config = getGitHubConfig()
  if (config.owner && config.repo) {
    return `https://github.com/${config.owner}/${config.repo}`
  }
  return null
}

/**
 * Get required GitHub token permissions for fine-grained tokens
 */
export function getRequiredGitHubPermissions(): string[] {
  return [
    'Contents: Read and write',
    'Metadata: Read',
    'Pull requests: Read (if using PR-based workflow)',
  ]
}

/**
 * Generate GitHub token setup instructions
 */
export function getGitHubTokenInstructions(): {
  title: string
  steps: string[]
  permissions: string[]
} {
  return {
    title: 'GitHub Fine-Grained Personal Access Token Setup',
    steps: [
      'Go to GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens',
      'Click "Generate new token"',
      'Select the target repository (LF-Decentralized-Trust-labs/gitmesh)',
      'Set expiration as needed (recommend 90 days or 1 year)',
      'Configure the required permissions (see below)',
      'Generate the token and copy it to your GITHUB_TOKEN environment variable',
    ],
    permissions: getRequiredGitHubPermissions(),
  }
}