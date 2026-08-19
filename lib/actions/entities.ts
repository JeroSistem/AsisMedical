'use server';

import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { findOrCreateModule, initializeModules } from '@/lib/actions/modules';
import { createEntityDatabase, getPrismaClientForEntity, updateEntityDatabaseSchema, dropEntityDatabase } from '@/lib/database-manager';

export interface CreateEntityData {
  name: string;
  type: 'HOSPITAL' | 'CLINICA' | 'CENTRO_MEDICO' | 'LABORATORIO';
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  adminUser: {
    name: string;
    email: string;
    password: string;
  };
  modules?: string[]; // Array de IDs de módulos
}

export interface EntityWithAdmin {
  id: string;
  name: string;
  type: string;
  status: string;
  adminUserId: string | null;
  adminUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  } | null;
  modules?: Array<{
    id: string;
    name: string;
    description: string;
    enabled: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Obtiene todos los módulos disponibles del sistema
 */
export async function getAllModules() {
  try {
    if (!prisma || typeof prisma.module === 'undefined') {
      return { success: false, data: [], error: 'Base de datos no disponible' };
    }

    const modules = await prisma.module.findMany({
      where: {
        status: 'ENABLED',
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      success: true,
      data: modules.map((module) => ({
        id: module.id,
        name: module.name,
        description: module.description,
        status: module.status,
      })),
    };
  } catch (error: any) {
    const code = error?.code;
    const message = error?.message || 'Error al obtener los módulos';
    if (code === 'ECONNREFUSED' || String(message).includes('ECONNREFUSED')) {
      console.warn('[DB] getAllModules: MySQL no disponible (ECONNREFUSED)');
      return {
        success: false,
        data: [],
        error: 'Base de datos no disponible. Inicia MySQL en el puerto configurado.',
      };
    }
    console.warn('[DB] getAllModules:', message);
    return {
      success: false,
      data: [],
      error: message,
    };
  }
}

/**
 * Crea una nueva institución con su usuario administrador principal
 */
export async function createEntity(data: CreateEntityData) {
  try {
    if (!prisma || typeof prisma.entity === 'undefined') {
      throw new Error('Base de datos no disponible');
    }

    // Verificar que el email del administrador no exista
    const existingUser = await prisma.user.findUnique({
      where: { email: data.adminUser.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: `El email ${data.adminUser.email} ya está registrado`,
      };
    }

    // Verificar que el nombre de la entidad no exista
    const existingEntity = await prisma.entity.findUnique({
      where: { name: data.name },
    });

    if (existingEntity) {
      return {
        success: false,
        error: `La institución "${data.name}" ya existe`,
      };
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(data.adminUser.password, 10);

    // Crear la entidad primero en la BD principal
    const result = await prisma.$transaction(async (tx) => {
      // Crear la entidad primero (sin adminUser todavía)
      const entity = await tx.entity.create({
        data: {
          name: data.name,
          type: data.type,
          status: data.status || 'ACTIVE',
        },
      });

      // Crear la base de datos para esta entidad ANTES de crear el usuario
      console.log(`[createEntity] Creando base de datos para entidad ${entity.id}`);
      const dbResult = await createEntityDatabase(entity.id, { fresh: true });
      
      if (!dbResult.success) {
        throw new Error(`Error creando base de datos para la entidad: ${dbResult.error}`);
      }

      // Actualizar la entidad con el nombre de la base de datos
      await tx.entity.update({
        where: { id: entity.id },
        data: {
          databaseName: dbResult.databaseName,
        },
      });

      console.log(`[createEntity] ✅ Base de datos ${dbResult.databaseName} creada para entidad ${entity.id}`);

      return entity;
    });

    // Crear el usuario administrador en la BD de la entidad (fuera de la transacción)
    let adminUser = null;
    if (result.id) {
      try {
        const entityPrisma = getPrismaClientForEntity(result.id);
        
        // Crear el usuario administrador en la BD de la entidad
        adminUser = await entityPrisma.user.create({
          data: {
            name: data.adminUser.name,
            email: data.adminUser.email,
            password: hashedPassword,
            role: 'ENTITY_ADMIN',
            status: 'Active',
            entityId: result.id,
          },
        });

        // Actualizar la entidad con el adminUserId (referencia al usuario en la BD de la entidad)
        await prisma.entity.update({
          where: { id: result.id },
          data: {
            adminUserId: adminUser.id,
          },
        });

        console.log(`[createEntity] ✅ Usuario administrador creado en BD de entidad: ${adminUser.email}`);
      } catch (userError: any) {
        console.error(`[createEntity] Error creando usuario administrador en BD de entidad:`, userError);
        throw new Error(`Error creando usuario administrador: ${userError.message}`);
      }
    }

    // Inicializar módulos y asociarlos en la base de datos de la entidad (fuera de la transacción)
    if (result.id) {
      try {
        const entityPrisma = getPrismaClientForEntity(result.id);
        
        // Asegurar que los módulos del sistema existan en la BD principal primero
        await initializeModules();
        
        // Obtener todos los módulos de la BD principal para copiar a la BD de la entidad
        const allModulesFromMainDB = await prisma.module.findMany();
        
        // Resolver los módulos seleccionados (pueden venir como IDs o nombres)
        let modulesToCopy: typeof allModulesFromMainDB = [];
        
        if (data.modules && data.modules.length > 0) {
          // Buscar los módulos seleccionados en la BD principal
          for (const moduleIdOrName of data.modules) {
            let foundModule = allModulesFromMainDB.find(m => m.id === moduleIdOrName);
            
            if (!foundModule) {
              foundModule = allModulesFromMainDB.find(m => 
                m.name.toLowerCase() === moduleIdOrName.toLowerCase() ||
                m.name.toLowerCase().includes(moduleIdOrName.toLowerCase())
              );
            }
            
            if (foundModule && !modulesToCopy.find(m => m.id === foundModule!.id)) {
              modulesToCopy.push(foundModule);
            }
          }
        } else {
          // Sin módulos seleccionados: institución en ceros (sin módulos activos)
          modulesToCopy = [];
        }

        // Crear los módulos en la BD de la entidad y obtener sus IDs
        const moduleIdMap = new Map<string, string>(); // Mapa: nombre del módulo -> ID en BD de entidad
        
        for (const moduleFromMain of modulesToCopy) {
          const entityModule = await entityPrisma.module.upsert({
            where: { name: moduleFromMain.name },
            update: {
              description: moduleFromMain.description,
              status: 'ENABLED',
            },
            create: {
              name: moduleFromMain.name,
              description: moduleFromMain.description,
              status: 'ENABLED',
            },
          });
          
          // Guardar el mapeo: nombre -> ID en BD de entidad
          moduleIdMap.set(moduleFromMain.name, entityModule.id);
        }

        // Asociar módulos en EntityModule de la BD de la entidad
        // Si se especificaron módulos, solo asociar esos. Si no, asociar todos los copiados
        const modulesToAssociate: string[] = [];
        
        if (data.modules && data.modules.length > 0) {
          // Solo asociar los módulos seleccionados
          for (const moduleFromMain of modulesToCopy) {
            const entityModuleId = moduleIdMap.get(moduleFromMain.name);
            if (entityModuleId) {
              modulesToAssociate.push(entityModuleId);
            }
          }
        } else {
          // Si no se especificaron módulos, asociar todos los copiados (pero deshabilitados por defecto)
          for (const moduleFromMain of modulesToCopy) {
            const entityModuleId = moduleIdMap.get(moduleFromMain.name);
            if (entityModuleId) {
              modulesToAssociate.push(entityModuleId);
            }
          }
        }
        
        // Crear los registros en EntityModule
        for (const moduleId of modulesToAssociate) {
          await entityPrisma.entityModule.upsert({
            where: {
              entityId_moduleId: {
                entityId: result.id,
                moduleId: moduleId,
              },
            },
            update: {
              enabled: data.modules && data.modules.length > 0 ? true : false, // Habilitar solo si se especificaron
            },
            create: {
              entityId: result.id,
              moduleId: moduleId,
              enabled: data.modules && data.modules.length > 0 ? true : false, // Habilitar solo si se especificaron
            },
          });
        }
        console.log(`[createEntity] ✅ ${modulesToAssociate.length} módulos asociados en BD de entidad ${result.id} (${data.modules && data.modules.length > 0 ? 'habilitados' : 'deshabilitados por defecto'})`);
      } catch (moduleError: any) {
        console.warn(`[createEntity] Advertencia al inicializar módulos en BD de entidad:`, moduleError.message);
        // No fallar la creación de la entidad si falla la inicialización de módulos
      }
    }

    return {
      success: true,
      data: {
        id: result.id,
        name: result.name,
        type: result.type,
        status: result.status,
        adminUser: adminUser
          ? {
              id: adminUser.id,
              name: adminUser.name,
              email: adminUser.email,
              role: adminUser.role,
              status: adminUser.status,
            }
          : null,
      },
    };
  } catch (error: any) {
    console.error('Error creando institución:', error);
    return {
      success: false,
      error: error.message || 'Error al crear la institución',
    };
  }
}

/**
 * Asocia módulos a una entidad existente (útil para corregir entidades creadas sin módulos)
 */
export async function associateModulesToEntity(
  entityId: string,
  moduleNames: string[]
): Promise<{ success: boolean; error?: string; associatedCount?: number }> {
  try {
    // Asegurar que los módulos del sistema existan en la BD principal primero
    await initializeModules();

    // Obtener todos los módulos de la BD principal
    const allModulesFromMainDB = await prisma.module.findMany();

    // Resolver los módulos seleccionados
    const modulesToCopy: typeof allModulesFromMainDB = [];

    for (const moduleName of moduleNames) {
      const foundModule = allModulesFromMainDB.find(
        (m) =>
          m.name.toLowerCase() === moduleName.toLowerCase() ||
          m.name.toLowerCase().includes(moduleName.toLowerCase())
      );

      if (foundModule && !modulesToCopy.find((m) => m.id === foundModule.id)) {
        modulesToCopy.push(foundModule);
      }
    }

    // 1) Asociar primero en BD principal (fuente de verdad del menú)
    if (prisma && typeof prisma.entityModule !== 'undefined') {
      await prisma.entityModule.updateMany({
        where: {
          entityId,
          moduleId: { notIn: modulesToCopy.map((m) => m.id) },
        },
        data: { enabled: false },
      });

      for (const moduleFromMain of modulesToCopy) {
        await prisma.entityModule.upsert({
          where: {
            entityId_moduleId: {
              entityId,
              moduleId: moduleFromMain.id,
            },
          },
          update: { enabled: true },
          create: {
            entityId,
            moduleId: moduleFromMain.id,
            enabled: true,
          },
        });
      }
    }

    // 2) Espejo best-effort en BD de la entidad (solo módulos activados)
    let associatedCount = modulesToCopy.length;
    try {
      // Asegurar registro de la institución en su propia BD (FK)
      const mainEntity = await prisma.entity.findUnique({ where: { id: entityId } });
      if (mainEntity) {
        const entityPrisma = getPrismaClientForEntity(entityId);
        await entityPrisma.entity.upsert({
          where: { id: entityId },
          update: {
            name: mainEntity.name,
            nit: mainEntity.nit,
            city: mainEntity.city,
            department: mainEntity.department,
            phone: mainEntity.phone,
            type: mainEntity.type,
            status: mainEntity.status,
            databaseName: mainEntity.databaseName,
          },
          create: {
            id: mainEntity.id,
            name: mainEntity.name,
            nit: mainEntity.nit,
            city: mainEntity.city,
            department: mainEntity.department,
            phone: mainEntity.phone,
            type: mainEntity.type,
            status: mainEntity.status,
            databaseName: mainEntity.databaseName,
          },
        });

        const moduleIdMap = new Map<string, string>();

        for (const moduleFromMain of modulesToCopy) {
          const entityModule = await entityPrisma.module.upsert({
            where: { name: moduleFromMain.name },
            update: {
              description: moduleFromMain.description,
              status: 'ENABLED',
            },
            create: {
              name: moduleFromMain.name,
              description: moduleFromMain.description,
              status: 'ENABLED',
            },
          });
          moduleIdMap.set(moduleFromMain.name, entityModule.id);
        }

        for (const moduleFromMain of modulesToCopy) {
          const entityModuleId = moduleIdMap.get(moduleFromMain.name);
          if (!entityModuleId) continue;
          await entityPrisma.entityModule.upsert({
            where: {
              entityId_moduleId: {
                entityId,
                moduleId: entityModuleId,
              },
            },
            update: { enabled: true },
            create: {
              entityId,
              moduleId: entityModuleId,
              enabled: true,
            },
          });
        }

        const selectedEntityIds = Array.from(moduleIdMap.values());
        await entityPrisma.entityModule.updateMany({
          where: {
            entityId,
            moduleId: { notIn: selectedEntityIds },
          },
          data: { enabled: false },
        });
      }
    } catch (mirrorError) {
      console.warn(
        '[associateModulesToEntity] Espejo en BD entidad falló (menú usa BD principal):',
        mirrorError
      );
    }

    console.log(
      `[associateModulesToEntity] ✅ ${associatedCount} módulos asociados a entidad ${entityId}`
    );

    return { success: true, associatedCount };
  } catch (error: any) {
    console.error('[associateModulesToEntity] Error:', error);
    return { success: false, error: error.message || 'Error al asociar módulos' };
  }
}

/**
 * Obtiene todas las instituciones con sus usuarios administradores
 */
export async function getAllEntities() {
  try {
    if (!prisma || typeof prisma.entity === 'undefined') {
      return { success: false, data: [], error: 'Base de datos no disponible' };
    }

    const entities = await prisma.entity.findMany({
      include: {
        adminUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        },
        entityModules: {
          include: {
            module: {
              select: {
                id: true,
                name: true,
                description: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: entities.map((entity) => ({
        id: entity.id,
        name: entity.name,
        type: entity.type,
        status: entity.status,
        adminUserId: entity.adminUserId,
        adminUser: entity.adminUser
          ? {
              id: entity.adminUser.id,
              name: entity.adminUser.name,
              email: entity.adminUser.email,
              role: entity.adminUser.role,
              status: entity.adminUser.status,
            }
          : null,
        modules: entity.entityModules.map((em) => ({
          id: em.module.id,
          name: em.module.name,
          description: em.module.description,
          enabled: em.enabled,
        })),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      })),
    };
  } catch (error: any) {
    const code = error?.code;
    const message = error?.message || 'Error al obtener las instituciones';
    if (code === 'ECONNREFUSED' || String(message).includes('ECONNREFUSED')) {
      console.warn('[DB] getAllEntities: MySQL no disponible (ECONNREFUSED)');
      return {
        success: false,
        data: [],
        error: 'Base de datos no disponible. Inicia MySQL en el puerto configurado.',
      };
    }
    console.warn('[DB] getAllEntities:', message);
    return {
      success: false,
      data: [],
      error: message,
    };
  }
}

/**
 * Obtiene una institución por su ID
 */
export async function getEntityById(id: string) {
  try {
    if (!prisma || typeof prisma.entity === 'undefined') {
      return { success: false, data: null, error: 'Base de datos no disponible' };
    }

    const entity = await prisma.entity.findUnique({
      where: { id },
      include: {
        adminUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        },
        entityModules: {
          include: {
            module: {
              select: {
                id: true,
                name: true,
                description: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!entity) {
      return { success: false, data: null, error: 'Institución no encontrada' };
    }

    return {
      success: true,
      data: {
        id: entity.id,
        name: entity.name,
        type: entity.type,
        status: entity.status,
        adminUserId: entity.adminUserId,
        adminUser: entity.adminUser
          ? {
              id: entity.adminUser.id,
              name: entity.adminUser.name,
              email: entity.adminUser.email,
              role: entity.adminUser.role,
              status: entity.adminUser.status,
            }
          : null,
        modules: entity.entityModules.map((em) => ({
          id: em.module.id,
          name: em.module.name,
          description: em.module.description,
          enabled: em.enabled,
        })),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    };
  } catch (error: any) {
    console.error('Error obteniendo institución:', error);
    return {
      success: false,
      data: null,
      error: error.message || 'Error al obtener la institución',
    };
  }
}

/**
 * Actualiza una institución
 */
export async function updateEntity(
  id: string,
  data: Partial<CreateEntityData>
) {
  try {
    if (!prisma || typeof prisma.entity === 'undefined') {
      throw new Error('Base de datos no disponible');
    }

    const updateData: any = {};

    if (data.name) {
      // Verificar que el nombre no esté en uso por otra entidad
      const existingEntity = await prisma.entity.findFirst({
        where: {
          name: data.name,
          NOT: { id },
        },
      });

      if (existingEntity) {
        return {
          success: false,
          error: `El nombre "${data.name}" ya está en uso`,
        };
      }

      updateData.name = data.name;
    }

    if (data.type) {
      updateData.type = data.type;
    }

    if (data.status) {
      updateData.status = data.status;
    }

    // Si se actualizan los módulos
    if (data.modules !== undefined) {
      console.log('[updateEntity] Módulos recibidos:', data.modules);
      
      // Obtener el cliente Prisma de la BD de la entidad
      const entityPrisma = getPrismaClientForEntity(id);
      
      // Asegurar que los módulos del sistema existan en la BD principal primero
      await initializeModules();
      
      // Obtener todos los módulos de la BD principal para copiar a la BD de la entidad
      const allModulesFromMainDB = await prisma.module.findMany();
      
      // Resolver los módulos seleccionados (pueden venir como IDs o nombres)
      let modulesToCopy: typeof allModulesFromMainDB = [];
      
      for (const moduleIdOrName of data.modules || []) {
        let foundModule = allModulesFromMainDB.find(m => m.id === moduleIdOrName);
        
        if (!foundModule) {
          foundModule = allModulesFromMainDB.find(m => 
            m.name.toLowerCase() === moduleIdOrName.toLowerCase() ||
            m.name.toLowerCase().includes(moduleIdOrName.toLowerCase())
          );
        }
        
        if (foundModule && !modulesToCopy.find(m => m.id === foundModule!.id)) {
          modulesToCopy.push(foundModule);
        }
      }

      // Crear/actualizar los módulos en la BD de la entidad y obtener sus IDs
      const moduleIdMap = new Map<string, string>(); // Mapa: nombre del módulo -> ID en BD de entidad
      
      for (const moduleFromMain of modulesToCopy) {
        const entityModule = await entityPrisma.module.upsert({
          where: { name: moduleFromMain.name },
          update: {
            description: moduleFromMain.description,
            status: 'ENABLED',
          },
          create: {
            name: moduleFromMain.name,
            description: moduleFromMain.description,
            status: 'ENABLED',
          },
        });
        
        // Guardar el mapeo: nombre -> ID en BD de entidad
        moduleIdMap.set(moduleFromMain.name, entityModule.id);
      }

      // Obtener módulos actuales de la entidad (en la BD de la entidad)
      const currentModules = await entityPrisma.entityModule.findMany({
        where: { entityId: id },
      });

      const currentModuleIds = currentModules.map((em) => em.moduleId);
      
      // Usar los IDs de los módulos en la BD de la entidad
      const resolvedModuleIds: string[] = [];
      for (const moduleFromMain of modulesToCopy) {
        const entityModuleId = moduleIdMap.get(moduleFromMain.name);
        if (entityModuleId) {
          resolvedModuleIds.push(entityModuleId);
        }
      }
      
      // Eliminar módulos que ya no están seleccionados
      const modulesToRemove = currentModuleIds.filter(
        (moduleId) => !resolvedModuleIds.includes(moduleId)
      );
      if (modulesToRemove.length > 0) {
        await entityPrisma.entityModule.deleteMany({
          where: {
            entityId: id,
            moduleId: { in: modulesToRemove },
          },
        });
        console.log('[updateEntity] Módulos eliminados:', modulesToRemove.length);
      }
      
      // Agregar nuevos módulos seleccionados (solo los que existen)
      const modulesToAdd = resolvedModuleIds.filter(
        (moduleId) => !currentModuleIds.includes(moduleId)
      );
      if (modulesToAdd.length > 0) {
        await Promise.all(
          modulesToAdd.map((moduleId) =>
            entityPrisma.entityModule.create({
              data: {
                entityId: id,
                moduleId: moduleId,
                enabled: true,
              },
            })
          )
        );
        console.log('[updateEntity] ✅ Módulos agregados:', modulesToAdd.length);
      }

      // Actualizar estado de módulos existentes (usar los IDs resueltos)
      const modulesToUpdate = resolvedModuleIds.filter((moduleId) =>
        currentModuleIds.includes(moduleId)
      );
      if (modulesToUpdate.length > 0) {
        await entityPrisma.entityModule.updateMany({
          where: {
            entityId: id,
            moduleId: { in: modulesToUpdate },
          },
          data: {
            enabled: true,
          },
        });
        console.log('[updateEntity] Módulos actualizados:', modulesToUpdate.length);
      }
      
      console.log('[updateEntity] Resumen de módulos:', {
        recibidos: (data.modules || []).length,
        resueltos: resolvedModuleIds.length,
        agregados: modulesToAdd.length,
        actualizados: modulesToUpdate.length,
        eliminados: modulesToRemove.length
      });
    }

    // Si se actualiza el usuario administrador
    if (data.adminUser) {
      const entity = await prisma.entity.findUnique({
        where: { id },
        include: { adminUser: true },
      });

      if (!entity) {
        return { success: false, error: 'Institución no encontrada' };
      }

      // Si hay un administrador existente, actualizarlo o crear uno nuevo
      if (entity.adminUserId) {
        // Verificar si el email cambió
        if (entity.adminUser?.email !== data.adminUser.email) {
          const emailExists = await prisma.user.findUnique({
            where: { email: data.adminUser.email },
          });

          if (emailExists) {
            return {
              success: false,
              error: `El email ${data.adminUser.email} ya está registrado`,
            };
          }
        }

        // Actualizar el usuario administrador existente
        const hashedPassword = data.adminUser.password
          ? await bcrypt.hash(data.adminUser.password, 10)
          : undefined;

        await prisma.user.update({
          where: { id: entity.adminUserId },
          data: {
            name: data.adminUser.name,
            email: data.adminUser.email,
            ...(hashedPassword && { password: hashedPassword }),
          },
        });
      } else {
        // Crear nuevo usuario administrador
        const hashedPassword = await bcrypt.hash(data.adminUser.password, 10);

        const adminUser = await prisma.user.create({
          data: {
            name: data.adminUser.name,
            email: data.adminUser.email,
            password: hashedPassword,
            role: 'ENTITY_ADMIN',
            status: 'Active',
            entityId: id,
          },
        });

        updateData.adminUserId = adminUser.id;
      }
    }

    const updatedEntity = await prisma.entity.update({
      where: { id },
      data: updateData,
      include: {
        adminUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        },
        entityModules: {
          include: {
            module: {
              select: {
                id: true,
                name: true,
                description: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      data: {
        id: updatedEntity.id,
        name: updatedEntity.name,
        type: updatedEntity.type,
        status: updatedEntity.status,
        adminUser: updatedEntity.adminUser
          ? {
              id: updatedEntity.adminUser.id,
              name: updatedEntity.adminUser.name,
              email: updatedEntity.adminUser.email,
              role: updatedEntity.adminUser.role,
              status: updatedEntity.adminUser.status,
            }
          : null,
        modules: updatedEntity.entityModules.map((em) => ({
          id: em.module.id,
          name: em.module.name,
          description: em.module.description,
          enabled: em.enabled,
        })),
      },
    };
  } catch (error: any) {
    console.error('Error actualizando institución:', error);
    return {
      success: false,
      error: error.message || 'Error al actualizar la institución',
    };
  }
}

/**
 * Elimina una institución (soft delete cambiando el status a INACTIVE)
 */
export async function deleteEntity(id: string, deleteDatabase: boolean = true) {
  try {
    if (!prisma || typeof prisma.entity === 'undefined') {
      throw new Error('Base de datos no disponible');
    }

    // Obtener la entidad antes de eliminarla
    const entity = await prisma.entity.findUnique({
      where: { id },
    });

    if (!entity) {
      return {
        success: false,
        error: 'Entidad no encontrada',
      };
    }

    // Si se solicita eliminar la base de datos, hacerlo primero
    // Generar el nombre de la base de datos usando la misma lógica que en createEntityDatabase
    if (deleteDatabase) {
      // El nombre de la BD se genera dinámicamente, así que lo generamos aquí también
      const normalizedId = id
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .substring(0, 50);
      const databaseName = `asis_medical_${normalizedId}`;
      
      console.log(`[deleteEntity] Eliminando base de datos ${databaseName} para entidad ${id}`);
      const dropResult = await dropEntityDatabase(id);
      if (!dropResult.success) {
        console.warn(`[deleteEntity] Advertencia: No se pudo eliminar la base de datos: ${dropResult.error}`);
        // Continuar con la eliminación de la entidad aunque falle la eliminación de la BD
      }
    }

    // Eliminar la entidad de la BD principal
    await prisma.entity.delete({
      where: { id },
    });

    console.log(`[deleteEntity] ✅ Entidad ${entity.name} eliminada exitosamente`);

    return {
      success: true,
      data: {
        id: entity.id,
        name: entity.name,
        deleted: true,
      },
    };
  } catch (error: any) {
    console.error('Error eliminando institución:', error);
    return {
      success: false,
      error: error.message || 'Error al eliminar la institución',
    };
  }
}
