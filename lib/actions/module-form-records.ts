'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  ensureEntityIncrementalTables,
  ensureModuleFormRecordsTable,
} from '@/lib/database-manager';
import { getTenantPrisma } from '@/lib/tenant-prisma';

export type ModuleFormRecordDTO = {
  id: string;
  modulePath: string;
  mode: string;
  codigo: string | null;
  nombre: string | null;
  estado: string | null;
  payload: Record<string, unknown>;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SaveModuleFormRecordInput = {
  modulePath: string;
  mode: 'crud' | 'report' | 'process';
  values: Record<string, string | boolean>;
  recordId?: string;
};

function normalizePath(modulePath: string): string {
  return modulePath.split('?')[0].replace(/\/$/, '') || modulePath;
}

function serializePayload(values: Record<string, string | boolean>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value]));
}

function toDto(record: {
  id: string;
  modulePath: string;
  mode: string;
  codigo: string | null;
  nombre: string | null;
  estado: string | null;
  payload: unknown;
  createdByName: string | null;
  createdAt: Date;
  updatedAt: Date;
}): ModuleFormRecordDTO {
  return {
    id: record.id,
    modulePath: record.modulePath,
    mode: record.mode,
    codigo: record.codigo,
    nombre: record.nombre,
    estado: record.estado,
    payload:
      record.payload && typeof record.payload === 'object' && !Array.isArray(record.payload)
        ? (record.payload as Record<string, unknown>)
        : {},
    createdByName: record.createdByName,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

async function ensureTablesForSession() {
  const session = await getServerSession(authOptions);
  const entityId =
    (session?.user as { entityId?: string | null } | undefined)?.entityId ?? null;

  if (entityId) {
    await ensureEntityIncrementalTables(entityId);
  } else {
    await ensureModuleFormRecordsTable();
  }
}

export async function saveModuleFormRecord(
  input: SaveModuleFormRecordInput
): Promise<{ success: boolean; data?: ModuleFormRecordDTO; error?: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: 'No autorizado' };
  }

  const modulePath = normalizePath(input.modulePath);
  if (!modulePath) {
    return { success: false, error: 'Ruta de submódulo inválida' };
  }

  await ensureTablesForSession();

  const prisma = await getTenantPrisma();
  if (!prisma || typeof (prisma as { moduleFormRecord?: unknown }).moduleFormRecord === 'undefined') {
    return { success: false, error: 'Modelo de formularios no disponible. Ejecute db:push.' };
  }

  const userId = (session.user as { id?: string }).id ?? null;
  const userName = session.user.name ?? session.user.email ?? 'Usuario';
  const payload = serializePayload(input.values);
  const codigo = String(input.values.codigo ?? '').trim() || null;
  const nombre = String(input.values.nombre ?? '').trim() || null;
  const estado = String(input.values.estado ?? 'activo').trim() || 'activo';

  try {
    if (input.recordId) {
      const existing = await prisma.moduleFormRecord.findFirst({
        where: { id: input.recordId, modulePath },
      });
      if (!existing) {
        return { success: false, error: 'Registro no encontrado' };
      }

      const updated = await prisma.moduleFormRecord.update({
        where: { id: input.recordId },
        data: {
          mode: input.mode,
          codigo,
          nombre,
          estado,
          payload,
        },
      });

      return { success: true, data: toDto(updated) };
    }

    const created = await prisma.moduleFormRecord.create({
      data: {
        modulePath,
        mode: input.mode,
        codigo,
        nombre,
        estado,
        payload,
        createdById: userId,
        createdByName: userName,
      },
    });

    return { success: true, data: toDto(created) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al guardar';
    console.error('[saveModuleFormRecord]', error);
    return { success: false, error: message };
  }
}

export async function listModuleFormRecords(
  modulePath: string,
  limit = 20
): Promise<{ success: boolean; data?: ModuleFormRecordDTO[]; error?: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: 'No autorizado' };
  }

  const normalized = normalizePath(modulePath);
  await ensureTablesForSession();

  const prisma = await getTenantPrisma();
  if (!prisma || typeof (prisma as { moduleFormRecord?: unknown }).moduleFormRecord === 'undefined') {
    return { success: true, data: [] };
  }

  try {
    const records = await prisma.moduleFormRecord.findMany({
      where: { modulePath: normalized },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 100),
    });

    return { success: true, data: records.map(toDto) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al listar';
    console.error('[listModuleFormRecords]', error);
    return { success: false, error: message };
  }
}

export async function deleteModuleFormRecord(
  recordId: string,
  modulePath: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: 'No autorizado' };
  }

  const normalized = normalizePath(modulePath);
  await ensureTablesForSession();

  const prisma = await getTenantPrisma();
  if (!prisma || typeof (prisma as { moduleFormRecord?: unknown }).moduleFormRecord === 'undefined') {
    return { success: false, error: 'Modelo no disponible' };
  }

  try {
    const existing = await prisma.moduleFormRecord.findFirst({
      where: { id: recordId, modulePath: normalized },
    });
    if (!existing) {
      return { success: false, error: 'Registro no encontrado' };
    }

    await prisma.moduleFormRecord.delete({ where: { id: recordId } });
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al eliminar';
    console.error('[deleteModuleFormRecord]', error);
    return { success: false, error: message };
  }
}
