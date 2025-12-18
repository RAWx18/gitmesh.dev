'use client'

import { useEffect } from 'react'
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body className="min-h-screen bg-[#FFFFFF] flex items-center justify-center px-4">
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
              Critical Error
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              We encountered a critical error that prevented the application from loading properly. Please try refreshing the page.
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
              <button 
                onClick={reset}
                className="inline-flex items-center gap-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors font-bold px-6 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              
              <a 
                href="/"
                className="inline-flex items-center gap-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-bold px-6 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] no-underline"
              >
                <Home className="w-4 h-4" />
                Go Home
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-gray-600">
            <p className="text-sm">
              If this error persists, please{" "}
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
      </body>
    </html>
  )
}