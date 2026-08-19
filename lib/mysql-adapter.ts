import { PrismaMariaDb } from '@prisma/adapter-mariadb';

export type MysqlPoolConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export function mysqlConfigFromUrl(
  connectionString = process.env.DATABASE_URL
): MysqlPoolConfig {
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida');
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

/** Opciones del conector mariadb para MySQL 8.4 (caching_sha2_password). */
export function createMysqlAdapter(
  databaseName?: string,
  connectionLimit = 5
) {
  const cfg = mysqlConfigFromUrl();
  return new PrismaMariaDb({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: databaseName || cfg.database,
    connectionLimit,
    connectTimeout: 8000,
    acquireTimeout: 8000,
    allowPublicKeyRetrieval: true,
  } as never);
}
