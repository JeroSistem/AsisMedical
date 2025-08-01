
import { prisma } from './database';
import type { Patient, MedicalRecord, User } from './types';

// Funciones para Pacientes
export async function getPatients(): Promise<Patient[]> {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return patients.map(patient => ({
      id: patient.id,
      name: patient.name,
      dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0],
      gender: patient.gender,
      contact: patient.contact || '',
      address: patient.address || '',
      avatarUrl: patient.avatarUrl || 'https://placehold.co/100x100.png',
    }));
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id }
    });
    
    if (!patient) return undefined;
    
    return {
      id: patient.id,
      name: patient.name,
      dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0],
      gender: patient.gender,
      contact: patient.contact || '',
      address: patient.address || '',
      avatarUrl: patient.avatarUrl || 'https://placehold.co/100x100.png',
    };
  } catch (error) {
    console.error('Error fetching patient:', error);
    return undefined;
  }
}

export async function addPatient(patientData: Omit<Patient, 'id' | 'avatarUrl'>): Promise<Patient> {
  try {
    const patient = await prisma.patient.create({
      data: {
        name: patientData.name,
        dateOfBirth: new Date(patientData.dateOfBirth),
        gender: patientData.gender,
        contact: patientData.contact,
        address: patientData.address,
        avatarUrl: 'https://placehold.co/100x100.png',
      }
    });
    
    return {
      id: patient.id,
      name: patient.name,
      dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0],
      gender: patient.gender,
      contact: patient.contact || '',
      address: patient.address || '',
      avatarUrl: patient.avatarUrl || 'https://placehold.co/100x100.png',
    };
  } catch (error) {
    console.error('Error adding patient:', error);
    throw error;
  }
}

// Funciones para Historias Clínicas
export async function getMedicalRecordByPatientId(patientId: string): Promise<MedicalRecord | undefined> {
  try {
    const medicalRecord = await prisma.medicalRecord.findFirst({
      where: { patientId },
      include: {
        diagnoses: true,
        treatments: true,
        documents: true,
      }
    });
    
    if (!medicalRecord) return undefined;
    
    return {
      patientId: medicalRecord.patientId,
      medicalHistory: medicalRecord.medicalHistory || '',
      currentStatus: medicalRecord.currentStatus || '',
      diagnoses: medicalRecord.diagnoses.map(d => ({
        id: d.id,
        date: d.date.toISOString().split('T')[0],
        code: d.code,
        description: d.description,
        physician: d.physician,
      })),
      treatments: medicalRecord.treatments.map(t => ({
        id: t.id,
        date: t.date.toISOString().split('T')[0],
        procedure: t.procedure,
        medication: t.medication || '',
        dosage: t.dosage || '',
        physician: t.physician,
      })),
      documents: medicalRecord.documents.map(d => ({
        id: d.id,
        date: d.date.toISOString().split('T')[0],
        type: d.type as 'Lab Result' | 'Imaging Report' | 'Consultation Note',
        title: d.title,
        url: d.url || '',
      })),
    };
  } catch (error) {
    console.error('Error fetching medical record:', error);
    return undefined;
  }
}

// Funciones para Usuarios
export async function getUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      creationDate: user.createdAt.toISOString().split('T')[0],
      status: user.status as 'Active' | 'Inactive',
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function addUser(userData: Omit<User, 'id' | 'creationDate'>): Promise<User> {
  try {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
      }
    });
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      creationDate: user.createdAt.toISOString().split('T')[0],
      status: user.status as 'Active' | 'Inactive',
    };
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

// Función para verificar conexión a la base de datos
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error);
    return false;
  }
}

// Funciones para estadísticas del Dashboard
export async function getDashboardStats() {
  try {
    const [
      totalPatients,
      totalUsers,
      totalMedicalRecords,
      patientsByGender,
      recentPatients,
      patientsByMonth
    ] = await Promise.all([
      // Total de pacientes
      prisma.patient.count(),
      
      // Total de usuarios
      prisma.user.count(),
      
      // Total de historias clínicas
      prisma.medicalRecord.count(),
      
      // Pacientes por género
      prisma.patient.groupBy({
        by: ['gender'],
        _count: {
          gender: true
        }
      }),
      
      // Pacientes recientes (últimos 7 días)
      prisma.patient.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      
      // Pacientes por mes (últimos 6 meses)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*) as count
        FROM "Patient"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
      `
    ]);

    return {
      totalPatients,
      totalUsers,
      totalMedicalRecords,
      patientsByGender: patientsByGender.map(g => ({
        gender: g.gender,
        count: g._count.gender
      })),
      recentPatients: recentPatients.map(p => ({
        id: p.id,
        name: p.name,
        createdAt: p.createdAt.toISOString().split('T')[0]
      })),
      patientsByMonth: patientsByMonth as Array<{ month: string; count: number }>
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalPatients: 0,
      totalUsers: 0,
      totalMedicalRecords: 0,
      patientsByGender: [],
      recentPatients: [],
      patientsByMonth: []
    };
  }
}

// Función para obtener estadísticas de diagnósticos
export async function getDiagnosisStats() {
  try {
    const diagnosisStats = await prisma.diagnosis.groupBy({
      by: ['code'],
      _count: {
        code: true
      },
      _max: {
        date: true
      }
    });

    return diagnosisStats.map(d => ({
      code: d.code,
      count: d._count.code,
      lastOccurrence: d._max.date?.toISOString().split('T')[0] || ''
    }));
  } catch (error) {
    console.error('Error fetching diagnosis stats:', error);
    return [];
  }
}

// Función para obtener estadísticas de tratamientos
export async function getTreatmentStats() {
  try {
    const treatmentStats = await prisma.treatment.groupBy({
      by: ['type'],
      _count: {
        type: true
      }
    });

    return treatmentStats.map(t => ({
      type: t.type,
      count: t._count.type
    }));
  } catch (error) {
    console.error('Error fetching treatment stats:', error);
    return [];
  }
}
