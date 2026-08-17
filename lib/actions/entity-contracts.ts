'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getPrismaClientForEntity,
  ensureEntityIncrementalTables,
  clearPrismaClientCache,
} from '@/lib/database-manager';

export type PartnerContractFormData = {
  numeroContrato: string;
  entidad: string;
  tipoEntidad: string;
  representanteLegal: string;
  nit: string;
  direccion: string;
  telefono: string;
  email: string;
  fechaInicio: string;
  fechaFin: string;
  valorContrato: string;
  moneda: string;
  tipoContrato: string;
  serviciosIncluidos: string;
  exclusiones: string;
  coberturaGeografica: string;
  poblacionObjetivo: string;
  plazoPago: string;
  formaPago: string;
  garantias: string;
  penalizaciones: string;
  documentosRequeridos: string;
  observaciones: string;
  estado: string;
  activo: boolean;
};

async function requireInstitutionSession() {
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

  return { ok: true as const, entityId, role };
}

function parseDate(value?: string) {
  if (!value?.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function ensurePartnerContractsTable(entityId: string) {
  // Siempre alinear columnas/tablas nuevas (idempotente); evita upsert fallido
  // cuando partner_contracts ya existe pero entities está desactualizada.
  const updated = await ensureEntityIncrementalTables(entityId);
  if (!updated.success) {
    throw new Error(
      updated.error ||
        'No se pudo preparar el esquema de contratos en la BD de la institución'
    );
  }
  clearPrismaClientCache(entityId);
  const entityPrisma = getPrismaClientForEntity(entityId);
  if (!(entityPrisma as { partnerContract?: unknown }).partnerContract) {
    throw new Error(
      'Cliente Prisma sin partnerContract. Reinicie el servidor con npm run dev.'
    );
  }
  return entityPrisma;
}

async function ensureTenantEntityRow(
  entityPrisma: ReturnType<typeof getPrismaClientForEntity>,
  entityId: string
) {
  const { prisma } = await import('@/lib/prisma');
  const mainEntity = await prisma.entity.findUnique({
    where: { id: entityId },
  });
  if (!mainEntity) return;

  await entityPrisma.entity.upsert({
    where: { id: entityId },
    update: {
      name: mainEntity.name,
      databaseName: mainEntity.databaseName,
      nit: mainEntity.nit,
      city: mainEntity.city,
      department: mainEntity.department,
      phone: mainEntity.phone,
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

export async function listPartnerContracts() {
  const gate = await requireInstitutionSession();
  if (!gate.ok) return { success: false, data: [], error: gate.error };

  try {
    const entityPrisma = await ensurePartnerContractsTable(gate.entityId);
    const rows = await entityPrisma.partnerContract.findMany({
      where: { entityId: gate.entityId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        numero: r.contractNumber,
        entidad: r.partnerName,
        tipo: r.partnerType || '',
        tipoContrato: r.contractType || '',
        fechaInicio: r.startDate
          ? r.startDate.toISOString().slice(0, 10)
          : '',
        fechaFin: r.endDate ? r.endDate.toISOString().slice(0, 10) : '',
        valor: r.contractValue || '',
        moneda: r.currency,
        estado: r.status,
        activo: r.active,
      })),
    };
  } catch (error: any) {
    console.error('listPartnerContracts:', error);
    return {
      success: false,
      data: [],
      error: error?.message || 'Error al listar contratos',
    };
  }
}

/** EPS/entidades y contratos activos para formularios de admisión. */
export async function listActivePartnersForAdmission() {
  const res = await listPartnerContracts();
  if (!res.success) {
    return { success: false as const, partners: [], contracts: [], error: res.error };
  }

  const active = (res.data || []).filter(
    (c) => c.activo !== false && String(c.estado || '').toLowerCase() !== 'inactivo'
  );

  const partnerMap = new Map<string, { name: string; tipo: string }>();
  for (const c of active) {
    const key = c.entidad.trim().toLowerCase();
    if (!key) continue;
    if (!partnerMap.has(key)) {
      partnerMap.set(key, { name: c.entidad.trim(), tipo: c.tipo || '' });
    }
  }

  return {
    success: true as const,
    partners: Array.from(partnerMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, 'es')
    ),
    contracts: active.map((c) => ({
      id: c.id,
      numero: c.numero,
      entidad: c.entidad,
      tipo: c.tipo,
      tipoContrato: c.tipoContrato,
      label: [c.numero, c.tipoContrato].filter(Boolean).join(' · '),
    })),
  };
}

export async function createPartnerContract(form: PartnerContractFormData) {
  const gate = await requireInstitutionSession();
  if (!gate.ok) return { success: false, error: gate.error };

  const numeroContrato = form.numeroContrato?.trim();
  const entidad = form.entidad?.trim();
  const tipoContrato = form.tipoContrato?.trim();

  if (!numeroContrato || !entidad) {
    return {
      success: false,
      error: 'Número de contrato y entidad son obligatorios',
    };
  }
  if (!tipoContrato) {
    return {
      success: false,
      error: 'Seleccione el tipo de contrato (Subsidiado o Contributivo)',
    };
  }

  try {
    const entityPrisma = await ensurePartnerContractsTable(gate.entityId);

    const exists = await entityPrisma.partnerContract.findFirst({
      where: {
        entityId: gate.entityId,
        contractNumber: numeroContrato,
      },
    });
    if (exists) {
      return {
        success: false,
        error: `Ya existe un contrato con el número ${numeroContrato}`,
      };
    }

    // Asegurar fila Entity en BD tenant (FK) — SQL para evitar drift de columnas Prisma
    await ensureTenantEntityRow(entityPrisma, gate.entityId);

    const created = await entityPrisma.partnerContract.create({
      data: {
        entityId: gate.entityId,
        contractNumber: numeroContrato,
        partnerName: entidad,
        partnerType: form.tipoEntidad || null,
        legalRepresentative: form.representanteLegal || null,
        nit: form.nit || null,
        address: form.direccion || null,
        phone: form.telefono || null,
        email: form.email || null,
        startDate: parseDate(form.fechaInicio),
        endDate: parseDate(form.fechaFin),
        contractValue: form.valorContrato || null,
        currency: form.moneda || 'COP',
        contractType: tipoContrato,
        includedServices: form.serviciosIncluidos || null,
        exclusions: form.exclusiones || null,
        geographicCoverage: form.coberturaGeografica || null,
        targetPopulation: form.poblacionObjetivo || null,
        paymentTermDays: form.plazoPago || null,
        paymentMethod: form.formaPago || null,
        guarantees: form.garantias || null,
        penalties: form.penalizaciones || null,
        requiredDocuments: form.documentosRequeridos || null,
        observations: form.observaciones || null,
        status: form.estado || 'activo',
        active: form.activo ?? true,
      },
    });

    return {
      success: true,
      data: {
        id: created.id,
        numero: created.contractNumber,
        entidad: created.partnerName,
      },
    };
  } catch (error: any) {
    console.error('createPartnerContract:', error);
    return {
      success: false,
      error: error?.message || 'Error al guardar el contrato',
    };
  }
}
