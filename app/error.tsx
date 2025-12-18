'use client'

import { useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Home, RefreshCw, AlertTriangle, Bug } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#FFFFFF] flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Visual */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-red-500 rounded-full mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
              <AlertTriangle className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Error Message */}
          <div className="bg-white border-4 border-black rounded-xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
            <h1 className="text-4xl font-bold mb-4 text-black">
              Something went wrong!
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              We encountered an unexpected error. Don't worry, our team has been notified and we're working to fix it.
            </p>
            
            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer font-medium text-gray-800 hover:text-black">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-4 bg-gray-100 border-2 border-gray-300 rounded-lg">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {error.message}
                  </pre>
                  {error.digest && (
                    <p className="mt-2 text-xs text-gray-500">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              </details>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={reset}
                className="bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors font-bold px-6 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button asChild variant="outline" className="border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-bold px-6 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Report Issue */}
          <div className="bg-gray-50 border-4 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold mb-4 text-black">
              Help us improve
            </h2>
            <p className="text-gray-700 mb-4">
              If this error persists, please report it to help us fix the issue.
            </p>
            <Button asChild variant="outline" className="border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-medium px-4 py-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
              <a 
                href="https://github.com/LF-Decentralized-Trust-labs/gitmesh/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Bug className="w-4 h-4" />
                Report Issue
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}