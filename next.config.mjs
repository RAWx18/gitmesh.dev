/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
 
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  
  // Configure redirects for old documentation URLs
  async redirects() {
    return [
      // Redirect old GitBook URLs to new documentation system
      {
        source: '/docs/getting-started/:path*',
        destination: '/documentation/getting-started/:path*',
        permanent: true,
      },
      {
        source: '/docs/guides/:path*', 
        destination: '/documentation/guides/:path*',
        permanent: true,
      },
      {
        source: '/docs/technical-docs/:path*',
        destination: '/documentation/technical-docs/:path*', 
        permanent: true,
      },
      // Redirect old docs root to new documentation
      {
        source: '/docs',
        destination: '/documentation',
        permanent: true,
      },
      // Handle common GitBook patterns
      {
        source: '/getting-started/:path*',
        destination: '/documentation/getting-started/:path*',
        permanent: true,
      },
      {
        source: '/guides/:path*',
        destination: '/documentation/guides/:path*',
        permanent: true,
      },
      {
        source: '/technical-docs/:path*',
        destination: '/documentation/technical-docs/:path*',
        permanent: true,
      }
    ]
  }
}

export default nextConfig
