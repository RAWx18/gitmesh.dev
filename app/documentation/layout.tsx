import { ReactNode } from 'react'
import Link from 'next/link'
import DocumentationSearch from '@/components/documentation/search'

interface DocsLayoutProps {
  children: ReactNode
}

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/documentation' },
      { title: 'Core Concepts', href: '/documentation/getting-started/core-concepts' },
      { title: 'Getting Set Up', href: '/documentation/getting-started/getting-set-up' },
      { title: 'Integrations', href: '/documentation/getting-started/integrations' },
      { title: 'Use Cases', href: '/documentation/getting-started/use-cases' },
    ]
  },
  {
    title: 'Guides',
    items: [
      { title: 'Overview', href: '/documentation/guides' },
      { title: 'Backlog Management', href: '/documentation/guides/backlog-management' },
      { title: 'Sprint Planning', href: '/documentation/guides/sprint-planning' },
      { title: 'Work Routing', href: '/documentation/guides/work-routing' },
    ]
  },
  {
    title: 'Technical Docs',
    items: [
      { title: 'Overview', href: '/documentation/technical-docs' },
      { title: 'Self-Hosting', href: '/documentation/technical-docs/self-hosting' },
      { title: 'Local Development', href: '/documentation/technical-docs/local-development' },
      { title: 'API Reference', href: '/documentation/technical-docs/api-reference' },
    ]
  },
  {
    title: 'Governance',
    items: [
      { title: 'Project Governance', href: '/documentation/governance' },
    ]
  }
]

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700">
                GitMesh CE
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Documentation</span>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/LF-Decentralized-Trust-labs/gitmesh"
                className="text-gray-500 hover:text-gray-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 py-8 pr-8">
            <div className="mb-6">
              <DocumentationSearch />
            </div>
            <nav className="space-y-8">
              {navigation.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    {section.title}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block text-sm text-gray-600 hover:text-gray-900 py-1"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 py-8 pl-8 border-l border-gray-200">
            <div className="max-w-4xl">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              GitMesh Community Edition Documentation
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>
                LF Decentralized Trust governs the GitMesh CE GitHub repository. 
                This website is hosted by Alveoli for community welfare and is not hosted or operated by LFDT.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}