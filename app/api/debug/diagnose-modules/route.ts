import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPrismaClient } from '@/lib/database-manager';
import { getEnabledModulesForEntity } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const userEntityId = session.user?.entityId;
    const userRole = session.user?.role;

    if (!userEntityId) {
      return NextResponse.json({
        success: false,
        error: 'Usuario sin entityId',
        userRole,
      });
    }

    const diagnosis: any = {
      user: {
        role: userRole,
        entityId: userEntityId,
        email: session.user?.email,
      },
      steps: [],
    };

    // Paso 1: Verificar que la entidad existe en la BD principal
    try {
      const entity = await prisma.entity.findUnique({
        where: { id: userEntityId },
        select: {
          id: true,
          name: true,
          databaseName: true,
          status: true,
        },
      });

      diagnosis.steps.push({
        step: 1,
        name: 'Verificar entidad en BD principal',
        success: !!entity,
        data: entity || null,
      });

      if (!entity) {
        return NextResponse.json({
          success: false,
          error: 'Entidad no encontrada en BD principal',
          diagnosis,
        });
      }

      diagnosis.entity = entity;
    } catch (error: any) {
      diagnosis.steps.push({
        step: 1,
        name: 'Verificar entidad en BD principal',
        success: false,
        error: error.message,
      });
      return NextResponse.json({ success: false, error: error.message, diagnosis });
    }

    // Paso 2: Obtener cliente Prisma de la entidad
    try {
      const entityPrisma = getPrismaClient(userEntityId);
      diagnosis.steps.push({
        step: 2,
        name: 'Obtener cliente Prisma de entidad',
        success: !!entityPrisma,
        data: { hasEntityModule: typeof entityPrisma.entityModule !== 'undefined' },
      });
    } catch (error: any) {
      diagnosis.steps.push({
        step: 2,
        name: 'Obtener cliente Prisma de entidad',
        success: false,
        error: error.message,
      });
    }

    // Paso 3: Verificar módulos en BD principal
    try {
      const mainModules = await prisma.module.findMany({
        orderBy: { name: 'asc' },
      });
      diagnosis.steps.push({
        step: 3,
        name: 'Verificar módulos en BD principal',
        success: true,
        data: {
          count: mainModules.length,
          modules: mainModules.map(m => ({ id: m.id, name: m.name, status: m.status })),
        },
      });
      diagnosis.mainModules = mainModules;
    } catch (error: any) {
      diagnosis.steps.push({
        step: 3,
        name: 'Verificar módulos en BD principal',
        success: false,
        error: error.message,
      });
    }

    // Paso 4: Verificar módulos en BD de la entidad
    try {
      const entityPrisma = getPrismaClient(userEntityId);
      const entityModules = await entityPrisma.module.findMany({
        orderBy: { name: 'asc' },
      });
      diagnosis.steps.push({
        step: 4,
        name: 'Verificar módulos en BD de entidad',
        success: true,
        data: {
          count: entityModules.length,
          modules: entityModules.map(m => ({ id: m.id, name: m.name, status: m.status })),
        },
      });
      diagnosis.entityModules = entityModules;
    } catch (error: any) {
      diagnosis.steps.push({
        step: 4,
        name: 'Verificar módulos en BD de entidad',
        success: false,
        error: error.message,
      });
    }

    // Paso 5: Verificar EntityModule en BD de la entidad
    try {
      const entityPrisma = getPrismaClient(userEntityId);
      // Obtener EntityModule sin relaciones primero
      const entityModuleRecordsRaw = await entityPrisma.entityModule.findMany({
        where: {
          entityId: userEntityId,
        },
      });

      // Obtener los módulos correspondientes
      const moduleIds = entityModuleRecordsRaw.map(em => em.moduleId);
      const modules = moduleIds.length > 0 ? await entityPrisma.module.findMany({
        where: { id: { in: moduleIds } },
        select: { id: true, name: true },
      }) : [];

      // Combinar EntityModule con Module
      const entityModuleRecords = entityModuleRecordsRaw.map(em => ({
        ...em,
        module: modules.find(m => m.id === em.moduleId) || { id: em.moduleId, name: 'Unknown' },
      }));
      diagnosis.steps.push({
        step: 5,
        name: 'Verificar EntityModule en BD de entidad',
        success: true,
        data: {
          total: entityModuleRecords.length,
          enabled: entityModuleRecords.filter(em => em.enabled).length,
          records: entityModuleRecords.map(em => ({
            id: em.id,
            entityId: em.entityId,
            moduleId: em.moduleId,
            moduleName: em.module.name,
            enabled: em.enabled,
          })),
        },
      });
      diagnosis.entityModuleRecords = entityModuleRecords;
    } catch (error: any) {
      diagnosis.steps.push({
        step: 5,
        name: 'Verificar EntityModule en BD de entidad',
        success: false,
        error: error.message,
        hint: error.message?.includes('does not exist') 
          ? 'La tabla entity_modules no existe. Ejecuta updateEntityDatabaseSchema.' 
          : null,
      });
    }

    // Paso 6: Probar getEnabledModulesForEntity
    try {
      const enabledModulesSet = await getEnabledModulesForEntity(userEntityId);
      diagnosis.steps.push({
        step: 6,
        name: 'Probar getEnabledModulesForEntity',
        success: true,
        data: {
          count: enabledModulesSet.size,
          modules: Array.from(enabledModulesSet),
        },
      });
      diagnosis.enabledModulesSet = Array.from(enabledModulesSet);
    } catch (error: any) {
      diagnosis.steps.push({
        step: 6,
        name: 'Probar getEnabledModulesForEntity',
        success: false,
        error: error.message,
      });
    }

    // Paso 7: Verificar navegación filtrada
    try {
      const { getNavigationByPermissions } = await import('@/lib/permissions');
      const navigation = await getNavigationByPermissions();
      diagnosis.steps.push({
        step: 7,
        name: 'Verificar navegación filtrada',
        success: true,
        data: {
          count: navigation.length,
          modules: navigation.map(n => ({ id: n.id, title: n.title })),
        },
      });
      diagnosis.navigation = navigation;
    } catch (error: any) {
      diagnosis.steps.push({
        step: 7,
        name: 'Verificar navegación filtrada',
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      diagnosis,
    });
  } catch (error: any) {
    console.error('Error en diagnóstico:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
