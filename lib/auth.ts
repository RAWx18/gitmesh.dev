import { getServerSession } from 'next-auth/next'
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { NextRequest, NextResponse } from 'next/server'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if user email is in admin allowlist
      const adminEmails = getAdminEmails()
      const isAuthorized = adminEmails.includes(user.email || '')
      
      if (!isAuthorized) {
        console.log(`Access denied for email: ${user.email}`)
      }
      
      return isAuthorized
    },
    async session({ session, token }) {
      // Add admin role to session
      if (session.user?.email && isAdmin(session.user.email)) {
        session.user.role = 'admin'
      }
      return session
    },
    async jwt({ token, user }) {
      if (user && isAdmin(user.email)) {
        token.role = 'admin'
        token.email = user.email
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`Admin sign in: ${user.email}`)
      
      // Update user activity and log sign in
      try {
        const { updateUserActivity, logAdminActivity } = await import('./admin-users')
        
        if (user.email) {
          await updateUserActivity(user.email)
          await logAdminActivity({
            action: 'USER_SIGNIN',
            adminUser: user.email,
            details: `User signed in via Google OAuth`,
            timestamp: new Date(),
            metadata: { provider: account?.provider, isNewUser }
          })
        }
      } catch (error) {
        console.error('Error logging sign in activity:', error)
      }
    },
    async signOut({ session, token }) {
      const email = session?.user?.email || token?.email
      console.log(`Admin sign out: ${email}`)
      
      // Log sign out
      try {
        const { logAdminActivity } = await import('./admin-users')
        
        if (email) {
          await logAdminActivity({
            action: 'USER_SIGNOUT',
            adminUser: email,
            details: `User signed out`,
            timestamp: new Date()
          })
        }
      } catch (error) {
        console.error('Error logging sign out activity:', error)
      }
    },
  },
}

/**
 * Get the current server session
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * Get admin emails from environment variable
 */
export function getAdminEmails(): string[] {
  const emails = process.env.GITMESH_CE_ADMIN_EMAILS?.split(',') || []
  return emails.map(email => email.trim()).filter(Boolean)
}

/**
 * Check if an email is in the admin allowlist
 */
export function isAdmin(email?: string | null): boolean {
  if (!email) return false
  const adminEmails = getAdminEmails()
  return adminEmails.includes(email)
}

/**
 * Server-side admin validation middleware
 */
export async function validateAdminAccess(): Promise<{
  isValid: boolean
  session: any
  error?: string
}> {
  try {
    const session = await getSession()
    
    if (!session) {
      return {
        isValid: false,
        session: null,
        error: 'No session found'
      }
    }

    if (!session.user?.email) {
      return {
        isValid: false,
        session,
        error: 'No email in session'
      }
    }

    if (!isAdmin(session.user.email)) {
      return {
        isValid: false,
        session,
        error: 'Email not in admin allowlist'
      }
    }

    return {
      isValid: true,
      session
    }
  } catch (error) {
    console.error('Admin validation error:', error)
    return {
      isValid: false,
      session: null,
      error: 'Validation failed'
    }
  }
}

/**
 * API route middleware for admin protection
 */
export async function withAdminAuth(
  handler: (req: NextRequest, session: any) => Promise<Response>
) {
  return async (req: NextRequest) => {
    const validation = await validateAdminAccess()
    
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Unauthorized', 
          message: validation.error || 'Admin access required' 
        },
        { status: 401 }
      )
    }

    return handler(req, validation.session)
  }
}