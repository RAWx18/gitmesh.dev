import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost } from '@/types'

const contentDirectory = path.join(process.cwd(), 'content')
const blogDirectory = path.join(contentDirectory, 'blog')
const pagesDirectory = path.join(contentDirectory, 'pages')

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(blogDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(blogDirectory)
  const posts = fileNames
    .filter(name => name.endsWith('.mdx'))
    .map(name => {
      const fullPath = path.join(blogDirectory, name)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      const slug = name.replace(/\.mdx$/, '')
      
      return {
        slug,
        title: data.title || '',
        excerpt: data.excerpt || '',
        content,
        author: data.author || '',
        publishedAt: new Date(data.publishedAt || Date.now()),
        tags: data.tags || [],
        featured: data.featured || false,
        newsletter: data.newsletter || false,
      } as BlogPost
    })
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

  return posts
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      content,
      author: data.author || '',
      publishedAt: new Date(data.publishedAt || Date.now()),
      tags: data.tags || [],
      featured: data.featured || false,
      newsletter: data.newsletter || false,
    } as BlogPost
  } catch (error) {
    return null
  }
}

export function getPageContent(slug: string): { title: string; content: string } | null {
  try {
    const fullPath = path.join(pagesDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      title: data.title || '',
      content,
    }
  } catch (error) {
    return null
  }
}