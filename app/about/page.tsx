import { Github, ExternalLink, Mail, Calendar, Users, Code, Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LFDTBadge } from "@/components/ui/lfdt-badge"
import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About GitMesh Community Edition",
  description: "Learn about GitMesh CE, its origins, maintainers, and how it correlates market signals with engineering telemetry to auto-generate ranked backlogs and sprint plans.",
  keywords: ["GitMesh", "Community Edition", "open source", "development workflow", "LFDT", "Linux Foundation"],
}

export default function AboutPage() {
  const maintainers = [
    {
      name: "Ryan Madhuwala",
      role: "Creator & Lab Leader",
      github: "ryanmadhuwala",
      avatar: "/placeholder-user.jpg",
      bio: "Creator of GitMesh, passionate about bridging the gap between market signals and engineering execution."
    },
    {
      name: "Ronit Raj",
      role: "Core Maintainer",
      github: "ronitraj",
      avatar: "/placeholder-user.jpg",
      bio: "Core maintainer focused on platform architecture and developer experience."
    },
    {
      name: "Parv Mittal",
      role: "Core Maintainer", 
      github: "parvmittal",
      avatar: "/placeholder-user.jpg",
      bio: "Core maintainer specializing in integrations and community engagement."
    }
  ]

  const projectLinks = [
    {
      title: "GitHub Repository",
      description: "Main GitMesh CE repository",
      url: "https://github.com/LF-Decentralized-Trust-labs/gitmesh",
      icon: Github
    },
    {
      title: "Weekly Dev Call",
      description: "Join our weekly development discussions",
      url: "https://zoom-lfx.platform.linuxfoundation.org/meeting/96608771523?password=211b9c60-b73a-4545-8913-75ef933f9365",
      icon: Calendar
    },
    {
      title: "Discord Community",
      description: "Chat with the community",
      url: "https://discord.gg/xXvYkK3yEp",
      icon: Users
    },
    {
      title: "Documentation",
      description: "Comprehensive guides and API docs",
      url: "/documentation",
      icon: Code,
      internal: true
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Button asChild variant="outline" className="border-2 border-black hover:bg-gray-50 rounded-lg">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="bg-[#2F81F7] text-white px-3 py-1 inline-block">GitMesh CE</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            GitMesh correlates market signals with engineering telemetry to auto-generate ranked backlogs, sprint plans, and work routing — fully synced across your dev stack.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-black text-white hover:bg-black/90 rounded-lg py-3 px-6">
              <Link href="/documentation">
                <Code className="w-5 h-5 mr-2" />
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-2 border-black hover:bg-gray-50 rounded-lg py-3 px-6">
              <a href="https://github.com/LF-Decentralized-Trust-labs/gitmesh" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg aspect-square border-[4px] border-black rounded-full overflow-hidden bg-[#FF6B6B] shadow-[-8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Image src="/images/about-me.svg" alt="GitMesh CE origin story" fill className="object-cover" />
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  The <span className="bg-[#FF6B7A] text-white px-3 py-1 inline-block">Origin Story</span>
                </h2>
                
                <div className="space-y-4 text-gray-600 text-base md:text-lg leading-relaxed">
                  <p>
                    GitMesh was born from the frustration of disconnected development workflows and the need to bridge the gap between market signals and engineering execution.
                  </p>
                  
                  <p>
                    What started as an internal tool to correlate customer feedback with development priorities has evolved into a comprehensive platform that auto-generates ranked backlogs and sprint plans.
                  </p>
                  
                  <p>
                    The journey began when our team realized that despite having access to rich market data and engineering telemetry, there was no intelligent system to connect these insights and automatically prioritize development work.
                  </p>
                  
                  <p>
                    Today, GitMesh CE serves as the open-source foundation for intelligent development workflow automation, enabling teams worldwide to make data-driven decisions about what to build next.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-5 h-5 bg-[#6366F1] border-2 border-black rounded-[5px] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Open Source First</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      GitMesh CE is developed in the open under <LFDTBadge variant="inline" className="mx-1" /> governance, ensuring transparency and community collaboration.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-5 h-5 bg-[#FF6B7A] border-2 border-black rounded-[5px] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Enterprise Edition Clarity</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      The GitMesh Enterprise Edition is built, hosted, and supported by Alveoli, providing additional features and professional support for organizations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-5 h-5 bg-[#10B981] border-2 border-black rounded-[5px] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Community Driven</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Built by developers, for developers. Every feature and improvement comes from real-world needs and community feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Our <span className="bg-[#2F81F7] text-white px-3 py-1 inline-block">Mission</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            To democratize intelligent development workflow automation by providing open-source tools that connect market insights with engineering execution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-white border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-12 h-12 bg-[#6366F1] border-2 border-black rounded-lg flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">What We Believe</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#6366F1] rounded-full mt-2 flex-shrink-0"></div>
                <span>Development decisions should be data-driven, not gut-driven</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#6366F1] rounded-full mt-2 flex-shrink-0"></div>
                <span>Market signals and engineering telemetry should work together</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#6366F1] rounded-full mt-2 flex-shrink-0"></div>
                <span>Open source enables innovation and community collaboration</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#6366F1] rounded-full mt-2 flex-shrink-0"></div>
                <span>Automation should enhance human decision-making, not replace it</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-12 h-12 bg-[#FF6B7A] border-2 border-black rounded-lg flex items-center justify-center mb-6">
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              A world where every development team has access to intelligent workflow automation that helps them build the right things at the right time, backed by data and community-driven innovation.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              We envision GitMesh CE as the foundation for a new generation of development tools that seamlessly integrate market intelligence with engineering execution.
            </p>
          </div>
        </div>
      </section>

      {/* Maintainers Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Meet the <span className="bg-[#FF6B7A] text-white px-3 py-1 inline-block">Maintainers</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The dedicated team behind GitMesh Community Edition, committed to building tools that make development workflows more intelligent and efficient.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {maintainers.map((maintainer, index) => (
              <div key={index} className="bg-white border-4 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                <div className="relative w-32 h-32 mx-auto mb-6 border-4 border-black rounded-full overflow-hidden bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Image 
                    src={maintainer.avatar} 
                    alt={maintainer.name}
                    fill 
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{maintainer.name}</h3>
                <p className="text-[#6366F1] font-semibold mb-3">{maintainer.role}</p>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{maintainer.bio}</p>
                <Button 
                  asChild
                  variant="outline" 
                  size="sm"
                  className="border-2 border-black hover:bg-gray-50 w-full"
                >
                  <a 
                    href={`https://github.com/${maintainer.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub Profile
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Links Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Get <span className="bg-[#10B981] text-white px-3 py-1 inline-block">Involved</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join our community and contribute to the future of intelligent development workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projectLinks.map((link, index) => {
              const IconComponent = link.icon
              const LinkComponent = link.internal ? Link : 'a'
              const linkProps = link.internal 
                ? { href: link.url }
                : { href: link.url, target: "_blank", rel: "noopener noreferrer" }

              return (
                <LinkComponent
                  key={index}
                  {...linkProps}
                  className="bg-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 block"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black border-2 border-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        {link.title}
                        {!link.internal && <ExternalLink className="w-4 h-4" />}
                      </h3>
                      <p className="text-gray-600">{link.description}</p>
                    </div>
                  </div>
                </LinkComponent>
              )
            })}
          </div>
        </div>
      </section>

      {/* Governance & Enterprise Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Governance & <span className="bg-[#2F81F7] text-white px-3 py-1 inline-block">Enterprise</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <LFDTBadge variant="inline" />
                Governance
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                GitMesh CE operates under the governance of the Linux Foundation Decentralized Trust, ensuring neutral and transparent project management.
              </p>
              <Button asChild variant="outline" className="border-2 border-black hover:bg-gray-50 w-full">
                <Link href="/documentation/governance">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Governance Details
                </Link>
              </Button>
            </div>

            <div className="bg-white border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-bold mb-4">Enterprise Edition</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The GitMesh Enterprise Edition is built, hosted, and supported by Alveoli, providing additional features and professional support for organizations.
              </p>
              <Button asChild variant="outline" className="border-2 border-black hover:bg-gray-50 w-full">
                <a href="mailto:support@gitmesh.dev">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact for Enterprise
                </a>
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border-4 border-blue-200 rounded-xl p-6 mt-8">
            <h4 className="text-lg font-semibold mb-2 text-blue-800">Important Notice</h4>
            <p className="text-blue-700">
              <LFDTBadge variant="inline" className="mr-1" /> governs the GitMesh CE GitHub repository. This website is hosted by Alveoli for community welfare and is not hosted or operated by LFDT.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get <span className="bg-[#FF6B7A] text-white px-3 py-1 inline-block">Started?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join thousands of developers who are already using GitMesh CE to build smarter development workflows.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-black text-white hover:bg-black/90 rounded-lg py-3 px-8 text-lg">
              <Link href="/documentation/getting-started">
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-2 border-black hover:bg-gray-50 rounded-lg py-3 px-8 text-lg">
              <a href="https://github.com/LF-Decentralized-Trust-labs/gitmesh" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 mr-2" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}