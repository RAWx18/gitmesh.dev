import { requireAdmin } from '@/lib/admin-protection'
import { AdminPage } from '@/components/admin/admin-layout'
import { UserManagement } from '@/components/admin/user-management'

export default async function UsersPage() {
  const session = await requireAdmin()

  return (
    <AdminPage 
      title="User Management" 
      description="Manage admin users, permissions, and access control"
    >
      <UserManagement />
    </AdminPage>
  )
}