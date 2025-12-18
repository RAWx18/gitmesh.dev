import { requireAdmin } from '@/lib/admin-protection'
import { AdminPage } from '@/components/admin/admin-layout'
import { ContributorsManager } from '@/components/admin/contributors-manager'

export default async function ContributorsPage() {
  await requireAdmin()

  return (
    <AdminPage 
      title="Contributors" 
      description="Manage GitHub contributors and community members"
    >
      <ContributorsManager />
    </AdminPage>
  )
}