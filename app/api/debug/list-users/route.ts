import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPrismaClient } from '@/lib/database-manager';

/**
 * Lista todos los usuarios de la base de datos principal y de todas las entidades
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const results: any = {
      mainDatabase: [],
      entityDatabases: [],
      total: 0,
    };

    // 1. Obtener usuarios de la BD principal
    const mainUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        entityId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    results.mainDatabase = mainUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      entityId: user.entityId,
      database: 'main',
      createdAt: user.createdAt.toISOString(),
    }));

    // 2. Obtener todas las entidades y sus usuarios
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
            status: true,
            entityId: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        if (entityUsers.length > 0) {
          results.entityDatabases.push({
            entityId: entity.id,
            entityName: entity.name,
            databaseName: entity.databaseName,
            users: entityUsers.map(user => ({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              status: user.status,
              entityId: user.entityId,
              database: `entity_${entity.id}`,
              createdAt: user.createdAt.toISOString(),
            })),
          });
        }
      } catch (error: any) {
        console.error(`[listUsers] Error obteniendo usuarios de entidad ${entity.name}:`, error.message);
        results.entityDatabases.push({
          entityId: entity.id,
          entityName: entity.name,
          databaseName: entity.databaseName,
          error: error.message,
          users: [],
        });
      }
    }

    // Calcular total
    results.total = results.mainDatabase.length + 
      results.entityDatabases.reduce((sum: number, entity: any) => sum + (entity.users?.length || 0), 0);

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('[listUsers] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
