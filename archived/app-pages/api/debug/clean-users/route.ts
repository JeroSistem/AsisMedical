import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPrismaClient } from '@/lib/database-manager';

/**
 * Elimina todos los usuarios excepto el SUPER_ADMIN de todas las bases de datos
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session?.user as any)?.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Solo el SUPER_ADMIN puede ejecutar esta acción' },
        { status: 403 }
      );
    }

    const results: any = {
      mainDatabase: {
        deleted: 0,
        kept: 0,
        keptUsers: [],
      },
      entityDatabases: [],
      errors: [],
    };

    // 1. Eliminar usuarios de la BD principal (excepto SUPER_ADMIN)
    try {
      const mainUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      const superAdminUsers = mainUsers.filter(u => u.role === 'SUPER_ADMIN');
      const usersToDelete = mainUsers.filter(u => u.role !== 'SUPER_ADMIN');

      // Eliminar usuarios que no son SUPER_ADMIN
      for (const user of usersToDelete) {
        try {
          await prisma.user.delete({
            where: { id: user.id },
          });
          results.mainDatabase.deleted++;
          console.log(`[cleanUsers] ✅ Usuario eliminado de BD principal: ${user.email}`);
        } catch (error: any) {
          results.errors.push(`Error eliminando usuario ${user.email} de BD principal: ${error.message}`);
          console.error(`[cleanUsers] ❌ Error eliminando usuario ${user.email}:`, error.message);
        }
      }

      results.mainDatabase.kept = superAdminUsers.length;
      results.mainDatabase.keptUsers = superAdminUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
      }));
    } catch (error: any) {
      results.errors.push(`Error procesando BD principal: ${error.message}`);
      console.error('[cleanUsers] Error procesando BD principal:', error);
    }

    // 2. Obtener todas las entidades y eliminar usuarios de sus bases de datos
    const allEntities = await prisma.entity.findMany({
      select: {
        id: true,
        name: true,
        databaseName: true,
      },
    });

    for (const entity of allEntities) {
      try {
        const entityPrisma = getPrismaClient(entity.id);
        const entityUsers = await entityPrisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });

        const superAdminUsersEntity = entityUsers.filter(u => u.role === 'SUPER_ADMIN');
        const usersToDeleteEntity = entityUsers.filter(u => u.role !== 'SUPER_ADMIN');

        let deletedCount = 0;
        const keptUsers: any[] = [];

        // Eliminar usuarios que no son SUPER_ADMIN
        for (const user of usersToDeleteEntity) {
          try {
            await entityPrisma.user.delete({
              where: { id: user.id },
            });
            deletedCount++;
            console.log(`[cleanUsers] ✅ Usuario eliminado de entidad ${entity.name}: ${user.email}`);
          } catch (error: any) {
            results.errors.push(`Error eliminando usuario ${user.email} de entidad ${entity.name}: ${error.message}`);
            console.error(`[cleanUsers] ❌ Error eliminando usuario ${user.email} de ${entity.name}:`, error.message);
          }
        }

        keptUsers.push(...superAdminUsersEntity.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
        })));

        results.entityDatabases.push({
          entityId: entity.id,
          entityName: entity.name,
          deleted: deletedCount,
          kept: superAdminUsersEntity.length,
          keptUsers,
        });
      } catch (error: any) {
        results.entityDatabases.push({
          entityId: entity.id,
          entityName: entity.name,
          error: error.message,
          deleted: 0,
          kept: 0,
        });
        results.errors.push(`Error procesando entidad ${entity.name}: ${error.message}`);
        console.error(`[cleanUsers] Error procesando entidad ${entity.name}:`, error);
      }
    }

    const totalDeleted = results.mainDatabase.deleted + 
      results.entityDatabases.reduce((sum: number, e: any) => sum + (e.deleted || 0), 0);
    const totalKept = results.mainDatabase.kept + 
      results.entityDatabases.reduce((sum: number, e: any) => sum + (e.kept || 0), 0);

    console.log(`[cleanUsers] ✅ Limpieza completada: ${totalDeleted} usuarios eliminados, ${totalKept} SUPER_ADMIN mantenidos`);

    return NextResponse.json({
      success: true,
      message: `Se eliminaron ${totalDeleted} usuario(s). Se mantuvieron ${totalKept} usuario(s) SUPER_ADMIN.`,
      data: {
        ...results,
        summary: {
          totalDeleted,
          totalKept,
        },
      },
    });
  } catch (error: any) {
    console.error('[cleanUsers] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
