import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin (you'll need to implement proper auth check)
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { enabled, message, duration } = await request.json()
    
    // Read current .env file
    const envPath = join(process.cwd(), '.env')
    let envContent = readFileSync(envPath, 'utf8')
    
    // Update maintenance mode setting
    const maintenanceModeRegex = /MAINTENANCE_MODE=.*/
    if (maintenanceModeRegex.test(envContent)) {
      envContent = envContent.replace(maintenanceModeRegex, `MAINTENANCE_MODE=${enabled}`)
    } else {
      envContent += `\nMAINTENANCE_MODE=${enabled}`
    }
    
    // Update maintenance message if provided
    if (message) {
      const messageRegex = /MAINTENANCE_MESSAGE=.*/
      if (messageRegex.test(envContent)) {
        envContent = envContent.replace(messageRegex, `MAINTENANCE_MESSAGE=${message}`)
      } else {
        envContent += `\nMAINTENANCE_MESSAGE=${message}`
      }
    }
    
    // Update maintenance duration if provided
    if (duration) {
      const durationRegex = /MAINTENANCE_DURATION=.*/
      if (durationRegex.test(envContent)) {
        envContent = envContent.replace(durationRegex, `MAINTENANCE_DURATION=${duration}`)
      } else {
        envContent += `\nMAINTENANCE_DURATION=${duration}`
      }
    }
    
    // Write updated .env file
    writeFileSync(envPath, envContent)
    
    return NextResponse.json({ 
      success: true, 
      message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}` 
    })
  } catch (error) {
    console.error('Error toggling maintenance mode:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    enabled: process.env.MAINTENANCE_MODE === 'true',
    message: process.env.MAINTENANCE_MESSAGE || 'We are currently performing scheduled maintenance.',
    duration: process.env.MAINTENANCE_DURATION || '1-2 hours'
  })
}