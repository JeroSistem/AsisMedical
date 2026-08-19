import type { Patient, MedicalRecord, User } from './types';
import type { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';
import { prisma } from './prisma';
import { mysqlConfigFromUrl } from './mysql-adapter';

function logDbUnavailable(context: string, error: unknown) {
  const code = (error as any)?.code;
  const message = (error as any)?.message || String(error);
  // Evitar console.error con Error objects: en Next 15 dispara overlay rojo
  if (code === 'ECONNREFUSED' || message.includes('ECONNREFUSED')) {
    console.warn(
      `[DB] ${context}: MySQL no disponible (ECONNREFUSED). Revisa que el servicio esté en el puerto de DATABASE_URL.`
    );
    return;
  }
  console.warn(`[DB] ${context}:`, message);
}

// Funciones para Pacientes
export async function getPatients(): Promise<Patient[]> {
  try {
    // Verificar que prisma esté inicializado correctamente
    if (!prisma || typeof prisma.patient === 'undefined') {
      console.warn('[DB] Prisma no está inicializado correctamente');
      return [];
    }
    
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return patients.map(patient => ({
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      contact: patient.mobilePhone || patient.landlinePhone || '',
      address: patient.address || '',
      avatarUrl: patient.avatarUrl || undefined,
    }));
  } catch (error: any) {
    logDbUnavailable('getPatients', error);
    return [];
  }
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  try {
    // Verificar que prisma esté inicializado correctamente
    if (!prisma || typeof prisma.patient === 'undefined') {
      console.error('Prisma no está inicializado correctamente');
      return undefined;
    }
    
    const patient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) return undefined;

    return {
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      contact: patient.mobilePhone || patient.landlinePhone || '',
      address: patient.address || '',
      avatarUrl: patient.avatarUrl || undefined,
    };
  } catch (error) {
    logDbUnavailable('getPatientById', error);
    return undefined;
  }
}

export async function addPatient(patientData: Omit<Patient, 'id' | 'avatarUrl'>): Promise<Patient> {
  try {
    // Verificar que prisma esté inicializado correctamente
    if (!prisma || typeof prisma.patient === 'undefined') {
      console.error('Prisma no está inicializado correctamente');
      throw new Error('Base de datos no disponible');
    }
    
    // Calcular edad desde la fecha de nacimiento
    const birthDate = typeof patientData.dateOfBirth === 'string' 
      ? new Date(patientData.dateOfBirth) 
      : patientData.dateOfBirth;
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const calculatedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;

    // Extraer nombre y apellido del campo name
    const nameParts = patientData.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const newPatient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: birthDate,
        age: calculatedAge,
        gender: patientData.gender,
        mobilePhone: patientData.contact,
        address: patientData.address,
        documentType: 'CC', // Valor por defecto
        documentNumber: `TEMP-${Date.now()}`, // Temporal, debería venir del formulario
      },
    });

    return {
      id: newPatient.id,
      name: `${newPatient.firstName} ${newPatient.lastName}`,
      dateOfBirth: newPatient.dateOfBirth,
      gender: newPatient.gender,
      contact: newPatient.mobilePhone || newPatient.landlinePhone || '',
      address: newPatient.address || '',
      avatarUrl: newPatient.avatarUrl || undefined,
    };
  } catch (error: any) {
    logDbUnavailable('addPatient', error);
    throw new Error(`Error creando paciente: ${error?.message || 'Error desconocido'}`);
  }
}

// Funciones para Historias Clínicas
export async function getMedicalRecordByPatientId(patientId: string): Promise<MedicalRecord | undefined> {
  try {
    // Verificar que prisma esté inicializado correctamente
    if (!prisma || typeof prisma.medicalRecord === 'undefined') {
      console.error('Prisma no está inicializado correctamente');
      return undefined;
    }
    
    const record = await prisma.medicalRecord.findFirst({
      where: { patientId },
      include: {
        diagnoses: true,
        treatments: true,
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) return undefined;

    return {
      id: record.id,
      patientId: record.patientId,
      medicalHistory: record.medicalHistory || '',
      currentStatus: record.currentStatus || '',
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      diagnoses: record.diagnoses.map(d => ({
        id: d.id,
        name: d.code,
        description: d.description,
        date: d.date,
      })),
      treatments: record.treatments.map(t => ({
        id: t.id,
        type: t.procedure,
        description: t.procedure,
        medication: t.medication || undefined,
        dosage: t.dosage || undefined,
        date: t.date,
      })),
      documents: record.documents.map(doc => ({
        id: doc.id,
        name: doc.title,
        type: doc.type,
        url: doc.url || '#',
        date: doc.date,
      })),
    };
  } catch (error) {
    console.error('Error obteniendo historia clínica:', error);
    return undefined;
  }
}

// Funciones para Usuarios
export async function getUsers(): Promise<User[]> {
  try {
    // Verificar que prisma esté inicializado correctamente
    if (!prisma || typeof prisma.user === 'undefined') {
      console.error('Prisma no está inicializado correctamente');
      return [];
    }
    
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => ({
      id: user.id,
      name: user.name || '',
      email: user.email,
      role: user.role,
      status: user.status,
      creationDate: user.createdAt.toISOString().split('T')[0],
    }));
  } catch (error) {
    logDbUnavailable('getUsers', error);
    return [];
  }
}

export async function addUser(userData: Omit<User, 'id' | 'creationDate'>): Promise<User> {
  try {
    // Verificar que prisma esté inicializado correctamente
    if (!prisma || typeof prisma.user === 'undefined') {
      console.error('Prisma no está inicializado correctamente');
      throw new Error('Base de datos no disponible');
    }
    
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        role: userData.role as any,
        status: userData.status,
      },
    });

    return {
      id: newUser.id,
      name: newUser.name || '',
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      creationDate: newUser.createdAt.toISOString().split('T')[0],
    };
  } catch (error: any) {
    logDbUnavailable('addUser', error);
    throw new Error(`Error creando usuario: ${error?.message || 'Error desconocido'}`);
  }
}

// Función para verificar conexión a la base de datos
export async function testDatabaseConnection(
  db: PrismaClient = prisma
): Promise<boolean> {
  try {
    const cfg = mysqlConfigFromUrl();
    const conn = await mysql.createConnection({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
      connectTimeout: 5000,
    });
    await conn.query('SELECT 1');
    await conn.end();
    return true;
  } catch (error) {
    logDbUnavailable('testDatabaseConnection', error);
    if (!db || typeof db.$queryRaw === 'undefined') {
      return false;
    }
    try {
      await db.user.count({ take: 1 });
      return true;
    } catch (prismaError) {
      logDbUnavailable('testDatabaseConnection.prisma', prismaError);
      return false;
    }
  }
}

// Funciones para estadísticas del Dashboard (scoped por BD tenant o plataforma)
export async function getDashboardStats(db: PrismaClient = prisma) {
  try {
    if (!db || typeof db.patient === 'undefined') {
      console.error('Prisma no está inicializado correctamente');
      return {
        totalPatients: 0,
        totalUsers: 0,
        totalMedicalRecords: 0,
        patientsByGender: [],
        recentPatients: [],
        patientsByMonth: [],
      };
    }

    const [totalPatients, totalUsers, totalMedicalRecords, patients] = await Promise.all([
      db.patient.count().catch(() => 0),
      db.user.count().catch(() => 0),
      db.medicalRecord.count().catch(() => 0),
      db.patient.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          gender: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }).catch(() => []),
    ]);

    const genderCounts = patients.reduce<Record<string, number>>((acc, patient) => {
      acc[patient.gender] = (acc[patient.gender] ?? 0) + 1;
      return acc;
    }, {});

    const patientsByGender = Object.entries(genderCounts).map(([gender, count]) => ({
      gender,
      count,
    }));

    const recentPatients = patients.slice(0, 5).map(patient => ({
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
      createdAt: patient.createdAt.toISOString().split('T')[0],
    }));

    // Obtener pacientes por mes
    let patientsByMonth: Array<{ month: string; count: number }> = [];
    try {
      const patientsByMonthData = await db.$queryRaw<Array<{ month: string; count: bigint }>>`
        SELECT
          DATE_FORMAT(created_at, '%Y-%m-01') as month,
          COUNT(*) as count
        FROM patients
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m-01')
        ORDER BY month ASC
      `;

      patientsByMonth = patientsByMonthData.map(item => ({
        month: String(item.month).slice(0, 10),
        count: Number(item.count),
      }));
    } catch (error) {
      logDbUnavailable('getPatientsByMonth', error);
      patientsByMonth = [];
    }

    return {
      totalPatients,
      totalUsers,
      totalMedicalRecords,
      patientsByGender,
      recentPatients,
      patientsByMonth,
    };
  } catch (error) {
    logDbUnavailable('getDashboardStats', error);
    return {
      totalPatients: 0,
      totalUsers: 0,
      totalMedicalRecords: 0,
      patientsByGender: [],
      recentPatients: [],
      patientsByMonth: [],
    };
  }
}

// Función para obtener estadísticas de diagnósticos
export async function getDiagnosisStats() {
  try {
    // Verificar que prisma esté inicializado correctamente
    if (!prisma || typeof prisma.diagnosis === 'undefined') {
      console.error('Prisma no está inicializado correctamente');
      return [];
    }
    
    const diagnoses = await prisma.diagnosis.findMany({
      orderBy: { date: 'desc' },
    });

    const diagnosisMap = new Map<string, { count: number; lastOccurrence: Date }>();

    diagnoses.forEach(diagnosis => {
      const current = diagnosisMap.get(diagnosis.code);
      if (!current) {
        diagnosisMap.set(diagnosis.code, { count: 1, lastOccurrence: diagnosis.date });
      } else {
        current.count += 1;
        if (diagnosis.date > current.lastOccurrence) {
          current.lastOccurrence = diagnosis.date;
        }
      }
    });

    return Array.from(diagnosisMap.entries()).map(([code, { count, lastOccurrence }]) => ({
      code,
      count,
      lastOccurrence: lastOccurrence.toISOString().split('T')[0],
    }));
  } catch (error) {
    console.error('Error obteniendo estadísticas de diagnósticos:', error);
    return [];
  }
}

// Función para obtener estadísticas de tratamientos
export async function getTreatmentStats() {
  try {
    // Verificar que prisma esté inicializado correctamente
    if (!prisma || typeof prisma.treatment === 'undefined') {
      console.error('Prisma no está inicializado correctamente');
      return [];
    }
    
    const treatments = await prisma.treatment.findMany();

    const treatmentMap = new Map<string, number>();

    treatments.forEach(treatment => {
      treatmentMap.set(treatment.procedure, (treatmentMap.get(treatment.procedure) ?? 0) + 1);
    });

    return Array.from(treatmentMap.entries()).map(([type, count]) => ({
      type,
      count,
    }));
  } catch (error) {
    console.error('Error obteniendo estadísticas de tratamientos:', error);
    return [];
  }
}
