'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { 
  GitBranch, 
  Users, 
  Search, 
  Filter,
  RefreshCw,
  ExternalLink,
  Star,
  GitCommit,
  Calendar,
  Plus,
  Trash2,
  UserPlus
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Contributor {
  id: string
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  contributions: number
  type: 'User' | 'Bot'
  role: 'maintainer' | 'contributor' | 'community'
  first_contribution: string
  last_contribution: string
  total_commits: number
  total_prs: number
  total_issues: number
}

interface ContributorStats {
  total: number
  maintainers: number
  contributors: number
  community: number
  bots: number
}

export function ContributorsManager() {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [stats, setStats] = useState<ContributorStats>({
    total: 0,
    maintainers: 0,
    contributors: 0,
    community: 0,
    bots: 0
  })
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('')
  const { toast } = useToast()

  useEffect(() => {
    fetchContributors()
  }, [])

  const fetchContributors = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/contributors')
      const result = await response.json()
      
      if (result.success) {
        setContributors(result.data.contributors)
        setStats(result.data.stats)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch contributors',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch contributors',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const syncWithGitHub = async () => {
    try {
      setSyncing(true)
      const response = await fetch('/api/admin/contributors/sync', {
        method: 'POST',
      })
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Success',
          description: `Synced ${result.data.synced} contributors from GitHub`,
        })
        fetchContributors()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to sync with GitHub',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync with GitHub',
        variant: 'destructive',
      })
    } finally {
      setSyncing(false)
    }
  }

  const updateContributorRole = async (contributorId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/contributors/${contributorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Contributor role updated successfully',
        })
        fetchContributors()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update contributor role',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update contributor role',
        variant: 'destructive',
      })
    }
  }

  const removeContributor = async (contributorId: string) => {
    try {
      const response = await fetch(`/api/admin/contributors/${contributorId}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Contributor removed successfully',
        })
        fetchContributors()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to remove contributor',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove contributor',
        variant: 'destructive',
      })
    }
  }

  // Filter contributors based on search and filters
  const filteredContributors = contributors.filter(contributor => {
    const matchesSearch = searchTerm === '' || 
      contributor.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contributor.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === '' || filterRole === 'all' || contributor.role === filterRole
    const matchesType = filterType === '' || filterType === 'all' || contributor.type === filterType
    
    return matchesSearch && matchesRole && matchesType
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'maintainer': return 'bg-purple-100 text-purple-800'
      case 'contributor': return 'bg-blue-100 text-blue-800'
      case 'community': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Contributors List Skeleton */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Contributors Management</h2>
          <p className="text-gray-600">Manage GitHub contributors and community members</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={fetchContributors} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={syncWithGitHub} disabled={syncing}>
            <GitBranch className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync with GitHub'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-purple-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Maintainers</p>
                <p className="text-2xl font-bold">{stats.maintainers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GitCommit className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Contributors</p>
                <p className="text-2xl font-bold">{stats.contributors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Community</p>
                <p className="text-2xl font-bold">{stats.community}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GitBranch className="h-4 w-4 text-gray-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Bots</p>
                <p className="text-2xl font-bold">{stats.bots}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contributors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterRole || "all"} onValueChange={(value) => setFilterRole(value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="maintainer">Maintainers</SelectItem>
                <SelectItem value="contributor">Contributors</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterType || "all"} onValueChange={(value) => setFilterType(value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="User">Users</SelectItem>
                <SelectItem value="Bot">Bots</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contributors List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contributors ({filteredContributors.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredContributors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {contributors.length === 0 ? 'No contributors yet' : 'No contributors match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {contributors.length === 0 
                  ? 'Sync with GitHub to fetch contributors.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {contributors.length === 0 && (
                <Button onClick={syncWithGitHub} disabled={syncing}>
                  <GitBranch className="h-4 w-4 mr-2" />
                  Sync with GitHub
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContributors.map((contributor) => (
                <div key={contributor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contributor.avatar_url} alt={contributor.login} />
                      <AvatarFallback>{contributor.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{contributor.name || contributor.login}</h3>
                        <Badge className={getRoleBadgeColor(contributor.role)}>
                          {contributor.role}
                        </Badge>
                        {contributor.type === 'Bot' && (
                          <Badge variant="outline">Bot</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">@{contributor.login}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <GitCommit className="h-3 w-3" />
                          {contributor.total_commits} commits
                        </span>
                        <span>{contributor.total_prs} PRs</span>
                        <span>{contributor.total_issues} issues</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Since {new Date(contributor.first_contribution).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    
                    <Select
                      value={contributor.role}
                      onValueChange={(value) => updateContributorRole(contributor.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintainer">Maintainer</SelectItem>
                        <SelectItem value="contributor">Contributor</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Contributor</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {contributor.name || contributor.login} from the contributors list? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeContributor(contributor.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}