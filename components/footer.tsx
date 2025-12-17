import { Youtube, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewsletterSignup } from "@/components/newsletter-signup"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16 relative">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="w-24 h-24 md:w-36 md:h-36 rounded-full flex items-center justify-center flex-shrink-0 relative">
                <Image
                  src="/images/newsletter-icon.png"
                  alt="Newsletter"
                  width={180}
                  height={180}
                  className="object-cover"
                />
              </div>

              <div className="w-full flex-1 bg-white border-4 border-black rounded-3xl py-4 px-4 md:py-6 md:px-8">
                <div className="text-center mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-black">Subscribe to GitMesh CE Newsletter</h3>
                  <p className="text-sm text-gray-600 mt-2">Get updates on new features, tutorials, and community news</p>
                </div>
                <NewsletterSignup variant="compact" className="max-w-md mx-auto" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/gitmesh.png"
                    alt="GitMesh X Logo"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="text-lg md:text-xl font-bold">GitMesh CE</span>
              </div>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                GitMesh Community Edition correlates market signals with engineering telemetry to auto-generate ranked backlogs, sprint plans, and work routing — fully synced across your dev stack.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.youtube.com/@GitMesh"
                  className="w-10 h-10 bg-[#FF6B7A] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Pages</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/documentation" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://github.com/LF-Decentralized-Trust-labs/gitmesh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Repository
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/xXvYkK3yEp" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Discord
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="https://zoom-lfx.platform.linuxfoundation.org/meeting/96608771523?password=211b9c60-b73a-4545-8913-75ef933f9365" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Weekly Dev Call
                  </a>
                </li>
                <li>
                  <a href="https://x.com/Gitmesh_oss" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Twitter / X
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/gitmesh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@GitMesh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contact us</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:support@gitmesh.dev" className="hover:text-white transition-colors">
                    support@gitmesh.dev
                  </a>
                </li> 
              </ul>
            </div>
          </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
            <p>
              GitMesh CE is governed by{" "}
              <a
                href="https://www.lfdecentralizedtrust.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white underline"
              >
                Linux Foundation Decentralized Trust
              </a>
              . This website is hosted by{" "}
              <a
                href="https://alveoli.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white underline"
              >
                Alveoli
              </a>{" "}
              for community welfare.
            </p>
            <div className="mt-4 sm:mt-0 flex gap-2">
              <Button 
                asChild 
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <a href="/admin/diagnostics">Rybbit</a>
              </Button>
              <Button 
                asChild 
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <a href="/admin">Super Admin</a>
              </Button>
            </div>
            </div>
        </div>
      </div>
    </footer>
  )
}
