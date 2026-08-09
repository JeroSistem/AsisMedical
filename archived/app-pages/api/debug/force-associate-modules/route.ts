import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPrismaClient } from '@/lib/database-manager';
import { prisma } from '@/lib/prisma';
import { initializeModules } from '@/lib/actions/modules';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    const userEntityId = (session.user as any)?.entityId;

    if (!userEntityId) {
      return NextResponse.json(
        { success: false, error: 'Usuario sin entityId' },
        { status: 400 }
      );
    }

    // Asegurar que los módulos existan en la BD principal
    await initializeModules();

    // Obtener todos los módulos de la BD principal
    const allModules = await prisma.module.findMany();

    // Obtener cliente Prisma de la entidad
    const entityPrisma = getPrismaClient(userEntityId);

    // Copiar módulos a la BD de la entidad
    const moduleIdMap = new Map<string, string>();
    for (const module of allModules) {
      const entityModule = await entityPrisma.module.upsert({
        where: { name: module.name },
        update: {
          description: module.description,
          status: 'ENABLED',
        },
        create: {
          name: module.name,
          description: module.description,
          status: 'ENABLED',
        },
      });
      moduleIdMap.set(module.name, entityModule.id);
    }

    // Asociar TODOS los módulos como habilitados
    let associatedCount = 0;
    for (const module of allModules) {
      const entityModuleId = moduleIdMap.get(module.name);
      if (entityModuleId) {
        await entityPrisma.entityModule.upsert({
          where: {
            entityId_moduleId: {
              entityId: userEntityId,
              moduleId: entityModuleId,
            },
          },
          update: {
            enabled: true,
          },
          create: {
            entityId: userEntityId,
            moduleId: entityModuleId,
            enabled: true,
          },
        });
        associatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Se asociaron ${associatedCount} módulos a la entidad`,
      data: {
        entityId: userEntityId,
        associatedCount,
        modules: allModules.map(m => m.name),
      },
    });
  } catch (error: any) {
    console.error('[API] Error forzando asociación de módulos:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
