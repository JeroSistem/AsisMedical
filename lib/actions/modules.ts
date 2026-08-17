'use server';

import { prisma } from '@/lib/prisma';
import { getPrismaClient } from '@/lib/database-manager';

/**
 * Inicializa los módulos del sistema si no existen
 */
export async function initializeModules() {
  try {
    if (!prisma || typeof prisma.module === 'undefined') {
      return { success: false, error: 'Base de datos no disponible' };
    }

    const { PLATFORM_MODULES_CATALOG } = await import('@/lib/platform-modules');
    const modulesToCreate = PLATFORM_MODULES_CATALOG.map((m) => ({
      name: m.name,
      description: m.description,
    }));

    const createdModules = [];
    const existingModules = [];
    
    for (const moduleData of modulesToCreate) {
      const module = await prisma.module.upsert({
        where: { name: moduleData.name },
        update: {
          // Actualizar descripción si cambió
          description: moduleData.description,
          status: 'ENABLED', // Asegurar que esté habilitado
        },
        create: {
          name: moduleData.name,
          description: moduleData.description,
          status: 'ENABLED',
        },
      });
      
      if (module.createdAt.getTime() === module.updatedAt.getTime()) {
        createdModules.push(module);
      } else {
        existingModules.push(module);
      }
    }

    return {
      success: true,
      data: {
        created: createdModules,
        existing: existingModules,
        total: createdModules.length + existingModules.length,
      },
      message: `Se crearon ${createdModules.length} módulos nuevos y se encontraron ${existingModules.length} existentes`,
    };
  } catch (error: any) {
    console.error('Error inicializando módulos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Busca o crea un módulo por nombre
 */
export async function findOrCreateModule(name: string, description?: string) {
  try {
    if (!prisma || typeof prisma.module === 'undefined') {
      return { success: false, data: null, error: 'Base de datos no disponible' };
    }

    // Buscar por nombre exacto (case insensitive)
    let module = await prisma.module.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    });

    // Si no se encuentra, buscar por nombre parcial
    if (!module) {
      module = await prisma.module.findFirst({
        where: {
          name: {
            contains: name,
          },
        },
      });
    }

    // Si aún no existe, crearlo
    if (!module) {
      module = await prisma.module.create({
        data: {
          name: name,
          description: description || `Módulo ${name}`,
          status: 'ENABLED',
        },
      });
      console.log(`[findOrCreateModule] Módulo creado: "${name}" (${module.id})`);
    }

    return { success: true, data: module };
  } catch (error: any) {
    console.error('Error buscando/creando módulo:', error);
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Obtiene un módulo por nombre (búsqueda exacta o parcial)
 */
export async function findModuleByName(name: string) {
  try {
    if (!prisma || typeof prisma.module === 'undefined') {
      return { success: false, data: null, error: 'Base de datos no disponible' };
    }

    // Primero intentar búsqueda exacta
    let module = await prisma.module.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    });

    // Si no se encuentra, intentar búsqueda parcial
    if (!module) {
      module = await prisma.module.findFirst({
        where: {
          name: {
            contains: name,
          },
        },
      });
    }

    if (!module) {
      return { success: false, data: null, error: `No se encontró ningún módulo con el nombre "${name}"` };
    }

    return { success: true, data: module };
  } catch (error: any) {
    console.error('Error buscando módulo:', error);
    return { success: false, data: null, error: error.message };
  }
}
