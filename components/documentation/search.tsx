'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

interface SearchResult {
  title: string
  href: string
  excerpt: string
}

const searchData: SearchResult[] = [
  {
    title: 'Introduction',
    href: '/documentation',
    excerpt: 'Welcome to GitMesh CE documentation. Learn about market signal correlation and engineering telemetry.'
  },
  {
    title: 'Core Concepts',
    href: '/documentation/getting-started/core-concepts',
    excerpt: 'Understand market signals, engineering telemetry, ranked backlogs, and work routing.'
  },
  {
    title: 'Getting Set Up',
    href: '/documentation/getting-started/getting-set-up',
    excerpt: 'Installation guide, configuration, and initial setup for GitMesh CE.'
  },
  {
    title: 'Integrations',
    href: '/documentation/getting-started/integrations',
    excerpt: 'Connect GitHub, Jira, Slack, and other tools to GitMesh CE.'
  },
  {
    title: 'Guides',
    href: '/documentation/guides',
    excerpt: 'Comprehensive guides for backlog management, sprint planning, and work routing.'
  },
  {
    title: 'Technical Documentation',
    href: '/documentation/technical-docs',
    excerpt: 'API reference, deployment guides, and development documentation.'
  },
  {
    title: 'Governance',
    href: '/documentation/governance',
    excerpt: 'Project governance, LFDT oversight, and contribution guidelines.'
  }
]

export default function DocumentationSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(query.toLowerCase())
    )

    setResults(filtered)
    setIsOpen(true)
  }, [query])

  const handleResultClick = () => {
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <a
              key={index}
              href={result.href}
              onClick={handleResultClick}
              className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <h4 className="font-medium text-gray-900 mb-1">{result.title}</h4>
              <p className="text-sm text-gray-600">{result.excerpt}</p>
            </a>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <p className="text-gray-600">No results found for "{query}"</p>
        </div>
      )}
    </div>
  )
}