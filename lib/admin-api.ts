/**
 * Client-side utilities for making authenticated admin API calls
 */

export class AdminAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'AdminAPIError'
  }
}

/**
 * Make an authenticated admin API request
 */
export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new AdminAPIError(
      errorData.message || 'API request failed',
      response.status,
      errorData.code
    )
  }

  return response
}

/**
 * Test admin API access
 */
export async function testAdminAccess(): Promise<{
  success: boolean
  user?: any
  error?: string
}> {
  try {
    const response = await adminFetch('/api/admin/test')
    const data = await response.json()
    
    return {
      success: true,
      user: data.user
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof AdminAPIError ? error.message : 'Unknown error'
    }
  }
}