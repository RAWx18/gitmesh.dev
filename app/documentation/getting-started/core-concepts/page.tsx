export default function CoreConceptsPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Core Concepts</h1>
      
      <p className="lead">
        Get to know the core concepts of GitMesh CE and how it transforms your development workflow.
      </p>

      <h2>Market Signals</h2>
      
      <p>
        GitMesh CE automatically correlates market signals with your engineering telemetry. Market signals include:
      </p>

      <ul>
        <li>Customer feedback and feature requests</li>
        <li>Support ticket trends and patterns</li>
        <li>User behavior analytics</li>
        <li>Competitive intelligence</li>
        <li>Business metrics and KPIs</li>
      </ul>

      <p>
        These signals are processed and weighted to influence backlog prioritization and sprint planning.
      </p>

      <h2>Engineering Telemetry</h2>
      
      <p>
        Engineering telemetry represents the technical data from your development stack:
      </p>

      <ul>
        <li>Code commit patterns and velocity</li>
        <li>Pull request metrics and review times</li>
        <li>Build and deployment success rates</li>
        <li>Test coverage and quality metrics</li>
        <li>Performance and reliability data</li>
      </ul>

      <p>
        GitMesh CE analyzes this telemetry to understand development capacity and technical constraints.
      </p>

      <h2>Ranked Backlogs</h2>
      
      <p>GitMesh CE automatically generates ranked backlogs by:</p>

      <ol>
        <li><strong>Signal Analysis</strong> - Processing market signals and engineering telemetry</li>
        <li><strong>Priority Scoring</strong> - Calculating priority scores based on business impact and technical feasibility</li>
        <li><strong>Dependency Mapping</strong> - Understanding technical dependencies and blockers</li>
        <li><strong>Resource Allocation</strong> - Considering team capacity and expertise</li>
      </ol>

      <p>
        The result is a data-driven backlog that balances business value with technical reality.
      </p>

      <h2>Sprint Plans</h2>
      
      <p>Automated sprint planning takes into account:</p>

      <ul>
        <li><strong>Team Velocity</strong> - Historical and current team performance metrics</li>
        <li><strong>Story Complexity</strong> - Technical complexity analysis and estimation</li>
        <li><strong>Dependencies</strong> - Cross-team and technical dependencies</li>
        <li><strong>Risk Assessment</strong> - Identification of potential blockers and risks</li>
      </ul>

      <p>Sprint plans are continuously updated as new data becomes available.</p>

      <h2>Work Routing</h2>
      
      <p>Intelligent work routing ensures the right work gets to the right people:</p>

      <ul>
        <li><strong>Skill Matching</strong> - Matching tasks to team member expertise</li>
        <li><strong>Workload Balancing</strong> - Distributing work based on current capacity</li>
        <li><strong>Context Switching</strong> - Minimizing context switches for better productivity</li>
        <li><strong>Learning Opportunities</strong> - Identifying growth opportunities for team members</li>
      </ul>

      <h2>Full Stack Synchronization</h2>
      
      <p>GitMesh CE keeps everything synchronized across your development stack:</p>

      <ul>
        <li><strong>Issue Tracking</strong> - Sync with Jira, GitHub Issues, Linear, etc.</li>
        <li><strong>Code Repositories</strong> - Integration with GitHub, GitLab, Bitbucket</li>
        <li><strong>CI/CD Pipelines</strong> - Connect with Jenkins, GitHub Actions, CircleCI</li>
        <li><strong>Communication Tools</strong> - Slack, Microsoft Teams integration</li>
        <li><strong>Project Management</strong> - Sync with Asana, Monday.com, Notion</li>
      </ul>

      <p>
        This ensures all stakeholders have a unified view of progress and priorities.
      </p>
    </div>
  )
}