/**
 * Elimina todos los usuarios excepto el SUPER_ADMIN principal (PLATFORM_ADMIN_*).
 * Uso: npm run db:keep-platform-admin
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mysql from 'mysql2/promise';

config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local'), override: true });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL no está definida');
}

const username = (process.env.PLATFORM_ADMIN_USERNAME || 'AsisMedical').toLowerCase();

const url = new URL(connectionString);
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    database: url.pathname.replace(/^\//, ''),
    user: url.username,
    password: decodeURIComponent(url.password || ''),
  }),
});

async function cleanTenantDatabases() {
  const conn = await mysql.createConnection({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: url.username,
    password: decodeURIComponent(url.password || ''),
  });

  try {
    const [rows] = await conn.query<mysql.RowDataPacket[]>(
      `SHOW DATABASES LIKE 'asis_medical\\_%'`
    );

    for (const row of rows) {
      const dbName = Object.values(row)[0] as string;
      console.log(`  Limpiando usuarios en ${dbName}...`);
      try {
        await conn.query(`USE \`${dbName}\``);
        await conn.query(`DELETE FROM sessions`);
        await conn.query(`DELETE FROM accounts`);
        await conn.query(`DELETE FROM user_permissions`);
        await conn.query(`DELETE FROM users`);
        console.log(`  ✓ ${dbName}: usuarios eliminados`);
      } catch (err: any) {
        console.warn(`  ⚠ ${dbName}: ${err.message}`);
      }
    }
  } finally {
    await conn.end();
  }
}

async function main() {
  const principal = await prisma.user.findFirst({
    where: { username: { equals: username } },
  });

  if (!principal) {
    throw new Error(
      `No existe el usuario principal "${username}". Ejecuta: npm run db:create-platform-admin`
    );
  }

  console.log(`Conservando usuario principal: ${principal.username} (${principal.email})`);

  const others = await prisma.user.findMany({
    where: { id: { not: principal.id } },
    select: { id: true, username: true, email: true, role: true },
  });

  if (others.length === 0) {
    console.log('No hay otros usuarios en la BD principal.');
  } else {
    console.log(`Eliminando ${others.length} usuario(s) de asis_medical:`);
    for (const u of others) {
      console.log(`  - ${u.username || '(sin username)'} / ${u.email} [${u.role}]`);
    }

    await prisma.userPermission.deleteMany({
      where: { userId: { not: principal.id } },
    });
    await prisma.session.deleteMany({
      where: { userId: { not: principal.id } },
    });
    await prisma.account.deleteMany({
      where: { userId: { not: principal.id } },
    });
    await prisma.entity.updateMany({
      where: { adminUserId: { not: principal.id } },
      data: { adminUserId: null },
    });
    const deleted = await prisma.user.deleteMany({
      where: { id: { not: principal.id } },
    });
    console.log(`✓ ${deleted.count} usuario(s) eliminado(s) de la BD principal`);
  }

  console.log('\nBDs por institución (tenant):');
  await cleanTenantDatabases();

  console.log('\n✅ Solo queda el usuario principal SUPER_ADMIN.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
