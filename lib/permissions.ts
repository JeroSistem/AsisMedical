import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSystemConfig } from '@/lib/actions/config';
import { getNavigationByRole, filterNavigationByPermissions, MAIN_NAVIGATION, type NavigationItem } from '@/lib/navigation';
import { prisma } from '@/lib/prisma';
import { getPrismaClient, getPrismaClientForEntity } from '@/lib/database-manager';

/**
 * Obtiene los permisos del usuario actual desde la configuración de roles
 * (módulo de servidor; helpers síncronos también se exportan, por eso no usa 'use server')
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
    let entityModules: Array<{ module: { id: string; name: string }; enabled: boolean }> = [];

    // 1) Preferir BD principal (más confiable para el menú)
    if (prisma && typeof prisma.entityModule !== 'undefined') {
      try {
        const mainRecords = await prisma.entityModule.findMany({
          where: { entityId, enabled: true },
          include: { module: { select: { id: true, name: true } } },
        });
        entityModules = mainRecords.map((em) => ({
          enabled: em.enabled,
          module: em.module,
        }));
      } catch (mainErr) {
        console.warn('[getEnabledModulesForEntity] BD principal:', mainErr);
      }
    }

    // 2) Fallback / complemento: BD de la entidad
    if (entityModules.length === 0) {
      const entityPrisma = getPrismaClient(entityId);
      if (entityPrisma && typeof entityPrisma.entityModule !== 'undefined') {
        try {
          const entityModuleRecords = await entityPrisma.entityModule.findMany({
            where: { entityId, enabled: true },
          });
          const moduleIds = entityModuleRecords.map((em) => em.moduleId);
          if (moduleIds.length > 0) {
            const modules = await entityPrisma.module.findMany({
              where: { id: { in: moduleIds } },
              select: { id: true, name: true },
            });
            entityModules = entityModuleRecords.map((em) => ({
              enabled: em.enabled,
              module:
                modules.find((m) => m.id === em.moduleId) || {
                  id: em.moduleId,
                  name: 'Unknown',
                },
            }));
          }
        } catch (tableError: any) {
          console.warn('[getEnabledModulesForEntity] BD entidad:', tableError?.message);
        }
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
  'admin': ['administracion', 'administración', 'admin', 'administracion del sistema', 'administración del sistema', 'pacientes', 'patients', 'gestión de pacientes'],
  // patients queda bajo Administración; se mantiene por compatibilidad de mapeos antiguos
  'patients': ['pacientes', 'patients', 'gestión de pacientes'],
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
  'plataforma': ['plataforma', 'usuarios principales', 'usuarios-principales'], // Solo para SUPER_ADMIN
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
    'pacientes': 'admin',
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
export function isModuleEnabledForEntity(navItemId: string, enabledModuleNames: Set<string>): boolean {
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

type ProfilePermRow = {
  moduleKey: string;
  submoduleKey: string;
  canRead: boolean;
};

/**
 * Carga permisos del perfil de acceso del usuario (BD tenant).
 */
async function getAccessProfilePermissionsForUser(
  userId: string,
  entityId: string
): Promise<ProfilePermRow[]> {
  try {
    const entityPrisma = getPrismaClientForEntity(entityId);
    const rows = await entityPrisma.$queryRaw<ProfilePermRow[]>`
      SELECT
        p.module_key AS "moduleKey",
        COALESCE(p.submodule_key, '') AS "submoduleKey",
        p.can_read AS "canRead"
      FROM users u
      INNER JOIN access_profiles ap ON ap.id = u.access_profile_id
      INNER JOIN access_profile_permissions p ON p.profile_id = ap.id
      WHERE u.id = ${userId}
        AND u.entity_id = ${entityId}
        AND LOWER(COALESCE(ap.status, 'active')) IN ('active', 'activo')
    `;
    return (rows || []).map((r) => ({
      moduleKey: String(r.moduleKey || ''),
      submoduleKey: String(r.submoduleKey || ''),
      canRead: Boolean(r.canRead),
    }));
  } catch (error) {
    console.error('[getAccessProfilePermissionsForUser]', error);
    return [];
  }
}

function isInstitutionAdminRole(role: string) {
  return (
    role === 'ENTITY_ADMIN' ||
    role === 'ADMIN' ||
    role === 'Administrador'
  );
}

/**
 * Filtra navegación según permisos del perfil (moduleKey / submoduleKey).
 */
function filterNavigationByAccessProfile(
  navItems: NavigationItem[],
  permissions: ProfilePermRow[]
): NavigationItem[] {
  const readable = permissions.filter((p) => p.canRead && p.moduleKey);
  if (!readable.length) return [];

  const byModule = new Map<string, Set<string>>();
  for (const p of readable) {
    if (!byModule.has(p.moduleKey)) byModule.set(p.moduleKey, new Set());
    byModule.get(p.moduleKey)!.add(p.submoduleKey || '');
  }

  return navItems
    .map((item) => {
      const allowed = byModule.get(item.id);
      if (!allowed) return null;

      if (!item.children?.length) {
        return item;
      }

      const fullModule = allowed.has('');
      const filteredChildren = item.children
        .map((child) => {
          const childOk = fullModule || allowed.has(child.id);
          if (!childOk) return null;

          if (!child.children?.length) return child;

          if (fullModule) return child;

          const filteredGrand = child.children.filter((g) => allowed.has(g.id));
          return {
            ...child,
            children: filteredGrand.length > 0 ? filteredGrand : undefined,
          };
        })
        .filter((c): c is NavigationItem => c !== null);

      if (!fullModule && filteredChildren.length === 0) return null;

      return {
        ...item,
        children:
          filteredChildren.length > 0
            ? filteredChildren
            : fullModule
              ? item.children
              : undefined,
      };
    })
    .filter((item): item is NavigationItem => item !== null);
}

/**
 * Obtiene la navegación filtrada por permisos del usuario actual
 */
export async function getNavigationByPermissions(): Promise<NavigationItem[]> {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || 'Administrador';
    const userEntityId = (session?.user as any)?.entityId;
    const userId = (session?.user as any)?.id as string | undefined;

    console.log('[getNavigationByPermissions] Iniciando:', {
      userRole,
      userEntityId,
      userId,
    });

    if (userRole === 'SUPER_ADMIN') {
      return getNavigationByRole(userRole);
    }

    if (!userEntityId) {
      console.log('[getNavigationByPermissions] Usuario sin entityId, retornando navegación vacía');
      return [];
    }

    const enabledModuleNames = await getEnabledModulesForEntity(userEntityId);

    if (enabledModuleNames.size === 0) {
      console.log(
        '[getNavigationByPermissions] No hay módulos habilitados para la entidad'
      );
      return [];
    }

    // Admin de institución: menú completo de módulos contratados
    if (isInstitutionAdminRole(userRole)) {
      const permissions = await getUserPermissions(userEntityId);
      let filteredNavigation = filterNavigationByEnabledModules(
        getNavigationByRole(userRole),
        enabledModuleNames
      );
      if (permissions) {
        filteredNavigation = filterNavigationByPermissions(
          filteredNavigation,
          permissions
        );
      }
      return filteredNavigation.filter(
        (item) => item.id !== 'configuracion' && item.id !== 'plataforma'
      );
    }

    // Empleados / usuarios del sistema: menú según perfil de acceso
    if (!userId) {
      console.log('[getNavigationByPermissions] Sin userId, menú vacío');
      return [];
    }

    const profilePerms = await getAccessProfilePermissionsForUser(
      userId,
      userEntityId
    );
    console.log('[getNavigationByPermissions] Permisos de perfil:', {
      count: profilePerms.length,
      modules: [...new Set(profilePerms.map((p) => p.moduleKey))],
    });

    if (!profilePerms.length) {
      console.log(
        '[getNavigationByPermissions] Usuario sin perfil/permisos de lectura'
      );
      return [];
    }

    // Base = toda la navegación (el perfil define qué ve; el rol USER no está en roles de menú)
    let filteredNavigation = filterNavigationByEnabledModules(
      MAIN_NAVIGATION,
      enabledModuleNames
    );
    filteredNavigation = filterNavigationByAccessProfile(
      filteredNavigation,
      profilePerms
    );
    filteredNavigation = filteredNavigation.filter(
      (item) => item.id !== 'configuracion' && item.id !== 'plataforma'
    );

    console.log('[getNavigationByPermissions] Menú por perfil:', {
      count: filteredNavigation.length,
      modules: filteredNavigation.map((n) => n.id),
    });

    return filteredNavigation;
  } catch (error) {
    console.error('Error obteniendo navegación por permisos:', error);
    try {
      const session = await getServerSession(authOptions);
      const userRole = (session?.user as any)?.role || 'Administrador';
      if (userRole === 'SUPER_ADMIN') {
        return getNavigationByRole(userRole);
      }
      return [];
    } catch {
      return [];
    }
  }
}
