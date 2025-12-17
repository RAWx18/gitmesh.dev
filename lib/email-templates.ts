import { NewsletterSubscriber, BlogPost } from '@/types'

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface NewsletterTemplateData {
  subscriber: NewsletterSubscriber
  posts?: BlogPost[]
  customContent?: string
  unsubscribeUrl: string
}

export interface ConfirmationTemplateData {
  email: string
  name?: string
  confirmUrl: string
}

export interface WelcomeTemplateData {
  email: string
  name?: string
  unsubscribeUrl: string
}

// Base HTML template with GitMesh CE branding
const getBaseTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8f9fa;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e9ecef;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 8px;
    }
    .tagline {
      color: #6b7280;
      font-size: 14px;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin: 16px 0;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    .unsubscribe {
      margin-top: 20px;
      font-size: 11px;
      color: #9ca3af;
    }
    .unsubscribe a {
      color: #9ca3af;
      text-decoration: underline;
    }
    .blog-post {
      margin: 20px 0;
      padding: 20px;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      background-color: #f8f9fa;
    }
    .blog-post h3 {
      margin: 0 0 10px 0;
      color: #1f2937;
    }
    .blog-post .meta {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 10px;
    }
    .blog-post .excerpt {
      margin-bottom: 15px;
    }
    .blog-post .read-more {
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">GitMesh CE</div>
      <div class="tagline">Community Edition - Open Source Developer Intelligence</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>GitMesh Community Edition is governed by Linux Foundation Decentralized Trust</p>
      <p>This website is hosted by Alveoli for community welfare</p>
    </div>
  </div>
</body>
</html>
`

export class EmailTemplateService {
  private baseUrl: string

  constructor(baseUrl: string = process.env.NEXTAUTH_URL || 'http://localhost:3000') {
    this.baseUrl = baseUrl
  }

  generateConfirmationEmail(data: ConfirmationTemplateData): EmailTemplate {
    const { email, name, confirmUrl } = data
    const displayName = name || email

    const content = `
      <h2>Welcome to GitMesh CE Newsletter! 🎉</h2>
      <p>Hi ${displayName},</p>
      <p>Thank you for subscribing to the GitMesh Community Edition newsletter. To complete your subscription, please confirm your email address by clicking the button below:</p>
      <p style="text-align: center;">
        <a href="${confirmUrl}" class="button">Confirm Subscription</a>
      </p>
      <p>Once confirmed, you'll receive updates about:</p>
      <ul>
        <li>New GitMesh CE features and releases</li>
        <li>Community tutorials and best practices</li>
        <li>Developer insights and engineering intelligence</li>
        <li>Community events and announcements</li>
      </ul>
      <p>If you didn't subscribe to this newsletter, you can safely ignore this email.</p>
      <p>Best regards,<br>The GitMesh CE Team</p>
    `

    const html = getBaseTemplate(content, 'Confirm Your GitMesh CE Newsletter Subscription')
    
    const text = `
Welcome to GitMesh CE Newsletter!

Hi ${displayName},

Thank you for subscribing to the GitMesh Community Edition newsletter. To complete your subscription, please confirm your email address by visiting:

${confirmUrl}

Once confirmed, you'll receive updates about:
- New GitMesh CE features and releases
- Community tutorials and best practices  
- Developer insights and engineering intelligence
- Community events and announcements

If you didn't subscribe to this newsletter, you can safely ignore this email.

Best regards,
The GitMesh CE Team
    `.trim()

    return {
      subject: 'Confirm your GitMesh CE newsletter subscription',
      html,
      text,
    }
  }

  generateWelcomeEmail(data: WelcomeTemplateData): EmailTemplate {
    const { email, name, unsubscribeUrl } = data
    const displayName = name || email

    const content = `
      <h2>Welcome to the GitMesh CE Community! 🚀</h2>
      <p>Hi ${displayName},</p>
      <p>Your subscription to the GitMesh Community Edition newsletter has been confirmed! We're excited to have you join our community of developers building better software with engineering intelligence.</p>
      
      <h3>What to expect:</h3>
      <ul>
        <li><strong>Weekly Updates:</strong> Latest features, bug fixes, and improvements</li>
        <li><strong>Community Spotlights:</strong> Success stories and use cases from the community</li>
        <li><strong>Technical Deep Dives:</strong> Engineering insights and best practices</li>
        <li><strong>Event Announcements:</strong> Webinars, conferences, and community meetups</li>
      </ul>

      <h3>Get Started:</h3>
      <p>While you're here, check out these resources:</p>
      <ul>
        <li><a href="${this.baseUrl}/docs">Documentation</a> - Complete guides and API reference</li>
        <li><a href="${this.baseUrl}/docs/getting-started">Getting Started Guide</a> - Set up GitMesh CE in minutes</li>
        <li><a href="https://github.com/LF-Decentralized-Trust-labs/gitmesh">GitHub Repository</a> - Contribute to the project</li>
      </ul>

      <p>Thank you for being part of the GitMesh CE community!</p>
      <p>Best regards,<br>The GitMesh CE Team</p>

      <div class="unsubscribe">
        <p>You can <a href="${unsubscribeUrl}">unsubscribe</a> from these emails at any time.</p>
      </div>
    `

    const html = getBaseTemplate(content, 'Welcome to GitMesh CE!')
    
    const text = `
Welcome to the GitMesh CE Community!

Hi ${displayName},

Your subscription to the GitMesh Community Edition newsletter has been confirmed! We're excited to have you join our community of developers building better software with engineering intelligence.

What to expect:
- Weekly Updates: Latest features, bug fixes, and improvements
- Community Spotlights: Success stories and use cases from the community
- Technical Deep Dives: Engineering insights and best practices
- Event Announcements: Webinars, conferences, and community meetups

Get Started:
While you're here, check out these resources:
- Documentation: ${this.baseUrl}/docs
- Getting Started Guide: ${this.baseUrl}/docs/getting-started
- GitHub Repository: https://github.com/LF-Decentralized-Trust-labs/gitmesh

Thank you for being part of the GitMesh CE community!

Best regards,
The GitMesh CE Team

You can unsubscribe from these emails at any time: ${unsubscribeUrl}
    `.trim()

    return {
      subject: 'Welcome to GitMesh CE! 🚀',
      html,
      text,
    }
  }

  generateNewsletterEmail(data: NewsletterTemplateData): EmailTemplate {
    const { subscriber, posts = [], customContent, unsubscribeUrl } = data
    const displayName = subscriber.name || subscriber.email

    let postsContent = ''
    if (posts.length > 0) {
      postsContent = `
        <h3>Latest Blog Posts</h3>
        ${posts.map(post => `
          <div class="blog-post">
            <h3>${post.title}</h3>
            <div class="meta">By ${post.author} • ${new Date(post.publishedAt).toLocaleDateString()}</div>
            <div class="excerpt">${post.excerpt}</div>
            <a href="${this.baseUrl}/blog/${post.slug}" class="read-more">Read More →</a>
          </div>
        `).join('')}
      `
    }

    const content = `
      <h2>GitMesh CE Newsletter</h2>
      <p>Hi ${displayName},</p>
      
      ${customContent ? `<div>${customContent}</div>` : ''}
      
      ${postsContent}
      
      ${!customContent && posts.length === 0 ? `
        <p>Thank you for being part of the GitMesh CE community! We'll be sharing updates about new features, community highlights, and engineering insights in future newsletters.</p>
      ` : ''}

      <h3>Community Links</h3>
      <ul>
        <li><a href="${this.baseUrl}">GitMesh CE Website</a></li>
        <li><a href="${this.baseUrl}/docs">Documentation</a></li>
        <li><a href="https://github.com/LF-Decentralized-Trust-labs/gitmesh">GitHub Repository</a></li>
      </ul>

      <p>Best regards,<br>The GitMesh CE Team</p>

      <div class="unsubscribe">
        <p>You can <a href="${unsubscribeUrl}">unsubscribe</a> from these emails at any time.</p>
      </div>
    `

    const html = getBaseTemplate(content, 'GitMesh CE Newsletter')
    
    const textPosts = posts.length > 0 ? `
Latest Blog Posts:
${posts.map(post => `
${post.title}
By ${post.author} • ${new Date(post.publishedAt).toLocaleDateString()}
${post.excerpt}
Read more: ${this.baseUrl}/blog/${post.slug}
`).join('\n')}
` : ''

    const text = `
GitMesh CE Newsletter

Hi ${displayName},

${customContent ? customContent.replace(/<[^>]*>/g, '') : ''}

${textPosts}

${!customContent && posts.length === 0 ? 'Thank you for being part of the GitMesh CE community! We\'ll be sharing updates about new features, community highlights, and engineering insights in future newsletters.' : ''}

Community Links:
- GitMesh CE Website: ${this.baseUrl}
- Documentation: ${this.baseUrl}/docs
- GitHub Repository: https://github.com/LF-Decentralized-Trust-labs/gitmesh

Best regards,
The GitMesh CE Team

You can unsubscribe from these emails at any time: ${unsubscribeUrl}
    `.trim()

    return {
      subject: posts.length > 0 ? `GitMesh CE Newsletter - ${posts.length} New Post${posts.length > 1 ? 's' : ''}` : 'GitMesh CE Newsletter',
      html,
      text,
    }
  }

  generateUnsubscribeUrl(email: string, token: string): string {
    return `${this.baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
  }

  generateConfirmUrl(email: string, token: string): string {
    return `${this.baseUrl}/api/newsletter/confirm?email=${encodeURIComponent(email)}&token=${token}`
  }
}

// Singleton instance
let templateService: EmailTemplateService | null = null

export function getEmailTemplateService(): EmailTemplateService {
  if (!templateService) {
    templateService = new EmailTemplateService()
  }
  return templateService
}