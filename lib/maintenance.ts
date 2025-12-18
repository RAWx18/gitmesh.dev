/**
 * Utility functions for managing maintenance mode
 */

export function isMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE === 'true'
}

export function getMaintenanceConfig() {
  return {
    enabled: isMaintenanceMode(),
    message: process.env.MAINTENANCE_MESSAGE || 'We are currently performing scheduled maintenance.',
    estimatedDuration: process.env.MAINTENANCE_DURATION || '1-2 hours',
    contactEmail: process.env.FROM_EMAIL || 'support@gitmesh.dev'
  }
}