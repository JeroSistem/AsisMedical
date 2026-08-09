import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

function createPrismaClient() {
  try {
    // Crear el pool de conexiones de PostgreSQL (singleton)
    let connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL no está definida en las variables de entorno')
    }

    // Parsear la URL para extraer componentes individuales
    // Esto ayuda a manejar mejor las contraseñas con caracteres especiales como @@
    try {
      const url = new URL(connectionString)
      const password = decodeURIComponent(url.password)
      
      // Log en desarrollo para debugging (sin mostrar la contraseña completa)
      if (process.env.NODE_ENV === 'development') {
        console.log('[Prisma] Configurando conexión:', {
          host: url.hostname,
          port: parseInt(url.port) || 5432,
          database: url.pathname.slice(1),
          user: url.username,
          passwordLength: password.length,
          passwordStartsWith: password.substring(0, 2),
        })
      }
      
      // Usar configuración individual para mejor manejo de contraseñas especiales
      const poolConfig = {
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1), // Remover el '/' inicial
        user: url.username,
        password: password, // Contraseña decodificada directamente
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000, // Aumentar timeout
      }

      const pool =
        globalForPrisma.pool ??
        new Pool(poolConfig)
      
      // Probar la conexión inmediatamente para detectar errores temprano
      if (process.env.NODE_ENV === 'development') {
        pool.on('error', (err) => {
          console.error('[Prisma Pool] Error inesperado:', err)
        })
        
        pool.on('connect', () => {
          console.log('[Prisma Pool] Conexión establecida')
        })
      }

      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.pool = pool
      }

      // Crear el adapter de Prisma
      const adapter = new PrismaPg(pool)

      // Crear el cliente de Prisma
      const client = new PrismaClient({
        adapter,
        // Evitar log 'error' en console: Next 15 lo convierte en overlay rojo aunque el catch lo maneje
        log: process.env.NODE_ENV === 'development' ? ['warn'] : ['error'],
      })

      return client
    } catch (parseError) {
      // Si falla el parseo, usar connectionString directamente como fallback
      console.warn('Error parseando DATABASE_URL, usando connectionString directamente:', parseError)
      
      const pool =
        globalForPrisma.pool ??
        new Pool({ 
          connectionString,
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        })

      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.pool = pool
      }

      const adapter = new PrismaPg(pool)

      const client = new PrismaClient({
        adapter,
        // Evitar log 'error' en console: Next 15 lo convierte en overlay rojo aunque el catch lo maneje
        log: process.env.NODE_ENV === 'development' ? ['warn'] : ['error'],
      })

      return client
    }
  } catch (error) {
    console.error('Error creando cliente de Prisma:', error)
    throw error
  }
}

// Crear el cliente de Prisma (singleton) con manejo de errores mejorado
let prismaInstance: PrismaClient;

try {
  prismaInstance = globalForPrisma.prisma ?? createPrismaClient();
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
} catch (error: any) {
  console.error('Error crítico inicializando Prisma:', error);
  // En desarrollo, crear un cliente mock para evitar que la app se rompa completamente
  if (process.env.NODE_ENV === 'development') {
    console.warn('Usando cliente Prisma mock debido a error de inicialización');
    prismaInstance = {} as PrismaClient;
  } else {
    throw error; // En producción, lanzar el error
  }
}

export const prisma = prismaInstance;
