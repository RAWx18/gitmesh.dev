/**
 * Tests for error handling utilities
 */

import { AppError, createAPIError } from '../error-handling'
import { ErrorCodes } from '@/types'

describe('Error Handling', () => {
  describe('AppError', () => {
    it('should create an AppError with all properties', () => {
      const error = new AppError(
        'Test error',
        ErrorCodes.VALIDATION_ERROR,
        400,
        { component: 'test' },
        true
      )

      expect(error.message).toBe('Test error')
      expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR)
      expect(error.statusCode).toBe(400)
      expect(error.context.component).toBe('test')
      expect(error.isRetryable).toBe(true)
      expect(error.context.timestamp).toBeInstanceOf(Date)
    })

    it('should serialize to JSON correctly', () => {
      const error = new AppError(
        'Test error',
        ErrorCodes.VALIDATION_ERROR,
        400,
        { component: 'test' }
      )

      const json = error.toJSON()
      expect(json.name).toBe('AppError')
      expect(json.message).toBe('Test error')
      expect(json.code).toBe(ErrorCodes.VALIDATION_ERROR)
      expect(json.statusCode).toBe(400)
    })
  })

  describe('createAPIError', () => {
    it('should create standardized API error response', () => {
      const error = createAPIError(
        'Test error',
        ErrorCodes.VALIDATION_ERROR,
        400,
        { field: 'email' }
      )

      expect(error.success).toBe(false)
      expect(error.error.code).toBe(ErrorCodes.VALIDATION_ERROR)
      expect(error.error.message).toBe('Test error')
      expect(error.error.details).toEqual({ field: 'email' })
      expect(error.error.timestamp).toBeDefined()
    })
  })

  describe('Error Classification', () => {
    it('should create different error types correctly', () => {
      const validationError = new AppError(
        'Invalid input',
        ErrorCodes.VALIDATION_ERROR,
        400
      )
      
      const githubError = new AppError(
        'GitHub API failed',
        ErrorCodes.GITHUB_API_ERROR,
        500,
        { service: 'github' },
        true
      )
      
      const emailError = new AppError(
        'Email send failed',
        ErrorCodes.EMAIL_SERVICE_ERROR,
        503,
        { service: 'email' },
        true
      )

      expect(validationError.isRetryable).toBe(false)
      expect(githubError.isRetryable).toBe(true)
      expect(emailError.isRetryable).toBe(true)
      
      expect(validationError.statusCode).toBe(400)
      expect(githubError.statusCode).toBe(500)
      expect(emailError.statusCode).toBe(503)
    })
  })
})