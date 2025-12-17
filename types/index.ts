// Content Management Types
export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: Date
  tags: string[]
  featured: boolean
  newsletter: boolean
}

export interface Contributor {
  name: string
  github: string
  role: string
  avatar: string
  contributions: number
}

// Newsletter Types
export interface NewsletterSubscriber {
  email: string
  name?: string
  subscribedAt: Date
  confirmed: boolean
  tags: string[]
  unsubscribeToken: string
}

// Admin Types
export interface AdminUser {
  email: string
  name: string
  avatar: string
  role: 'admin' | 'super_admin'
  lastLogin: Date
  permissions: Permission[]
}

export interface Permission {
  resource: 'blog' | 'newsletter' | 'users' | 'diagnostics'
  actions: ('create' | 'read' | 'update' | 'delete')[]
}

// Site Configuration
export interface SiteConfig {
  maintenance: boolean
  featuredPosts: string[]
  announcementBanner?: {
    text: string
    link?: string
    variant: 'info' | 'warning' | 'success'
  }
}

// API Error Types
export interface APIError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

export enum ErrorCodes {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  GITHUB_API_ERROR = 'GITHUB_API_ERROR',
  EMAIL_SERVICE_ERROR = 'EMAIL_SERVICE_ERROR'
}

// GitHub Integration Types
export interface GitHubConfig {
  token: string
  owner: string
  repo: string
}

export interface GitHubCommitResult {
  sha: string
  url: string
  message: string
}

export interface GitHubOperationResult {
  success: boolean
  sha?: string
  url?: string
  message?: string
  error?: string
}

export interface CommitMetadata {
  type: 'blog' | 'page' | 'data' | 'config'
  action: 'create' | 'update' | 'delete'
  title?: string
  author?: string
  timestamp: Date
  adminUser?: string
}