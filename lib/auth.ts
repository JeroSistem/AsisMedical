import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { loginSchema } from './validator'
import { logger } from './logger'
import { prisma } from './prisma'
import { getPrismaClient } from './database-manager'
import bcrypt from 'bcryptjs'

interface StaticUser {
  id: string
  email: string
  password: string
  role: string
  entityId?: string
  name: string
}

const STATIC_USERS: StaticUser[] = [
  {
    id: 'demo-admin',
    email: process.env.AUTH_DEMO_EMAIL ?? 'admin@asismedicare.com',
    password: process.env.AUTH_DEMO_PASSWORD ?? 'admin123',
    role: process.env.AUTH_DEMO_ROLE ?? 'SUPER_ADMIN',
    entityId: process.env.AUTH_DEMO_ENTITY_ID ?? 'demo-entity',
    name: process.env.AUTH_DEMO_NAME ?? 'Administrador Demo'
  }
]

function findStaticUser(email: string): StaticUser | undefined {
  return STATIC_USERS.find(user => user.email.toLowerCase() === email.toLowerCase())
}

function fallbackToStaticUser(email: string, password: string) {
  const user = findStaticUser(email)
  if (!user || user.password !== password) {
    return null
  }
  logger.info('Usuario autenticado en modo fallback (sin base de datos)', { userId: user.id, email: user.email })
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    entityId: user.entityId,
    name: user.name
  }
}

export const authOptions: any = {
  session: { strategy: 'jwt' as const },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(creds) {
        try {
          if (!creds?.email || !creds?.password) {
            logger.warn('Intento de inicio de sesión sin credenciales')
            return null
          }

          const validated = loginSchema.safeParse(creds)
          if (!validated.success) {
            logger.warn('Formato de credenciales inválido', { email: creds.email })
            return null
          }

          // Buscar usuario primero en la BD principal (solo para SUPER_ADMIN)
          // Los usuarios de entidades están en sus propias BDs
          let user = await prisma.user.findUnique({
            where: { email: validated.data.email.toLowerCase() },
            select: {
              id: true,
              email: true,
              password: true,
              role: true,
              name: true,
              entityId: true,
              status: true
            }
          })

          // Si no se encuentra en la BD principal, buscar en todas las BDs de entidades
          if (!user) {
            try {
              // Obtener todas las entidades activas con BD creada
              const entities = await prisma.entity.findMany({
                where: { 
                  status: 'ACTIVE',
                  databaseName: { not: null }
                },
                select: { id: true, databaseName: true }
              })

              logger.info(`Buscando usuario en ${entities.length} entidades activas`)

              // Buscar en cada BD de entidad
              for (const entity of entities) {
                if (!entity.databaseName) continue
                
                try {
                  const entityPrisma = getPrismaClient(entity.id)
                  const entityUser = await entityPrisma.user.findUnique({
                    where: { email: validated.data.email.toLowerCase() },
                    select: {
                      id: true,
                      email: true,
                      password: true,
                      role: true,
                      name: true,
                      entityId: true,
                      status: true
                    }
                  })

                  if (entityUser) {
                    // Asegurar que el entityId esté correcto
                    user = {
                      ...entityUser,
                      entityId: entity.id
                    }
                    logger.info('✅ Usuario encontrado en BD de entidad', { 
                      email: validated.data.email, 
                      entityId: entity.id,
                      role: entityUser.role
                    })
                    break
                  }
                } catch (entityError: any) {
                  // Continuar buscando en otras entidades si hay error
                  logger.warn('Error buscando usuario en BD de entidad', { 
                    entityId: entity.id, 
                    error: entityError.message 
                  })
                }
              }
            } catch (searchError: any) {
              logger.warn('Error buscando usuario en BDs de entidades', { 
                error: searchError.message 
              })
            }
          } else {
            logger.info('Usuario encontrado en BD principal (SUPER_ADMIN o sistema)', { 
              email: validated.data.email,
              role: user.role
            })
          }

          if (!user) {
            logger.warn('Usuario no encontrado en la base de datos', { email: creds.email })
            // Fallback a usuarios estáticos
            return fallbackToStaticUser(validated.data.email, validated.data.password)
          }

          // Verificar que el usuario esté activo
          if (user.status !== 'Active') {
            logger.warn('Usuario inactivo intentando iniciar sesión', { email: creds.email, status: user.status })
            return null
          }

          // Verificar contraseña
          if (!user.password) {
            logger.warn('Usuario sin contraseña configurada', { email: creds.email })
            return null
          }

          const passwordMatch = await bcrypt.compare(validated.data.password, user.password)
          if (!passwordMatch) {
            logger.warn('Contraseña incorrecta', { email: creds.email })
            return null
          }

          logger.info('Usuario autenticado desde base de datos', { userId: user.id, email: user.email })

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            entityId: user.entityId || null,
            name: user.name
          }
        } catch (error) {
          logger.error('Error en autenticación', { error, email: creds?.email })
          // Fallback a usuarios estáticos en caso de error
          return fallbackToStaticUser(creds?.email || '', creds?.password || '')
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.entityId = (user as any).entityId
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        (session as any).user.id = token.id
        ;(session as any).user.role = token.role
        ;(session as any).user.entityId = token.entityId
      } else {
        ;(session as any).user = session.user ?? {}
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)
