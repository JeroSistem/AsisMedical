import { z } from 'zod'

// Common validation schemas
export const uuidSchema = z.string().uuid()
export const emailSchema = z.string().email()
export const passwordSchema = z.string().min(8)
export const entityIdSchema = z.string().uuid()

// Patient schemas
export const patientSchema = z.object({
  entityId: entityIdSchema,
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  documentType: z.enum(['CC', 'CE', 'TI', 'PP']),
  documentNumber: z.string().min(5).max(20),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['M', 'F', 'O']).optional(),
  phone: z.string().max(20).optional(),
  email: emailSchema.optional(),
  address: z.string().max(200).optional()
})

// Appointment schemas
export const appointmentSchema = z.object({
  entityId: entityIdSchema,
  patientId: uuidSchema,
  doctorId: uuidSchema.optional(),
  date: z.string().datetime(),
  time: z.string(),
  type: z.enum(['CONSULTATION', 'FOLLOW_UP', 'EMERGENCY']),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('SCHEDULED'),
  notes: z.string().optional()
})

// Triage schemas
export const triageSchema = z.object({
  entityId: entityIdSchema,
  patientId: uuidSchema,
  urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  symptoms: z.string().min(1),
  vitalSigns: z.record(z.any()).optional(),
  notes: z.string().optional()
})

// Admission schemas
export const admissionSchema = z.object({
  entityId: entityIdSchema,
  patientId: uuidSchema,
  admissionDate: z.string().datetime(),
  admissionType: z.enum(['URGENT', 'SCHEDULED', 'EMERGENCY']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  diagnosis: z.string().min(1),
  service: z.string().optional(),
  room: z.string().optional(),
  notes: z.string().optional()
})

// User schemas
export const userSchema = z.object({
  entityId: entityIdSchema,
  email: emailSchema,
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']),
  password: passwordSchema.optional()
})

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
})
