import { requireAdmin } from '@/lib/admin-protection'
import { AdminPage } from '@/components/admin/admin-layout'
import { BlogPostManager } from '@/components/admin/blog-post-manager'

export default async function ContentPage() {
  await requireAdmin()

  return (
    <AdminPage 
      title="Content Management" 
      description="Manage blog posts, pages, and other content"
    >
      <BlogPostManager />
    </AdminPage>
  )
}