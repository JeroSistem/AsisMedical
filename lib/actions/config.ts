'use server';

import { prisma } from '@/lib/prisma';
import { getPrismaClient } from '@/lib/database-manager';

export interface SystemConfigValue {
  [key: string]: any;
}

/**
 * Guarda o actualiza una configuración del sistema
 */
export async function saveSystemConfig(
  key: string,
  value: SystemConfigValue,
  category: string = 'general',
  description?: string,
  entityId?: string
) {
  try {
    // Obtener el cliente Prisma correcto según la entidad
    const client = getPrismaClient(entityId);
    
    // Verificar que prisma esté inicializado
    if (!client || typeof client.systemConfiguration === 'undefined') {
      throw new Error('Base de datos no disponible');
    }

    // Crear una clave única que incluya el entityId si existe
    const uniqueKey = entityId ? `${entityId}:${key}` : key;

    // Buscar si existe una configuración con esta clave y entityId
    const existing = await client.systemConfiguration.findFirst({
      where: {
        key: uniqueKey,
        entityId: entityId || null,
      },
    });

    let config;
    if (existing) {
      // Actualizar la configuración existente
      config = await client.systemConfiguration.update({
        where: { id: existing.id },
        data: {
          value: value as any,
          category,
          description,
          entityId,
          updatedAt: new Date(),
        },
      });
    } else {
      // Crear nueva configuración con la clave única que incluye entityId
      config = await client.systemConfiguration.create({
        data: {
          key: uniqueKey,
          value: value as any,
          category,
          description,
          entityId,
        },
      });
    }

    return { success: true, data: config };
  } catch (error: any) {
    console.error('Error guardando configuración:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene una configuración del sistema por su clave
 */
export async function getSystemConfig(key: string, entityId?: string) {
  try {
    // Obtener el cliente Prisma correcto según la entidad
    const client = getPrismaClient(entityId);
    
    // Verificar que prisma esté inicializado
    if (!client || typeof client.systemConfiguration === 'undefined') {
      return { success: false, data: null };
    }

    // Construir la clave única que incluye entityId si existe
    const uniqueKey = entityId ? `${entityId}:${key}` : key;

    const config = await client.systemConfiguration.findFirst({
      where: {
        key: uniqueKey,
        ...(entityId ? { entityId } : { entityId: null }),
      },
    });

    if (!config) {
      return { success: true, data: null };
    }

    // Remover el prefijo del entityId de la clave al devolver
    return {
      success: true,
      data: {
        ...config,
        key: entityId && config.key.startsWith(`${entityId}:`)
          ? config.key.replace(`${entityId}:`, '')
          : config.key,
      },
    };
  } catch (error: any) {
    console.error('Error obteniendo configuración:', error);
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Obtiene todas las configuraciones de una categoría
 */
export async function getSystemConfigsByCategory(category: string, entityId?: string) {
  try {
    // Obtener el cliente Prisma correcto según la entidad
    const client = getPrismaClient(entityId);
    
    // Verificar que prisma esté inicializado
    if (!client || typeof client.systemConfiguration === 'undefined') {
      return { success: false, data: [] };
    }

    const configs = await client.systemConfiguration.findMany({
      where: {
        category,
        ...(entityId ? { entityId } : { entityId: null }),
      },
    });

    // Remover el prefijo del entityId de las claves al devolver los datos
    const processedConfigs = configs.map((config) => ({
      ...config,
      key: entityId && config.key.startsWith(`${entityId}:`) 
        ? config.key.replace(`${entityId}:`, '') 
        : config.key,
    }));

    return { success: true, data: processedConfigs };
  } catch (error: any) {
    console.error('Error obteniendo configuraciones:', error);
    return { success: false, data: [], error: error.message };
  }
}

/**
 * Guarda múltiples configuraciones a la vez
 */
export async function saveSystemConfigs(
  configs: Array<{
    key: string;
    value: SystemConfigValue;
    category?: string;
    description?: string;
    entityId?: string;
  }>
) {
  try {
    // Agrupar configuraciones por entityId para usar el cliente correcto
    const configsByEntity = new Map<string | null, typeof configs>();
    
    configs.forEach(config => {
      const key = config.entityId || null;
      if (!configsByEntity.has(key)) {
        configsByEntity.set(key, []);
      }
      configsByEntity.get(key)!.push(config);
    });

    const results = await Promise.all(
      Array.from(configsByEntity.entries()).flatMap(([entityId, entityConfigs]) => {
        const client = getPrismaClient(entityId || undefined);
        
        if (!client || typeof client.systemConfiguration === 'undefined') {
          throw new Error('Base de datos no disponible');
        }

        return entityConfigs.map(async ({ key, value, category = 'general', description, entityId: configEntityId }) => {
          // Crear una clave única que incluya el entityId si existe
          const uniqueKey = configEntityId ? `${configEntityId}:${key}` : key;

          // Primero buscar si existe una configuración con esta clave y entityId
          const existing = await client.systemConfiguration.findFirst({
            where: {
              key: uniqueKey,
              entityId: configEntityId || null,
            },
          });

          if (existing) {
            // Actualizar la configuración existente
            return await client.systemConfiguration.update({
              where: { id: existing.id },
              data: {
                value: value as any,
                category,
                description,
                entityId: configEntityId,
                updatedAt: new Date(),
              },
            });
          } else {
            // Crear nueva configuración con la clave única que incluye entityId
            return await client.systemConfiguration.create({
              data: {
                key: uniqueKey,
                value: value as any,
                category,
                description,
                entityId: configEntityId,
              },
            });
          }
        });
      })
    );

    return { success: true, data: results };
  } catch (error: any) {
    console.error('Error guardando configuraciones:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene todas las configuraciones como un objeto plano
 */
export async function getAllSystemConfigs(entityId?: string) {
  try {
    // Obtener el cliente Prisma correcto según la entidad
    const client = getPrismaClient(entityId);
    
    // Verificar que prisma esté inicializado
    if (!client || typeof client.systemConfiguration === 'undefined') {
      return { success: false, data: {} };
    }

    const configs = await client.systemConfiguration.findMany({
      where: entityId ? { entityId } : { entityId: null },
    });

    // Convertir a objeto plano, removiendo el prefijo del entityId de las claves
    const configObject: Record<string, any> = {};
    configs.forEach((config) => {
      const cleanKey = entityId && config.key.startsWith(`${entityId}:`)
        ? config.key.replace(`${entityId}:`, '')
        : config.key;
      configObject[cleanKey] = config.value;
    });

    return { success: true, data: configObject };
  } catch (error: any) {
    console.error('Error obteniendo todas las configuraciones:', error);
    return { success: false, data: {}, error: error.message };
  }
}

/**
 * Obtiene los permisos configurados para una entidad específica
 */
export async function getEntityPermissions(entityId: string) {
  try {
    // Obtener el cliente Prisma correcto para esta entidad
    const client = getPrismaClient(entityId);
    
    if (!client || typeof client.systemConfiguration === 'undefined') {
      return { success: false, data: null, error: 'Base de datos no disponible' };
    }

    // Obtener todas las configuraciones de roles para esta entidad
    const roleConfigs = await client.systemConfiguration.findMany({
      where: {
        category: 'roles',
        entityId: entityId,
      },
    });

    // Separar roles.enabled y los permisos de cada rol
    const rolesEnabled = roleConfigs.find(config => 
      config.key === `${entityId}:roles.enabled` || config.key === 'roles.enabled'
    );

    const rolePermissions: Record<string, any> = {};
    
    roleConfigs.forEach(config => {
      // Remover el prefijo del entityId de la clave
      const cleanKey = config.key.startsWith(`${entityId}:`)
        ? config.key.replace(`${entityId}:`, '')
        : config.key;
      
      // Si es un permiso de rol (roles.{roleId})
      if (cleanKey.startsWith('roles.') && cleanKey !== 'roles.enabled') {
        const roleId = cleanKey.replace('roles.', '');
        rolePermissions[roleId] = config.value;
      }
    });

    return {
      success: true,
      data: {
        rolesEnabled: rolesEnabled?.value === true,
        rolePermissions,
      },
    };
  } catch (error: any) {
    console.error('Error obteniendo permisos de entidad:', error);
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Busca una entidad por nombre (búsqueda parcial)
 */
export async function findEntityByName(name: string) {
  try {
    if (!prisma || typeof prisma.entity === 'undefined') {
      return { success: false, data: null, error: 'Base de datos no disponible' };
    }

    const entity = await prisma.entity.findFirst({
      where: {
        name: {
          contains: name,
        },
      },
    });

    if (!entity) {
      return { success: false, data: null, error: `No se encontró ninguna entidad con el nombre "${name}"` };
    }

    return { success: true, data: entity };
  } catch (error: any) {
    console.error('Error buscando entidad:', error);
    return { success: false, data: null, error: error.message };
  }
}
