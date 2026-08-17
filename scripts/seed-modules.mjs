import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mysql from 'mysql2/promise';

config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local'), override: true });

const url = new URL(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  database: url.pathname.replace(/^\//, ''),
  user: url.username,
  password: decodeURIComponent(url.password || ''),
});
const prisma = new PrismaClient({ adapter });

const modulesToCreate = [
  { name: 'Dashboard', description: 'Panel principal del sistema' },
  { name: 'Pacientes', description: 'Gestión de pacientes' },
  { name: 'Administración', description: 'Configuración del sistema' },
  { name: 'Facturación', description: 'Gestión financiera y facturación' },
  { name: 'Citas', description: 'Programación de citas médicas' },
  { name: 'Historias Clínicas', description: 'Gestión de historias médicas' },
  { name: 'Triage', description: 'Sistema de priorización' },
  { name: 'Asistencial', description: 'Gestión asistencial y atención médica' },
  { name: 'Inventario', description: 'Control de inventario' },
  { name: 'Auditoría', description: 'Sistema de auditoría' },
  { name: 'Laboratorio', description: 'Gestión de pruebas de laboratorio' },
  { name: 'Calidad', description: 'Gestión de calidad y satisfacción del paciente' },
  { name: 'Farmacia', description: 'Gestión de medicamentos' },
  { name: 'Contabilidad', description: 'Gestión contable' },
  { name: 'Presupuesto', description: 'Gestión presupuestaria' },
  { name: 'Nómina', description: 'Gestión de nómina' },
  { name: 'Cartera', description: 'Gestión de cartera' },
  { name: 'Imágenes Diagnósticas', description: 'Gestión de imágenes médicas' },
  { name: 'Admisiones', description: 'Gestión de admisiones hospitalarias' },
];

const conn = await mysql.createConnection({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: url.username,
  password: decodeURIComponent(url.password || ''),
  database: url.pathname.replace(/^\//, ''),
});
const [cols] = await conn.query(
  `SELECT COLUMN_NAME AS column_name FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'entities'
   ORDER BY ORDINAL_POSITION`
);
console.log(
  'entity_columns',
  cols.map((r) => r.column_name)
);
await conn.end();

for (const m of modulesToCreate) {
  await prisma.module.upsert({
    where: { name: m.name },
    update: { description: m.description, status: 'ENABLED' },
    create: { name: m.name, description: m.description, status: 'ENABLED' },
  });
}

const count = await prisma.module.count({ where: { status: 'ENABLED' } });
console.log('modules_enabled', count);

await prisma.$disconnect();
