const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('@prisma/client');

function mysqlConfigFromUrl(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida');
  }
  const url = new URL(connectionString);
  return {
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: url.username,
    password: decodeURIComponent(url.password || ''),
    database: url.pathname.replace(/^\//, ''),
  };
}

function createMysqlPrisma(connectionString = process.env.DATABASE_URL) {
  const cfg = mysqlConfigFromUrl(connectionString);
  return new PrismaClient({
    adapter: new PrismaMariaDb({
      ...cfg,
      connectionLimit: 10,
    }),
  });
}

module.exports = { mysqlConfigFromUrl, createMysqlPrisma };
