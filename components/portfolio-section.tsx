import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function PortfolioSection() {
  // Empty projects array - no dummy data
  const projects: any[] = []

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Watch Our <br />
            <span className="bg-[#FFC224] text-black px-3 py-1 inline-block">Video Updates</span>
          </h2>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 mb-12">
            <div className="w-20 h-20 bg-gray-100 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
              Video Content Coming Soon
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
              We're creating amazing video content including demos, tutorials, and community spotlights. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-8 mb-12">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group grid md:grid-cols-2 bg-white border-[3px] border-black rounded-[32px] overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {/* Project content would go here when projects exist */}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <a href="/vlogs" className="bg-black text-white px-6 md:px-8 py-4 md:py-5 rounded-[12px] font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto text-sm md:text-base">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Watch all vlogs
          </a>
        </div>
      </div>
    </section>
  )
}
