'use server';

import { getServerSession } from 'next-auth';
import * as bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPrismaClientForEntity, ensureEntityIncrementalTables } from '@/lib/database-manager';

export type EmployeeRoleInput = 'medico' | 'enfermero' | 'user' | 'admin';

export type CreateEmployeeInput = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  /** Opcional: el acceso se define por perfil */
  role?: EmployeeRoleInput;
  status?: string;
  /** Perfil de acceso creado en Roles / Perfiles */
  accessProfileId?: string | null;
};

function mapRole(role: EmployeeRoleInput): 'MEDICO' | 'ENFERMERO' | 'USER' {
  switch (role) {
    case 'medico':
      return 'MEDICO';
    case 'enfermero':
      return 'ENFERMERO';
    case 'admin':
      // Admin de área (no reemplaza al usuario principal ENTITY_ADMIN)
      return 'USER';
    default:
      return 'USER';
  }
}

function mapStatus(status?: string): string {
  const s = (status || 'active').toLowerCase();
  if (s === 'inactive') return 'Inactive';
  if (s === 'suspended') return 'Suspended';
  return 'Active';
}

async function requireInstitutionAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const entityId = (session?.user as { entityId?: string | null } | undefined)
    ?.entityId;
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!session?.user) {
    return { ok: false as const, error: 'No autenticado' };
  }

  // Usuario principal de la institución (o admin con entityId)
  const allowed =
    role === 'ENTITY_ADMIN' ||
    (role === 'Administrador' && !!entityId) ||
    (role === 'ADMIN' && !!entityId);

  if (!allowed || !entityId) {
    return {
      ok: false as const,
      error:
        'Solo el usuario principal de la institución puede gestionar empleados',
    };
  }

  return { ok: true as const, entityId, userId, role };
}

/**
 * Lista empleados de la institución (BD tenant).
 * Nota: en tenants `role` suele ser TEXT; filtrar con enum Prisma provoca
 * "operator does not exist: text <> UserRole".
 */
export async function listInstitutionEmployees() {
  const gate = await requireInstitutionAdmin();
  if (!gate.ok) return { success: false, data: [], error: gate.error };

  try {
    await ensureEntityIncrementalTables(gate.entityId);
    const entityPrisma = getPrismaClientForEntity(gate.entityId);

    type RawUser = {
      id: string;
      name: string;
      email: string;
      username: string | null;
      role: string;
      status: string;
      createdAt: Date;
      lastLogin: Date | null;
      accessProfileId: string | null;
      accessProfileName: string | null;
    };

    const rows = await entityPrisma.$queryRaw<RawUser[]>`
      SELECT
        u.id,
        u.name,
        u.email,
        u.username,
        u.role AS role,
        u.status,
        u.created_at AS "createdAt",
        u.last_login AS "lastLogin",
        u.access_profile_id AS "accessProfileId",
        p.name AS "accessProfileName"
      FROM users u
      LEFT JOIN access_profiles p ON p.id = u.access_profile_id
      WHERE u.entity_id = ${gate.entityId}
        AND COALESCE(u.role, '') <> 'SUPER_ADMIN'
      ORDER BY u.created_at DESC
    `;

    return {
      success: true,
      data: rows.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        username: u.username || '',
        role: u.role,
        status: u.status,
        accessProfileId: u.accessProfileId || null,
        accessProfileName: u.accessProfileName || null,
        createdAt:
          u.createdAt instanceof Date
            ? u.createdAt.toISOString()
            : String(u.createdAt),
        lastLogin:
          u.lastLogin instanceof Date
            ? u.lastLogin.toISOString()
            : u.lastLogin
              ? String(u.lastLogin)
              : null,
      })),
    };
  } catch (error: any) {
    console.error('listInstitutionEmployees:', error);
    // Fallback sin join de perfiles (columna/tabla ausente)
    try {
      const entityPrisma = getPrismaClientForEntity(gate.entityId);
      const rows = await entityPrisma.$queryRaw<
        Array<{
          id: string;
          name: string;
          email: string;
          username: string | null;
          role: string;
          status: string;
          createdAt: Date;
          lastLogin: Date | null;
        }>
      >`
        SELECT
          id,
          name,
          email,
          username,
          role AS role,
          status,
          created_at AS "createdAt",
          last_login AS "lastLogin"
        FROM users
        WHERE entity_id = ${gate.entityId}
          AND COALESCE(role, '') <> 'SUPER_ADMIN'
        ORDER BY created_at DESC
      `;

      return {
        success: true,
        data: rows.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          username: u.username || '',
          role: u.role,
          status: u.status,
          accessProfileId: null,
          accessProfileName: null,
          createdAt:
            u.createdAt instanceof Date
              ? u.createdAt.toISOString()
              : String(u.createdAt),
          lastLogin:
            u.lastLogin instanceof Date
              ? u.lastLogin.toISOString()
              : u.lastLogin
                ? String(u.lastLogin)
                : null,
        })),
      };
    } catch (fallbackErr: any) {
      console.error('listInstitutionEmployees fallback:', fallbackErr);
      return {
        success: false,
        data: [],
        error:
          fallbackErr?.message ||
          error?.message ||
          'Error al listar empleados',
      };
    }
  }
}

/**
 * Crea un empleado en la BD de la institución (tabla users del tenant).
 * Espejo en BD principal solo para login rápido y unicidad de email/usuario.
 */
export async function createInstitutionEmployee(input: CreateEmployeeInput) {
  const gate = await requireInstitutionAdmin();
  if (!gate.ok) return { success: false, error: gate.error };

  const firstName = input.firstName?.trim();
  const lastName = input.lastName?.trim();
  const email = input.email?.trim().toLowerCase();
  const username = input.username?.trim().toLowerCase();
  const password = input.password?.trim();

  if (!firstName || !lastName || !email || !username || !password) {
    return {
      success: false,
      error: 'Nombre, apellido, email, usuario y contraseña son obligatorios',
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: 'La contraseña debe tener al menos 8 caracteres',
    };
  }

  const role = mapRole(input.role || 'user');
  const status = mapStatus(input.status);
  const name = `${firstName} ${lastName}`.trim();
  const hashed = await bcrypt.hash(password, 12);
  const entityId = gate.entityId;
  const accessProfileId = input.accessProfileId?.trim() || null;

  try {
    await ensureEntityIncrementalTables(entityId);

    // Unicidad en BD principal (login global)
    if (prisma?.user) {
      const taken = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: email } },
            { username: { equals: username } },
          ],
        },
      });
      if (taken) {
        return {
          success: false,
          error: 'El email o nombre de usuario ya está registrado',
        };
      }
    }

    const entityPrisma = getPrismaClientForEntity(entityId);

    if (accessProfileId) {
      const profileModel = (entityPrisma as { accessProfile?: { findFirst: Function } })
        .accessProfile;
      if (!profileModel) {
        return {
          success: false,
          error: 'Los perfiles de acceso no están disponibles. Cree uno en Roles.',
        };
      }
      const profile = await profileModel.findFirst({
        where: { id: accessProfileId, entityId },
        select: { id: true, status: true, name: true },
      });
      if (!profile) {
        return { success: false, error: 'El perfil de acceso seleccionado no existe' };
      }
      if (String(profile.status).toLowerCase() !== 'active') {
        return {
          success: false,
          error: `El perfil "${profile.name}" no está activo`,
        };
      }
    } else {
      return {
        success: false,
        error: 'Debe asignar un perfil de acceso al usuario',
      };
    }

    // Asegurar registro de la entidad en su BD (FK)
    const mainEntity = await prisma.entity.findUnique({
      where: { id: entityId },
    });
    if (mainEntity) {
      await entityPrisma.entity.upsert({
        where: { id: entityId },
        update: {
          name: mainEntity.name,
          status: mainEntity.status,
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

    const takenInTenant = await entityPrisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: email } },
          { username: { equals: username } },
        ],
      },
    });
    if (takenInTenant) {
      return {
        success: false,
        error: 'El email o usuario ya existe en esta institución',
      };
    }

    // 1) Crear en BD de la institución (fuente de verdad del personal)
    const employee = await entityPrisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashed,
        role,
        status,
        entityId,
        accessProfileId,
      },
    });

    // 2) Espejo en BD principal para login (mismo id + entityId)
    try {
      if (prisma?.user) {
        await prisma.user.create({
          data: {
            id: employee.id,
            name,
            email,
            username,
            password: hashed,
            role,
            status,
            entityId,
            // accessProfileId solo aplica en BD tenant; en principal puede no existir el perfil
          },
        });
      }
    } catch (mirrorErr) {
      console.warn(
        '[createInstitutionEmployee] Espejo en BD principal falló:',
        mirrorErr
      );
    }

    return {
      success: true,
      data: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        username: employee.username,
        role: employee.role,
        status: employee.status,
        accessProfileId,
      },
    };
  } catch (error: any) {
    console.error('createInstitutionEmployee:', error);
    return {
      success: false,
      error: error?.message || 'Error al crear el empleado',
    };
  }
}

/** Activa / desactiva un empleado de la institución. */
export async function setInstitutionEmployeeStatus(
  userId: string,
  status: 'Active' | 'Inactive' | 'Suspended'
) {
  const gate = await requireInstitutionAdmin();
  if (!gate.ok) return { success: false, error: gate.error };

  try {
    const entityPrisma = getPrismaClientForEntity(gate.entityId);
    const rows = await entityPrisma.$queryRaw<
      Array<{ id: string; role: string }>
    >`
      SELECT id, role AS role
      FROM users
      WHERE id = ${userId} AND entity_id = ${gate.entityId}
      LIMIT 1
    `;
    const user = rows[0];
    if (!user) return { success: false, error: 'Empleado no encontrado' };
    if (user.role === 'ENTITY_ADMIN') {
      return {
        success: false,
        error: 'No se puede cambiar el estado del usuario principal aquí',
      };
    }

    await entityPrisma.$executeRaw`
      UPDATE users
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId} AND entity_id = ${gate.entityId}
    `;

    try {
      if (prisma?.user) {
        await prisma.$executeRaw`
          UPDATE users
          SET status = ${status}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${userId}
        `;
      }
    } catch {
      // espejo best-effort
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Error al actualizar estado',
    };
  }
}

export type UpdateEmployeeInput = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
  status?: string;
  accessProfileId?: string | null;
};

/** Actualiza un empleado de la institución (perfil, datos, contraseña opcional). */
export async function updateInstitutionEmployee(input: UpdateEmployeeInput) {
  const gate = await requireInstitutionAdmin();
  if (!gate.ok) return { success: false, error: gate.error };

  const userId = input.userId?.trim();
  const firstName = input.firstName?.trim();
  const lastName = input.lastName?.trim();
  const email = input.email?.trim().toLowerCase();
  const username = input.username?.trim().toLowerCase();
  const password = input.password?.trim() || '';
  const status = mapStatus(input.status);
  const accessProfileId = input.accessProfileId?.trim() || null;

  if (!userId || !firstName || !lastName || !email || !username) {
    return {
      success: false,
      error: 'Nombre, apellido, email y usuario son obligatorios',
    };
  }
  if (password && password.length < 8) {
    return {
      success: false,
      error: 'La contraseña debe tener al menos 8 caracteres',
    };
  }
  if (!accessProfileId) {
    return { success: false, error: 'Debe asignar un perfil de acceso al usuario' };
  }

  const name = `${firstName} ${lastName}`.trim();
  const entityId = gate.entityId;

  try {
    await ensureEntityIncrementalTables(entityId);
    const entityPrisma = getPrismaClientForEntity(entityId);

    const existing = await entityPrisma.$queryRaw<
      Array<{ id: string; role: string }>
    >`
      SELECT id, role AS role
      FROM users
      WHERE id = ${userId} AND entity_id = ${entityId}
      LIMIT 1
    `;
    if (!existing[0]) {
      return { success: false, error: 'Usuario no encontrado' };
    }
    if (existing[0].role === 'ENTITY_ADMIN') {
      return {
        success: false,
        error: 'No se puede editar el usuario principal desde aquí',
      };
    }

    const profileRows = await entityPrisma.$queryRaw<
      Array<{ id: string; status: string; name: string }>
    >`
      SELECT id, status, name
      FROM access_profiles
      WHERE id = ${accessProfileId} AND entity_id = ${entityId}
      LIMIT 1
    `;
    const profile = profileRows[0];
    if (!profile) {
      return { success: false, error: 'El perfil de acceso seleccionado no existe' };
    }
    if (String(profile.status).toLowerCase() !== 'active') {
      return {
        success: false,
        error: `El perfil "${profile.name}" no está activo`,
      };
    }

    const taken = await entityPrisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM users
      WHERE entity_id = ${entityId}
        AND id <> ${userId}
        AND (
          LOWER(email) = ${email}
          OR LOWER(COALESCE(username, '')) = ${username}
        )
      LIMIT 1
    `;
    if (taken[0]) {
      return {
        success: false,
        error: 'El email o usuario ya existe en esta institución',
      };
    }

    if (prisma?.user) {
      const takenMain = await prisma.user.findFirst({
        where: {
          id: { not: userId },
          OR: [
            { email: { equals: email } },
            { username: { equals: username } },
          ],
        },
        select: { id: true },
      });
      if (takenMain) {
        return {
          success: false,
          error: 'El email o nombre de usuario ya está registrado',
        };
      }
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 12);
      await entityPrisma.$executeRaw`
        UPDATE users
        SET
          name = ${name},
          email = ${email},
          username = ${username},
          password = ${hashed},
          status = ${status},
          access_profile_id = ${accessProfileId},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId} AND entity_id = ${entityId}
      `;
      try {
        if (prisma?.user) {
          await prisma.$executeRaw`
            UPDATE users
            SET
              name = ${name},
              email = ${email},
              username = ${username},
              password = ${hashed},
              status = ${status},
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ${userId}
          `;
        }
      } catch {
        // espejo best-effort
      }
    } else {
      await entityPrisma.$executeRaw`
        UPDATE users
        SET
          name = ${name},
          email = ${email},
          username = ${username},
          status = ${status},
          access_profile_id = ${accessProfileId},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId} AND entity_id = ${entityId}
      `;
      try {
        if (prisma?.user) {
          await prisma.$executeRaw`
            UPDATE users
            SET
              name = ${name},
              email = ${email},
              username = ${username},
              status = ${status},
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ${userId}
          `;
        }
      } catch {
        // espejo best-effort
      }
    }

    return { success: true, data: { id: userId, name, email, username } };
  } catch (error: any) {
    console.error('updateInstitutionEmployee:', error);
    return {
      success: false,
      error: error?.message || 'Error al actualizar el usuario',
    };
  }
}
