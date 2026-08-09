'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSystemConfig } from '@/lib/actions/config';
import { getNavigationByRole, filterNavigationByPermissions, type NavigationItem } from '@/lib/navigation';
import { prisma } from '@/lib/prisma';
import { getPrismaClient } from '@/lib/database-manager';

/**
 * Obtiene los permisos del usuario actual desde la configuración de roles
 * Server Action
 */
export async function getUserPermissions(entityId?: string | null): Promise<Record<string, { read: boolean; create: boolean; update: boolean; delete: boolean }> | null> {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const userEntityId = (session?.user as any)?.entityId || entityId;

    // Si no hay sesión, retornar null
    if (!session) {
      console.log('[getUserPermissions] No hay sesión');
      return null;
    }

    // SUPER_ADMIN puede no tener entityId, pero otros usuarios deben tenerlo
    if (userRole !== 'SUPER_ADMIN' && !userEntityId) {
      console.log('[getUserPermissions] Usuario sin entityId (no es SUPER_ADMIN):', { userRole });
      return null;
    }

    console.log('[getUserPermissions] Usuario:', { userRole, userEntityId });

    // SUPER_ADMIN siempre tiene todos los permisos (no depende de configuración)
    if (userRole === 'SUPER_ADMIN') {
      return {
        usuarios: { read: true, create: true, update: true, delete: true },
        pacientes: { read: true, create: true, update: true, delete: true },
        historias: { read: true, create: true, update: true, delete: true },
        imagenes: { read: true, create: true, update: true, delete: true },
        laboratorio: { read: true, create: true, update: true, delete: true },
        facturacion: { read: true, create: true, update: true, delete: true },
        configuracion: { read: true, create: true, update: true, delete: true },
      };
    }

    // Para usuarios de entidades, obtener permisos desde la configuración de la entidad
    if (!userEntityId) {
      console.log('[getUserPermissions] Usuario sin entityId, retornando null');
      return null;
    }

    // Obtener configuración de roles habilitados desde la BD de la entidad
    const rolesEnabledConfig = await getSystemConfig('roles.enabled', userEntityId);
    const rolesEnabled = rolesEnabledConfig.success && rolesEnabledConfig.data?.value === true;
    
    console.log('[getUserPermissions] Roles habilitados para entidad:', { rolesEnabled, userEntityId });

    // Si los roles no están habilitados, usar sistema por defecto
    if (!rolesEnabled) {
      console.log('[getUserPermissions] Roles no habilitados, usando sistema por defecto');
      return null; // Retornar null para usar el sistema de roles por defecto
    }

    // Si los roles están habilitados, obtener permisos específicos del rol
    // Mapeo de roles de BD a IDs de roles en configuración
    const roleIdMap: Record<string, string> = {
      'SUPER_ADMIN': 'super-admin',
      'ENTITY_ADMIN': 'admin',
      'ADMIN': 'admin',
      'MEDICO': 'medico',
      'ENFERMERO': 'enfermeria',
      'RECEPCION': 'recepcion',
      'LABORATORIO': 'laboratorio',
      'FACTURACION': 'facturacion',
    };
    
    const roleId = roleIdMap[userRole] || userRole.toLowerCase().replace(/_/g, '-');
    
    console.log('[getUserPermissions] Buscando permisos para rol:', { userRole, roleId });
    
    // Obtener la configuración de roles para esta entidad
    const rolesConfig = await getSystemConfig(`roles.${roleId}`, userEntityId);
    
    console.log('[getUserPermissions] Configuración encontrada:', { 
      success: rolesConfig.success, 
      hasValue: !!rolesConfig.data?.value,
      key: `roles.${roleId}`
    });
    
    if (!rolesConfig.success || !rolesConfig.data?.value) {
      // Intentar también con el formato original
      const rolesConfigAlt = await getSystemConfig(`roles.${userRole}`, userEntityId);
      if (rolesConfigAlt.success && rolesConfigAlt.data?.value) {
        const permissions = rolesConfigAlt.data.value as Record<string, { read: boolean; create: boolean; update: boolean; delete: boolean }>;
        console.log('[getUserPermissions] Permisos encontrados (formato alternativo):', permissions);
        return permissions;
      }
      console.log('[getUserPermissions] No se encontraron permisos configurados, usando sistema por defecto');
      return null; // Si no hay configuración, usar sistema por defecto
    }

    const permissions = rolesConfig.data.value as Record<string, { read: boolean; create: boolean; update: boolean; delete: boolean }>;
    console.log('[getUserPermissions] Permisos encontrados:', permissions);
    return permissions;
  } catch (error) {
    console.error('Error obteniendo permisos del usuario:', error);
    return null;
  }
}

/**
 * Obtiene los módulos habilitados para una entidad desde EntityModule
 * Retorna un Set con los nombres de módulos habilitados (normalizados a lowercase)
 */
export async function getEnabledModulesForEntity(entityId: string): Promise<Set<string>> {
  try {
    // Obtener el cliente Prisma correcto para esta entidad
    const entityPrisma = getPrismaClient(entityId);
    
    if (!entityPrisma || typeof entityPrisma.entityModule === 'undefined') {
      console.log('[getEnabledModulesForEntity] Prisma no disponible para entidad:', entityId);
      return new Set(); // Si no hay BD, retornar vacío (bloquear todo excepto SUPER_ADMIN)
    }

    let entityModules = [];
    try {
      // Primero obtener los EntityModule sin relaciones
      const entityModuleRecords = await entityPrisma.entityModule.findMany({
        where: {
          entityId: entityId,
          enabled: true,
        },
      });

      // Luego obtener los módulos correspondientes usando los moduleIds
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
        console.log('[getEnabledModulesForEntity] Tabla entity_modules no existe, actualizando esquema...');
        const { updateEntityDatabaseSchema } = await import('@/lib/database-manager');
        const updateResult = await updateEntityDatabaseSchema(entityId);
        if (updateResult.success) {
          // Reintentar la consulta después de actualizar el esquema
          const entityModuleRecords = await entityPrisma.entityModule.findMany({
            where: {
              entityId: entityId,
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
          console.error('[getEnabledModulesForEntity] Error actualizando esquema:', updateResult.error);
          return new Set(); // Retornar vacío si no se puede actualizar
        }
      } else {
        throw tableError;
      }
    }

    console.log('[getEnabledModulesForEntity] Módulos encontrados en BD:', entityModules.map(em => ({
      moduleId: em.module.id,
      moduleName: em.module.name,
      enabled: em.enabled
    })));

    // Crear un Set con los nombres de módulos habilitados (normalizados)
    const enabledModuleNames = new Set<string>();
    
    entityModules.forEach(em => {
      const originalName = em.module.name;
      const moduleId = em.module.id;
      const moduleName = normalizeString(originalName);
      
      // Agregar el nombre original normalizado
      enabledModuleNames.add(moduleName);
      
      // También agregar el ID del módulo normalizado (por si el nombre no coincide)
      enabledModuleNames.add(normalizeString(moduleId));
      
      // Agregar variaciones comunes del nombre (ya normalizado, pero por si acaso)
      // Remover acentos y caracteres especiales para mejor matching
      const nameWithoutAccents = moduleName
        .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
        .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n');
      enabledModuleNames.add(nameWithoutAccents);
      
      // Agregar también el nombre original sin normalizar (por si acaso)
      enabledModuleNames.add(originalName.toLowerCase().trim());
      
      // Agregar el nombre sin espacios ni caracteres especiales
      const nameNoSpaces = moduleName.replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
      enabledModuleNames.add(nameNoSpaces);
      
      // Agregar solo la primera palabra del nombre (por si es "Administración del Sistema")
      const firstWord = moduleName.split(' ')[0];
      if (firstWord && firstWord.length > 2) {
        enabledModuleNames.add(firstWord);
      }
      
      // CRÍTICO: Agregar el mapeo inverso desde el nombre de BD al ID de navegación
      // Esto es esencial porque los nombres en BD ('Administración') deben mapearse a IDs de navegación ('admin')
      const matchingNavIds = getNavigationIdForModuleName(originalName);
      matchingNavIds.forEach(navId => {
        enabledModuleNames.add(normalizeString(navId));
        enabledModuleNames.add(navId.toLowerCase());
        // También agregar variaciones del ID de navegación
        enabledModuleNames.add(navId);
      });
    });

    console.log('[getEnabledModulesForEntity] Módulos habilitados normalizados para entidad:', {
      entityId,
      count: enabledModuleNames.size,
      modules: Array.from(enabledModuleNames)
    });
    return enabledModuleNames;
  } catch (error) {
    console.error('[getEnabledModulesForEntity] Error obteniendo módulos habilitados:', error);
    return new Set(); // En caso de error, retornar vacío (bloquear todo)
  }
}

/**
 * Mapeo de IDs de navegación a nombres de módulos en la BD
 * Este mapeo conecta los IDs usados en la navegación con los nombres de módulos en EntityModule
 * IMPORTANTE: Los nombres deben coincidir exactamente con los nombres en initializeModules()
 */
const NAVIGATION_TO_MODULE_MAP: Record<string, string[]> = {
  'dashboard': ['dashboard', 'panel principal'],
  'patients': ['pacientes', 'patients', 'gestión de pacientes'],
  'admin': ['administracion', 'administración', 'admin', 'administracion del sistema', 'administración del sistema'],
  'facturacion': ['facturacion', 'facturación', 'billing'],
  'citas': ['citas', 'appointments', 'citas médicas'],
  'historias': ['historias', 'historias clinicas', 'historias clínicas', 'clinical records'],
  'triage': ['triage', 'triaje'],
  'asistencial': ['asistencial', 'clinical care', 'atención asistencial'],
  'inventario': ['inventario', 'inventory'],
  'auditoria': ['auditoria', 'auditoría', 'audit'],
  'laboratorio': ['laboratorio', 'laboratory'],
  'imagenes-diagnosticas': ['imagenes', 'imágenes', 'imagenes diagnosticas', 'imágenes diagnósticas', 'diagnostic images'],
  'calidad': ['calidad', 'quality'],
  'farmacia': ['farmacia', 'pharmacy'],
  'contabilidad': ['contabilidad', 'accounting'],
  'presupuesto': ['presupuesto', 'budget'],
  'nomina': ['nomina', 'nómina', 'payroll'],
  'cartera': ['cartera', 'portfolio'],
  'admision': ['admisiones', 'admisión', 'admissions'],
  'configuracion': ['configuracion', 'configuración', 'configuration', 'configuración general'], // Solo para SUPER_ADMIN
};

/**
 * Mapeo inverso: nombres de módulos en BD -> IDs de navegación
 * Esto permite encontrar el ID de navegación dado un nombre de módulo de la BD
 * 
 * Mapeo directo de nombres en BD (initializeModules) a IDs de navegación:
 * - 'Dashboard' -> 'dashboard'
 * - 'Pacientes' -> 'patients'
 * - 'Administración' -> 'admin'
 * - 'Facturación' -> 'facturacion'
 * - 'Citas' -> 'citas'
 * - 'Historias Clínicas' -> 'historias'
 * - 'Triage' -> 'triage'
 * - 'Asistencial' -> 'asistencial'
 * - 'Inventario' -> 'inventario'
 * - 'Auditoría' -> 'auditoria'
 * - 'Laboratorio' -> 'laboratorio'
 * - 'Imágenes Diagnósticas' -> 'imagenes-diagnosticas'
 * - 'Calidad' -> 'calidad'
 * - 'Farmacia' -> 'farmacia'
 * - 'Contabilidad' -> 'contabilidad'
 * - 'Presupuesto' -> 'presupuesto'
 * - 'Nómina' -> 'nomina'
 * - 'Cartera' -> 'cartera'
 * - 'Configuración General' -> 'configuracion'
 */
function getNavigationIdForModuleName(moduleName: string): string[] {
  const normalizedModuleName = normalizeString(moduleName);
  const matchingNavIds: string[] = [];
  
  // Mapeo directo de nombres en BD a IDs de navegación
  const directMapping: Record<string, string> = {
    'dashboard': 'dashboard',
    'pacientes': 'patients',
    'administracion': 'admin',
    'administración': 'admin',
    'facturacion': 'facturacion',
    'facturación': 'facturacion',
    'citas': 'citas',
    'historias clinicas': 'historias',
    'historias clínicas': 'historias',
    'triage': 'triage',
    'asistencial': 'asistencial',
    'inventario': 'inventario',
    'auditoria': 'auditoria',
    'auditoría': 'auditoria',
    'laboratorio': 'laboratorio',
    'imagenes diagnosticas': 'imagenes-diagnosticas',
    'imágenes diagnósticas': 'imagenes-diagnosticas',
    'calidad': 'calidad',
    'farmacia': 'farmacia',
    'contabilidad': 'contabilidad',
    'presupuesto': 'presupuesto',
    'nomina': 'nomina',
    'nómina': 'nomina',
    'cartera': 'cartera',
    'configuracion general': 'configuracion',
    'configuración general': 'configuracion',
  };
  
  // Buscar mapeo directo
  if (directMapping[normalizedModuleName]) {
    matchingNavIds.push(directMapping[normalizedModuleName]);
  }
  
  // También buscar en el mapeo inverso usando NAVIGATION_TO_MODULE_MAP
  for (const [navId, possibleNames] of Object.entries(NAVIGATION_TO_MODULE_MAP)) {
    const normalizedPossibleNames = possibleNames.map(n => normalizeString(n));
    if (normalizedPossibleNames.includes(normalizedModuleName) || 
        normalizedPossibleNames.some(n => normalizedModuleName.includes(n)) ||
        normalizedModuleName.includes(normalizeString(navId))) {
      if (!matchingNavIds.includes(navId)) {
        matchingNavIds.push(navId);
      }
    }
  }
  
  return matchingNavIds;
}

/**
 * Normaliza un string para comparación (lowercase, sin espacios extra, sin acentos)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ñ/g, 'n');
}

/**
 * Verifica si un módulo de navegación está habilitado para la entidad
 */
function isModuleEnabledForEntity(navItemId: string, enabledModuleNames: Set<string>): boolean {
  // Si no hay módulos habilitados, bloquear todo (excepto para SUPER_ADMIN que se maneja arriba)
  if (enabledModuleNames.size === 0) {
    console.log(`[isModuleEnabledForEntity] No hay módulos habilitados, bloqueando "${navItemId}"`);
    return false;
  }

  // Normalizar el ID de navegación
  const normalizedNavId = normalizeString(navItemId);
  
  // Verificar primero si el ID de navegación coincide directamente
  if (enabledModuleNames.has(normalizedNavId)) {
    console.log(`[isModuleEnabledForEntity] Módulo "${navItemId}" encontrado directamente como "${normalizedNavId}"`);
    return true;
  }

  // Obtener los posibles nombres del módulo en la BD
  const possibleNames = NAVIGATION_TO_MODULE_MAP[navItemId] || [navItemId];
  
  // Normalizar los nombres posibles y verificar si alguno coincide
  const normalizedPossibleNames = possibleNames.map(name => normalizeString(name));
  
  // Verificar si alguno de los nombres normalizados está en los módulos habilitados
  for (const normalizedName of normalizedPossibleNames) {
    if (enabledModuleNames.has(normalizedName)) {
      console.log(`[isModuleEnabledForEntity] Módulo "${navItemId}" encontrado como "${normalizedName}"`);
      return true;
    }
  }
  
  // Log para depuración: ver qué módulos están habilitados vs qué se está buscando
  console.log(`[isModuleEnabledForEntity] Módulo "${navItemId}" NO encontrado en módulos habilitados:`, {
    buscando: normalizedNavId,
    posiblesNombres: normalizedPossibleNames,
    modulosHabilitados: Array.from(enabledModuleNames)
  });
  
  return false;
}

/**
 * Filtra la navegación por módulos habilitados para la entidad
 * Solo filtra los módulos principales (nivel 1), los submódulos se muestran si el módulo principal está habilitado
 */
function filterNavigationByEnabledModules(
  navItems: NavigationItem[],
  enabledModuleNames: Set<string>
): NavigationItem[] {
  console.log('[filterNavigationByEnabledModules] Iniciando filtrado:', {
    navItemsCount: navItems.length,
    enabledModuleNamesCount: enabledModuleNames.size,
    enabledModuleNames: Array.from(enabledModuleNames)
  });
  
  const filtered = navItems
    .map(item => {
      // Verificar si el módulo principal está habilitado
      const isEnabled = isModuleEnabledForEntity(item.id, enabledModuleNames);
      
      if (!isEnabled) {
        console.log(`[filterNavigationByEnabledModules] Módulo "${item.id}" (${item.title}) NO está habilitado, filtrando`);
        return null; // Filtrar el módulo completo si no está habilitado
      }

      console.log(`[filterNavigationByEnabledModules] Módulo "${item.id}" (${item.title}) está habilitado, incluyendo`);
      
      // Si el módulo principal está habilitado, incluir todos sus hijos y nietos
      // Los submódulos no necesitan estar en EntityModule, solo los módulos principales
      return item;
    })
    .filter((item): item is NavigationItem => item !== null);
  
  console.log('[filterNavigationByEnabledModules] Resultado del filtrado:', {
    antes: navItems.length,
    despues: filtered.length,
    filtrados: filtered.map(n => ({ id: n.id, title: n.title }))
  });
  
  return filtered;
}

/**
 * Obtiene la navegación filtrada por permisos del usuario actual
 * Server Action
 */
export async function getNavigationByPermissions(): Promise<NavigationItem[]> {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || 'Administrador';
    const userEntityId = (session?.user as any)?.entityId;

    console.log('[getNavigationByPermissions] Iniciando:', { userRole, userEntityId });

    // SUPER_ADMIN siempre ve todos los módulos (excepto configuración que se maneja después)
    if (userRole === 'SUPER_ADMIN') {
      const baseNavigation = getNavigationByRole(userRole);
      // Configuración ya está incluida para SUPER_ADMIN en getNavigationByRole
      return baseNavigation;
    }

    // Si no hay entityId, no mostrar nada (usuario sin entidad asignada)
    if (!userEntityId) {
      console.log('[getNavigationByPermissions] Usuario sin entityId, retornando navegación vacía');
      return [];
    }

    // Obtener módulos habilitados para la entidad
    const enabledModuleNames = await getEnabledModulesForEntity(userEntityId);
    
    // Si no hay módulos habilitados, retornar vacío (bloquear todo)
    if (enabledModuleNames.size === 0) {
      console.log('[getNavigationByPermissions] ⚠️ No hay módulos habilitados para la entidad, retornando navegación vacía');
      console.log('[getNavigationByPermissions] Para depurar, verifica que la entidad tenga módulos en EntityModule con enabled=true');
      console.log('[getNavigationByPermissions] EntityId actual:', userEntityId);
      return [];
    }

    // Obtener permisos del usuario
    const permissions = await getUserPermissions(userEntityId);

    // Obtener navegación base por rol
    const baseNavigation = getNavigationByRole(userRole);
    console.log('[getNavigationByPermissions] Navegación base:', baseNavigation.length, 'módulos');

    // Primero filtrar por módulos habilitados para la entidad
    console.log('[getNavigationByPermissions] ANTES de filtrar por módulos habilitados:', {
      baseNavigationCount: baseNavigation.length,
      baseNavigationModules: baseNavigation.map(n => ({ id: n.id, title: n.title })),
      enabledModuleNames: Array.from(enabledModuleNames),
      enabledModuleNamesCount: enabledModuleNames.size
    });
    
    let filteredNavigation = filterNavigationByEnabledModules(baseNavigation, enabledModuleNames);
    
    console.log('[getNavigationByPermissions] DESPUÉS de filtrar por módulos habilitados:', {
      antes: baseNavigation.length,
      despues: filteredNavigation.length,
      modulosHabilitados: Array.from(enabledModuleNames),
      modulosFiltrados: filteredNavigation.map(n => ({ id: n.id, title: n.title }))
    });

    // Luego filtrar por permisos de roles si están configurados
    if (permissions) {
      console.log('[getNavigationByPermissions] Filtrando navegación con permisos:', permissions);
      filteredNavigation = filterNavigationByPermissions(filteredNavigation, permissions);
      console.log('[getNavigationByPermissions] Navegación filtrada por permisos:', filteredNavigation.length, 'módulos');
    }

    // Filtrar el módulo de configuración: solo visible para SUPER_ADMIN
    filteredNavigation = filteredNavigation.filter(item => item.id !== 'configuracion');
    console.log('[getNavigationByPermissions] Módulo de configuración removido (solo para SUPER_ADMIN)');

    return filteredNavigation;
  } catch (error) {
    console.error('Error obteniendo navegación por permisos:', error);
    // Fallback a navegación por rol
    try {
      const session = await getServerSession(authOptions);
      const userRole = (session?.user as any)?.role || 'Administrador';
      const fallbackNavigation = getNavigationByRole(userRole);
      
      // También filtrar configuración en el fallback si no es SUPER_ADMIN
      if (userRole !== 'SUPER_ADMIN') {
        return fallbackNavigation.filter(item => item.id !== 'configuracion');
      }
      
      return fallbackNavigation;
    } catch {
      return [];
    }
  }
}
