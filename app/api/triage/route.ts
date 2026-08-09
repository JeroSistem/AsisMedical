import { ok, badRequest, serverError, unauthorized } from '@/lib/http'
import { medicalStaffGuard } from '@/lib/rbac'
import { triageSchema } from '@/lib/validator'
import { limitOrThrow } from '@/lib/ratelimit'
import { logger } from '@/lib/logger'

export async function GET(req: Request) {
  try {
    const user = await medicalStaffGuard(req)
    const ip = req.headers.get('x-forwarded-for') ?? 'local'
    await limitOrThrow(ip, 'triage-read')

    logger.warn('Triage assessments solicitados sin capa de base de datos', {
      userId: user.id,
      entityId: user.entityId
    })

    return ok([])
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorized()
    }
    logger.error('Error retrieving triage assessments', { error })
    return serverError(error)
  }
}

export async function POST(req: Request) {
  try {
    const user = await medicalStaffGuard(req)
    const ip = req.headers.get('x-forwarded-for') ?? 'local'
    await limitOrThrow(ip, 'triage-create')

    const body = await req.json()
    
    // Validate input
    const validated = triageSchema.safeParse(body)
    if (!validated.success) {
      logger.warn('Invalid triage data', { 
        errors: validated.error.errors,
        userId: user.id 
      })
      return badRequest('Invalid triage data')
    }

    logger.warn('Intento de crear valoración de triage sin capa de base de datos', {
      userId: user.id,
      entityId: user.entityId,
      payload: validated.data
    })

    return badRequest('La base de datos está deshabilitada. No es posible registrar la valoración.', 503)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorized()
    }
    logger.error('Error creating triage assessment', { error })
    return serverError(error)
  }
}


