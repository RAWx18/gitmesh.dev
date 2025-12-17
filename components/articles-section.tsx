import { Pencil, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function ArticlesSection() {
  // Empty articles array - no dummy data
  const articles: any[] = []

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Blog</h2>
          <Button
            asChild
            variant="outline"
            className="border-[3px] border-black rounded-xl px-4 md:px-6 py-4 md:py-6 hover:bg-gray-50 bg-white font-semibold text-sm md:text-base w-full sm:w-auto"
          >
            <a href="/blog">
              <Pencil className="w-4 h-4 mr-2" />
              View all posts
            </a>
          </Button>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
              Blog Posts Coming Soon
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
              We're working on creating valuable content about GitMesh CE, development workflows, and community insights. Stay tuned!
            </p>
            <Button asChild className="bg-black text-white hover:bg-black/90 rounded-lg px-6 py-3">
              <a href="#newsletter">
                Subscribe for Updates
              </a>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-6 mb-16">
            {/* Articles content would go here when articles exist */}
          </div>
        )}
      </div>
    </section>
  )
}
