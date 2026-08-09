import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');
  console.log('📝 Este seed solo creará el superusuario. Para datos de prueba, usa el seed anterior.\n');

  // Crear solo el superusuario
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@asismedicare.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Administrador';
  
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword, // Actualizar contraseña si el usuario ya existe
      name: adminName,
      role: UserRole.SUPER_ADMIN,
      status: 'Active',
    },
    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      status: 'Active',
    },
  });

  console.log('✅ Superusuario creado/actualizado:');
  console.log(`   Email: ${adminUser.email}`);
  console.log(`   Nombre: ${adminUser.name}`);
  console.log(`   Rol: ${adminUser.role}`);
  console.log(`   ID: ${adminUser.id}`);
  console.log(`\n📝 Credenciales de acceso:`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Contraseña: ${adminPassword}`);
  console.log('\n⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro.');
  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
