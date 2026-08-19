'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPrismaClientForEntity } from '@/lib/database-manager';

async function requireEntityContext() {
  const session = await getServerSession(authOptions);
  const entityId = (session?.user as { entityId?: string | null } | undefined)
    ?.entityId;
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user) {
    return { ok: false as const, error: 'No autenticado' };
  }
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
    role === 'Administrador' ||
    role === 'USER' ||
    role === 'MEDICO' ||
    role === 'ENFERMERO';

  if (!allowed) {
    return { ok: false as const, error: 'Sin permiso' };
  }

  return { ok: true as const, entityId, role, session };
}

/**
 * Datos de la institución del usuario en sesión (ya creados desde plataforma).
 */
export async function getMyInstitution() {
  const gate = await requireEntityContext();
  if (!gate.ok) return { success: false, error: gate.error, data: null };

  try {
    const entity = await prisma.entity.findUnique({
      where: { id: gate.entityId },
      select: {
        id: true,
        name: true,
        nit: true,
        city: true,
        department: true,
        phone: true,
        type: true,
        status: true,
        databaseName: true,
        adminUserId: true,
      },
    });

    if (!entity) {
      return { success: false, error: 'Institución no encontrada', data: null };
    }

    let adminEmail: string | null = null;
    let adminName: string | null = null;
    if (entity.adminUserId) {
      const admin = await prisma.user.findUnique({
        where: { id: entity.adminUserId },
        select: { email: true, name: true },
      });
      adminEmail = admin?.email || null;
      adminName = admin?.name || null;
    }

    return {
      success: true,
      data: {
        id: entity.id,
        name: entity.name,
        nit: entity.nit || '',
        city: entity.city || '',
        department: entity.department || '',
        phone: entity.phone || '',
        type: entity.type,
        status: entity.status,
        databaseName: entity.databaseName,
        email: adminEmail || '',
        adminName: adminName || '',
      },
    };
  } catch (error: any) {
    console.error('getMyInstitution:', error);
    return {
      success: false,
      error: error?.message || 'Error al cargar la institución',
      data: null,
    };
  }
}

export type UpdateMyInstitutionInput = {
  name?: string;
  nit?: string;
  city?: string;
  department?: string;
  phone?: string;
  type?: string;
  email?: string;
  address?: string;
  website?: string;
  code?: string;
  /** Datos extendidos opcionales (JSON en system_configurations) */
  extras?: Record<string, unknown>;
};

/**
 * Actualiza los datos de la institución del usuario (BD principal + espejo tenant).
 */
export async function updateMyInstitution(input: UpdateMyInstitutionInput) {
  const gate = await requireEntityContext();
  if (!gate.ok) return { success: false, error: gate.error };

  // Solo el admin de la institución (o plataforma) puede editar
  const canEdit =
    gate.role === 'ENTITY_ADMIN' ||
    gate.role === 'SUPER_ADMIN' ||
    gate.role === 'ADMIN' ||
    gate.role === 'Administrador';
  if (!canEdit) {
    return {
      success: false,
      error: 'Solo el administrador de la institución puede editar estos datos',
    };
  }

  const name = input.name?.trim();
  const nit = input.nit?.trim();
  const city = input.city?.trim();
  const department = input.department?.trim();
  const phone = input.phone?.trim();

  if (!name || !nit || !city || !department || !phone) {
    return {
      success: false,
      error: 'Nombre, NIT, ciudad, departamento y teléfono son obligatorios',
    };
  }

  try {
    const typeMap: Record<string, 'HOSPITAL' | 'CLINIC' | 'IPS' | 'OTHER'> = {
      hospital: 'HOSPITAL',
      HOSPITAL: 'HOSPITAL',
      clinic: 'CLINIC',
      CLINIC: 'CLINIC',
      ips: 'IPS',
      IPS: 'IPS',
      other: 'OTHER',
      OTHER: 'OTHER',
    };
    const type = typeMap[input.type || 'HOSPITAL'] || 'HOSPITAL';

    // Unicidad NIT / nombre (excluyendo esta entidad)
    const conflict = await prisma.entity.findFirst({
      where: {
        OR: [{ name }, { nit }],
        NOT: { id: gate.entityId },
      },
    });
    if (conflict) {
      return {
        success: false,
        error:
          conflict.name === name
            ? 'Ya existe otra institución con ese nombre'
            : 'Ya existe otra institución con ese NIT',
      };
    }

    const updated = await prisma.entity.update({
      where: { id: gate.entityId },
      data: {
        name,
        nit,
        city,
        department,
        phone,
        type,
      },
    });

    // Espejo en BD de la institución
    try {
      const entityPrisma = getPrismaClientForEntity(gate.entityId);
      await entityPrisma.entity.upsert({
        where: { id: gate.entityId },
        update: {
          name,
          nit,
          city,
          department,
          phone,
          type,
          databaseName: updated.databaseName,
        },
        create: {
          id: gate.entityId,
          name,
          nit,
          city,
          department,
          phone,
          type,
          status: updated.status,
          databaseName: updated.databaseName,
        },
      });

      // Extras (dirección, web, código, etc.) en system_configurations de la BD tenant
      if (input.extras || input.address || input.website || input.code || input.email) {
        const extras = {
          ...(input.extras || {}),
          address: input.address ?? '',
          website: input.website ?? '',
          code: input.code ?? '',
          email: input.email ?? '',
        };
        await entityPrisma.systemConfiguration.upsert({
          where: { key: 'institution_profile' },
          update: {
            value: extras,
            description: 'Perfil extendido de la institución',
            category: 'institucion',
          },
          create: {
            key: 'institution_profile',
            value: extras,
            description: 'Perfil extendido de la institución',
            category: 'institucion',
          },
        });
      }
    } catch (mirrorErr) {
      console.warn('[updateMyInstitution] Espejo tenant:', mirrorErr);
    }

    return {
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        nit: updated.nit,
        city: updated.city,
        department: updated.department,
        phone: updated.phone,
        type: updated.type,
      },
    };
  } catch (error: any) {
    console.error('updateMyInstitution:', error);
    return {
      success: false,
      error: error?.message || 'Error al actualizar la institución',
    };
  }
}

/** Carga extras del perfil institucional desde la BD tenant. */
export async function getMyInstitutionExtras() {
  const gate = await requireEntityContext();
  if (!gate.ok) return { success: false, data: {} as Record<string, unknown> };

  try {
    const entityPrisma = getPrismaClientForEntity(gate.entityId);
    const row = await entityPrisma.systemConfiguration.findUnique({
      where: { key: 'institution_profile' },
    });
    const value =
      row?.value && typeof row.value === 'object'
        ? (row.value as Record<string, unknown>)
        : {};
    return { success: true, data: value };
  } catch {
    return { success: true, data: {} as Record<string, unknown> };
  }
}
