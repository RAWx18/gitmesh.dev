'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Wrench, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle,
  Copy,
  Clock,
  RefreshCw,
  Globe,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'

interface MaintenanceConfig {
  enabled: boolean
  message: string
  estimatedDuration: string
}

export function MaintenanceSettings() {
  const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceConfig>({
    enabled: false,
    message: "We are currently performing scheduled maintenance to improve your experience.",
    estimatedDuration: "1-2 hours"
  })
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Load current maintenance status
  useEffect(() => {
    fetchMaintenanceStatus()
  }, [])

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/admin/maintenance')
      if (response.ok) {
        const data = await response.json()
        setMaintenanceConfig(data)
        setError(null)
      } else {
        throw new Error('Failed to fetch maintenance status')
      }
    } catch (error) {
      console.error('Failed to fetch maintenance status:', error)
      setError('Failed to load maintenance settings')
    } finally {
      setInitialLoad(false)
    }
  }

  const toggleMaintenanceMode = async (enabled: boolean) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled,
          message: maintenanceConfig.message,
          duration: maintenanceConfig.estimatedDuration
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMaintenanceConfig(prev => ({ ...prev, enabled }))
        setSuccess(data.message)
        toast.success(data.message)
      } else {
        throw new Error('Failed to update maintenance mode')
      }
    } catch (error) {
      const errorMsg = 'Failed to update maintenance mode'
      setError(errorMsg)
      toast.error(errorMsg)
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateMaintenanceConfig = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: maintenanceConfig.enabled,
          message: maintenanceConfig.message,
          duration: maintenanceConfig.estimatedDuration
        }),
      })

      if (response.ok) {
        setSuccess('Maintenance configuration updated successfully')
        toast.success('Maintenance configuration updated')
      } else {
        throw new Error('Failed to update configuration')
      }
    } catch (error) {
      const errorMsg = 'Failed to update configuration'
      setError(errorMsg)
      toast.error(errorMsg)
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyMaintenanceUrl = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/maintenance` : '/maintenance'
    navigator.clipboard.writeText(url)
    toast.success('Maintenance URL copied to clipboard!')
  }

  if (initialLoad) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Current Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Status
              </CardTitle>
              <CardDescription>
                Current maintenance mode status and quick actions
              </CardDescription>
            </div>
            <Button 
              onClick={fetchMaintenanceStatus} 
              variant="outline" 
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`p-6 rounded-lg border-2 ${
            maintenanceConfig.enabled 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {maintenanceConfig.enabled ? (
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                )}
                <div>
                  <div className={`text-xl font-bold ${
                    maintenanceConfig.enabled ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {maintenanceConfig.enabled ? 'Maintenance Mode Active' : 'Site is Live'}
                  </div>
                  <div className={`text-sm ${
                    maintenanceConfig.enabled ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {maintenanceConfig.enabled 
                      ? 'Public access is currently disabled' 
                      : 'Site is accessible to all users'
                    }
                  </div>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                maintenanceConfig.enabled 
                  ? 'bg-red-100 text-red-800 border border-red-300' 
                  : 'bg-green-100 text-green-800 border border-green-300'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  maintenanceConfig.enabled ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                }`}></div>
                {maintenanceConfig.enabled ? 'MAINTENANCE' : 'ONLINE'}
              </div>
            </div>

            {/* Maintenance URL Display - Only when active */}
            {maintenanceConfig.enabled && (
              <div className="bg-white rounded-lg p-4 border border-red-300">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-red-800 font-medium">
                    👀 Visitor Experience:
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/maintenance', '_blank')}
                    className="text-red-700 border-red-300 hover:bg-red-100"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                  <code className="text-sm font-mono text-gray-700 flex-1 select-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/maintenance` : '/maintenance'}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1 h-auto"
                    onClick={copyMaintenanceUrl}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-3 mt-4">
              {maintenanceConfig.enabled ? (
                <Button
                  onClick={() => toggleMaintenanceMode(false)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {loading ? 'Enabling Site...' : 'Enable Site'}
                </Button>
              ) : (
                <Button
                  onClick={() => toggleMaintenanceMode(true)}
                  disabled={loading}
                  variant="destructive"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {loading ? 'Enabling Maintenance...' : 'Enable Maintenance'}
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={() => window.open('/maintenance', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Configuration
          </CardTitle>
          <CardDescription>
            Customize the maintenance page message and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Toggle Switch */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="space-y-1">
              <Label htmlFor="maintenance-toggle" className="text-base font-medium">
                Maintenance Mode
              </Label>
              <p className="text-sm text-gray-600">
                When enabled, all visitors will see the maintenance page
              </p>
            </div>
            <Switch
              id="maintenance-toggle"
              checked={maintenanceConfig.enabled}
              onCheckedChange={toggleMaintenanceMode}
              disabled={loading}
            />
          </div>

          {/* Configuration Fields */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="maintenance-message">Maintenance Message</Label>
              <Textarea
                id="maintenance-message"
                value={maintenanceConfig.message}
                onChange={(e) => setMaintenanceConfig(prev => ({ 
                  ...prev, 
                  message: e.target.value 
                }))}
                placeholder="Enter maintenance message..."
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                This message will be displayed to visitors during maintenance
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenance-duration">Expected Duration</Label>
              <Input
                id="maintenance-duration"
                value={maintenanceConfig.estimatedDuration}
                onChange={(e) => setMaintenanceConfig(prev => ({ 
                  ...prev, 
                  estimatedDuration: e.target.value 
                }))}
                placeholder="e.g., 1-2 hours, 30 minutes"
              />
              <p className="text-xs text-gray-500">
                Estimated time for maintenance completion
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={updateMaintenanceConfig}
              disabled={loading}
            >
              <Clock className="w-4 h-4 mr-2" />
              {loading ? 'Updating...' : 'Update Configuration'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}