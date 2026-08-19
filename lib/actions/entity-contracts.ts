'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getPrismaClientForEntity,
  ensureEntityIncrementalTables,
  clearPrismaClientCache,
  getEntityDatabaseName,
} from '@/lib/database-manager';
import { mysqlConfigFromUrl } from '@/lib/mysql-adapter';
import mysql from 'mysql2/promise';
import {
  CONTRACT_OPTION_KEYS,
  type ContractOptionKey,
  type PartnerContractFormData,
} from '@/lib/entity-contracts-types';

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

function toFormPayload(form: PartnerContractFormData) {
  return {
    cobertura: form.cobertura,
    numeroPoliza: form.numeroPoliza,
    codigoCucon: form.codigoCucon,
    niveles: form.niveles,
    sede: form.sede,
    valorUpc: form.valorUpc,
    numeroConsultas: form.numeroConsultas,
    numeroUsuarios: form.numeroUsuarios,
    tarifasSoat: form.tarifasSoat,
    tarifasIss: form.tarifasIss,
    mediosPago: form.mediosPago,
    tarifasSoatDetalle: form.tarifasSoatDetalle,
    porcentajeValor: form.porcentajeValor,
    listaPreciosProcedimientos: form.listaPreciosProcedimientos,
    cuentaContableRadicada: form.cuentaContableRadicada,
    cuentaContableSinRadicar: form.cuentaContableSinRadicar,
    rubroPresupuesto: form.rubroPresupuesto,
    fuenteFinanciacion: form.fuenteFinanciacion,
    resolucionDian: form.resolucionDian,
    asuntoCorreoMinHacienda: form.asuntoCorreoMinHacienda,
    chatbotMorbilidadPym: form.chatbotMorbilidadPym,
    notasFinalesFactura: form.notasFinalesFactura,
    opciones: form.opciones,
    gruposFacturacion: form.gruposFacturacion,
    centrosServicios: form.centrosServicios,
  };
}

async function persistContractExtras(params: {
  entityId: string;
  contractId: string;
  descripcion: string;
  planBeneficios: string;
  listaPreciosMedsOtros: string;
  payload: ReturnType<typeof toFormPayload>;
}) {
  const conn = await openTenantConnection(params.entityId);
  try {
    await conn.query(
      `UPDATE partner_contracts
       SET description = ?, benefit_plan = ?, medication_price_list = ?, form_payload = ?
       WHERE id = ?`,
      [
        params.descripcion,
        params.planBeneficios,
        params.listaPreciosMedsOtros,
        JSON.stringify(params.payload),
        params.contractId,
      ]
    );
  } finally {
    await conn.end().catch(() => {});
  }
}

async function openTenantConnection(entityId: string) {
  const cfg = mysqlConfigFromUrl();
  return mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: getEntityDatabaseName(entityId),
  });
}

function toDateStr(value: unknown) {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  const d = new Date(text);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

function parseJsonValue(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? parsed
        : {};
    } catch {
      return {};
    }
  }
  return {};
}

function defaultOpciones(): Record<ContractOptionKey, boolean> {
  return Object.fromEntries(
    CONTRACT_OPTION_KEYS.map((k) => [k, k === 'activo'])
  ) as Record<ContractOptionKey, boolean>;
}

function rowToForm(row: mysql.RowDataPacket): PartnerContractFormData {
  const extras = {
    ...parseJsonValue(row.required_documents),
    ...parseJsonValue(row.form_payload),
  };
  const opcionesSaved =
    extras.opciones && typeof extras.opciones === 'object'
      ? (extras.opciones as Record<string, boolean>)
      : {};

  return {
    numeroContrato: String(row.contract_number || ''),
    entidades: String(row.partner_name || ''),
    descripcion: String(row.description || row.included_services || ''),
    planBeneficios: String(row.benefit_plan || row.geographic_coverage || ''),
    cobertura: String(extras.cobertura ?? ''),
    numeroPoliza: String(extras.numeroPoliza ?? ''),
    codigoCucon: String(extras.codigoCucon ?? ''),
    fechaInicio: toDateStr(row.start_date),
    fechaFin: toDateStr(row.end_date),
    tipoContrato: String(row.contract_type || ''),
    niveles: String(extras.niveles ?? ''),
    sede: String(extras.sede ?? ''),
    valorContrato: String(row.contract_value || ''),
    valorUpc: String(extras.valorUpc ?? ''),
    numeroConsultas: String(extras.numeroConsultas ?? ''),
    numeroUsuarios: String(extras.numeroUsuarios ?? ''),
    tarifasSoat: String(extras.tarifasSoat ?? ''),
    tarifasIss: String(extras.tarifasIss ?? ''),
    mediosPago: String(extras.mediosPago ?? row.payment_method ?? ''),
    tarifasSoatDetalle: String(extras.tarifasSoatDetalle ?? ''),
    porcentajeValor: String(extras.porcentajeValor ?? ''),
    listaPreciosProcedimientos: String(extras.listaPreciosProcedimientos ?? ''),
    listaPreciosMedsOtros: String(
      row.medication_price_list || row.target_population || ''
    ),
    cuentaContableRadicada: String(extras.cuentaContableRadicada ?? ''),
    cuentaContableSinRadicar: String(extras.cuentaContableSinRadicar ?? ''),
    rubroPresupuesto: String(extras.rubroPresupuesto ?? ''),
    fuenteFinanciacion: String(extras.fuenteFinanciacion ?? ''),
    resolucionDian: String(extras.resolucionDian ?? ''),
    asuntoCorreoMinHacienda: String(extras.asuntoCorreoMinHacienda ?? ''),
    chatbotMorbilidadPym: String(extras.chatbotMorbilidadPym ?? ''),
    notasFinalesFactura: String(
      extras.notasFinalesFactura ?? row.observations ?? ''
    ),
    opciones: {
      ...defaultOpciones(),
      ...opcionesSaved,
      activo: row.active !== 0 && row.active !== false,
    },
    gruposFacturacion: Array.isArray(extras.gruposFacturacion)
      ? extras.gruposFacturacion
      : [],
    centrosServicios: Array.isArray(extras.centrosServicios)
      ? extras.centrosServicios
      : [],
  };
}

function validateContractForm(form: PartnerContractFormData) {
  const numeroContrato = form.numeroContrato?.trim();
  const entidades = form.entidades?.trim();
  const descripcion = form.descripcion?.trim();
  const planBeneficios = form.planBeneficios?.trim();
  const tipoContrato = form.tipoContrato?.trim();
  const valorContrato = form.valorContrato?.trim();
  const listaPreciosMedsOtros = form.listaPreciosMedsOtros?.trim();

  if (!numeroContrato) return { error: 'El código de contrato es obligatorio' };
  if (!entidades) return { error: 'Debe indicar las entidades del contrato' };
  if (!descripcion) return { error: 'La descripción del contrato es obligatoria' };
  if (!planBeneficios) return { error: 'El plan de beneficios es obligatorio' };
  if (!form.fechaInicio?.trim() || !form.fechaFin?.trim()) {
    return { error: 'La fecha de inicio y la fecha fin son obligatorias' };
  }
  if (!tipoContrato) return { error: 'El tipo de contrato es obligatorio' };
  if (!valorContrato) return { error: 'El valor del contrato es obligatorio' };
  if (!listaPreciosMedsOtros) {
    return {
      error:
        'La lista de precios procedimientos medicamentos y otros es obligatoria',
    };
  }

  return {
    numeroContrato,
    entidades,
    descripcion,
    planBeneficios,
    tipoContrato,
    valorContrato,
    listaPreciosMedsOtros,
  };
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
        planBeneficios:
          (r as { benefitPlan?: string | null }).benefitPlan ||
          r.geographicCoverage ||
          '',
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

export async function getPartnerContract(id: string) {
  const gate = await requireInstitutionSession();
  if (!gate.ok) return { success: false as const, error: gate.error };

  const contractId = id?.trim();
  if (!contractId) {
    return { success: false as const, error: 'Contrato no válido' };
  }

  try {
    await ensurePartnerContractsTable(gate.entityId);
    const conn = await openTenantConnection(gate.entityId);
    try {
      const [rows] = await conn.query<mysql.RowDataPacket[]>(
        `SELECT * FROM partner_contracts WHERE id = ? AND entity_id = ? LIMIT 1`,
        [contractId, gate.entityId]
      );
      const row = rows[0];
      if (!row) {
        return { success: false as const, error: 'No se encontró el contrato' };
      }
      return {
        success: true as const,
        data: { id: String(row.id), form: rowToForm(row) },
      };
    } finally {
      await conn.end().catch(() => {});
    }
  } catch (error: any) {
    console.error('getPartnerContract:', error);
    return {
      success: false as const,
      error: error?.message || 'Error al abrir el contrato',
    };
  }
}

export async function createPartnerContract(form: PartnerContractFormData) {
  const gate = await requireInstitutionSession();
  if (!gate.ok) return { success: false, error: gate.error };

  const parsed = validateContractForm(form);
  if ('error' in parsed && parsed.error) {
    return { success: false, error: parsed.error };
  }
  const {
    numeroContrato,
    entidades,
    descripcion,
    planBeneficios,
    tipoContrato,
    valorContrato,
    listaPreciosMedsOtros,
  } = parsed as Exclude<ReturnType<typeof validateContractForm>, { error: string }>;

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
        error: `Ya existe un contrato con el código ${numeroContrato}`,
      };
    }

    await ensureTenantEntityRow(entityPrisma, gate.entityId);

    const activo = form.opciones?.activo ?? true;
    const extras = toFormPayload(form);
    const created = await entityPrisma.partnerContract.create({
      data: {
        entityId: gate.entityId,
        contractNumber: numeroContrato,
        partnerName: entidades,
        startDate: parseDate(form.fechaInicio),
        endDate: parseDate(form.fechaFin),
        contractValue: valorContrato,
        currency: 'COP',
        contractType: tipoContrato,
        paymentMethod: form.mediosPago || null,
        includedServices: descripcion,
        geographicCoverage: planBeneficios,
        targetPopulation: listaPreciosMedsOtros,
        requiredDocuments: JSON.stringify(extras),
        observations: form.notasFinalesFactura || null,
        status: activo ? 'activo' : 'inactivo',
        active: activo,
      },
    });

    try {
      await persistContractExtras({
        entityId: gate.entityId,
        contractId: created.id,
        descripcion,
        planBeneficios,
        listaPreciosMedsOtros,
        payload: extras,
      });
    } catch (extraError) {
      console.warn('persistContractExtras:', extraError);
    }

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

export async function updatePartnerContract(
  id: string,
  form: PartnerContractFormData
) {
  const gate = await requireInstitutionSession();
  if (!gate.ok) return { success: false, error: gate.error };

  const contractId = id?.trim();
  if (!contractId) {
    return { success: false, error: 'Contrato no válido' };
  }

  const parsed = validateContractForm(form);
  if ('error' in parsed && parsed.error) {
    return { success: false, error: parsed.error };
  }
  const {
    numeroContrato,
    entidades,
    descripcion,
    planBeneficios,
    tipoContrato,
    valorContrato,
    listaPreciosMedsOtros,
  } = parsed as Exclude<ReturnType<typeof validateContractForm>, { error: string }>;

  try {
    const entityPrisma = await ensurePartnerContractsTable(gate.entityId);
    const current = await entityPrisma.partnerContract.findFirst({
      where: { id: contractId, entityId: gate.entityId },
    });
    if (!current) {
      return { success: false, error: 'No se encontró el contrato' };
    }

    const duplicate = await entityPrisma.partnerContract.findFirst({
      where: {
        entityId: gate.entityId,
        contractNumber: numeroContrato,
        NOT: { id: contractId },
      },
    });
    if (duplicate) {
      return {
        success: false,
        error: `Ya existe un contrato con el código ${numeroContrato}`,
      };
    }

    const activo = form.opciones?.activo ?? true;
    const extras = toFormPayload(form);
    const updated = await entityPrisma.partnerContract.update({
      where: { id: contractId },
      data: {
        contractNumber: numeroContrato,
        partnerName: entidades,
        startDate: parseDate(form.fechaInicio),
        endDate: parseDate(form.fechaFin),
        contractValue: valorContrato,
        currency: 'COP',
        contractType: tipoContrato,
        paymentMethod: form.mediosPago || null,
        includedServices: descripcion,
        geographicCoverage: planBeneficios,
        targetPopulation: listaPreciosMedsOtros,
        requiredDocuments: JSON.stringify(extras),
        observations: form.notasFinalesFactura || null,
        status: activo ? 'activo' : 'inactivo',
        active: activo,
      },
    });

    try {
      await persistContractExtras({
        entityId: gate.entityId,
        contractId: updated.id,
        descripcion,
        planBeneficios,
        listaPreciosMedsOtros,
        payload: extras,
      });
    } catch (extraError) {
      console.warn('persistContractExtras:', extraError);
    }

    return {
      success: true,
      data: {
        id: updated.id,
        numero: updated.contractNumber,
        entidad: updated.partnerName,
      },
    };
  } catch (error: any) {
    console.error('updatePartnerContract:', error);
    return {
      success: false,
      error: error?.message || 'Error al actualizar el contrato',
    };
  }
}
