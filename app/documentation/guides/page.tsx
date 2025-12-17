import Link from 'next/link'

export default function GuidesPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Guides</h1>
      
      <p className="lead">
        Comprehensive guides to help you get the most out of GitMesh CE's features and capabilities.
      </p>

      <h2>Core Features</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">📋 Backlog Management</h3>
          <p className="text-gray-600 mb-4">Learn how to create, manage, and optimize data-driven backlogs that align engineering work with business priorities.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">🎯 Sprint Planning</h3>
          <p className="text-gray-600 mb-4">Master automated sprint planning that considers team velocity, task complexity, and business priorities.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">🔄 Work Routing</h3>
          <p className="text-gray-600 mb-4">Understand how GitMesh CE intelligently routes work to the right team members based on skills, capacity, and context.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">👥 Team Management</h3>
          <p className="text-gray-600 mb-4">Organize teams, define roles, and configure permissions to optimize collaboration and productivity.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
      </div>

      <h2>Data Sources</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">📊 Market Signals</h3>
          <p className="text-gray-600 mb-4">Configure and optimize market signal sources to ensure your development priorities align with business needs.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">🔧 Engineering Telemetry</h3>
          <p className="text-gray-600 mb-4">Set up comprehensive engineering telemetry to track team performance, code quality, and delivery metrics.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">📈 Reporting & Analytics</h3>
          <p className="text-gray-600 mb-4">Create custom reports and dashboards to track progress, identify trends, and make data-driven decisions.</p>
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
      </div>

      <h2>Quick Navigation</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left">Feature</th>
              <th className="text-left">Description</th>
              <th className="text-left">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Backlog Management</strong></td>
              <td>Automated backlog prioritization</td>
              <td>Beginner</td>
            </tr>
            <tr>
              <td><strong>Sprint Planning</strong></td>
              <td>Data-driven sprint planning</td>
              <td>Intermediate</td>
            </tr>
            <tr>
              <td><strong>Work Routing</strong></td>
              <td>Intelligent task assignment</td>
              <td>Intermediate</td>
            </tr>
            <tr>
              <td><strong>Market Signals</strong></td>
              <td>Business signal integration</td>
              <td>Advanced</td>
            </tr>
            <tr>
              <td><strong>Engineering Telemetry</strong></td>
              <td>Technical metrics tracking</td>
              <td>Advanced</td>
            </tr>
            <tr>
              <td><strong>Team Management</strong></td>
              <td>Team organization and permissions</td>
              <td>Beginner</td>
            </tr>
            <tr>
              <td><strong>Reporting</strong></td>
              <td>Custom analytics and insights</td>
              <td>Intermediate</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Getting Help</h2>
      
      <ul>
        <li><strong>Step-by-step tutorials</strong> - Follow detailed walkthroughs for each feature</li>
        <li><strong>Best practices</strong> - Learn from successful implementations</li>
        <li><strong>Troubleshooting</strong> - Solve common issues and challenges</li>
        <li><strong>Community examples</strong> - See how other teams use GitMesh CE</li>
      </ul>

      <h2>Prerequisites</h2>
      
      <p>Before diving into the guides, ensure you have:</p>

      <ul>
        <li>GitMesh CE installed and configured</li>
        <li>Basic integrations set up (GitHub, project management tool)</li>
        <li>Team members added to the system</li>
        <li>Initial data processing completed</li>
      </ul>

      <p>
        Ready to explore? Start with <Link href="/documentation/getting-started/core-concepts">Core Concepts</Link> for the foundational understanding.
      </p>
    </div>
  )
}