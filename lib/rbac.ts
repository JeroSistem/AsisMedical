import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { logger } from './logger'
import { unauthorized, forbidden } from './http'

export interface AuthUser {
  id: string
  role: string
  entityId: string
  email: string
}

export async function authGuard(req: Request, opts?: { roles?: string[] }): Promise<AuthUser> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      logger.warn('Unauthorized access attempt', { 
        url: req.url,
        method: req.method 
      })
      throw new Error('Unauthorized')
    }

    const user = {
      id: (session.user as any).id,
      role: (session.user as any).role,
      entityId: (session.user as any).entityId,
      email: session.user.email!
    }

    // Check role requirements
    if (opts?.roles && !opts.roles.includes(user.role)) {
      logger.warn('Insufficient permissions', { 
        userId: user.id,
        userRole: user.role,
        requiredRoles: opts.roles,
        url: req.url 
      })
      throw new Error('Insufficient permissions')
    }

    logger.debug('User authenticated', { 
      userId: user.id,
      role: user.role,
      entityId: user.entityId 
    })

    return user
  } catch (error) {
    logger.error('Authentication guard error', { error, url: req.url })
    throw error
  }
}

// Convenience guards for specific roles
export async function adminGuard(req: Request): Promise<AuthUser> {
  return authGuard(req, { roles: ['ADMIN'] })
}

export async function medicalStaffGuard(req: Request): Promise<AuthUser> {
  return authGuard(req, { roles: ['DOCTOR', 'NURSE', 'ADMIN'] })
}

export async function doctorGuard(req: Request): Promise<AuthUser> {
  return authGuard(req, { roles: ['DOCTOR', 'ADMIN'] })
}
