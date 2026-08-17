import { ok, badRequest, serverError, unauthorized } from '@/lib/http'
import { medicalStaffGuard } from '@/lib/rbac'
import { triageSchema } from '@/lib/validator'
import { limitOrThrow } from '@/lib/ratelimit'
import { logger } from '@/lib/logger'
import { getTenantPrisma } from '@/lib/tenant-prisma'

function mapPriority(priorityAttention?: string | null) {
  switch (priorityAttention) {
    case 'critical':
      return 'critical'
    case 'emergency':
      return 'high'
    case 'urgent':
      return 'medium'
    default:
      return 'low'
  }
}

function patientName(patient: any) {
  if (!patient) return 'Paciente'
  return `${patient.firstName || ''} ${patient.lastName || ''} ${patient.secondLastName || ''}`.trim()
}

export async function GET(req: Request) {
  try {
    const user = await medicalStaffGuard(req)
    const ip = req.headers.get('x-forwarded-for') ?? 'local'
    await limitOrThrow(ip, 'triage-read')

    const prisma = await getTenantPrisma()
    if (!prisma || typeof prisma.patientAdmission === 'undefined') {
      return ok([])
    }

    const url = new URL(req.url)
    const q = (url.searchParams.get('q') || '').trim()

    const admissions = await prisma.patientAdmission.findMany({
      where: q
        ? {
            OR: [
              { patient: { documentNumber: { contains: q } } },
              { patient: { firstName: { contains: q } } },
              { patient: { lastName: { contains: q } } },
              { observation: { contains: q } },
            ],
          }
        : undefined,
      include: { patient: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    const data = admissions.map((a) => ({
      id: a.id,
      admissionId: a.id,
      admissionNumber: a.admissionNumber,
      patientId: a.patientId,
      patientName: patientName(a.patient),
      documentNumber: a.patient?.documentNumber || '',
      documentType: a.patient?.documentType || '',
      age: a.patient?.age ?? null,
      gender: a.patient?.gender || '',
      priority: mapPriority(a.priorityAttention),
      priorityAttention: a.priorityAttention,
      symptoms: a.observation || '',
      vitalSigns: [
        a.bloodPressure ? `TA ${a.bloodPressure}` : null,
        a.heartRate ? `FC ${a.heartRate}` : null,
        a.temperature ? `T ${a.temperature}` : null,
        a.oxygenSaturation ? `Sat ${a.oxygenSaturation}%` : null,
      ]
        .filter(Boolean)
        .join(' · '),
      status: a.status === 'ACTIVE' ? 'waiting' : 'completed',
      createdAt: a.createdAt,
      admissionDate: a.admissionDate,
      admissionTime: a.admissionTime,
      entity: a.entity,
      contract: a.contract,
      observations: a.observation || '',
      patient: a.patient
        ? {
            id: a.patient.id,
            name: patientName(a.patient),
            documentNumber: a.patient.documentNumber,
            documentType: a.patient.documentType,
            age: a.patient.age,
            gender: a.patient.gender,
            mobilePhone: a.patient.mobilePhone,
            email: a.patient.email,
          }
        : null,
      admission: {
        bloodPressure: a.bloodPressure,
        respiratoryRate: a.respiratoryRate,
        temperature: a.temperature,
        heartRate: a.heartRate,
        height: a.height,
        weight: a.weight,
        bmi: a.bmi,
        oxygenSaturation: a.oxygenSaturation,
        responsibleName: a.responsibleName,
        companionName: a.companionName,
      },
    }))

    logger.info('Triage admissions listed', {
      userId: user.id,
      count: data.length,
      q,
    })

    return ok(data)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorized()
    }
    logger.error('Error retrieving triage admissions', { error })
    return serverError(error)
  }
}

export async function POST(req: Request) {
  try {
    const user = await medicalStaffGuard(req)
    const ip = req.headers.get('x-forwarded-for') ?? 'local'
    await limitOrThrow(ip, 'triage-create')

    const body = await req.json()
    const validated = triageSchema.safeParse(body)
    if (!validated.success) {
      return badRequest('Invalid triage data')
    }

    const prisma = await getTenantPrisma()
    if (!prisma || typeof prisma.triage === 'undefined') {
      return badRequest('Base de datos no disponible', 503)
    }

    const created = await prisma.triage.create({
      data: {
        patientId: (validated.data as any).patientId || null,
        arrivalTime: new Date(),
        urgencyLevel: String((validated.data as any).priority || 'URGENTE').toUpperCase(),
        notes: String((validated.data as any).symptoms || (validated.data as any).observations || ''),
        vitalSigns: {
          raw: String((validated.data as any).vitalSigns || ''),
        },
      },
      include: { patient: true },
    })

    return ok(created)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorized()
    }
    logger.error('Error creating triage', { error })
    return serverError(error)
  }
}
