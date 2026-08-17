import { getServerSession } from 'next-auth';
import { getDashboardStats, testDatabaseConnection } from '@/lib/data';
import {
  PatientsByGenderChart,
  PatientsByMonthChart,
  RecentPatients,
} from '@/components/modules/dashboard';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { MetricCard } from '@/components/design-system';
import { authOptions } from '@/lib/auth';
import { getTenantPrisma } from '@/lib/tenant-prisma';
import { prisma } from '@/lib/prisma';

const emptyStats = {
  totalPatients: 0,
  totalUsers: 0,
  totalMedicalRecords: 0,
  patientsByGender: [] as Array<{ gender: string; count: number }>,
  recentPatients: [] as Array<{ id: string; name: string; createdAt: string }>,
  patientsByMonth: [] as Array<{ month: string; count: number }>,
};

async function getDashboardSubtitle(
  role?: string,
  entityId?: string | null
): Promise<string> {
  if (entityId) {
    const entity = await prisma.entity.findUnique({
      where: { id: entityId },
      select: { name: true },
    });
    return `Panel de control clínico — ${entity?.name ?? 'Institución'}`;
  }

  if (role === 'SUPER_ADMIN') {
    return 'Panel de control — Administración de plataforma';
  }

  return 'Panel de control clínico';
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const entityId = (session?.user as { entityId?: string | null } | undefined)
    ?.entityId;

  const tenantDb = await getTenantPrisma();
  const dbOnline = await testDatabaseConnection(tenantDb);
  const dashboardStats = dbOnline
    ? await getDashboardStats(tenantDb)
    : emptyStats;
  const subtitle = await getDashboardSubtitle(role, entityId);

  return (
    <ModulePageLayout
      title="Dashboard central"
      description={subtitle}
      maxWidth="7xl"
    >
      {!dbOnline && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-body-sm text-amber-900">
          No hay conexión con MySQL (<span className="font-mono">127.0.0.1:3306</span>). El
          panel se muestra sin datos. Inicia el servicio MySQL84 y recarga la página.
        </div>
      )}

      {role === 'SUPER_ADMIN' && !entityId && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-body-sm text-blue-900">
          Vista de plataforma: métricas clínicas (pacientes, historias) aparecen al
          ingresar con un usuario de institución. Cada institución tiene su propia base
          de datos.
        </div>
      )}

      <div className="grid grid-cols-1 gap-gutter-md md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Pacientes activos"
          value={dashboardStats.totalPatients ?? 0}
          icon="group"
          trend="12%"
          trendUp
        />
        <MetricCard
          label="Historias clínicas"
          value={dashboardStats.totalMedicalRecords ?? 0}
          icon="clinical_notes"
          meta="Registros"
        />
        <MetricCard
          label="Usuarios del sistema"
          value={dashboardStats.totalUsers ?? 0}
          icon="manage_accounts"
          meta="Activos"
        />
        <MetricCard
          label="Camas disponibles"
          value="42"
          icon="bed"
          meta="Capacidad: 450"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <div className="lg:col-span-2">
          <ModuleCard title="Distribución por género">
            <PatientsByGenderChart data={dashboardStats.patientsByGender} />
          </ModuleCard>
        </div>
        <div className="lg:col-span-2">
          <ModuleCard title="Tendencia mensual">
            <PatientsByMonthChart data={dashboardStats.patientsByMonth} />
          </ModuleCard>
        </div>
        <div className="lg:col-span-3">
          <ModuleCard title="Pacientes recientes">
            <RecentPatients patients={dashboardStats.recentPatients} />
          </ModuleCard>
        </div>
      </div>

      <div className="clinical-card p-4">
        <h2 className="mb-1 font-geist text-title-lg text-[#191c1e]">Navegación</h2>
        <p className="text-body-sm text-[#45464d]">
          Usa el menú lateral para abrir cada módulo y sus formularios.
        </p>
      </div>
    </ModulePageLayout>
  );
}
