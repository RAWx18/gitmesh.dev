import { requireAdmin } from '@/lib/admin-protection'
import { AdminPage } from '@/components/admin/admin-layout'
import { AdminSettings } from '@/components/admin/admin-settings'

export default async function AdminSettingsPage() {
  const session = await requireAdmin()

  return (
    <AdminPage 
      title="System Settings" 
      description="Configure system-wide settings and preferences"
    >
      <AdminSettings />
    </AdminPage>
  )
}