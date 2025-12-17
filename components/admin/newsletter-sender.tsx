'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, TestTube, Users, Mail, AlertCircle, CheckCircle, Target, Eye } from 'lucide-react'

interface BlogPostSummary {
  slug: string
  title: string
  author: string
  publishedAt: string
  excerpt: string
  tags: string[]
  newsletter: boolean
}

interface NewsletterSenderProps {
  subscriberStats?: {
    total: number
    confirmed: number
    unconfirmed: number
  }
}

export function NewsletterSender({ subscriberStats }: NewsletterSenderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    subject: '',
    customContent: '',
    includePosts: [] as string[],
    tags: [] as string[],
    testEmail: '',
    targetingMode: 'all' as 'all' | 'tags' | 'specific'
  })
  const [subscriberPreview, setSubscriberPreview] = useState<{
    total: number
    targeted: number
    tags: string[]
  } | null>(null)
  const [availablePosts, setAvailablePosts] = useState<BlogPostSummary[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  const handleSendNewsletter = async (isTest = false) => {
    if (isTest) {
      setIsTesting(true)
    } else {
      setIsLoading(true)
    }
    
    setResult(null)

    try {
      const payload = {
        ...formData,
        ...(isTest && formData.testEmail ? { testEmail: formData.testEmail } : {})
      }

      const response = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send newsletter')
      }

      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    } finally {
      setIsLoading(false)
      setIsTesting(false)
    }
  }

  const togglePost = (postSlug: string) => {
    setFormData(prev => ({
      ...prev,
      includePosts: prev.includePosts.includes(postSlug)
        ? prev.includePosts.filter(slug => slug !== postSlug)
        : [...prev.includePosts, postSlug]
    }))
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const previewTargeting = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: formData.targetingMode === 'tags' ? formData.tags : [],
          targetingMode: formData.targetingMode
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSubscriberPreview(data)
      }
    } catch (error) {
      console.error('Failed to preview targeting:', error)
    }
  }

  // Load available blog posts
  const loadBlogPosts = async () => {
    try {
      setLoadingPosts(true)
      const response = await fetch('/api/admin/content/blog')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Filter to only newsletter-enabled posts
          const newsletterPosts = result.data.filter((post: any) => post.newsletter)
          setAvailablePosts(newsletterPosts)
        }
      }
    } catch (error) {
      console.error('Failed to load blog posts:', error)
    } finally {
      setLoadingPosts(false)
    }
  }

  // Update preview when targeting changes
  useEffect(() => {
    if (formData.targetingMode !== 'all' || formData.tags.length > 0) {
      previewTargeting()
    } else {
      setSubscriberPreview(null)
    }
  }, [formData.targetingMode, formData.tags])

  // Load blog posts on mount
  useEffect(() => {
    loadBlogPosts()
  }, [])

  return (
    <div className="space-y-6">
      {/* Subscriber Stats */}
      {subscriberStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Subscriber Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{subscriberStats.total}</div>
                <div className="text-sm text-gray-600">Total Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{subscriberStats.confirmed}</div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{subscriberStats.unconfirmed}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Newsletter
          </CardTitle>
          <CardDescription>
            Create and send a newsletter to your subscribers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject (optional)</Label>
            <Input
              id="subject"
              placeholder="Leave empty to auto-generate based on content"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            />
          </div>

          {/* Custom Content */}
          <div className="space-y-2">
            <Label htmlFor="customContent">Custom Content (optional)</Label>
            <Textarea
              id="customContent"
              placeholder="Add custom HTML content to include in the newsletter..."
              rows={4}
              value={formData.customContent}
              onChange={(e) => setFormData(prev => ({ ...prev, customContent: e.target.value }))}
            />
          </div>

          {/* Blog Posts */}
          <div className="space-y-2">
            <Label>Include Blog Posts</Label>
            {loadingPosts ? (
              <div className="border rounded-md p-4 text-center text-sm text-gray-500">
                Loading blog posts...
              </div>
            ) : availablePosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {availablePosts.map((post) => (
                  <div
                    key={post.slug}
                    className={`p-3 rounded cursor-pointer transition-colors border ${
                      formData.includePosts.includes(post.slug)
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                    }`}
                    onClick={() => togglePost(post.slug)}
                  >
                    <div className="font-medium text-sm">{post.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      By {post.author} • {new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {post.excerpt}
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-md p-4 text-center text-sm text-gray-500">
                No newsletter-enabled blog posts available. 
                <br />
                Enable newsletter option when creating blog posts to include them here.
              </div>
            )}
          </div>

          {/* Targeting */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Subscriber Targeting
            </Label>
            
            <Select 
              value={formData.targetingMode} 
              onValueChange={(value: 'all' | 'tags' | 'specific') => 
                setFormData(prev => ({ ...prev, targetingMode: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All confirmed subscribers</SelectItem>
                <SelectItem value="tags">Subscribers with specific tags</SelectItem>
              </SelectContent>
            </Select>

            {formData.targetingMode === 'tags' && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag(e.currentTarget.value.trim())
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <div className="text-sm text-gray-600">
                  Only subscribers with these tags will receive the newsletter
                </div>
              </div>
            )}

            {/* Targeting Preview */}
            {subscriberPreview && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">
                    {subscriberPreview.targeted} of {subscriberPreview.total} subscribers will receive this newsletter
                  </span>
                </div>
                {subscriberPreview.tags.length > 0 && (
                  <div className="text-xs text-blue-600 mt-1">
                    Targeting tags: {subscriberPreview.tags.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Test Email */}
          <div className="space-y-2">
            <Label htmlFor="testEmail">Test Email (optional)</Label>
            <Input
              id="testEmail"
              type="email"
              placeholder="your-email@example.com"
              value={formData.testEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, testEmail: e.target.value }))}
            />
            <div className="text-sm text-gray-600">
              Send a test email to this address before sending to all subscribers
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => handleSendNewsletter(true)}
              disabled={isTesting || isLoading || !formData.testEmail}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isTesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              Send Test
            </Button>
            
            <Button
              onClick={() => handleSendNewsletter(false)}
              disabled={isLoading || isTesting}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send Newsletter
            </Button>
          </div>

          {/* Results */}
          {result && (
            <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>
                  {result.success ? (
                    <div>
                      <div className="font-medium">
                        {result.isTest ? 'Test email sent successfully!' : 'Newsletter sent successfully!'}
                      </div>
                      {!result.isTest && (
                        <div className="text-sm mt-1">
                          Sent to {result.totalSent} of {result.totalSubscribers} subscribers
                          {result.totalFailed > 0 && (
                            <span className="text-red-600"> ({result.totalFailed} failed)</span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium">Failed to send newsletter</div>
                      <div className="text-sm mt-1">{result.error}</div>
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}