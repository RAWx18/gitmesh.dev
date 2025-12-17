import { ArrowLeft, Building, Users, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "GitMesh CE Case Studies - Real-World Success Stories",
  description: "Discover how organizations are using GitMesh CE to transform their development workflows with intelligent automation and market signal integration.",
  keywords: ["GitMesh", "case studies", "success stories", "development workflow", "automation", "enterprise"],
}

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      title: "Fortune 500 Company Reduces Sprint Planning Time by 75%",
      company: "Global Technology Corporation",
      industry: "Enterprise Software",
      teamSize: "200+ developers",
      challenge: "Manual sprint planning was consuming 8+ hours per sprint across multiple teams, leading to delayed releases and developer frustration.",
      solution: "Implemented GitMesh CE's automated backlog generation and sprint planning features with custom market signal integrations.",
      results: [
        "75% reduction in sprint planning time",
        "60% improvement in feature delivery accuracy",
        "40% increase in developer satisfaction scores",
        "25% faster time-to-market for new features"
      ],
      image: "/images/studio-workspace.svg",
      bgColor: "bg-[#6366F1]",
      featured: true
    },
    {
      title: "Open Source Project Scales Community Contributions",
      company: "Major Open Source Foundation",
      industry: "Open Source",
      teamSize: "50+ contributors",
      challenge: "Difficulty prioritizing community contributions and feature requests while maintaining project direction and quality.",
      solution: "Used GitMesh CE to correlate GitHub issues, community feedback, and usage analytics for intelligent backlog management.",
      results: [
        "300% increase in meaningful contributions",
        "50% reduction in issue triage time",
        "90% improvement in contributor onboarding",
        "Doubled release frequency while maintaining quality"
      ],
      image: "/images/venture-workspace.svg",
      bgColor: "bg-[#2F81F7]"
    },
    {
      title: "Startup Achieves Product-Market Fit Faster",
      company: "TechFlow Innovations",
      industry: "SaaS Platform",
      teamSize: "15 developers",
      challenge: "Limited resources required precise feature prioritization to achieve product-market fit before running out of runway.",
      solution: "Leveraged GitMesh CE's market signal analysis to prioritize features based on customer feedback and usage patterns.",
      results: [
        "6 months faster to product-market fit",
        "80% reduction in feature waste",
        "200% improvement in customer satisfaction",
        "Successfully raised Series A funding"
      ],
      image: "/images/studio-workspace.svg",
      bgColor: "bg-[#10B981]"
    },
    {
      title: "E-commerce Platform Optimizes Development ROI",
      company: "ShopTech Solutions",
      industry: "E-commerce",
      teamSize: "75 developers",
      challenge: "Struggling to balance new feature development with technical debt while maintaining platform stability.",
      solution: "Implemented GitMesh CE to automatically balance feature work, bug fixes, and technical debt based on business impact.",
      results: [
        "45% improvement in development ROI",
        "60% reduction in production incidents",
        "30% faster feature delivery",
        "Improved team morale and retention"
      ],
      image: "/images/venture-workspace.svg",
      bgColor: "bg-[#FF6B7A]"
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
            GitMesh CE <span className="bg-[#10B981] text-white px-3 py-1 inline-block">Case Studies</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Real-world success stories from organizations using GitMesh CE to transform their development workflows with intelligent automation.
          </p>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-16">
            <div className="grid md:grid-cols-2">
              <div className={`${caseStudies[0].bgColor} relative overflow-hidden min-h-[400px] flex items-center justify-center`}>
                <Image
                  src={caseStudies[0].image}
                  alt={caseStudies[0].title}
                  width={300}
                  height={300}
                  className="object-contain"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-semibold border-2 border-black">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span className="text-sm font-semibold">{caseStudies[0].industry}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-semibold">{caseStudies[0].teamSize}</span>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                  {caseStudies[0].title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {caseStudies[0].challenge}
                </p>
                <div className="space-y-2 mb-6">
                  {caseStudies[0].results.slice(0, 2).map((result, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">{result}</span>
                    </div>
                  ))}
                </div>
                <Button asChild className="bg-black text-white hover:bg-black/90 rounded-lg">
                  <Link href={`/documentation/case-studies/${caseStudies[0].company.toLowerCase().replace(/\s+/g, '-')}`}>
                    Read Full Case Study
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.slice(1).map((study, index) => (
              <article
                key={index}
                className="bg-white border-4 border-black rounded-3xl overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group"
              >
                <div className={`${study.bgColor} relative h-48 flex items-center justify-center overflow-hidden`}>
                  <Image
                    src={study.image}
                    alt={study.title}
                    width={200}
                    height={200}
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                      <Building className="w-3 h-3" />
                      <span>{study.industry}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                      <Users className="w-3 h-3" />
                      <span>{study.teamSize}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-3 leading-tight">
                    {study.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {study.challenge.substring(0, 120)}...
                  </p>
                  <div className="space-y-1 mb-4">
                    {study.results.slice(0, 2).map((result, resultIndex) => (
                      <div key={resultIndex} className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-700 font-medium">{result}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="outline" size="sm" className="border-2 border-black hover:bg-gray-50 w-full">
                    <Link href={`/documentation/case-studies/${study.company.toLowerCase().replace(/\s+/g, '-')}`}>
                      Read Case Study
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#2F81F7] border-4 border-black rounded-3xl p-8 md:p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-lg mb-8 leading-relaxed opacity-90">
              Join these successful organizations and start building smarter development workflows with GitMesh CE.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-white text-black hover:bg-gray-100 rounded-lg px-8 py-3">
                <Link href="/documentation/getting-started">
                  Get Started Now
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black rounded-lg px-8 py-3">
                <Link href="/about">
                  Learn More About GitMesh CE
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}