import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mysql from 'mysql2/promise';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

const prismaClientsCache = new Map<string, PrismaClient>();

function getBaseConnectionConfig() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida en las variables de entorno');
  }

  const url = new URL(connectionString);
  return {
    host: url.hostname,
    port: parseInt(url.port || '3306', 10),
    user: url.username,
    password: decodeURIComponent(url.password || ''),
    database: url.pathname.replace(/^\//, ''),
  };
}

export function getEntityDatabaseName(entityId: string): string {
  const normalizedId = entityId
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .substring(0, 50);

  return `asis_medical_${normalizedId}`;
}

function buildDatabaseUrl(databaseName: string): string {
  const baseConfig = getBaseConnectionConfig();
  return `mysql://${baseConfig.user}:${encodeURIComponent(baseConfig.password)}@${baseConfig.host}:${baseConfig.port}/${databaseName}`;
}

function createAdapter(databaseName: string) {
  const baseConfig = getBaseConnectionConfig();
  return new PrismaMariaDb({
    host: baseConfig.host,
    port: baseConfig.port,
    user: baseConfig.user,
    password: baseConfig.password,
    database: databaseName,
    connectionLimit: 10,
  });
}

async function getAdminConnection() {
  const baseConfig = getBaseConnectionConfig();
  return mysql.createConnection({
    host: baseConfig.host,
    port: baseConfig.port,
    user: baseConfig.user,
    password: baseConfig.password,
    multipleStatements: true,
  });
}

async function pushSchemaToDatabase(databaseName: string): Promise<void> {
  const databaseUrl = buildDatabaseUrl(databaseName);
  const prismaSchemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

  if (!fs.existsSync(prismaSchemaPath)) {
    throw new Error(`No se encontró schema.prisma en ${prismaSchemaPath}`);
  }

  console.log(`[pushSchemaToDatabase] Aplicando schema vacío a ${databaseName}`);

  const quotedSchema = `"${prismaSchemaPath.replace(/"/g, '')}"`;
  const { stdout, stderr } = await execAsync(
    `npx prisma db push --schema=${quotedSchema} --accept-data-loss`,
    {
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
      windowsHide: true,
      maxBuffer: 20 * 1024 * 1024,
    }
  );
  if (stdout?.trim()) console.log(stdout);
  if (stderr?.trim()) console.error(stderr);

  console.log(`[pushSchemaToDatabase] ✅ Schema aplicado en ${databaseName}`);
}

async function databaseExists(
  conn: mysql.Connection,
  databaseName: string
): Promise<boolean> {
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?`,
    [databaseName]
  );
  return rows.length > 0;
}

export async function createEntityDatabase(
  entityId: string,
  options: { fresh?: boolean } = { fresh: true }
): Promise<{ success: boolean; databaseName: string; error?: string }> {
  const databaseName = getEntityDatabaseName(entityId);
  const fresh = options.fresh !== false;

  try {
    console.log(
      `[createEntityDatabase] Provisionando BD MySQL para entidad ${entityId}: ${databaseName} (fresh=${fresh})`
    );

    const conn = await getAdminConnection();
    try {
      const exists = await databaseExists(conn, databaseName);

      if (exists && fresh) {
        console.log(
          `[createEntityDatabase] BD existente → reinicio en ceros: ${databaseName}`
        );
        await conn.query(`DROP DATABASE IF EXISTS \`${databaseName}\``);
        prismaClientsCache.delete(entityId);
      }

      const stillExists = await databaseExists(conn, databaseName);
      if (!stillExists) {
        await conn.query(
          `CREATE DATABASE \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );
        console.log(
          `[createEntityDatabase] ✅ Base de datos ${databaseName} creada vacía`
        );
      } else {
        console.log(
          `[createEntityDatabase] La base de datos ${databaseName} ya existe (sin recrear)`
        );
      }
    } finally {
      await conn.end();
    }

    await pushSchemaToDatabase(databaseName);
    return { success: true, databaseName };
  } catch (error: any) {
    console.error(
      `[createEntityDatabase] Error creando base de datos para entidad ${entityId}:`,
      error
    );
    return {
      success: false,
      databaseName,
      error: error.message || 'Error desconocido al crear la base de datos',
    };
  }
}

export function clearPrismaClientCache(entityId?: string) {
  if (entityId) {
    prismaClientsCache.delete(entityId);
    return;
  }
  prismaClientsCache.clear();
}

export function getPrismaClientForEntity(entityId: string): PrismaClient {
  if (prismaClientsCache.has(entityId)) {
    return prismaClientsCache.get(entityId)!;
  }

  const databaseName = getEntityDatabaseName(entityId);
  const adapter = createAdapter(databaseName);
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  prismaClientsCache.set(entityId, client);
  return client;
}

export function getPrismaClient(entityId?: string | null): PrismaClient {
  if (!entityId) {
    const { prisma } = require('./prisma');
    return prisma;
  }

  return getPrismaClientForEntity(entityId);
}

const patientDiffColumnsReady = new Set<string>();

const PATIENT_DIFF_COLUMNS = [
  'orientacion_sexual',
  'religion',
  'consumo_spa',
  'gestacion',
  'habitante_calle',
  'resguardo_indigena',
  'victima_conflicto',
  'minas_antipersona',
  'minas_municion_sin_explotar',
  'desplazado',
  'ruv',
  'victima_maltrato',
  'abandono_social',
  'carcelario',
  'poblacion_lgbti',
  'desempleado',
  'mujer_con_nino_menor_un_anio',
  'adulto_mayor',
  'migrante',
  'desescolarizado',
  'trabajadora_sexual',
] as const;

async function addColumnIfMissing(
  conn: mysql.Connection,
  table: string,
  column: string,
  definition: string
) {
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  if (rows.length === 0) {
    await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
  }
}

export async function ensurePatientDifferentialColumns(
  entityId: string
): Promise<{ success: boolean; error?: string }> {
  if (patientDiffColumnsReady.has(entityId)) {
    return { success: true };
  }

  const databaseName = getEntityDatabaseName(entityId);
  const baseConfig = getBaseConnectionConfig();
  const conn = await mysql.createConnection({
    host: baseConfig.host,
    port: baseConfig.port,
    user: baseConfig.user,
    password: baseConfig.password,
    database: databaseName,
  });

  try {
    const [tables] = await conn.query<mysql.RowDataPacket[]>(
      `SELECT TABLE_NAME FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'patients' LIMIT 1`,
      [databaseName]
    );
    if (!tables.length) {
      return {
        success: false,
        error: 'La tabla patients no existe en la BD de la institución',
      };
    }

    for (const col of PATIENT_DIFF_COLUMNS) {
      await addColumnIfMissing(conn, 'patients', col, 'TEXT NULL');
    }

    patientDiffColumnsReady.add(entityId);
    return { success: true };
  } catch (error: any) {
    console.error(`[ensurePatientDifferentialColumns] Error:`, error);
    return {
      success: false,
      error: error.message || 'No se pudieron crear columnas de enfoque diferencial',
    };
  } finally {
    await conn.end().catch(() => {});
  }
}

export async function ensureEntityIncrementalTables(
  entityId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // En MySQL fresco, el schema completo ya viene de db push.
    // Solo aseguramos columnas diferenciales de patients.
    const diff = await ensurePatientDifferentialColumns(entityId);
    clearPrismaClientCache(entityId);
    return diff.success
      ? { success: true }
      : { success: false, error: diff.error };
  } catch (error: any) {
    console.error(`[ensureEntityIncrementalTables] Error:`, error);
    return {
      success: false,
      error:
        error.message ||
        'Error desconocido al crear tablas incrementales de la institución',
    };
  }
}

export async function updateEntityDatabaseSchema(
  entityId: string
): Promise<{ success: boolean; error?: string }> {
  const incremental = await ensureEntityIncrementalTables(entityId);
  if (incremental.success) {
    return incremental;
  }

  try {
    const databaseName = getEntityDatabaseName(entityId);
    console.log(
      `[updateEntityDatabaseSchema] Fallback db push en ${databaseName}`
    );
    await pushSchemaToDatabase(databaseName);
    clearPrismaClientCache(entityId);
    return { success: true };
  } catch (error: any) {
    console.error(`[updateEntityDatabaseSchema] Error:`, error);
    return {
      success: false,
      error:
        incremental.error ||
        error.message ||
        'Error desconocido al actualizar el esquema',
    };
  }
}

export async function dropEntityDatabase(
  entityId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const databaseName = getEntityDatabaseName(entityId);
    console.log(`[dropEntityDatabase] Eliminando base de datos ${databaseName}`);

    const conn = await getAdminConnection();
    try {
      await conn.query(`DROP DATABASE IF EXISTS \`${databaseName}\``);
      prismaClientsCache.delete(entityId);
    } finally {
      await conn.end();
    }
    return { success: true };
  } catch (error: any) {
    console.error(`[dropEntityDatabase] Error:`, error);
    return {
      success: false,
      error: error.message || 'Error desconocido al eliminar la base de datos',
    };
  }
}
