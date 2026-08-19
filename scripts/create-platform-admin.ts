/**
 * Crea/actualiza el SUPER_ADMIN único de plataforma.
 * Credenciales vía env (no hardcodear secretos en el repo):
 *   PLATFORM_ADMIN_USERNAME
 *   PLATFORM_ADMIN_PASSWORD
 *   PLATFORM_ADMIN_EMAIL (opcional)
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcryptjs';

config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local'), override: true });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL no está definida');
}

const username = process.env.PLATFORM_ADMIN_USERNAME;
const password = process.env.PLATFORM_ADMIN_PASSWORD;
const email = (
  process.env.PLATFORM_ADMIN_EMAIL || 'asismedical@platform.local'
).toLowerCase();
const name =
  process.env.PLATFORM_ADMIN_NAME || 'Administrador Principal ASIS Medical';

if (!username || !password) {
  throw new Error(
    'Define PLATFORM_ADMIN_USERNAME y PLATFORM_ADMIN_PASSWORD en .env.local'
  );
}

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

async function main() {
  const hash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { username: { equals: username } },
        { email },
      ],
    },
  });

  let user;
  if (existing) {
    user = await prisma.user.update({
      where: { id: existing.id },
      data: {
        username,
        email,
        name,
        password: hash,
        role: UserRole.SUPER_ADMIN,
        status: 'Active',
        entityId: null,
      },
    });
    console.log('Usuario principal actualizado:', user.username, user.role);
  } else {
    user = await prisma.user.create({
      data: {
        username,
        email,
        name,
        password: hash,
        role: UserRole.SUPER_ADMIN,
        status: 'Active',
      },
    });
    console.log('Usuario principal creado:', user.username, user.role);
  }

  // Desactiva el admin demo débil si existe
  const weak = await prisma.user.findFirst({
    where: {
      OR: [
        { username: { equals: 'admin' } },
        { email: 'admin@asismedicare.com' },
      ],
      NOT: { id: user.id },
    },
  });
  if (weak) {
    await prisma.user.update({
      where: { id: weak.id },
      data: { status: 'Inactive' },
    });
    console.log('Usuario demo admin desactivado:', weak.email);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
