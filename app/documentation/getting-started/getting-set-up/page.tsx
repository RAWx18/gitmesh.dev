export default function GettingSetUpPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Getting Set Up</h1>
      
      <p className="lead">
        Set up your GitMesh CE workspace to start identifying opportunities and optimizing your development workflow.
      </p>

      <h2>Installation</h2>

      <h3>Prerequisites</h3>
      
      <p>Before installing GitMesh CE, ensure you have:</p>

      <ul>
        <li><strong>Node.js</strong> (version 18 or higher)</li>
        <li><strong>Docker</strong> (for containerized deployment)</li>
        <li><strong>Git</strong> access to your repositories</li>
        <li>Administrative access to your development tools</li>
      </ul>

      <h3>Quick Installation</h3>

      <pre><code>{`# Clone the repository
git clone https://github.com/LF-Decentralized-Trust-labs/gitmesh.git

# Navigate to the project directory
cd gitmesh

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start the development server
npm run dev`}</code></pre>

      <h3>Docker Installation</h3>

      <pre><code>{`# Pull the latest image
docker pull gitmesh/community-edition:latest

# Run with docker-compose
docker-compose up -d`}</code></pre>

      <h2>Initial Configuration</h2>
      
      <p>Once GitMesh CE is running, follow these steps to get started:</p>

      <h3>1. Connect Your Data Sources</h3>
      
      <p>
        The more data sources you connect, the better GitMesh CE can correlate signals and generate insights.
      </p>

      <p><strong>Recommended first integrations:</strong></p>
      <ul>
        <li><strong>GitHub</strong> - Rich source for engineering telemetry</li>
        <li><strong>Jira/Linear</strong> - Issue tracking and project management</li>
        <li><strong>Slack</strong> - Team communication and collaboration data</li>
      </ul>

      <h3>2. Configure Market Signals</h3>
      
      <p>Set up your market signal sources:</p>

      <ul>
        <li><strong>Customer Feedback</strong> - Connect support systems and feedback tools</li>
        <li><strong>Analytics</strong> - Integrate user behavior and product analytics</li>
        <li><strong>Business Metrics</strong> - Connect to your business intelligence tools</li>
      </ul>

      <h3>3. Set Up Team Configuration</h3>
      
      <p>Configure your team structure:</p>

      <ul>
        <li><strong>Team Members</strong> - Add team members and their skills</li>
        <li><strong>Roles and Permissions</strong> - Define access levels and responsibilities</li>
        <li><strong>Working Hours</strong> - Set team availability and time zones</li>
      </ul>

      <h3>4. Initial Data Processing</h3>
      
      <p>Allow GitMesh CE to process your initial data:</p>

      <ol>
        <li><strong>Data Ingestion</strong> - GitMesh CE will start pulling data from connected sources</li>
        <li><strong>Signal Processing</strong> - Market signals and engineering telemetry will be analyzed</li>
        <li><strong>Baseline Establishment</strong> - Initial baselines for velocity and capacity will be calculated</li>
      </ol>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
        <p className="text-yellow-800 mb-0">
          <strong>Note:</strong> Initial processing may take several hours depending on data volume.
        </p>
      </div>

      <h2>Verification</h2>

      <h3>Check Your Dashboard</h3>
      
      <p>Once setup is complete, verify everything is working:</p>

      <ol>
        <li><strong>Navigate to the Dashboard</strong> - Check that data is being ingested</li>
        <li><strong>Review Integrations</strong> - Ensure all connected services show as active</li>
        <li><strong>Examine Initial Insights</strong> - Look for preliminary backlog recommendations</li>
      </ol>

      <h3>Test Core Features</h3>

      <ol>
        <li><strong>Generate a Backlog</strong> - Create your first data-driven backlog</li>
        <li><strong>Plan a Sprint</strong> - Use automated sprint planning features</li>
        <li><strong>Review Work Routing</strong> - Check task assignments and recommendations</li>
      </ol>

      <h2>Next Steps</h2>
      
      <p>After successful setup:</p>

      <ol>
        <li><strong>Explore Integrations</strong> - Connect additional tools and data sources</li>
        <li><strong>Customize Workflows</strong> - Adapt GitMesh CE to your team's processes</li>
        <li><strong>Train Your Team</strong> - Ensure team members understand the new workflow</li>
        <li><strong>Monitor and Optimize</strong> - Continuously improve based on insights and feedback</li>
      </ol>

      <h2>Troubleshooting</h2>

      <h3>Common Issues</h3>

      <p><strong>Connection Problems</strong></p>
      <ul>
        <li>Verify API keys and permissions</li>
        <li>Check network connectivity and firewall settings</li>
        <li>Review integration-specific documentation</li>
      </ul>

      <p><strong>Data Processing Issues</strong></p>
      <ul>
        <li>Ensure sufficient system resources</li>
        <li>Check data source permissions</li>
        <li>Review error logs for specific issues</li>
      </ul>

      <p><strong>Performance Issues</strong></p>
      <ul>
        <li>Monitor system resource usage</li>
        <li>Consider scaling recommendations</li>
        <li>Review data retention policies</li>
      </ul>

      <h3>Getting Help</h3>

      <ul>
        <li><strong>Documentation</strong> - Check our comprehensive guides</li>
        <li><strong>Community</strong> - Join discussions on GitHub</li>
        <li><strong>Issues</strong> - Report bugs and feature requests on GitHub</li>
      </ul>
    </div>
  )
}