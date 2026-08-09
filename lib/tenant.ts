const DB_DISABLED_MESSAGE =
  'La base de datos ha sido deshabilitada. Las operaciones multi-tenant estarán disponibles cuando se configure una nueva persistencia.'

function warn(method: string, entityId: string, payload?: unknown) {
  console.warn(`tenant.${method} llamado sin proveedor de base de datos`, { entityId, payload })
}

export function scoped(entityId: string) {
  return {
    patient: {
      findMany: async () => {
        warn('patient.findMany', entityId)
        return []
      },
      findFirst: async () => {
        warn('patient.findFirst', entityId)
        return null
      },
      findUnique: async () => {
        warn('patient.findUnique', entityId)
        return null
      },
      create: async (args: unknown) => {
        warn('patient.create', entityId, args)
        throw new Error(DB_DISABLED_MESSAGE)
      },
      update: async (args: unknown) => {
        warn('patient.update', entityId, args)
        throw new Error(DB_DISABLED_MESSAGE)
      },
      delete: async (args: unknown) => {
        warn('patient.delete', entityId, args)
        throw new Error(DB_DISABLED_MESSAGE)
      },
      count: async () => {
        warn('patient.count', entityId)
        return 0
      }
    },
    appointment: {
      findMany: async () => {
        warn('appointment.findMany', entityId)
        return []
      },
      findFirst: async () => {
        warn('appointment.findFirst', entityId)
        return null
      },
      create: async (args: unknown) => {
        warn('appointment.create', entityId, args)
        throw new Error(DB_DISABLED_MESSAGE)
      },
      update: async (args: unknown) => {
        warn('appointment.update', entityId, args)
        throw new Error(DB_DISABLED_MESSAGE)
      },
      delete: async (args: unknown) => {
        warn('appointment.delete', entityId, args)
        throw new Error(DB_DISABLED_MESSAGE)
      }
    },
    triageAssessment: {
      findMany: async () => {
        warn('triageAssessment.findMany', entityId)
        return []
      },
      findFirst: async () => {
        warn('triageAssessment.findFirst', entityId)
        return null
      },
      create: async (args: unknown) => {
        warn('triageAssessment.create', entityId, args)
        throw new Error(DB_DISABLED_MESSAGE)
      },
      update: async (args: unknown) => {
        warn('triageAssessment.update', entityId, args)
        throw new Error(DB_DISABLED_MESSAGE)
      }
    },
    patientAdmission: {
      findMany: async () => {
        warn('patientAdmission.findMany', entityId)
        return []
      },
      findFirst: async () => {
        warn('patientAdmission.findFirst', entityId)
        return null
      },
      create: async (args: unknown) => {
        warn('patientAdmission.create', entityId, args)
        throw new Error(DB_DISABLED_MESSAGE)
      },
      update: async (args: unknown) => {
        warn('patientAdmission.update', entityId, args)
        throw new Error(DB_DISABLED_MESSAGE)
      }
    }
  }
}
