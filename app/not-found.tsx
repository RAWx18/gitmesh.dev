'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Home, ArrowLeft, Search, FileText } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FFFFFF] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Visual */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-black rounded-full mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
              <span className="text-white text-4xl font-bold">404</span>
            </div>
          </div>

          {/* Error Message */}
          <div className="bg-white border-4 border-black rounded-xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
            <h1 className="text-4xl font-bold mb-4 text-black">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild className="bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors font-bold px-6 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
              
              <Button 
                onClick={() => window.history.back()} 
                variant="outline" 
                className="border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-bold px-6 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="bg-gray-50 border-4 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold mb-4 text-black">
              Looking for something specific?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link 
                href="/documentation" 
                className="flex items-center gap-2 p-3 bg-white border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
              >
                <FileText className="w-4 h-4" />
                Documentation
              </Link>
              
              <Link 
                href="/about" 
                className="flex items-center gap-2 p-3 bg-white border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
              >
                <Search className="w-4 h-4" />
                About Us
              </Link>
              
              <Link 
                href="/blog" 
                className="flex items-center gap-2 p-3 bg-white border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
              >
                <FileText className="w-4 h-4" />
                Blog
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-gray-600">
            <p className="text-sm">
              If you believe this is an error, please{" "}
              <a 
                href="https://github.com/LF-Decentralized-Trust-labs/gitmesh/issues" 
                className="text-black font-medium hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                report it on GitHub
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}