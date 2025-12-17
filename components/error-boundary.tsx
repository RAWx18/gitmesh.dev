'use client'

import React, { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { logError } from '@/lib/error-handling'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  errorId: string | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showDetails?: boolean
  context?: string
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = this.state.errorId || `error-${Date.now()}`
    
    // Log the error
    logError('React Error Boundary caught error', error, {
      component: this.props.context || 'ErrorBoundary',
      errorId,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    })

    this.setState({
      errorInfo,
      errorId
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    })
  }

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state
    
    // Create error report
    const errorReport = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      context: this.props.context
    }

    // In a real app, you'd send this to your error reporting service
    console.log('Error Report:', errorReport)
    
    // Copy to clipboard for easy reporting
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => alert('Error report copied to clipboard'))
      .catch(() => console.log('Failed to copy error report'))
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, errorInfo, errorId } = this.state
      const isDevelopment = process.env.NODE_ENV === 'development'

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-red-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-red-800">Something went wrong</CardTitle>
              </div>
              <CardDescription>
                An unexpected error occurred in this component. 
                {errorId && (
                  <span className="block mt-1 font-mono text-xs">
                    Error ID: {errorId}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error message */}
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Details</AlertTitle>
                <AlertDescription className="font-mono text-sm">
                  {error?.message || 'Unknown error occurred'}
                </AlertDescription>
              </Alert>

              {/* Development details */}
              {isDevelopment && this.props.showDetails && (
                <details className="bg-gray-50 p-4 rounded-md">
                  <summary className="cursor-pointer font-medium text-sm">
                    Technical Details (Development Only)
                  </summary>
                  <div className="mt-2 space-y-2">
                    {error?.stack && (
                      <div>
                        <h4 className="font-medium text-sm">Stack Trace:</h4>
                        <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                    {errorInfo?.componentStack && (
                      <div>
                        <h4 className="font-medium text-sm">Component Stack:</h4>
                        <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={this.handleRetry} variant="default">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button asChild variant="outline">
                  <a href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </a>
                </Button>

                <Button onClick={this.handleReportError} variant="outline">
                  <Bug className="h-4 w-4 mr-2" />
                  Report Error
                </Button>
              </div>

              {/* Help text */}
              <p className="text-sm text-gray-600">
                If this problem persists, please contact support with the error ID above.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Specialized error boundary for admin interface
 */
export function AdminErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      context="AdminInterface"
      showDetails={true}
      onError={(error, errorInfo) => {
        // Additional admin-specific error handling
        logError('Admin interface error', error, {
          component: 'AdminErrorBoundary',
          componentStack: errorInfo.componentStack,
          isAdminError: true
        })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Lightweight error boundary for individual components
 */
export function ComponentErrorBoundary({ 
  children, 
  componentName,
  fallback 
}: { 
  children: ReactNode
  componentName: string
  fallback?: ReactNode
}) {
  const defaultFallback = (
    <Alert variant="destructive" className="m-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Component Error</AlertTitle>
      <AlertDescription>
        The {componentName} component encountered an error and could not be displayed.
      </AlertDescription>
    </Alert>
  )

  return (
    <ErrorBoundary
      context={componentName}
      fallback={fallback || defaultFallback}
      showDetails={false}
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Hook for handling async errors in components
 */
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, context?: Record<string, any>) => {
    logError('Component async error', error, {
      component: 'useErrorHandler',
      ...context
    })

    // In a real app, you might want to show a toast notification
    // or update some global error state
    console.error('Handled async error:', error)
  }, [])

  return handleError
}

/**
 * Higher-order component for wrapping components with error boundaries
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}