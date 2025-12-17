/**
 * API error handling utilities and middleware
 */

import { NextRequest, NextResponse } from 'next/server'
import { AppError, createAPIError, logError, withRetry, RETRY_CONFIGS } from './error-handling'
import { ErrorCodes } from '@/types'

/**
 * Standard API response types
 */
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
    timestamp: string
  }
  meta?: {
    timestamp: string
    requestId?: string
    version?: string
  }
}

/**
 * API handler wrapper with comprehensive error handling
 */
export function createAPIHandler<T = any>(
  handler: (req: NextRequest) => Promise<T>,
  options: {
    requireAuth?: boolean
    retryConfig?: typeof RETRY_CONFIGS.api
    context?: string
  } = {}
) {
  return async (req: NextRequest): Promise<NextResponse<APIResponse<T>>> => {
    const requestId = generateRequestId()
    const startTime = Date.now()
    
    try {
      // Add request context for logging
      const context = {
        requestId,
        method: req.method,
        url: req.url,
        userAgent: req.headers.get('user-agent'),
        component: options.context || 'api-handler'
      }

      logError('API request started', undefined, context)

      // Execute handler with optional retry logic
      const result = options.retryConfig
        ? await withRetry(() => handler(req), options.retryConfig!, context)
        : await handler(req)

      const duration = Date.now() - startTime
      
      logError('API request completed', undefined, {
        ...context,
        duration,
        success: true
      })

      return NextResponse.json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId
        }
      })

    } catch (error) {
      const duration = Date.now() - startTime
      
      // Handle different error types
      if (error instanceof AppError) {
        logError('API request failed with AppError', error, {
          requestId,
          duration,
          statusCode: error.statusCode
        })

        return NextResponse.json(
          createAPIError(error.message, error.code, error.statusCode, {
            requestId,
            context: error.context
          }),
          { status: error.statusCode }
        )
      }

      // Handle validation errors
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        logError('API request failed with JSON parse error', error, { requestId, duration })
        
        return NextResponse.json(
          createAPIError(
            'Invalid JSON in request body',
            ErrorCodes.VALIDATION_ERROR,
            400,
            { requestId }
          ),
          { status: 400 }
        )
      }

      // Handle unknown errors
      const unknownError = error as Error
      logError('API request failed with unknown error', unknownError, {
        requestId,
        duration,
        stack: unknownError.stack
      })

      return NextResponse.json(
        createAPIError(
          process.env.NODE_ENV === 'development' 
            ? unknownError.message 
            : 'Internal server error',
          ErrorCodes.VALIDATION_ERROR,
          500,
          { 
            requestId,
            ...(process.env.NODE_ENV === 'development' && { stack: unknownError.stack })
          }
        ),
        { status: 500 }
      )
    }
  }
}

/**
 * Middleware for validating request methods
 */
export function validateMethod(allowedMethods: string[]) {
  return (req: NextRequest) => {
    if (!allowedMethods.includes(req.method || '')) {
      throw new AppError(
        `Method ${req.method} not allowed`,
        ErrorCodes.VALIDATION_ERROR,
        405,
        { allowedMethods }
      )
    }
  }
}

/**
 * Middleware for validating request body
 */
export async function validateRequestBody<T>(
  req: NextRequest,
  validator: (body: any) => T | Promise<T>
): Promise<T> {
  try {
    const body = await req.json()
    return await validator(body)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new AppError(
        'Invalid JSON in request body',
        ErrorCodes.VALIDATION_ERROR,
        400
      )
    }
    throw error
  }
}

/**
 * Rate limiting middleware (simple in-memory implementation)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(options: {
  windowMs: number
  maxRequests: number
  keyGenerator?: (req: NextRequest) => string
}) {
  return (req: NextRequest) => {
    const key = options.keyGenerator 
      ? options.keyGenerator(req)
      : req.ip || req.headers.get('x-forwarded-for') || 'anonymous'
    
    const now = Date.now()
    const windowStart = now - options.windowMs
    
    // Clean up old entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < windowStart) {
        rateLimitStore.delete(k)
      }
    }
    
    const current = rateLimitStore.get(key)
    
    if (!current) {
      rateLimitStore.set(key, { count: 1, resetTime: now + options.windowMs })
      return
    }
    
    if (current.resetTime < now) {
      rateLimitStore.set(key, { count: 1, resetTime: now + options.windowMs })
      return
    }
    
    if (current.count >= options.maxRequests) {
      throw new AppError(
        'Rate limit exceeded',
        ErrorCodes.VALIDATION_ERROR,
        429,
        { 
          limit: options.maxRequests,
          windowMs: options.windowMs,
          resetTime: current.resetTime
        }
      )
    }
    
    current.count++
  }
}

/**
 * Enhanced GitHub API error handling
 */
export function handleGitHubError(error: any): never {
  const status = error.status || error.response?.status
  const message = error.message || error.response?.data?.message || 'GitHub API error'
  
  let errorCode: ErrorCodes
  let statusCode: number
  let isRetryable = false

  switch (status) {
    case 401:
      errorCode = ErrorCodes.UNAUTHORIZED
      statusCode = 401
      break
    case 403:
      errorCode = ErrorCodes.FORBIDDEN
      statusCode = 403
      // Check if it's a rate limit error
      if (message.toLowerCase().includes('rate limit')) {
        isRetryable = true
      }
      break
    case 404:
      errorCode = ErrorCodes.NOT_FOUND
      statusCode = 404
      break
    case 422:
      errorCode = ErrorCodes.VALIDATION_ERROR
      statusCode = 422
      break
    default:
      errorCode = ErrorCodes.GITHUB_API_ERROR
      statusCode = status || 500
      isRetryable = status >= 500
  }

  throw new AppError(
    `GitHub API error: ${message}`,
    errorCode,
    statusCode,
    { 
      githubStatus: status,
      githubMessage: message,
      service: 'github'
    },
    isRetryable,
    error
  )
}

/**
 * Enhanced email service error handling
 */
export function handleEmailError(error: any): never {
  const status = error.statusCode || error.status
  const message = error.message || 'Email service error'
  
  let errorCode: ErrorCodes
  let statusCode: number
  let isRetryable = false

  // Handle SendGrid specific errors
  if (error.response?.body?.errors) {
    const sendGridError = error.response.body.errors[0]
    throw new AppError(
      `Email service error: ${sendGridError.message}`,
      ErrorCodes.EMAIL_SERVICE_ERROR,
      400,
      { 
        emailProvider: 'sendgrid',
        sendGridError: sendGridError
      }
    )
  }

  // Handle general email errors
  switch (status) {
    case 400:
      errorCode = ErrorCodes.VALIDATION_ERROR
      statusCode = 400
      break
    case 401:
      errorCode = ErrorCodes.UNAUTHORIZED
      statusCode = 401
      break
    case 429:
      errorCode = ErrorCodes.EMAIL_SERVICE_ERROR
      statusCode = 429
      isRetryable = true
      break
    default:
      errorCode = ErrorCodes.EMAIL_SERVICE_ERROR
      statusCode = status || 500
      isRetryable = status >= 500
  }

  throw new AppError(
    `Email service error: ${message}`,
    errorCode,
    statusCode,
    { 
      emailStatus: status,
      service: 'email'
    },
    isRetryable,
    error
  )
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Compose multiple middleware functions
 */
export function compose<T>(...middlewares: Array<(req: NextRequest) => void | Promise<void>>) {
  return async (req: NextRequest): Promise<void> => {
    for (const middleware of middlewares) {
      await middleware(req)
    }
  }
}

/**
 * Create a typed API route handler with validation
 */
export function createTypedAPIHandler<TBody = any, TResponse = any>(config: {
  methods: string[]
  handler: (req: NextRequest, body?: TBody) => Promise<TResponse>
  bodyValidator?: (body: any) => TBody | Promise<TBody>
  middleware?: Array<(req: NextRequest) => void | Promise<void>>
  retryConfig?: typeof RETRY_CONFIGS.api
  context?: string
}) {
  return createAPIHandler(async (req: NextRequest) => {
    // Validate method
    validateMethod(config.methods)(req)
    
    // Run middleware
    if (config.middleware) {
      await compose(...config.middleware)(req)
    }
    
    // Validate and parse body if needed
    let body: TBody | undefined
    if (config.bodyValidator && ['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
      body = await validateRequestBody(req, config.bodyValidator)
    }
    
    // Execute handler
    return await config.handler(req, body)
  }, {
    retryConfig: config.retryConfig,
    context: config.context
  })
}