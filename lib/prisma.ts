import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida en las variables de entorno')
  }

  const url = new URL(connectionString)
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: parseInt(url.port || '3306', 10),
    user: url.username,
    password: decodeURIComponent(url.password || ''),
    database: url.pathname.replace(/^\//, ''),
    connectionLimit: 20,
  })

  if (process.env.NODE_ENV === 'development') {
    console.log('[Prisma] Configurando conexión MySQL:', {
      host: url.hostname,
      port: parseInt(url.port || '3306', 10),
      database: url.pathname.replace(/^\//, ''),
      user: url.username,
    })
  }

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn'] : ['error'],
  })
}

let prismaInstance: PrismaClient

try {
  prismaInstance = globalForPrisma.prisma ?? createPrismaClient()
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance
  }
} catch (error: any) {
  console.error('Error crítico inicializando Prisma:', error)
  if (process.env.NODE_ENV === 'development') {
    console.warn('Usando cliente Prisma mock debido a error de inicialización')
    prismaInstance = {} as PrismaClient
  } else {
    throw error
  }
}

export const prisma = prismaInstance
