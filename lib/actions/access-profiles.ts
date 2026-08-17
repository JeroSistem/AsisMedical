'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  clearPrismaClientCache,
  getPrismaClientForEntity,
  ensureEntityIncrementalTables,
} from '@/lib/database-manager';
import { MAIN_NAVIGATION } from '@/lib/navigation';
import type { NavigationItem } from '@/lib/types';
import { getEnabledModulesForEntity, isModuleEnabledForEntity } from '@/lib/permissions';

export type ModuleTreeNode = {
  id: string;
  title: string;
  href?: string;
  children?: ModuleTreeNode[];
};

export type ProfilePermissionInput = {
  moduleKey: string;
  submoduleKey?: string;
  canRead?: boolean;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
};

export type AccessProfileInput = {
  name: string;
  description?: string;
  status?: string;
  permissions: ProfilePermissionInput[];
};

async function requireInstitutionAdmin() {
  const session = await getServerSession(authOptions);
  const entityId = (session?.user as { entityId?: string | null } | undefined)
    ?.entityId;
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user) return { ok: false as const, error: 'No autenticado' };
  if (!entityId) {
    return {
      ok: false as const,
      error: 'Su usuario no está asociado a una institución',
    };
  }

  const allowed =
    role === 'ENTITY_ADMIN' ||
    role === 'SUPER_ADMIN' ||
    role === 'ADMIN' ||
    role === 'Administrador';
  if (!allowed) {
    return {
      ok: false as const,
      error: 'Solo el administrador de la institución puede gestionar perfiles',
    };
  }

  return { ok: true as const, entityId, role };
}

async function ensureAccessProfileTables(entityId: string) {
  let client = getPrismaClientForEntity(entityId);
  try {
    const model = (client as { accessProfile?: { findFirst: Function } })
      .accessProfile;
    if (!model) throw new Error('accessProfile missing');
    await model.findFirst({ take: 1 });
    return client;
  } catch {
    const updated = await ensureEntityIncrementalTables(entityId);
    if (!updated.success) {
      throw new Error(
        updated.error || 'No se pudieron crear las tablas de perfiles'
      );
    }
    clearPrismaClientCache(entityId);
    client = getPrismaClientForEntity(entityId);
    if (!(client as { accessProfile?: unknown }).accessProfile) {
      throw new Error(
        'Cliente Prisma sin AccessProfile. Reinicie el servidor (npm run dev).'
      );
    }
    return client;
  }
}

function toTreeNode(item: NavigationItem): ModuleTreeNode {
  return {
    id: item.id,
    title: item.title,
    href: item.href,
    children: item.children?.map(toTreeNode),
  };
}

/**
 * Árbol de módulos/submódulos disponibles para perfiles =
 * navegación filtrada por módulos contratados de la institución.
 * Si se activan más módulos después, aparecerán aquí automáticamente.
 */
export async function getModulesForProfiles() {
  const gate = await requireInstitutionAdmin();
  if (!gate.ok) return { success: false, data: [] as ModuleTreeNode[], error: gate.error };

  try {
    const enabled = await getEnabledModulesForEntity(gate.entityId);

    const filtered = MAIN_NAVIGATION.filter((item) => {
      if (item.id === 'plataforma' || item.id === 'configuracion') return false;
      if (enabled.size === 0) return false;
      return isModuleEnabledForEntity(item.id, enabled);
    }).map(toTreeNode);

    return { success: true, data: filtered };
  } catch (error: any) {
    console.error('getModulesForProfiles:', error);
    return {
      success: false,
      data: [],
      error: error?.message || 'Error al cargar módulos',
    };
  }
}

export async function listAccessProfiles() {
  const gate = await requireInstitutionAdmin();
  if (!gate.ok) return { success: false, data: [], error: gate.error };

  try {
    const client = await ensureAccessProfileTables(gate.entityId);
    const rows = await client.accessProfile.findMany({
      where: { entityId: gate.entityId },
      include: { permissions: true },
      orderBy: { name: 'asc' },
    });

    return {
      success: true,
      data: rows.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        status: p.status,
        createdAt: p.createdAt.toISOString(),
        permissions: p.permissions.map((perm) => ({
          moduleKey: perm.moduleKey,
          submoduleKey: perm.submoduleKey || '',
          canRead: perm.canRead,
          canCreate: perm.canCreate,
          canUpdate: perm.canUpdate,
          canDelete: perm.canDelete,
        })),
      })),
    };
  } catch (error: any) {
    console.error('listAccessProfiles:', error);
    return {
      success: false,
      data: [],
      error: error?.message || 'Error al listar perfiles',
    };
  }
}

async function syncEntityRow(entityId: string, client: ReturnType<typeof getPrismaClientForEntity>) {
  const mainEntity = await prisma.entity.findUnique({ where: { id: entityId } });
  if (!mainEntity) return;
  await client.entity.upsert({
    where: { id: entityId },
    update: {
      name: mainEntity.name,
      databaseName: mainEntity.databaseName,
    },
    create: {
      id: mainEntity.id,
      name: mainEntity.name,
      type: mainEntity.type,
      status: mainEntity.status,
      nit: mainEntity.nit,
      city: mainEntity.city,
      department: mainEntity.department,
      phone: mainEntity.phone,
      databaseName: mainEntity.databaseName,
    },
  });
}

export async function createAccessProfile(input: AccessProfileInput) {
  const gate = await requireInstitutionAdmin();
  if (!gate.ok) return { success: false, error: gate.error };

  const name = input.name?.trim();
  if (!name) return { success: false, error: 'El nombre del perfil es obligatorio' };
  if (!input.permissions?.length) {
    return {
      success: false,
      error: 'Seleccione al menos un módulo o submódulo',
    };
  }

  try {
    const client = await ensureAccessProfileTables(gate.entityId);
    await syncEntityRow(gate.entityId, client);

    const exists = await client.accessProfile.findFirst({
      where: { entityId: gate.entityId, name: { equals: name } },
    });
    if (exists) {
      return { success: false, error: `Ya existe un perfil llamado "${name}"` };
    }

    const created = await client.accessProfile.create({
      data: {
        entityId: gate.entityId,
        name,
        description: input.description?.trim() || null,
        status: input.status || 'Active',
        permissions: {
          create: input.permissions.map((p) => ({
            moduleKey: p.moduleKey,
            submoduleKey: p.submoduleKey || '',
            canRead: p.canRead ?? true,
            canCreate: p.canCreate ?? false,
            canUpdate: p.canUpdate ?? false,
            canDelete: p.canDelete ?? false,
          })),
        },
      },
      include: { permissions: true },
    });

    return {
      success: true,
      data: {
        id: created.id,
        name: created.name,
        permissionsCount: created.permissions.length,
      },
    };
  } catch (error: any) {
    console.error('createAccessProfile:', error);
    return {
      success: false,
      error: error?.message || 'Error al crear el perfil',
    };
  }
}

export async function updateAccessProfile(
  profileId: string,
  input: AccessProfileInput
) {
  const gate = await requireInstitutionAdmin();
  if (!gate.ok) return { success: false, error: gate.error };

  const name = input.name?.trim();
  if (!name) return { success: false, error: 'El nombre del perfil es obligatorio' };

  try {
    const client = await ensureAccessProfileTables(gate.entityId);
    const profile = await client.accessProfile.findFirst({
      where: { id: profileId, entityId: gate.entityId },
    });
    if (!profile) return { success: false, error: 'Perfil no encontrado' };

    const nameTaken = await client.accessProfile.findFirst({
      where: {
        entityId: gate.entityId,
        name: { equals: name },
        NOT: { id: profileId },
      },
    });
    if (nameTaken) {
      return { success: false, error: `Ya existe un perfil llamado "${name}"` };
    }

    await client.accessProfilePermission.deleteMany({
      where: { profileId },
    });

    const updated = await client.accessProfile.update({
      where: { id: profileId },
      data: {
        name,
        description: input.description?.trim() || null,
        status: input.status || profile.status,
        permissions: {
          create: (input.permissions || []).map((p) => ({
            moduleKey: p.moduleKey,
            submoduleKey: p.submoduleKey || '',
            canRead: p.canRead ?? true,
            canCreate: p.canCreate ?? false,
            canUpdate: p.canUpdate ?? false,
            canDelete: p.canDelete ?? false,
          })),
        },
      },
    });

    return { success: true, data: { id: updated.id, name: updated.name } };
  } catch (error: any) {
    console.error('updateAccessProfile:', error);
    return {
      success: false,
      error: error?.message || 'Error al actualizar el perfil',
    };
  }
}

export async function deleteAccessProfile(profileId: string) {
  const gate = await requireInstitutionAdmin();
  if (!gate.ok) return { success: false, error: gate.error };

  try {
    const client = await ensureAccessProfileTables(gate.entityId);
    const profile = await client.accessProfile.findFirst({
      where: { id: profileId, entityId: gate.entityId },
    });
    if (!profile) return { success: false, error: 'Perfil no encontrado' };

    await client.accessProfile.delete({ where: { id: profileId } });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Error al eliminar el perfil',
    };
  }
}
