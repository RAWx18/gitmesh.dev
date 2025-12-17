import { LFDTBadge } from '@/components/ui/lfdt-badge'

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">GitMesh Community Edition Documentation</h1>
      
      <p className="text-lg mb-8">
        Welcome to the GitMesh Community Edition documentation. This documentation has been migrated to our new documentation system.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">📚 New Documentation Available</h2>
        <p className="text-blue-700 mb-4">
          Our documentation has been migrated to a new system for better search, navigation, and user experience.
        </p>
        <a 
          href="/documentation" 
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Visit New Documentation →
        </a>
      </div>

      <h2 className="text-2xl font-semibold mb-4">What is GitMesh CE?</h2>
      <p className="mb-6">
        GitMesh correlates market signals with engineering telemetry to auto-generate ranked backlogs, sprint plans, and work routing — fully synced across your dev stack.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <a href="/documentation/getting-started/core-concepts" className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          <h3 className="font-semibold mb-2">🚀 Getting Started</h3>
          <p className="text-gray-600">Learn the basics and get up and running quickly</p>
        </a>
        <a href="/documentation/getting-started/integrations" className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          <h3 className="font-semibold mb-2">🔌 Integrations</h3>
          <p className="text-gray-600">Connect GitMesh CE with your existing tools</p>
        </a>
        <a href="/documentation/guides" className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          <h3 className="font-semibold mb-2">📖 Guides</h3>
          <p className="text-gray-600">Detailed guides for all features and capabilities</p>
        </a>
        <a href="/documentation/technical-docs" className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          <h3 className="font-semibold mb-2">⚙️ Technical Docs</h3>
          <p className="text-gray-600">API reference, deployment, and development guides</p>
        </a>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Community</h2>
      <p className="mb-6">
        GitMesh CE is an open-source project governed by the <LFDTBadge variant="inline" className="mx-1" />. This website is hosted by Alveoli for community welfare and is not hosted or operated by LFDT.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Enterprise Edition</h2>
      <p className="mb-6">
        The GitMesh Enterprise Edition is built, hosted, and supported by Alveoli. For enterprise features and support, please visit the Alveoli website.
      </p>
    </div>
  )
}