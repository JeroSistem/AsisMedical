import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Cache de clientes Prisma por entidad
 */
const prismaClientsCache = new Map<string, PrismaClient>();

/**
 * Obtiene la configuración de conexión base desde DATABASE_URL
 */
function getBaseConnectionConfig() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida en las variables de entorno');
  }

  const url = new URL(connectionString);
  const password = decodeURIComponent(url.password);

  return {
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    user: url.username,
    password: password,
  };
}

/**
 * Genera el nombre de la base de datos para una entidad
 */
function getEntityDatabaseName(entityId: string): string {
  // Normalizar el ID para que sea un nombre de BD válido
  const normalizedId = entityId
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .substring(0, 50); // Limitar longitud
  
  return `asis_medical_${normalizedId}`;
}

/**
 * Crea una nueva base de datos PostgreSQL para una entidad
 */
export async function createEntityDatabase(entityId: string): Promise<{ success: boolean; databaseName: string; error?: string }> {
  try {
    const baseConfig = getBaseConnectionConfig();
    const databaseName = getEntityDatabaseName(entityId);

    console.log(`[createEntityDatabase] Creando base de datos para entidad ${entityId}: ${databaseName}`);

    // Conectar a la BD por defecto (postgres) para crear la nueva BD
    const adminPool = new Pool({
      host: baseConfig.host,
      port: baseConfig.port,
      user: baseConfig.user,
      password: baseConfig.password,
      database: 'postgres', // Conectar a la BD por defecto
    });

    try {
      // Verificar si la BD ya existe
      const checkResult = await adminPool.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [databaseName]
      );

      if (checkResult.rows.length > 0) {
        console.log(`[createEntityDatabase] La base de datos ${databaseName} ya existe`);
        await adminPool.end();
        return { success: true, databaseName };
      }

      // Crear la base de datos
      await adminPool.query(`CREATE DATABASE "${databaseName}"`);
      console.log(`[createEntityDatabase] ✅ Base de datos ${databaseName} creada exitosamente`);

      await adminPool.end();

      // Ejecutar migraciones en la nueva base de datos
      await runMigrationsForDatabase(databaseName);

      return { success: true, databaseName };
    } catch (error: any) {
      await adminPool.end();
      throw error;
    }
  } catch (error: any) {
    console.error(`[createEntityDatabase] Error creando base de datos para entidad ${entityId}:`, error);
    return {
      success: false,
      databaseName: getEntityDatabaseName(entityId),
      error: error.message || 'Error desconocido al crear la base de datos',
    };
  }
}

/**
 * Ejecuta las migraciones de Prisma en una base de datos específica
 */
async function runMigrationsForDatabase(databaseName: string): Promise<void> {
  try {
    const baseConfig = getBaseConnectionConfig();
    
    // Construir la nueva DATABASE_URL para esta BD
    const newDatabaseUrl = `postgresql://${baseConfig.user}:${encodeURIComponent(baseConfig.password)}@${baseConfig.host}:${baseConfig.port}/${databaseName}`;

    console.log(`[runMigrationsForDatabase] Ejecutando migraciones para ${databaseName}`);

    // Ejecutar prisma migrate deploy usando la nueva URL
    // Nota: Esto requiere que Prisma esté instalado y disponible
    const prismaSchemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    
    if (!fs.existsSync(prismaSchemaPath)) {
      console.warn(`[runMigrationsForDatabase] No se encontró schema.prisma en ${prismaSchemaPath}`);
      // Intentar generar el cliente y ejecutar las migraciones manualmente
      await deployMigrationsManually(newDatabaseUrl);
      return;
    }

    // Usar prisma migrate deploy para aplicar migraciones
    try {
      execSync(`npx prisma migrate deploy --schema=${prismaSchemaPath}`, {
        env: {
          ...process.env,
          DATABASE_URL: newDatabaseUrl,
        },
        stdio: 'inherit',
      });
      console.log(`[runMigrationsForDatabase] ✅ Migraciones aplicadas para ${databaseName}`);
    } catch (execError: any) {
      console.warn(`[runMigrationsForDatabase] Error ejecutando migrate deploy, intentando deploy manual:`, execError.message);
      await deployMigrationsManually(newDatabaseUrl);
    }
  } catch (error: any) {
    console.error(`[runMigrationsForDatabase] Error ejecutando migraciones para ${databaseName}:`, error);
    throw error;
  }
}

/**
 * Aplica las migraciones manualmente usando SQL directo
 */
async function deployMigrationsManually(databaseUrl: string): Promise<void> {
  try {
    const pool = new Pool({ connectionString: databaseUrl });
    
    // Verificar y eliminar tablas antiguas si existen (para migración)
    const dropOldTablesSQL = `
      DROP TABLE IF EXISTS "EntityModule" CASCADE;
      DROP TABLE IF EXISTS "Module" CASCADE;
      DROP TABLE IF EXISTS "User" CASCADE;
      DROP TABLE IF EXISTS "Entity" CASCADE;
      DROP TABLE IF EXISTS "Patient" CASCADE;
      DROP TABLE IF EXISTS "SystemConfiguration" CASCADE;
    `;
    
    try {
      await pool.query(dropOldTablesSQL);
      console.log('[deployMigrationsManually] Tablas antiguas eliminadas si existían');
    } catch (dropError: any) {
      // Ignorar errores al eliminar tablas que no existen
      console.log('[deployMigrationsManually] No había tablas antiguas para eliminar');
    }
    
    // Leer el schema de Prisma y ejecutar las sentencias SQL necesarias
    // Por ahora, creamos las tablas básicas necesarias
    const createTablesSQL = `
      -- Tablas básicas del sistema
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "status" TEXT NOT NULL DEFAULT 'Active',
        "entity_id" TEXT,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "last_login" TIMESTAMP(3),
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "entities" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "type" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "admin_user_id" TEXT,
        "database_name" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "modules" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "status" TEXT NOT NULL DEFAULT 'ENABLED',
        "config" JSONB,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "entity_modules" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "entity_id" TEXT NOT NULL,
        "module_id" TEXT NOT NULL,
        "enabled" BOOLEAN NOT NULL DEFAULT true,
        "config" JSONB,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("entity_id", "module_id"),
        CONSTRAINT "entity_modules_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );

      CREATE TABLE IF NOT EXISTS "patients" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "document_type" TEXT,
        "document_number" TEXT UNIQUE,
        "country_of_issue" TEXT,
        "first_name" TEXT NOT NULL,
        "last_name" TEXT NOT NULL,
        "second_last_name" TEXT,
        "date_of_birth" TIMESTAMP(3) NOT NULL,
        "age" INTEGER NOT NULL,
        "gender" TEXT NOT NULL,
        "marital_status" TEXT,
        "blood_type" TEXT,
        "occupation" TEXT,
        "mobile_phone" TEXT,
        "landline_phone" TEXT,
        "email" TEXT,
        "contact_preference" TEXT,
        "notifications_consent" BOOLEAN DEFAULT true,
        "address" TEXT,
        "city" TEXT,
        "department" TEXT,
        "country" TEXT DEFAULT 'Colombia',
        "postal_code" TEXT,
        "neighborhood" TEXT,
        "emergency_contact_name" TEXT,
        "emergency_contact_phone" TEXT,
        "emergency_contact_relationship" TEXT,
        "legal_representative_name" TEXT,
        "legal_representative_document" TEXT,
        "legal_representative_phone" TEXT,
        "legal_representative_relationship" TEXT,
        "insurance_provider" TEXT,
        "insurance_number" TEXT,
        "allergies" TEXT,
        "active_problems" TEXT,
        "initial_observations" TEXT,
        "create_admission" BOOLEAN DEFAULT false,
        "admission_date" TIMESTAMP(3),
        "admission_type" TEXT,
        "status" TEXT DEFAULT 'ACTIVE',
        "data_processing_consent" BOOLEAN DEFAULT false,
        "medical_consent" BOOLEAN DEFAULT false,
        "privacy_consent" BOOLEAN DEFAULT false,
        "communication_consent" BOOLEAN DEFAULT false,
        "entity_id" TEXT,
        "avatar_url" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS "patients_document_number_idx" ON "patients"("document_number");
      CREATE INDEX IF NOT EXISTS "patients_email_idx" ON "patients"("email");
      CREATE INDEX IF NOT EXISTS "patients_entity_id_idx" ON "patients"("entity_id");
      CREATE INDEX IF NOT EXISTS "patients_created_at_idx" ON "patients"("created_at");

      CREATE TABLE IF NOT EXISTS "system_configurations" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL,
        "category" TEXT NOT NULL DEFAULT 'general',
        "value" JSONB NOT NULL,
        "description" TEXT,
        "entity_id" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("key", "entity_id")
      );

      CREATE INDEX IF NOT EXISTS "users_entity_id_idx" ON "users"("entity_id");
      CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
      CREATE INDEX IF NOT EXISTS "entity_modules_entity_id_idx" ON "entity_modules"("entity_id");
      CREATE INDEX IF NOT EXISTS "entity_modules_module_id_idx" ON "entity_modules"("module_id");
      CREATE INDEX IF NOT EXISTS "system_configurations_entity_id_idx" ON "system_configurations"("entity_id");
      CREATE INDEX IF NOT EXISTS "system_configurations_category_idx" ON "system_configurations"("category");
      CREATE INDEX IF NOT EXISTS "system_configurations_key_idx" ON "system_configurations"("key");
      CREATE INDEX IF NOT EXISTS "entities_status_idx" ON "entities"("status");
    `;

    await pool.query(createTablesSQL);
    await pool.end();
    
    console.log(`[deployMigrationsManually] ✅ Tablas creadas manualmente`);
  } catch (error: any) {
    console.error(`[deployMigrationsManually] Error creando tablas manualmente:`, error);
    throw error;
  }
}

/**
 * Obtiene un cliente Prisma específico para una entidad
 */
export function getPrismaClientForEntity(entityId: string): PrismaClient {
  // Si ya existe en el cache, retornarlo
  if (prismaClientsCache.has(entityId)) {
    return prismaClientsCache.get(entityId)!;
  }

  const baseConfig = getBaseConnectionConfig();
  const databaseName = getEntityDatabaseName(entityId);

  // Construir la connection string para esta entidad
  const connectionString = `postgresql://${baseConfig.user}:${encodeURIComponent(baseConfig.password)}@${baseConfig.host}:${baseConfig.port}/${databaseName}`;

  // Crear el pool para esta entidad
  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // Crear el adapter y cliente Prisma
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  // Guardar en cache
  prismaClientsCache.set(entityId, client);

  return client;
}

/**
 * Obtiene el cliente Prisma para la entidad del usuario actual o la BD principal
 */
export function getPrismaClient(entityId?: string | null): PrismaClient {
  // Si no hay entityId, usar la BD principal (para SUPER_ADMIN y sistema)
  if (!entityId) {
    // Importar dinámicamente para evitar dependencias circulares
    const { prisma } = require('./prisma');
    return prisma;
  }

  return getPrismaClientForEntity(entityId);
}

/**
 * Actualiza el esquema de una base de datos de entidad existente
 */
export async function updateEntityDatabaseSchema(entityId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const baseConfig = getBaseConnectionConfig();
    const databaseName = getEntityDatabaseName(entityId);

    console.log(`[updateEntityDatabaseSchema] Actualizando esquema de base de datos ${databaseName}`);

    // Construir la DATABASE_URL para esta BD
    const databaseUrl = `postgresql://${baseConfig.user}:${encodeURIComponent(baseConfig.password)}@${baseConfig.host}:${baseConfig.port}/${databaseName}`;

    // Ejecutar las migraciones manualmente
    await deployMigrationsManually(databaseUrl);

    console.log(`[updateEntityDatabaseSchema] ✅ Esquema actualizado para ${databaseName}`);
    return { success: true };
  } catch (error: any) {
    console.error(`[updateEntityDatabaseSchema] Error actualizando esquema:`, error);
    return {
      success: false,
      error: error.message || 'Error desconocido al actualizar el esquema',
    };
  }
}

/**
 * Elimina una base de datos de entidad
 */
export async function dropEntityDatabase(entityId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const baseConfig = getBaseConnectionConfig();
    const databaseName = getEntityDatabaseName(entityId);

    console.log(`[dropEntityDatabase] Eliminando base de datos ${databaseName}`);

    // Cerrar todas las conexiones activas primero
    const adminPool = new Pool({
      host: baseConfig.host,
      port: baseConfig.port,
      user: baseConfig.user,
      password: baseConfig.password,
      database: 'postgres',
    });

    try {
      // Terminar todas las conexiones activas a la BD
      await adminPool.query(
        `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()`,
        [databaseName]
      );

      // Eliminar la base de datos
      await adminPool.query(`DROP DATABASE IF EXISTS "${databaseName}"`);
      console.log(`[dropEntityDatabase] ✅ Base de datos ${databaseName} eliminada`);

      // Eliminar del cache
      prismaClientsCache.delete(entityId);

      await adminPool.end();
      return { success: true };
    } catch (error: any) {
      await adminPool.end();
      throw error;
    }
  } catch (error: any) {
    console.error(`[dropEntityDatabase] Error eliminando base de datos para entidad ${entityId}:`, error);
    return {
      success: false,
      error: error.message || 'Error desconocido al eliminar la base de datos',
    };
  }
}
