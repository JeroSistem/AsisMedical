'use server';

import { getServerSession } from 'next-auth';
import * as bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  createEntityDatabase,
  getPrismaClientForEntity,
  updateEntityDatabaseSchema,
} from '@/lib/database-manager';
import {
  associateModulesToEntity,
  getAllModules,
} from '@/lib/actions/entities';
import { initializeModules } from '@/lib/actions/modules';

export interface PrincipalUserFormData {
  entityId?: string;
  institutionName: string;
  nit: string;
  city: string;
  department: string;
  phone: string;
  email: string;
  password?: string;
  status?: 'Active' | 'Inactive';
  modules?: string[];
}

function isPlatformOwnerRole(role?: string | null) {
  return role === 'SUPER_ADMIN' || role === 'Administrador' || role === 'ADMIN';
}

async function requirePlatformOwner() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (
    role === 'ENTITY_ADMIN' ||
    role === 'MEDICO' ||
    role === 'ENFERMERO' ||
    role === 'USER'
  ) {
    return {
      ok: false as const,
      error:
        'Solo el administrador principal de la plataforma puede usar este módulo',
    };
  }
  if (!role || isPlatformOwnerRole(role)) {
    return { ok: true as const, session };
  }
  return {
    ok: false as const,
    error:
      'Solo el administrador principal de la plataforma puede usar este módulo',
  };
}

async function resolveAdminForEntity(
  entityId: string,
  adminUserId: string | null
) {
  try {
    if (adminUserId) {
      const byId = await prisma.user.findUnique({
        where: { id: adminUserId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      });
      if (byId) return byId;
    }

    const byEntity = await prisma.user.findFirst({
      where: { entityId, role: 'ENTITY_ADMIN' },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
    if (byEntity) return byEntity;

    // Fallback legacy: BD de entidad
    const entityPrisma = getPrismaClientForEntity(entityId);
    return await entityPrisma.user.findFirst({
      where: { role: 'ENTITY_ADMIN', entityId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
  } catch (error) {
    console.warn(
      '[principal-users] No se pudo leer admin de entidad:',
      entityId,
      error
    );
    return null;
  }
}

async function resolveModuleNames(moduleIdsOrNames: string[]) {
  await initializeModules();
  const modulesRes = await getAllModules();
  const catalog = modulesRes.data || [];
  return moduleIdsOrNames.map((idOrName) => {
    const found = catalog.find(
      (m: any) => m.id === idOrName || m.name === idOrName
    );
    return found?.name || idOrName;
  });
}

/** Lista módulos del sistema (asegura que existan). */
export async function listPlatformModules() {
  try {
    await initializeModules();
    const result = await getAllModules();
    if (!result.success || !result.data?.length) {
      return {
        success: false,
        data: [],
        error: result.error || 'No se pudieron cargar los módulos',
      };
    }
    return result;
  } catch (error: any) {
    console.error('listPlatformModules:', error);
    return {
      success: false,
      data: [],
      error: error?.message || 'Error al cargar módulos',
    };
  }
}

/** Lista entidades contratadas con su usuario principal. */
export async function listPrincipalUsers() {
  const gate = await requirePlatformOwner();
  if (!gate.ok) return { success: false, data: [], error: gate.error };

  if (!prisma || typeof prisma.entity === 'undefined') {
    return { success: false, data: [], error: 'Base de datos no disponible' };
  }

  try {
    const catalog = (await getAllModules()).data || [];

    const entities = await prisma.entity.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        nit: true,
        city: true,
        department: true,
        phone: true,
        type: true,
        status: true,
        adminUserId: true,
        databaseName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const data = await Promise.all(
      entities.map(async (entity) => {
        const adminUser = await resolveAdminForEntity(
          entity.id,
          entity.adminUserId
        );

        let moduleNames: string[] = [];
        try {
          // Preferir BD principal (fuente de verdad del menú)
          const mainEnabled = await prisma.entityModule.findMany({
            where: { entityId: entity.id, enabled: true },
            include: { module: { select: { name: true } } },
          });
          moduleNames = mainEnabled.map((em) => em.module.name);

          if (moduleNames.length === 0 && entity.databaseName) {
            const entityPrisma = getPrismaClientForEntity(entity.id);
            const enabled = await entityPrisma.entityModule.findMany({
              where: { enabled: true },
              include: { module: { select: { name: true } } },
            });
            moduleNames = enabled.map((em) => em.module.name);
          }
        } catch {
          moduleNames = [];
        }

        const moduleIds = catalog
          .filter((m: any) => moduleNames.includes(m.name))
          .map((m: any) => m.id);

        return {
          id: entity.id,
          name: entity.name,
          nit: entity.nit,
          city: entity.city,
          department: entity.department,
          phone: entity.phone,
          type: entity.type,
          status: entity.status,
          adminUserId: entity.adminUserId,
          databaseName: entity.databaseName,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
          adminUser,
          hasPrincipalUser: !!adminUser,
          moduleIds,
          moduleNames,
        };
      })
    );

    return { success: true, data };
  } catch (error: any) {
    console.error('listPrincipalUsers:', error);
    return {
      success: false,
      data: [],
      error: error?.message || 'Error al listar usuarios principales',
    };
  }
}

/** Crea institución + usuario principal, o actualiza ambos. */
export async function upsertPrincipalUser(formData: PrincipalUserFormData) {
  const gate = await requirePlatformOwner();
  if (!gate.ok) return { success: false, error: gate.error };

  if (!prisma || typeof prisma.entity === 'undefined') {
    return { success: false, error: 'Base de datos no disponible' };
  }

  const institutionName = formData.institutionName?.trim();
  const nit = formData.nit?.trim();
  const city = formData.city?.trim();
  const department = formData.department?.trim();
  const phone = formData.phone?.trim();
  const email = formData.email?.trim().toLowerCase();
  const status = formData.status || 'Active';
  const entityStatus = status === 'Active' ? 'ACTIVE' : 'INACTIVE';

  if (!institutionName || !nit || !city || !department || !phone || !email) {
    return {
      success: false,
      error:
        'Institución, NIT, ciudad, departamento, teléfono y email son obligatorios',
    };
  }

  try {
    let entityId = formData.entityId?.trim();
    let entity;
    let justProvisionedDb = false;

    if (entityId) {
      const nameTaken = await prisma.entity.findFirst({
        where: { name: institutionName, NOT: { id: entityId } },
      });
      if (nameTaken) {
        return {
          success: false,
          error: `Ya existe una institución con el nombre "${institutionName}"`,
        };
      }
      const nitTaken = await prisma.entity.findFirst({
        where: { nit, NOT: { id: entityId } },
      });
      if (nitTaken) {
        return { success: false, error: `El NIT ${nit} ya está registrado` };
      }

      entity = await prisma.entity.update({
        where: { id: entityId },
        data: {
          name: institutionName,
          nit,
          city,
          department,
          phone,
          status: entityStatus,
        },
      });
    } else {
      const nameTaken = await prisma.entity.findUnique({
        where: { name: institutionName },
      });
      if (nameTaken) {
        return {
          success: false,
          error: `Ya existe una institución con el nombre "${institutionName}"`,
        };
      }
      const nitTaken = await prisma.entity.findFirst({ where: { nit } });
      if (nitTaken) {
        return { success: false, error: `El NIT ${nit} ya está registrado` };
      }

      if (!formData.password?.trim()) {
        return {
          success: false,
          error: 'La contraseña es obligatoria al crear',
        };
      }

      entity = await prisma.entity.create({
        data: {
          name: institutionName,
          nit,
          city,
          department,
          phone,
          type: 'HOSPITAL',
          status: entityStatus,
        },
      });
      entityId = entity.id;

      const dbResult = await createEntityDatabase(entityId, { fresh: true });
      if (!dbResult.success) {
        await prisma.entity.delete({ where: { id: entityId } }).catch(() => {});
        return {
          success: false,
          error: dbResult.error || 'Error creando base de datos de la entidad',
        };
      }

      entity = await prisma.entity.update({
        where: { id: entityId },
        data: { databaseName: dbResult.databaseName },
      });
      justProvisionedDb = true;
    }

    if (!entity.databaseName && entityId) {
      const dbResult = await createEntityDatabase(entityId, { fresh: true });
      if (!dbResult.success) {
        return {
          success: false,
          error: dbResult.error || 'Error creando base de datos de la entidad',
        };
      }
      entity = await prisma.entity.update({
        where: { id: entityId },
        data: { databaseName: dbResult.databaseName },
      });
      justProvisionedDb = true;
    } else if (entityId && entity.databaseName && !justProvisionedDb) {
      // Institución ya provisionada: solo alinear schema, no borrar datos
      await updateEntityDatabaseSchema(entityId);
    }

    // Registrar la institución dentro de su BD (vacía, sin datos clínicos)
    if (entityId) {
      try {
        const entityPrisma = getPrismaClientForEntity(entityId);
        await entityPrisma.entity.upsert({
          where: { id: entityId },
          update: {
            name: institutionName,
            nit,
            city,
            department,
            phone,
            type: entity.type,
            status: entityStatus,
            databaseName: entity.databaseName,
          },
          create: {
            id: entityId,
            name: institutionName,
            nit,
            city,
            department,
            phone,
            type: entity.type,
            status: entityStatus,
            databaseName: entity.databaseName,
          },
        });
      } catch (metaErr) {
        console.warn(
          '[upsertPrincipalUser] No se pudo sincronizar entidad en BD tenant:',
          metaErr
        );
      }
    }

    const adminDisplayName = `Admin ${institutionName}`;
    const existingMainAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(entity.adminUserId ? [{ id: entity.adminUserId }] : []),
          { entityId: entityId!, role: 'ENTITY_ADMIN' },
        ],
      },
    });

    // El login y la FK adminUserId viven en la BD principal
    let user;
    if (existingMainAdmin) {
      if (
        existingMainAdmin.email !== email &&
        (await prisma.user.findUnique({ where: { email } }))
      ) {
        return {
          success: false,
          error: `El email ${email} ya está registrado`,
        };
      }
      const updateData: Record<string, unknown> = {
        name: adminDisplayName,
        email,
        role: 'ENTITY_ADMIN',
        status,
        entityId,
      };
      if (formData.password?.trim()) {
        updateData.password = await bcrypt.hash(formData.password.trim(), 12);
      }
      user = await prisma.user.update({
        where: { id: existingMainAdmin.id },
        data: updateData,
      });
    } else {
      if (!formData.password?.trim()) {
        return {
          success: false,
          error: 'La contraseña es obligatoria para el primer usuario principal',
        };
      }
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        return {
          success: false,
          error: `El email ${email} ya está registrado`,
        };
      }
      user = await prisma.user.create({
        data: {
          name: adminDisplayName,
          email,
          password: await bcrypt.hash(formData.password.trim(), 12),
          role: 'ENTITY_ADMIN',
          status,
          entityId,
        },
      });
    }

    await prisma.entity.update({
      where: { id: entityId! },
      data: { adminUserId: user.id },
    });

    // Espejo best-effort en BD de la entidad
    try {
      const entityPrisma = getPrismaClientForEntity(entityId!);
      const entityAdmin = await entityPrisma.user.findFirst({
        where: { email },
      });
      if (entityAdmin) {
        await entityPrisma.user.update({
          where: { id: entityAdmin.id },
          data: {
            name: adminDisplayName,
            email,
            role: 'ENTITY_ADMIN',
            status,
            entityId,
            ...(formData.password?.trim()
              ? { password: await bcrypt.hash(formData.password.trim(), 12) }
              : user.password
                ? { password: user.password }
                : {}),
          },
        });
      } else if (user.password) {
        await entityPrisma.user.create({
          data: {
            id: user.id,
            name: adminDisplayName,
            email,
            password: user.password,
            role: 'ENTITY_ADMIN',
            status,
            entityId,
          },
        });
      }
    } catch (mirrorError) {
      console.warn(
        '[upsertPrincipalUser] No se pudo espejar usuario en BD entidad:',
        mirrorError
      );
    }

    if (Array.isArray(formData.modules)) {
      const names = await resolveModuleNames(formData.modules);
      const assoc = await associateModulesToEntity(entityId!, names);
      if (!assoc.success) {
        return {
          success: false,
          error: assoc.error || 'No se pudieron asociar los módulos seleccionados',
        };
      }
    }

    return {
      success: true,
      data: {
        entityId,
        entityName: institutionName,
        adminUser: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
    };
  } catch (error: any) {
    console.error('upsertPrincipalUser:', error);
    return {
      success: false,
      error: error?.message || 'Error al guardar el usuario principal',
    };
  }
}

/** Desactiva el usuario principal de una entidad (no elimina la entidad). */
export async function deactivatePrincipalUser(entityId: string) {
  const gate = await requirePlatformOwner();
  if (!gate.ok) return { success: false, error: gate.error };

  if (!prisma || typeof prisma.entity === 'undefined') {
    return { success: false, error: 'Base de datos no disponible' };
  }

  try {
    const entity = await prisma.entity.findUnique({ where: { id: entityId } });
    if (!entity) return { success: false, error: 'Entidad no encontrada' };

    const admin = await resolveAdminForEntity(entityId, entity.adminUserId);
    if (!admin) {
      return { success: false, error: 'No hay usuario principal en esa entidad' };
    }

    const entityPrisma = getPrismaClientForEntity(entityId);
    await entityPrisma.user.update({
      where: { id: admin.id },
      data: { status: 'Inactive' },
    });

    await prisma.entity.update({
      where: { id: entityId },
      data: { status: 'INACTIVE' },
    });

    return { success: true };
  } catch (error: any) {
    console.error('deactivatePrincipalUser:', error);
    return {
      success: false,
      error: error?.message || 'Error al desactivar usuario',
    };
  }
}
