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

const url = new URL(connectionString);
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: url.username,
  password: decodeURIComponent(url.password || ''),
  database: url.pathname.replace(/^\//, ''),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando seed de login (MySQL)...');

  const adminUsername = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@asismedicare.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Administrador Plataforma';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      username: adminUsername,
      password: hashedPassword,
      name: adminName,
      role: UserRole.SUPER_ADMIN,
      status: 'Active',
    },
    create: {
      name: adminName,
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      status: 'Active',
    },
  });

  console.log('Usuario de login creado/actualizado:');
  console.log(`   Usuario: ${adminUser.username}`);
  console.log(`   Email: ${adminUser.email}`);
  console.log(`   Nombre: ${adminUser.name}`);
  console.log(`   Rol: ${adminUser.role}`);
  console.log('');
  console.log('Credenciales:');
  console.log(`   Usuario: ${adminUsername}`);
  console.log(`   Contraseña: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
