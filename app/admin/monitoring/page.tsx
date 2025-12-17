import { AdminPage } from '@/components/admin/admin-layout'
import { MonitoringDashboard } from '@/components/admin/monitoring-dashboard'

export default function MonitoringPage() {
  return (
    <AdminPage 
      title="System Monitoring" 
      description="Monitor system health, performance metrics, and service status"
    >
      <MonitoringDashboard />
    </AdminPage>
  )
}