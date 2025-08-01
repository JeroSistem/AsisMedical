import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando inserción de datos de prueba...');

  // Hash de la contraseña por defecto
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Crear usuarios de prueba
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'juan.perez@hospital.com' },
      update: {},
      create: {
        name: 'Dr. Juan Pérez',
        email: 'juan.perez@hospital.com',
        password: hashedPassword,
        role: 'Médico',
        status: 'Active',
      },
    }),
    prisma.user.upsert({
      where: { email: 'maria.garcia@hospital.com' },
      update: {},
      create: {
        name: 'Dr. María García',
        email: 'maria.garcia@hospital.com',
        password: hashedPassword,
        role: 'Médico',
        status: 'Active',
      },
    }),
    prisma.user.upsert({
      where: { email: 'carlos.lopez@hospital.com' },
      update: {},
      create: {
        name: 'Enf. Carlos López',
        email: 'carlos.lopez@hospital.com',
        password: hashedPassword,
        role: 'Enfermero',
        status: 'Active',
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin@hospital.com' },
      update: {},
      create: {
        name: 'Admin Sistema',
        email: 'admin@hospital.com',
        password: hashedPassword,
        role: 'Administrador',
        status: 'Active',
      },
    }),
  ]);

  console.log(`✅ ${users.length} usuarios creados`);

  // Crear pacientes de prueba
  const patients = await Promise.all([
    prisma.patient.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        name: 'John Doe',
        dateOfBirth: new Date('1985-04-12'),
        gender: 'Male',
        contact: '+1-202-555-0185',
        address: '123 Wellness Ave, Healthville, USA',
        avatarUrl: 'https://placehold.co/100x100.png',
      },
    }),
    prisma.patient.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        name: 'Jane Smith',
        dateOfBirth: new Date('1992-08-23'),
        gender: 'Female',
        contact: '+1-202-555-0191',
        address: '456 Cure St, Mediton, USA',
        avatarUrl: 'https://placehold.co/100x100.png',
      },
    }),
    prisma.patient.upsert({
      where: { id: '3' },
      update: {},
      create: {
        id: '3',
        name: 'Robert Johnson',
        dateOfBirth: new Date('1978-11-02'),
        gender: 'Male',
        contact: '+1-202-555-0143',
        address: '789 Remedy Rd, Sickbay, USA',
        avatarUrl: 'https://placehold.co/100x100.png',
      },
    }),
    prisma.patient.upsert({
      where: { id: '4' },
      update: {},
      create: {
        id: '4',
        name: 'Emily Williams',
        dateOfBirth: new Date('2001-07-15'),
        gender: 'Female',
        contact: '+1-202-555-0167',
        address: '101 Healer Ln, Recovery City, USA',
        avatarUrl: 'https://placehold.co/100x100.png',
      },
    }),
  ]);

  console.log(`✅ ${patients.length} pacientes creados`);

  // Crear historias clínicas de prueba
  const medicalRecords = await Promise.all([
    prisma.medicalRecord.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        patientId: '1',
        medicalHistory: 'History of hypertension, managed with Lisinopril. Non-smoker. No known allergies.',
        currentStatus: 'Presents with a persistent cough and mild fever. Blood pressure is within the normal range. Oxygen saturation at 98%.',
      },
    }),
    prisma.medicalRecord.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        patientId: '2',
        medicalHistory: 'Seasonal allergies, managed with Loratadine. History of a fractured left arm in 2015. All vaccinations are up to date.',
        currentStatus: 'Routine check-up. Reports feeling well. No acute complaints. Vital signs are stable.',
      },
    }),
  ]);

  console.log(`✅ ${medicalRecords.length} historias clínicas creadas`);

  // Crear diagnósticos de prueba
  const diagnoses = await Promise.all([
    prisma.diagnosis.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        medicalRecordId: '1',
        date: new Date('2023-10-15'),
        code: 'J02.9',
        description: 'Acute pharyngitis, unspecified',
        physician: 'Dr. Adams',
      },
    }),
    prisma.diagnosis.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        medicalRecordId: '1',
        date: new Date('2022-05-20'),
        code: 'I10',
        description: 'Essential (primary) hypertension',
        physician: 'Dr. House',
      },
    }),
  ]);

  console.log(`✅ ${diagnoses.length} diagnósticos creados`);

  // Crear tratamientos de prueba
  const treatments = await Promise.all([
    prisma.treatment.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        medicalRecordId: '1',
        date: new Date('2023-10-15'),
        procedure: 'Prescribed Amoxicillin',
        medication: 'Amoxicillin',
        dosage: '500mg, 3 times a day',
        physician: 'Dr. Adams',
      },
    }),
    prisma.treatment.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        medicalRecordId: '1',
        date: new Date('2022-05-20'),
        procedure: 'Prescribed Lisinopril',
        medication: 'Lisinopril',
        dosage: '10mg, once a day',
        physician: 'Dr. House',
      },
    }),
  ]);

  console.log(`✅ ${treatments.length} tratamientos creados`);

  console.log('🎉 ¡Datos de prueba insertados exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 