# Content Management System

This directory contains the file-based content management system for GitMesh Community Edition.

## Directory Structure

```
content/
├── blog/           # Blog posts in MDX format
├── pages/          # Static pages in MDX format
└── README.md       # This file
```

## Blog Posts

Blog posts are stored in `/content/blog/` with the following naming convention:
- Format: `YYYY-MM-DD-slug.mdx`
- Example: `2024-01-15-welcome-to-gitmesh-ce.mdx`

### Blog Post Frontmatter

```yaml
---
title: "Post Title"
excerpt: "Brief description of the post"
author: "Author Name"
publishedAt: "2024-01-15T10:00:00Z"
tags: ["tag1", "tag2"]
featured: true|false
newsletter: true|false
---
```

## Pages

Static pages are stored in `/content/pages/` with the following naming convention:
- Format: `slug.mdx`
- Example: `about.mdx`

### Page Frontmatter

```yaml
---
title: "Page Title"
description: "Optional page description"
---
```

## Content Management API

The content management system provides the following utilities:

### Content Parser (`lib/content-parser.ts`)
- `parseBlogPost()` - Parse and validate blog post MDX
- `parsePage()` - Parse and validate page MDX
- `generateSlug()` - Generate URL slug from filename
- `validateMDXContent()` - Validate MDX structure

### Content Manager (`lib/content-manager.ts`)
- `getAllBlogPosts()` - Get all blog posts
- `getBlogPost(slug)` - Get specific blog post
- `getAllPages()` - Get all pages
- `getPage(slug)` - Get specific page
- `createBlogPost()` - Create new blog post
- `updateBlogPost()` - Update existing blog post
- `deleteBlogPost()` - Delete blog post
- `createPage()` - Create new page
- `updatePage()` - Update existing page
- `deletePage()` - Delete page

### Content Metadata (`lib/content-metadata.ts`)
- `getContentStats()` - Get comprehensive content statistics
- `calculateReadingTime()` - Calculate estimated reading time
- `extractTags()` - Get all unique tags
- `extractAuthors()` - Get all unique authors
- `filterPostsByTag()` - Filter posts by tag
- `filterPostsByAuthor()` - Filter posts by author
- `getFeaturedPosts()` - Get featured posts
- `getNewsletterPosts()` - Get newsletter-enabled posts
- `searchContent()` - Search across all content
- `validateContentIntegrity()` - Validate content integrity

## Usage Examples

### Reading Content

```typescript
import { getAllBlogPosts, getBlogPost } from '@/lib/content-manager'

// Get all blog posts
const posts = await getAllBlogPosts()

// Get specific post
const post = await getBlogPost('welcome-to-gitmesh-ce')
```

### Creating Content

```typescript
import { createBlogPost } from '@/lib/content-manager'

await createBlogPost('my-new-post', {
  title: 'My New Post',
  excerpt: 'This is a new post',
  author: 'John Doe',
  publishedAt: '2024-01-15T10:00:00Z',
  tags: ['announcement'],
  featured: false,
  newsletter: true,
}, '# My New Post\n\nContent goes here...')
```

### Getting Statistics

```typescript
import { getContentStats } from '@/lib/content-metadata'

const stats = await getContentStats()
console.log(`Total posts: ${stats.totalPosts}`)
console.log(`Featured posts: ${stats.featuredPosts}`)
```

## Validation

All content is validated for:
- Required frontmatter fields
- Proper MDX structure
- Unique slugs
- Valid date formats
- Content integrity

Run validation with:
```typescript
import { validateContentIntegrity } from '@/lib/content-metadata'

const validation = await validateContentIntegrity()
if (!validation.isValid) {
  console.error('Content validation errors:', validation.errors)
}
```