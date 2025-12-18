"use client"

import { useState, useEffect } from "react"
import { Mail, ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen])

  return (
    <div className="container mx-auto px-4 pt-8 pb-4">
      <nav className="bg-white border-4 border-black rounded-xl px-5 py-3 max-w-2xl mx-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between">
          <a href="/" className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity" aria-label="GitMesh CE Home">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </a>

          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <a href="/" className="text-[18px] font-bold leading-[20px] hover:opacity-70 transition-opacity">
              Home
            </a>
            <a href="/about" className="text-[18px] font-bold leading-[20px] hover:opacity-70 transition-opacity">
              About
            </a>
            <a href="/documentation" className="text-[18px] font-bold leading-[20px] hover:opacity-70 transition-opacity">
              Docs
            </a>

            <details className="relative">
              <summary className="flex items-center gap-1 text-[18px] font-bold leading-[20px] hover:opacity-70 transition-opacity cursor-pointer list-none">
                Links
                <ChevronDown className="w-4 h-4" />
              </summary>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 bg-white border-4 border-black rounded-xl p-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2 z-50">
                <a href="https://github.com/LF-Decentralized-Trust-labs/gitmesh" target="_blank" rel="noopener noreferrer" className="font-semibold text-sm hover:opacity-70">
                  Repository
                </a>
                <a href="https://zoom-lfx.platform.linuxfoundation.org/meeting/96608771523?password=211b9c60-b73a-4545-8913-75ef933f9365" target="_blank" rel="noopener noreferrer" className="font-semibold text-sm hover:opacity-70">
                  Weekly Dev Call
                </a>
                <a href="https://discord.gg/xXvYkK3yEp" target="_blank" rel="noopener noreferrer" className="font-semibold text-sm hover:opacity-70">
                  Discord
                </a>
                <a href="https://x.com/Gitmesh_oss" target="_blank" rel="noopener noreferrer" className="font-semibold text-sm hover:opacity-70">
                  Twitter / X
                </a>
                <a href="https://www.linkedin.com/company/gitmesh" target="_blank" rel="noopener noreferrer" className="font-semibold text-sm hover:opacity-70">
                  LinkedIn
                </a>
              </div>
            </details>
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="bg-black text-white hover:bg-black/90 rounded-sm px-5 h-12 min-w-[48px] flex-shrink-0"
              onClick={() => (window.location.href = 'mailto:support@gitmesh.dev')}
              title="support@gitmesh.dev"
              aria-label="Email support@gitmesh.dev"
            >
              <Mail className="w-10 h-10" strokeWidth={2.5} />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 h-12 w-12"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t-2 border-gray-200">
            <div className="flex flex-col gap-4">
              <a 
                href="/" 
                className="text-[18px] font-bold leading-[20px] hover:opacity-70 transition-opacity py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="/about" 
                className="text-[18px] font-bold leading-[20px] hover:opacity-70 transition-opacity py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="/documentation" 
                className="text-[18px] font-bold leading-[20px] hover:opacity-70 transition-opacity py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Docs
              </a>

              
              {/* Mobile Links Section */}
              <div className="py-2">
                <div className="text-[18px] font-bold leading-[20px] mb-3">Links</div>
                <div className="flex flex-col gap-2 pl-4">
                  <a 
                    href="https://github.com/LF-Decentralized-Trust-labs/gitmesh" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-semibold text-sm hover:opacity-70 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Repository
                  </a>
                  <a 
                    href="https://zoom-lfx.platform.linuxfoundation.org/meeting/96608771523?password=211b9c60-b73a-4545-8913-75ef933f9365" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-semibold text-sm hover:opacity-70 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Weekly Dev Call
                  </a>
                  <a 
                    href="https://discord.gg/xXvYkK3yEp" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-semibold text-sm hover:opacity-70 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Discord
                  </a>
                  <a 
                    href="https://x.com/Gitmesh_oss" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-semibold text-sm hover:opacity-70 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Twitter / X
                  </a>
                  <a 
                    href="https://www.linkedin.com/company/gitmesh" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-semibold text-sm hover:opacity-70 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
