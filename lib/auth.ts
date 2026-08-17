import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { loginSchema } from './validator'
import { logger } from './logger'
import { prisma } from './prisma'
import { getPrismaClient } from './database-manager'
import bcrypt from 'bcryptjs'

interface StaticUser {
  id: string
  username: string
  email: string
  password: string
  role: string
  entityId?: string
  name: string
}

const STATIC_USERS: StaticUser[] = [
  {
    id: 'demo-admin',
    username: process.env.AUTH_DEMO_USERNAME ?? 'admin',
    email: process.env.AUTH_DEMO_EMAIL ?? 'admin@asismedicare.com',
    password: process.env.AUTH_DEMO_PASSWORD ?? 'admin123',
    role: process.env.AUTH_DEMO_ROLE ?? 'SUPER_ADMIN',
    entityId: process.env.AUTH_DEMO_ENTITY_ID,
    name: process.env.AUTH_DEMO_NAME ?? 'Administrador Plataforma',
  },
]

function findStaticUser(identifier: string): StaticUser | undefined {
  const key = identifier.toLowerCase()
  return STATIC_USERS.find(
    (user) =>
      user.username.toLowerCase() === key || user.email.toLowerCase() === key
  )
}

function fallbackToStaticUser(identifier: string, password: string) {
  // Desactivado por seguridad salvo AUTH_DEV_FALLBACK=true
  if (process.env.AUTH_DEV_FALLBACK !== 'true') {
    return null
  }
  const user = findStaticUser(identifier)
  if (!user || user.password !== password) {
    return null
  }
  logger.info('Usuario autenticado en modo fallback (sin base de datos)', {
    userId: user.id,
    username: user.username,
  })
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    entityId: user.entityId ?? null,
    name: user.name,
  }
}

type AuthUser = {
  id: string
  email: string
  password: string | null
  role: string
  name: string
  entityId: string | null
  status: string
  username?: string | null
}

async function findUserByLogin(identifier: string): Promise<AuthUser | null> {
  const raw = identifier.trim()
  const key = raw.toLowerCase()
  if (!key || !prisma || typeof prisma.user === 'undefined') return null

  // BD principal (usuario o email, sin distinguir mayúsculas)
  const mainUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username: { equals: raw } },
        { email: { equals: key } },
      ],
    },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
      role: true,
      name: true,
      entityId: true,
      status: true,
    },
  })
  if (mainUser) return mainUser

  // BDs de entidades
  try {
    const entities = await prisma.entity.findMany({
      where: {
        status: 'ACTIVE',
        databaseName: { not: null },
      },
      select: { id: true, databaseName: true },
    })

    for (const entity of entities) {
      if (!entity.databaseName) continue
      try {
        const entityPrisma = getPrismaClient(entity.id)
        const entityUser = await entityPrisma.user.findFirst({
          where: {
            OR: [
              { username: { equals: raw } },
              { email: { equals: key } },
            ],
          },
          select: {
            id: true,
            email: true,
            username: true,
            password: true,
            role: true,
            name: true,
            entityId: true,
            status: true,
          },
        })
        if (entityUser) {
          return { ...entityUser, entityId: entity.id }
        }
      } catch (entityError: any) {
        logger.warn('Error buscando usuario en BD de entidad', {
          entityId: entity.id,
          error: entityError.message,
        })
      }
    }
  } catch (searchError: any) {
    logger.warn('Error buscando usuario en BDs de entidades', {
      error: searchError.message,
    })
  }

  return null
}

export const authOptions: any = {
  session: { strategy: 'jwt' as const },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(creds) {
        try {
          if (!creds?.username || !creds?.password) {
            logger.warn('Intento de inicio de sesión sin credenciales')
            return null
          }

          const validated = loginSchema.safeParse({
            username: creds.username,
            password: creds.password,
          })
          if (!validated.success) {
            logger.warn('Formato de credenciales inválido', {
              username: creds.username,
            })
            return null
          }

          const identifier = validated.data.username
          let user = await findUserByLogin(identifier)

          if (!user) {
            logger.warn('Usuario no encontrado en la base de datos', {
              username: identifier,
            })
            return fallbackToStaticUser(
              identifier,
              validated.data.password
            )
          }

          if (user.status !== 'Active') {
            logger.warn('Usuario inactivo intentando iniciar sesión', {
              username: identifier,
              status: user.status,
            })
            return null
          }

          if (!user.password) {
            logger.warn('Usuario sin contraseña configurada', {
              username: identifier,
            })
            return null
          }

          const passwordMatch = await bcrypt.compare(
            validated.data.password,
            user.password
          )
          if (!passwordMatch) {
            logger.warn('Contraseña incorrecta', { username: identifier })
            return null
          }

          // Actualizar último acceso (best-effort)
          try {
            if (user.entityId) {
              const entityPrisma = getPrismaClient(user.entityId)
              await entityPrisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() },
              })
            } else if (prisma?.user) {
              await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() },
              })
            }
          } catch {
            // no bloquear login
          }

          logger.info('Usuario autenticado desde base de datos', {
            userId: user.id,
            email: user.email,
          })

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            entityId: user.entityId || null,
            name: user.name,
          }
        } catch (error) {
          logger.error('Error en autenticación', {
            error,
            username: creds?.username,
          })
          return fallbackToStaticUser(
            creds?.username || '',
            creds?.password || ''
          )
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
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
        ;(session as any).user.id = token.id
        ;(session as any).user.role = token.role
        ;(session as any).user.entityId = token.entityId
      } else {
        ;(session as any).user = session.user ?? {}
      }
      return session
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
