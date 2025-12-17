export default function TechnicalDocsPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Technical Documentation</h1>
      
      <p className="lead">
        Comprehensive technical documentation for developers, DevOps engineers, and system administrators working with GitMesh CE.
      </p>

      <h2>Development</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">💻 Local Development</h3>
          <p className="text-gray-600 mb-4">Set up a local development environment for contributing to GitMesh CE or customizing your installation.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">🏗️ Architecture</h3>
          <p className="text-gray-600 mb-4">Understand GitMesh CE's system architecture, components, and design principles.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">📚 API Reference</h3>
          <p className="text-gray-600 mb-4">Complete API documentation for integrating with GitMesh CE programmatically.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">🔌 Integration Framework</h3>
          <p className="text-gray-600 mb-4">Build custom integrations and extend GitMesh CE's capabilities.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
      </div>

      <h2>Deployment</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">🏠 Self-Hosting</h3>
          <p className="text-gray-600 mb-4">Deploy and manage GitMesh CE on your own infrastructure with complete control and customization.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">🚀 Deployment</h3>
          <p className="text-gray-600 mb-4">Production deployment guides for various platforms and environments.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">📊 Observability</h3>
          <p className="text-gray-600 mb-4">Monitor, log, and troubleshoot your GitMesh CE deployment effectively.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
      </div>

      <h2>Quick Reference</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left">Topic</th>
              <th className="text-left">Audience</th>
              <th className="text-left">Complexity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Local Development</strong></td>
              <td>Developers</td>
              <td>Intermediate</td>
            </tr>
            <tr>
              <td><strong>Self-Hosting</strong></td>
              <td>DevOps/SysAdmin</td>
              <td>Advanced</td>
            </tr>
            <tr>
              <td><strong>API Reference</strong></td>
              <td>Developers</td>
              <td>Intermediate</td>
            </tr>
            <tr>
              <td><strong>Architecture</strong></td>
              <td>Technical Leaders</td>
              <td>Advanced</td>
            </tr>
            <tr>
              <td><strong>Deployment</strong></td>
              <td>DevOps/SysAdmin</td>
              <td>Advanced</td>
            </tr>
            <tr>
              <td><strong>Integration Framework</strong></td>
              <td>Developers</td>
              <td>Advanced</td>
            </tr>
            <tr>
              <td><strong>Observability</strong></td>
              <td>DevOps/SysAdmin</td>
              <td>Intermediate</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>System Requirements</h2>

      <h3>Minimum Requirements</h3>
      
      <ul>
        <li><strong>CPU:</strong> 2 cores</li>
        <li><strong>Memory:</strong> 4GB RAM</li>
        <li><strong>Storage:</strong> 20GB available space</li>
        <li><strong>Network:</strong> Stable internet connection for integrations</li>
      </ul>

      <h3>Recommended Requirements</h3>
      
      <ul>
        <li><strong>CPU:</strong> 4+ cores</li>
        <li><strong>Memory:</strong> 8GB+ RAM</li>
        <li><strong>Storage:</strong> 50GB+ SSD storage</li>
        <li><strong>Network:</strong> High-bandwidth connection for real-time data processing</li>
      </ul>

      <h3>Supported Platforms</h3>
      
      <ul>
        <li><strong>Operating Systems:</strong> Linux, macOS, Windows</li>
        <li><strong>Container Platforms:</strong> Docker, Kubernetes</li>
        <li><strong>Cloud Providers:</strong> AWS, GCP, Azure, DigitalOcean</li>
        <li><strong>Databases:</strong> PostgreSQL, MySQL, SQLite</li>
      </ul>

      <h2>Security Considerations</h2>

      <h3>Data Protection</h3>
      
      <ul>
        <li><strong>Encryption at Rest</strong> - All sensitive data encrypted in storage</li>
        <li><strong>Encryption in Transit</strong> - TLS/SSL for all network communications</li>
        <li><strong>Access Control</strong> - Role-based permissions and authentication</li>
        <li><strong>Audit Logging</strong> - Comprehensive activity logging and monitoring</li>
      </ul>

      <h3>Network Security</h3>
      
      <ul>
        <li><strong>Firewall Configuration</strong> - Secure network access controls</li>
        <li><strong>VPN Support</strong> - Integration with corporate VPN solutions</li>
        <li><strong>API Security</strong> - OAuth 2.0, API keys, and rate limiting</li>
        <li><strong>Webhook Security</strong> - Signed webhooks and payload verification</li>
      </ul>

      <h2>Compliance</h2>
      
      <p>GitMesh CE supports various compliance requirements:</p>

      <ul>
        <li><strong>GDPR</strong> - Data privacy and user rights management</li>
        <li><strong>SOC 2</strong> - Security and availability controls</li>
        <li><strong>HIPAA</strong> - Healthcare data protection (with proper configuration)</li>
        <li><strong>ISO 27001</strong> - Information security management</li>
      </ul>

      <h2>Contributing</h2>
      
      <p>GitMesh CE is open source and welcomes contributions:</p>

      <ul>
        <li><strong>Code Contributions</strong> - Bug fixes, features, and improvements</li>
        <li><strong>Documentation</strong> - Help improve and expand documentation</li>
        <li><strong>Testing</strong> - Report bugs and test new features</li>
        <li><strong>Community</strong> - Help other users and share knowledge</li>
      </ul>

      <p>
        See our Local Development guide to get started with contributing.
      </p>

      <h2>License</h2>
      
      <p>
        GitMesh CE is released under the Apache 2.0 License. See the{' '}
        <a href="https://github.com/LF-Decentralized-Trust-labs/gitmesh/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
          LICENSE
        </a>{' '}
        file for details.
      </p>
    </div>
  )
}