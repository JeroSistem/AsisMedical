import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getEnabledModulesForEntity } from '@/lib/permissions';

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const userEntityId = session.user?.entityId;
    const userRole = session.user?.role;

    // Obtener todos los módulos de la BD
    const allModules = await prisma.module.findMany({
      orderBy: { name: 'asc' },
    });

    // Obtener todas las entidades y sus módulos habilitados
    const entities = await prisma.entity.findMany({
      include: {
        entityModules: {
          include: {
            module: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const entitiesWithModules = entities.map(e => ({
      id: e.id,
      name: e.name,
      enabledModules: e.entityModules
        .filter(em => em.enabled)
        .map(em => ({
          moduleId: em.module.id,
          moduleName: em.module.name,
          enabled: em.enabled,
        })),
      allModules: e.entityModules.map(em => ({
        moduleId: em.module.id,
        moduleName: em.module.name,
        enabled: em.enabled,
      })),
    }));

    // Obtener módulos habilitados para el usuario actual usando la función de permisos
    let enabledModulesForCurrentUser: string[] = [];
    if (userEntityId) {
      const enabledModulesSet = await getEnabledModulesForEntity(userEntityId);
      enabledModulesForCurrentUser = Array.from(enabledModulesSet);
    }

    // Obtener todos los EntityModule para depuración
    const allEntityModules = await prisma.entityModule.findMany({
      include: {
        module: {
          select: {
            id: true,
            name: true,
          },
        },
        entity: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        currentUser: {
          role: userRole,
          entityId: userEntityId,
          email: session.user?.email,
        },
        modulesInDB: allModules.map(m => ({
          id: m.id,
          name: m.name,
          description: m.description,
          status: m.status,
        })),
        entitiesWithModules,
        enabledModulesForCurrentUser: {
          count: enabledModulesForCurrentUser.length,
          modules: enabledModulesForCurrentUser,
        },
        allEntityModules: allEntityModules.map(em => ({
          entityId: em.entityId,
          entityName: em.entity.name,
          moduleId: em.moduleId,
          moduleName: em.module.name,
          enabled: em.enabled,
        })),
      },
    });
  } catch (error: any) {
    console.error('Error verificando módulos:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
