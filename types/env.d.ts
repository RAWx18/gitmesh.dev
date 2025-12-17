declare namespace NodeJS {
  interface ProcessEnv {
    // Authentication
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    
    // Admin Access
    GITMESH_CE_ADMIN_EMAILS: string
    
    // GitHub Integration
    GITHUB_TOKEN: string
    GITHUB_REPO: string
    
    // Email Service
    EMAIL_PROVIDER: 'sendgrid' | 'ses'
    SENDGRID_API_KEY?: string
    FROM_EMAIL: string
    
    // Analytics
    VERCEL_ANALYTICS_ID?: string
  }
}