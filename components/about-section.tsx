import { Github, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LFDTBadge } from "@/components/ui/lfdt-badge"
import Image from "next/image"

export function AboutSection() {
  const maintainers = [
    {
      name: "Ryan Madhuwala",
      role: "Lab Leader",
      github: "ryanmadhuwala",
      avatar: "/placeholder-user.jpg"
    },
    {
      name: "Ronit Raj",
      role: "Core Maintainer",
      github: "ronitraj",
      avatar: "/placeholder-user.jpg"
    },
    {
      name: "Parv Mittal",
      role: "Core Maintainer",
      github: "parvmittal",
      avatar: "/placeholder-user.jpg"
    }
  ]

  return (
    <section className="container mx-auto px-4 py-16 md:py-32">
      <div className="max-w-7xl mx-auto">


        {/* Maintainers Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Meet the <span className="bg-[#FF6B7A] text-white px-3 py-1 inline-block">Maintainers</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            The dedicated team behind GitMesh Community Edition, committed to building tools that make development workflows more intelligent and efficient.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {maintainers.map((maintainer, index) => (
            <div key={index} className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 border-4 border-black rounded-full overflow-hidden bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Image
                  src={maintainer.avatar}
                  alt={maintainer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{maintainer.name}</h3>
              <p className="text-gray-600 mb-3">{maintainer.role}</p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-2 border-black hover:bg-gray-50"
              >
                <a
                  href={`https://github.com/${maintainer.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
