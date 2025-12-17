import fs from 'fs'
import path from 'path'
import { Contributor, NewsletterSubscriber, SiteConfig } from '@/types'

const dataDirectory = path.join(process.cwd(), 'data')

export function getContributors(): Contributor[] {
  try {
    const filePath = path.join(dataDirectory, 'contributors.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    return []
  }
}

export function saveContributors(contributors: Contributor[]): void {
  const filePath = path.join(dataDirectory, 'contributors.json')
  fs.writeFileSync(filePath, JSON.stringify(contributors, null, 2))
}

export function getNewsletterSubscribers(): NewsletterSubscriber[] {
  try {
    const filePath = path.join(dataDirectory, 'newsletter-subscribers.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    return []
  }
}

export function saveNewsletterSubscribers(subscribers: NewsletterSubscriber[]): void {
  const filePath = path.join(dataDirectory, 'newsletter-subscribers.json')
  fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2))
}

export function getSiteConfig(): SiteConfig {
  try {
    const filePath = path.join(dataDirectory, 'admin-config.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    return {
      maintenance: false,
      featuredPosts: [],
      announcementBanner: undefined,
    }
  }
}

export function saveSiteConfig(config: SiteConfig): void {
  const filePath = path.join(dataDirectory, 'admin-config.json')
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2))
}