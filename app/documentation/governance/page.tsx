import { LFDTBadge } from '@/components/ui/lfdt-badge'

export default function GovernancePage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>GitMesh Community Governance</h1>
      
      <p className="lead">
        GitMesh Community Edition is governed by the <LFDTBadge variant="inline" className="mx-1" /> and operates as an open-source project with transparent governance processes.
      </p>

      <h2>Project Overview</h2>
      
      <p><strong>Project Name:</strong> GitMesh Community Edition<br />
      <strong>Governing Body:</strong> <LFDTBadge variant="inline" className="mx-1" /><br />
      <strong>License:</strong> Apache 2.0<br />
      <strong>Repository:</strong> <a href="https://github.com/LF-Decentralized-Trust-labs/gitmesh" target="_blank" rel="noopener noreferrer">https://github.com/LF-Decentralized-Trust-labs/gitmesh</a></p>

      <h2>Governance Structure</h2>

      <h3>Technical Steering Committee (TSC)</h3>
      
      <p>The Technical Steering Committee provides technical leadership and oversight for the project.</p>

      <p><strong>Current TSC Members:</strong></p>
      <ul>
        <li><strong>Ryan Madhuwala</strong> (Creator and Lead Maintainer)</li>
        <li><strong>Ronit Raj</strong> (Core Maintainer)</li>
        <li><strong>Parv Mittal</strong> (Core Maintainer)</li>
      </ul>

      <h3>Maintainers</h3>
      
      <p>Maintainers are responsible for the day-to-day management of the project, including:</p>
      <ul>
        <li>Code review and merging</li>
        <li>Release management</li>
        <li>Issue triage and resolution</li>
        <li>Community engagement</li>
      </ul>

      <h3>Contributors</h3>
      
      <p>All community members who contribute to the project through:</p>
      <ul>
        <li>Code contributions</li>
        <li>Documentation improvements</li>
        <li>Bug reports and feature requests</li>
        <li>Community support and engagement</li>
      </ul>

      <h2>Decision Making Process</h2>

      <h3>Consensus Building</h3>
      
      <p>The project operates on a consensus-based decision-making model:</p>

      <ol>
        <li><strong>Proposal</strong> - Ideas are proposed through GitHub issues or discussions</li>
        <li><strong>Discussion</strong> - Community members provide feedback and suggestions</li>
        <li><strong>Refinement</strong> - Proposals are refined based on community input</li>
        <li><strong>Consensus</strong> - Agreement is reached through discussion and compromise</li>
        <li><strong>Implementation</strong> - Approved changes are implemented and merged</li>
      </ol>

      <h3>Voting</h3>
      
      <p>For significant decisions that cannot reach consensus:</p>
      <ul>
        <li>TSC members have voting rights</li>
        <li>Simple majority required for most decisions</li>
        <li>Supermajority (2/3) required for governance changes</li>
      </ul>

      <h2>Contribution Guidelines</h2>

      <h3>Code of Conduct</h3>
      
      <p>All participants must adhere to the project's Code of Conduct, which promotes:</p>
      <ul>
        <li>Respectful and inclusive communication</li>
        <li>Constructive feedback and collaboration</li>
        <li>Professional behavior in all interactions</li>
        <li>Zero tolerance for harassment or discrimination</li>
      </ul>

      <h3>Contribution Process</h3>

      <ol>
        <li><strong>Fork and Clone</strong> - Fork the repository and create a local copy</li>
        <li><strong>Create Branch</strong> - Create a feature branch for your changes</li>
        <li><strong>Develop</strong> - Make your changes following coding standards</li>
        <li><strong>Test</strong> - Ensure all tests pass and add new tests as needed</li>
        <li><strong>Submit PR</strong> - Create a pull request with clear description</li>
        <li><strong>Review</strong> - Participate in the code review process</li>
        <li><strong>Merge</strong> - Changes are merged after approval</li>
      </ol>

      <h3>Becoming a Maintainer</h3>
      
      <p>Contributors can become maintainers by:</p>
      <ul>
        <li>Demonstrating consistent, high-quality contributions</li>
        <li>Showing deep understanding of the project</li>
        <li>Exhibiting good judgment in technical decisions</li>
        <li>Being nominated by existing maintainers</li>
        <li>Receiving approval from the TSC</li>
      </ul>

      <h2>Relationship with LFDT</h2>

      <h3>Governance Oversight</h3>
      
      <p>LFDT provides:</p>
      <ul>
        <li>Legal and administrative support</li>
        <li>Neutral governance framework</li>
        <li>Intellectual property management</li>
        <li>Community infrastructure</li>
      </ul>

      <h3>Independence</h3>
      
      <p>While governed by LFDT, the project maintains:</p>
      <ul>
        <li>Technical independence and decision-making authority</li>
        <li>Community-driven development process</li>
        <li>Open and transparent operations</li>
      </ul>

      <h2>Enterprise Edition Relationship</h2>

      <h3>Clear Separation</h3>
      
      <ul>
        <li><strong>GitMesh CE</strong> - Open-source community edition governed by LFDT</li>
        <li><strong>GitMesh Enterprise</strong> - Commercial product built, hosted, and supported by Alveoli</li>
        <li><strong>This Website</strong> - Hosted by Alveoli for community welfare, not operated by LFDT</li>
      </ul>

      <h3>Collaboration</h3>
      
      <ul>
        <li>Alveoli contributes to the open-source project</li>
        <li>Enterprise features may be contributed back to the community</li>
        <li>Clear boundaries maintained between commercial and open-source offerings</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
        <h3 className="text-lg font-semibold mb-2 text-blue-800 mt-0">Important Notice</h3>
        <p className="text-blue-700 mb-0">
          LF Decentralized Trust governs the GitMesh CE GitHub repository. This website is hosted by Alveoli for community welfare and is not hosted or operated by LFDT.
        </p>
      </div>

      <h2>Contact Information</h2>

      <h3>Project Leadership</h3>
      
      <ul>
        <li><strong>Technical Questions</strong> - Create GitHub issues or discussions</li>
        <li><strong>Governance Questions</strong> - Contact TSC members directly</li>
        <li><strong>Legal/Administrative</strong> - Contact LFDT through official channels</li>
      </ul>

      <h3>LFDT Contact</h3>
      
      <p>For LFDT-related matters:</p>
      <ul>
        <li><strong>Website</strong> - <a href="https://www.lfdecentralizedtrust.org/" target="_blank" rel="noopener noreferrer">https://www.lfdecentralizedtrust.org/</a></li>
        <li><strong>Email</strong> - info@lfdecentralizedtrust.org</li>
      </ul>

      <hr />

      <p className="text-sm text-gray-600">
        <em>This governance document is maintained by the GitMesh CE Technical Steering Committee and is subject to periodic review and updates.</em>
      </p>
    </div>
  )
}