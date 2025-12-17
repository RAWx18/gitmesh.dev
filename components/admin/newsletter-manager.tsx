"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { 
  Users, 
  Mail, 
  Search, 
  Download, 
  Trash2, 
  CheckCircle, 
  Clock,
  Filter,
  RefreshCw
} from "lucide-react"
import { NewsletterSubscriber } from "@/types"
import { NewsletterStatus } from "./newsletter-status"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [filteredSubscribers, setFilteredSubscribers] = useState<NewsletterSubscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending">("all")
  const { toast } = useToast()

  const loadSubscribers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/newsletter/subscribers")
      
      if (!response.ok) {
        throw new Error("Failed to load subscribers")
      }
      
      const data = await response.json()
      setSubscribers(data.subscribers)
    } catch (error) {
      toast({
        title: "Error loading subscribers",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSubscribers()
  }, [])

  useEffect(() => {
    let filtered = subscribers

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(sub => 
        statusFilter === "confirmed" ? sub.confirmed : !sub.confirmed
      )
    }

    setFilteredSubscribers(filtered)
  }, [subscribers, searchTerm, statusFilter])

  const handleDeleteSubscriber = async (email: string) => {
    try {
      const response = await fetch("/api/admin/newsletter/subscribers", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        throw new Error("Failed to delete subscriber")
      }

      await loadSubscribers()
      toast({
        title: "Subscriber deleted",
        description: "The subscriber has been removed from the list"
      })
    } catch (error) {
      toast({
        title: "Error deleting subscriber",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      })
    }
  }

  const handleExportSubscribers = () => {
    const csvContent = [
      ["Email", "Name", "Subscribed At", "Confirmed", "Tags"].join(","),
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.name || "",
        new Date(sub.subscribedAt).toISOString(),
        sub.confirmed ? "Yes" : "No",
        sub.tags.join(";")
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export complete",
      description: `Exported ${filteredSubscribers.length} subscribers to CSV`
    })
  }

  const confirmedCount = subscribers.filter(sub => sub.confirmed).length
  const pendingCount = subscribers.filter(sub => !sub.confirmed).length

  return (
    <Tabs defaultValue="subscribers" className="space-y-6">
      <TabsList>
        <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        <TabsTrigger value="status">Delivery Status</TabsTrigger>
      </TabsList>

      <TabsContent value="subscribers" className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{confirmedCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Newsletter Subscribers</CardTitle>
              <CardDescription>
                Manage your newsletter subscribers and their preferences
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadSubscribers}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSubscribers}
                disabled={filteredSubscribers.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: "all" | "confirmed" | "pending") => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subscribers</SelectItem>
                <SelectItem value="confirmed">Confirmed Only</SelectItem>
                <SelectItem value="pending">Pending Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Subscribers List */}
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading subscribers...</p>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "No subscribers match your filters" 
                  : "No subscribers yet"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSubscribers.map((subscriber) => (
                <div
                  key={subscriber.email}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{subscriber.email}</p>
                      <Badge variant={subscriber.confirmed ? "default" : "secondary"}>
                        {subscriber.confirmed ? "Confirmed" : "Pending"}
                      </Badge>
                    </div>
                    {subscriber.name && (
                      <p className="text-sm text-muted-foreground">{subscriber.name}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Subscribed: {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </p>
                    {subscriber.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {subscriber.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {subscriber.email} from the newsletter? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteSubscriber(subscriber.email)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="status">
        <NewsletterStatus />
      </TabsContent>
    </Tabs>
  )
}