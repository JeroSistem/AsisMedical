import 'server-only';

import { getServerSession } from 'next-auth';
import type { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPrismaClientForEntity } from '@/lib/database-manager';

/**
 * Cliente Prisma de la institución del usuario en sesión.
 * ENTITY_ADMIN (y cualquier usuario con entityId) opera solo en su BD.
 * SUPER_ADMIN sin entityId usa la BD principal (plataforma).
 */
export async function getTenantPrisma(): Promise<PrismaClient> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const entityId = (session?.user as { entityId?: string | null } | undefined)
    ?.entityId;

  if (entityId && role !== 'SUPER_ADMIN') {
    return getPrismaClientForEntity(entityId);
  }

  if (role === 'ENTITY_ADMIN') {
    throw new Error('Usuario de institución sin entityId asignado');
  }

  return prisma;
}

/** Fuerza el cliente de una entidad (provisionamiento / scripts). */
export function getEntityPrisma(entityId: string): PrismaClient {
  return getPrismaClientForEntity(entityId);
}
