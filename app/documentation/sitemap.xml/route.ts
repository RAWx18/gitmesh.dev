import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gitmesh.dev'
  
  const routes = [
    '/documentation',
    '/documentation/getting-started/core-concepts',
    '/documentation/getting-started/getting-set-up',
    '/documentation/getting-started/integrations',
    '/documentation/getting-started/use-cases',
    '/documentation/guides',
    '/documentation/technical-docs',
    '/documentation/governance'
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}