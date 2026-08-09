import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Pool } from 'pg';
import { dropEntityDatabase } from '@/lib/database-manager';

/**
 * Limpia todos los datos de la base de datos principal y elimina todas las bases de datos de entidades
 * PERO mantiene la estructura de las tablas
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
      mainDatabase: {},
      entityDatabases: [],
      errors: [],
    };

    // 1. Obtener todas las entidades antes de eliminarlas
    const allEntities = await prisma.entity.findMany({
      select: {
        id: true,
        name: true,
        databaseName: true,
      },
    });

    // 2. Eliminar todas las bases de datos de entidades
    console.log(`[cleanAllData] Eliminando ${allEntities.length} bases de datos de entidades...`);
    for (const entity of allEntities) {
      try {
        const dropResult = await dropEntityDatabase(entity.id);
        if (dropResult.success) {
          results.entityDatabases.push({
            entityId: entity.id,
            entityName: entity.name,
            success: true,
          });
          console.log(`[cleanAllData] ✅ BD eliminada para entidad ${entity.name}`);
        } else {
          results.entityDatabases.push({
            entityId: entity.id,
            entityName: entity.name,
            success: false,
            error: dropResult.error,
          });
          results.errors.push(`Error eliminando BD de ${entity.name}: ${dropResult.error}`);
        }
      } catch (error: any) {
        results.entityDatabases.push({
          entityId: entity.id,
          entityName: entity.name,
          success: false,
          error: error.message,
        });
        results.errors.push(`Error eliminando BD de ${entity.name}: ${error.message}`);
      }
    }

    // 3. Limpiar datos de la base de datos principal usando SQL directo
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL no está definida');
    }

    const pool = new Pool({ connectionString });

    try {
      // Desactivar temporalmente las foreign keys para poder eliminar en cualquier orden
      await pool.query('SET session_replication_role = replica;');

      // Eliminar datos de todas las tablas (en orden inverso de dependencias)
      const tablesToClean = [
        'user_permissions',
        'permissions',
        'entity_modules',
        'system_configurations',
        'patients',
        'users',
        'entities',
        'modules',
      ];

      const cleanResults: any = {};
      
      for (const table of tablesToClean) {
        try {
          const result = await pool.query(`DELETE FROM "${table}";`);
          cleanResults[table] = {
            success: true,
            deletedRows: result.rowCount || 0,
          };
          console.log(`[cleanAllData] ✅ Limpiada tabla ${table}: ${result.rowCount || 0} filas eliminadas`);
        } catch (error: any) {
          cleanResults[table] = {
            success: false,
            error: error.message,
          };
          results.errors.push(`Error limpiando tabla ${table}: ${error.message}`);
          console.error(`[cleanAllData] ❌ Error limpiando tabla ${table}:`, error.message);
        }
      }

      // Reactivar las foreign keys
      await pool.query('SET session_replication_role = DEFAULT;');

      results.mainDatabase = cleanResults;

      await pool.end();

      console.log('[cleanAllData] ✅ Limpieza completada');

      return NextResponse.json({
        success: true,
        message: 'Todos los datos han sido eliminados. Las tablas se mantienen intactas.',
        results,
      });
    } catch (error: any) {
      await pool.end();
      throw error;
    }
  } catch (error: any) {
    console.error('[cleanAllData] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
