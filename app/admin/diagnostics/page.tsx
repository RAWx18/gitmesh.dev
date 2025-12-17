import { AdminPage } from '@/components/admin/admin-layout'
import { DiagnosticsView } from '@/components/admin/diagnostics-view'

export default function DiagnosticsPage() {
  return (
    <AdminPage 
      title="Site Diagnostics" 
      description="Monitor website health, check for broken links, validate metadata, and review performance metrics"
    >
      <DiagnosticsView />
    </AdminPage>
  )
}