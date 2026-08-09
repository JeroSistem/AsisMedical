// Script para limpiar la base de datos dejando solo el superusuario
// Uso: node scripts/clean-database.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('🧹 Iniciando limpieza de la base de datos...\n');

    // Obtener el superusuario antes de eliminar
    const superAdmin = await prisma.user.findFirst({
      where: {
        role: 'SUPER_ADMIN'
      }
    });

    if (!superAdmin) {
      console.log('⚠️  No se encontró un superusuario. Se creará uno nuevo después de la limpieza.');
    } else {
      console.log(`✅ Superusuario encontrado: ${superAdmin.email} (ID: ${superAdmin.id})`);
      console.log('   Este usuario se conservará durante la limpieza.\n');
    }

    // Eliminar en orden para respetar las relaciones (de hijos a padres)
    
    console.log('🗑️  Eliminando documentos médicos...');
    await prisma.medicalDocument.deleteMany({});
    console.log('   ✓ Documentos médicos eliminados');

    console.log('🗑️  Eliminando tratamientos...');
    await prisma.treatment.deleteMany({});
    console.log('   ✓ Tratamientos eliminados');

    console.log('🗑️  Eliminando diagnósticos...');
    await prisma.diagnosis.deleteMany({});
    console.log('   ✓ Diagnósticos eliminados');

    console.log('🗑️  Eliminando historias clínicas...');
    await prisma.medicalRecord.deleteMany({});
    console.log('   ✓ Historias clínicas eliminadas');

    console.log('🗑️  Eliminando valoraciones de triage...');
    await prisma.triageAssessment.deleteMany({});
    console.log('   ✓ Valoraciones de triage eliminadas');

    console.log('🗑️  Eliminando registros de triage...');
    await prisma.triage.deleteMany({});
    console.log('   ✓ Registros de triage eliminados');

    console.log('🗑️  Eliminando admisiones de pacientes...');
    await prisma.patientAdmission.deleteMany({});
    console.log('   ✓ Admisiones eliminadas');

    console.log('🗑️  Eliminando citas...');
    await prisma.appointment.deleteMany({});
    console.log('   ✓ Citas eliminadas');

    console.log('🗑️  Eliminando pacientes...');
    await prisma.patient.deleteMany({});
    console.log('   ✓ Pacientes eliminados');

    console.log('🗑️  Eliminando permisos de usuario...');
    await prisma.userPermission.deleteMany({});
    console.log('   ✓ Permisos de usuario eliminados');

    console.log('🗑️  Eliminando sesiones...');
    await prisma.session.deleteMany({});
    console.log('   ✓ Sesiones eliminadas');

    console.log('🗑️  Eliminando cuentas de autenticación...');
    await prisma.account.deleteMany({});
    console.log('   ✓ Cuentas eliminadas');

    console.log('🗑️  Eliminando tokens de verificación...');
    await prisma.verificationToken.deleteMany({});
    console.log('   ✓ Tokens eliminados');

    // Eliminar usuarios excepto el superusuario
    if (superAdmin) {
      console.log('🗑️  Eliminando usuarios (excepto superusuario)...');
      const deletedUsers = await prisma.user.deleteMany({
        where: {
          id: {
            not: superAdmin.id
          }
        }
      });
      console.log(`   ✓ ${deletedUsers.count} usuarios eliminados`);
    } else {
      console.log('🗑️  Eliminando todos los usuarios...');
      const deletedUsers = await prisma.user.deleteMany({});
      console.log(`   ✓ ${deletedUsers.count} usuarios eliminados`);
    }

    // Eliminar módulos de entidad
    console.log('🗑️  Eliminando módulos de entidad...');
    await prisma.entityModule.deleteMany({});
    console.log('   ✓ Módulos de entidad eliminados');

    // Eliminar configuraciones del sistema (opcional - puedes comentar esto si quieres conservarlas)
    console.log('🗑️  Eliminando configuraciones del sistema...');
    await prisma.systemConfiguration.deleteMany({});
    console.log('   ✓ Configuraciones eliminadas');

    // Eliminar entidades (excepto si están relacionadas con el superusuario)
    console.log('🗑️  Eliminando entidades...');
    if (superAdmin && superAdmin.entityId) {
      // Conservar la entidad del superusuario
      const deletedEntities = await prisma.entity.deleteMany({
        where: {
          id: {
            not: superAdmin.entityId
          }
        }
      });
      console.log(`   ✓ ${deletedEntities.count} entidades eliminadas`);
    } else {
      await prisma.entity.deleteMany({});
      console.log('   ✓ Todas las entidades eliminadas');
    }

    // Eliminar permisos
    console.log('🗑️  Eliminando permisos...');
    await prisma.permission.deleteMany({});
    console.log('   ✓ Permisos eliminados');

    // Eliminar módulos
    console.log('🗑️  Eliminando módulos...');
    await prisma.module.deleteMany({});
    console.log('   ✓ Módulos eliminados');

    console.log('\n✅ Limpieza completada exitosamente!');
    
    if (superAdmin) {
      console.log(`\n👤 Superusuario conservado:`);
      console.log(`   Email: ${superAdmin.email}`);
      console.log(`   Nombre: ${superAdmin.name}`);
      console.log(`   Rol: ${superAdmin.role}`);
    } else {
      console.log('\n⚠️  No hay superusuario. Ejecuta el seed o create-admin-user para crear uno.');
    }

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase()
  .then(() => {
    console.log('\n🎉 Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
