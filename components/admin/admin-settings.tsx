'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Save, 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  Database,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Trash2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { MaintenanceSettings } from './maintenance-settings'

interface AdminConfig {
  maintenance: boolean
  featuredPosts: string[]
  announcementBanner: {
    enabled: boolean
    message: string
    type: 'info' | 'warning' | 'success'
  } | null
  siteSettings: {
    siteName: string
    siteDescription: string
    contactEmail: string
    githubRepo: string
  }
  emailSettings: {
    provider: string
    fromEmail: string
    fromName: string
  }
  securitySettings: {
    requireEmailVerification: boolean
    sessionTimeout: number
    maxLoginAttempts: number
  }
}

export function AdminSettings() {
  const [config, setConfig] = useState<AdminConfig>({
    maintenance: false,
    featuredPosts: [],
    announcementBanner: null,
    siteSettings: {
      siteName: 'GitMesh CE',
      siteDescription: 'Community Edition - Open-source platform for correlating market signals with engineering telemetry',
      contactEmail: 'support@gitmesh.dev',
      githubRepo: 'LF-Decentralized-Trust-labs/gitmesh'
    },
    emailSettings: {
      provider: 'sendgrid',
      fromEmail: 'support@gitmesh.dev',
      fromName: 'GitMesh CE'
    },
    securitySettings: {
      requireEmailVerification: true,
      sessionTimeout: 24,
      maxLoginAttempts: 5
    }
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newFeaturedPost, setNewFeaturedPost] = useState('')
  const [bannerMessage, setBannerMessage] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')
      const result = await response.json()
      
      if (result.success) {
        setConfig(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch settings',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Settings saved successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save settings',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const addFeaturedPost = () => {
    if (newFeaturedPost.trim() && !config.featuredPosts.includes(newFeaturedPost.trim())) {
      setConfig(prev => ({
        ...prev,
        featuredPosts: [...prev.featuredPosts, newFeaturedPost.trim()]
      }))
      setNewFeaturedPost('')
    }
  }

  const removeFeaturedPost = (postSlug: string) => {
    setConfig(prev => ({
      ...prev,
      featuredPosts: prev.featuredPosts.filter(slug => slug !== postSlug)
    }))
  }

  const toggleBanner = () => {
    if (config.announcementBanner) {
      setConfig(prev => ({ ...prev, announcementBanner: null }))
    } else {
      setConfig(prev => ({
        ...prev,
        announcementBanner: {
          enabled: true,
          message: bannerMessage || 'Important announcement',
          type: 'info'
        }
      }))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveConfig} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="site" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Site
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Configuration
              </CardTitle>
              <CardDescription>
                Basic system configuration and featured content management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Featured Posts */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Featured Posts</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter post slug"
                    value={newFeaturedPost}
                    onChange={(e) => setNewFeaturedPost(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeaturedPost()}
                  />
                  <Button onClick={addFeaturedPost} disabled={!newFeaturedPost.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.featuredPosts.map((slug) => (
                    <Badge key={slug} variant="secondary" className="flex items-center gap-1">
                      {slug}
                      <button
                        onClick={() => removeFeaturedPost(slug)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Announcement Banner */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Announcement Banner</Label>
                  <Switch
                    checked={!!config.announcementBanner}
                    onCheckedChange={toggleBanner}
                  />
                </div>
                {config.announcementBanner && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Announcement message"
                      value={config.announcementBanner.message}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        announcementBanner: prev.announcementBanner ? {
                          ...prev.announcementBanner,
                          message: e.target.value
                        } : null
                      }))}
                    />
                    <div className="flex gap-2">
                      {(['info', 'warning', 'success'] as const).map((type) => (
                        <Button
                          key={type}
                          variant={config.announcementBanner?.type === type ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setConfig(prev => ({
                            ...prev,
                            announcementBanner: prev.announcementBanner ? {
                              ...prev.announcementBanner,
                              type
                            } : null
                          }))}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Settings */}
        <TabsContent value="site" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Configuration
              </CardTitle>
              <CardDescription>
                Configure site metadata and basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={config.siteSettings.siteName}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    siteSettings: { ...prev.siteSettings, siteName: e.target.value }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={config.siteSettings.siteDescription}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    siteSettings: { ...prev.siteSettings, siteDescription: e.target.value }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={config.siteSettings.contactEmail}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    siteSettings: { ...prev.siteSettings, contactEmail: e.target.value }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="githubRepo">GitHub Repository</Label>
                <Input
                  id="githubRepo"
                  value={config.siteSettings.githubRepo}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    siteSettings: { ...prev.siteSettings, githubRepo: e.target.value }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure email service settings and templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailProvider">Email Provider</Label>
                <Input
                  id="emailProvider"
                  value={config.emailSettings.provider}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    emailSettings: { ...prev.emailSettings, provider: e.target.value }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={config.emailSettings.fromEmail}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    emailSettings: { ...prev.emailSettings, fromEmail: e.target.value }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  value={config.emailSettings.fromName}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    emailSettings: { ...prev.emailSettings, fromName: e.target.value }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Configure security policies and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Email Verification</Label>
                  <div className="text-sm text-gray-600">
                    Require users to verify their email addresses
                  </div>
                </div>
                <Switch
                  checked={config.securitySettings.requireEmailVerification}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    securitySettings: { ...prev.securitySettings, requireEmailVerification: checked }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="1"
                  max="168"
                  value={config.securitySettings.sessionTimeout}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    securitySettings: { ...prev.securitySettings, sessionTimeout: parseInt(e.target.value) || 24 }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  min="3"
                  max="10"
                  value={config.securitySettings.maxLoginAttempts}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    securitySettings: { ...prev.securitySettings, maxLoginAttempts: parseInt(e.target.value) || 5 }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance" className="space-y-6">
          <MaintenanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}