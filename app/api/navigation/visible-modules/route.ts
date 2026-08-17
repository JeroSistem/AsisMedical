import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

const DEFAULT_MODULES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Panel principal del sistema',
    icon: '📊',
    status: 'ENABLED',
    order: 1
  },
  {
    id: 'admisiones',
    name: 'Admisiones',
    description: 'Gestión de admisiones hospitalarias',
    icon: '🏥',
    status: 'ENABLED',
    order: 2
  },
  {
    id: 'triage',
    name: 'Triage',
    description: 'Evaluación de urgencias',
    icon: '🚨',
    status: 'ENABLED',
    order: 3
  },
  {
    id: 'historias',
    name: 'Historias Clínicas',
    description: 'Gestión de historias médicas',
    icon: '📋',
    status: 'ENABLED',
    order: 4
  },
  {
    id: 'citas',
    name: 'Citas',
    description: 'Programación de citas médicas',
    icon: '🗓️',
    status: 'ENABLED',
    order: 5
  },
  {
    id: 'admin',
    name: 'Administración',
    description: 'Configuración del sistema (incluye Pacientes)',
    icon: '⚙️',
    status: 'ENABLED',
    order: 6
  }
]

export async function GET() {
  try {
    // logger.info('Visible modules requested') // Temporarily disabled
    
    // For now, return default modules
    // TODO: Implement proper module visibility based on user permissions
    return NextResponse.json({ success: true, data: DEFAULT_MODULES })
  } catch (error) {
    // logger.error('Error retrieving visible modules', { error }) // Temporarily disabled
    return NextResponse.json(
      { success: false, error: 'Error retrieving modules' }, 
      { status: 500 }
    )
  }
}


