import Link from 'next/link'
import { LFDTBadge } from '@/components/ui/lfdt-badge'

export default function DocumentationPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>GitMesh Community Edition Documentation</h1>
      
      <p className="lead">
        Welcome to the GitMesh Community Edition documentation. This documentation will help you get started with GitMesh CE and understand its features and capabilities.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800 mt-0">🎉 New Documentation System</h2>
        <p className="text-blue-700 mb-4">
          Our documentation has been migrated from GitBook to this new system for better search, navigation, and user experience.
        </p>
      </div>

      <h2>What is GitMesh CE?</h2>
      
      <p>
        GitMesh correlates market signals with engineering telemetry to auto-generate ranked backlogs, sprint plans, and work routing — fully synced across your dev stack.
      </p>

      <p>
        GitMesh CE is an open-source project governed by the <LFDTBadge variant="inline" className="mx-1" />. This website is hosted by Alveoli for community welfare and is not hosted or operated by LFDT.
      </p>

      <h2>Key Features</h2>

      <ul>
        <li><strong>Market Signal Correlation</strong>: Automatically correlate market signals with engineering telemetry</li>
        <li><strong>Automated Backlog Generation</strong>: Generate ranked backlogs based on data-driven insights</li>
        <li><strong>Sprint Planning</strong>: Auto-generate sprint plans aligned with business priorities</li>
        <li><strong>Work Routing</strong>: Intelligent work routing across your development stack</li>
        <li><strong>Full Stack Sync</strong>: Keep everything synchronized across your entire dev stack</li>
      </ul>

      <h2>Getting Started</h2>

      <p>
        To get started with GitMesh CE, check out our <Link href="/documentation/getting-started/core-concepts">Getting Started</Link> guide.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
        <Link href="/documentation/getting-started/core-concepts" className="block p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          <h3 className="font-semibold mb-2 text-lg">🚀 Core Concepts</h3>
          <p className="text-gray-600">Understand the fundamental concepts behind GitMesh CE</p>
        </Link>
        
        <Link href="/documentation/getting-started/integrations" className="block p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          <h3 className="font-semibold mb-2 text-lg">🔌 Integrations</h3>
          <p className="text-gray-600">Connect GitMesh CE with your existing tools</p>
        </Link>
        
        <Link href="/documentation/guides" className="block p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          <h3 className="font-semibold mb-2 text-lg">📖 Guides</h3>
          <p className="text-gray-600">Detailed guides for all features and capabilities</p>
        </Link>
        
        <Link href="/documentation/technical-docs" className="block p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          <h3 className="font-semibold mb-2 text-lg">⚙️ Technical Docs</h3>
          <p className="text-gray-600">API reference, deployment, and development guides</p>
        </Link>
      </div>

      <h2>Community</h2>
      
      <p>GitMesh CE is maintained by:</p>
      <ul>
        <li><strong>Ryan Madhuwala</strong> (Creator)</li>
        <li><strong>Ronit Raj</strong></li>
        <li><strong>Parv Mittal</strong></li>
      </ul>

      <h2>Enterprise Edition</h2>
      
      <p>
        The GitMesh Enterprise Edition is built, hosted, and supported by Alveoli. For enterprise features and support, please visit the Alveoli website.
      </p>

      <h2>Contributing</h2>
      
      <p>
        GitMesh CE is open source and welcomes contributions. Visit our{' '}
        <a href="https://github.com/LF-Decentralized-Trust-labs/gitmesh" target="_blank" rel="noopener noreferrer">
          GitHub repository
        </a>{' '}
        to get involved.
      </p>
    </div>
  )
}