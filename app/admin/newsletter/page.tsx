import { AdminPage } from '@/components/admin/admin-layout'
import { NewsletterManager } from '@/components/admin/newsletter-manager'

export default function NewsletterAdminPage() {
  return (
    <AdminPage 
      title="Newsletter Management" 
      description="Manage newsletter subscribers and send campaigns"
    >
      <NewsletterManager />
    </AdminPage>
  )
}