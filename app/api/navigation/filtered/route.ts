import { NextRequest, NextResponse } from 'next/server';
import { getNavigationByPermissions } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || 'Administrador';
    const userEntityId = (session?.user as any)?.entityId;
    
    // Solo log en desarrollo y si hay múltiples llamadas
    if (process.env.NODE_ENV === 'development') {
      console.log('[API /navigation/filtered] Request recibida:', { userRole, userEntityId });
    }
    
    // Obtener navegación filtrada (esto ya incluye permisos internamente)
    const navigation = await getNavigationByPermissions();
    
    // Obtener módulos habilitados para debugging solo en desarrollo
    let enabledModulesInfo: any = null;
    if (userEntityId && process.env.NODE_ENV === 'development') {
      try {
        // Usar getPrismaClient para obtener el cliente correcto de la entidad
        const { getPrismaClient } = await import('@/lib/database-manager');
        const entityPrisma = getPrismaClient(userEntityId);
        
        console.log('[API /navigation/filtered] Consultando módulos habilitados para entidad:', userEntityId);
        
        // Verificar si la tabla existe, si no, actualizar el esquema
        let entityModules = [];
        try {
          // Obtener EntityModule sin relaciones primero
          const entityModuleRecords = await entityPrisma.entityModule.findMany({
            where: {
              entityId: userEntityId,
              enabled: true,
            },
          });

          // Obtener los módulos correspondientes
          const moduleIds = entityModuleRecords.map(em => em.moduleId);
          
          if (moduleIds.length > 0) {
            const modules = await entityPrisma.module.findMany({
              where: {
                id: { in: moduleIds },
              },
              select: {
                id: true,
                name: true,
              },
            });

            // Combinar EntityModule con Module
            entityModules = entityModuleRecords.map(em => ({
              ...em,
              module: modules.find(m => m.id === em.moduleId) || { id: em.moduleId, name: 'Unknown' },
            }));
          }
        } catch (tableError: any) {
          // Si la tabla no existe, intentar actualizar el esquema
          if (tableError.message?.includes('does not exist') || tableError.message?.includes('not available')) {
            console.log('[API /navigation/filtered] Tabla entity_modules no existe, actualizando esquema...');
            const { updateEntityDatabaseSchema } = await import('@/lib/database-manager');
            const updateResult = await updateEntityDatabaseSchema(userEntityId);
            if (updateResult.success) {
              // Reintentar la consulta después de actualizar el esquema
              const entityModuleRecords = await entityPrisma.entityModule.findMany({
                where: {
                  entityId: userEntityId,
                  enabled: true,
                },
              });

              const moduleIds = entityModuleRecords.map(em => em.moduleId);
              
              if (moduleIds.length > 0) {
                const modules = await entityPrisma.module.findMany({
                  where: {
                    id: { in: moduleIds },
                  },
                  select: {
                    id: true,
                    name: true,
                  },
                });

                entityModules = entityModuleRecords.map(em => ({
                  ...em,
                  module: modules.find(m => m.id === em.moduleId) || { id: em.moduleId, name: 'Unknown' },
                }));
              }
            } else {
              console.error('[API /navigation/filtered] Error actualizando esquema:', updateResult.error);
            }
          } else {
            throw tableError;
          }
        }
        
        console.log('[API /navigation/filtered] Módulos encontrados:', entityModules.length);
        
        enabledModulesInfo = {
          count: entityModules.length,
          modules: entityModules.map(em => ({
            moduleId: em.module.id,
            moduleName: em.module.name,
            enabled: em.enabled
          }))
        };
      } catch (error: any) {
        console.error('[API /navigation/filtered] Error obteniendo módulos para debug:', error);
        console.error('[API /navigation/filtered] Error details:', {
          message: error.message,
          stack: error.stack,
          userEntityId
        });
        enabledModulesInfo = {
          count: 0,
          modules: [],
          error: error.message
        };
      }
    }
    
    // Incluir información de depuración solo en desarrollo
    const debugInfo = process.env.NODE_ENV === 'development' ? {
      userRole,
      userEntityId,
      navigationCount: navigation.length,
      navigationModules: navigation.map(n => ({ id: n.id, title: n.title })),
      enabledModules: enabledModulesInfo,
    } : null;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[API /navigation/filtered] Respuesta:', debugInfo);
    }
    
    return NextResponse.json({
      success: true,
      data: navigation,
      debug: debugInfo,
    });
  } catch (error: any) {
    console.error('Error obteniendo navegación filtrada:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
