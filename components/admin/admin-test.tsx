'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { testAdminAccess } from '@/lib/admin-api'
import { useAdminCheck } from '@/hooks/use-admin'

export function AdminTest() {
  const { session, isAdmin, isAuthenticated, isLoading } = useAdminCheck()
  const [apiTest, setApiTest] = useState<{
    loading: boolean
    result?: any
    error?: string
  }>({ loading: false })

  const handleTestAPI = async () => {
    setApiTest({ loading: true })
    
    try {
      const result = await testAdminAccess()
      setApiTest({ loading: false, result })
    } catch (error) {
      setApiTest({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Authenticated:</span>
            <span className={`ml-2 ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
              {isAuthenticated ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="font-medium">Admin Access:</span>
            <span className={`ml-2 ${isAdmin ? 'text-green-600' : 'text-red-600'}`}>
              {isAdmin ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="font-medium">Email:</span>
            <span className="ml-2 text-gray-600">
              {session?.user?.email || 'N/A'}
            </span>
          </div>
          <div>
            <span className="font-medium">Role:</span>
            <span className="ml-2 text-gray-600">
              {session?.user?.role || 'N/A'}
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <Button 
            onClick={handleTestAPI} 
            disabled={apiTest.loading || !isAdmin}
            className="w-full"
          >
            {apiTest.loading ? 'Testing API...' : 'Test Admin API'}
          </Button>

          {apiTest.result && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm font-medium text-green-800">API Test Successful</p>
              <pre className="text-xs text-green-700 mt-2 overflow-x-auto">
                {JSON.stringify(apiTest.result, null, 2)}
              </pre>
            </div>
          )}

          {apiTest.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm font-medium text-red-800">API Test Failed</p>
              <p className="text-xs text-red-700 mt-1">{apiTest.error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}