import { getDashboardStats, testDatabaseConnection } from '@/lib/data';
import {
  PatientsByGenderChart,
  PatientsByMonthChart,
  RecentPatients,
} from '@/components/modules/dashboard';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { MetricCard } from '@/components/design-system';

const emptyStats = {
  totalPatients: 0,
  totalUsers: 0,
  totalMedicalRecords: 0,
  patientsByGender: [] as Array<{ gender: string; count: number }>,
  recentPatients: [] as Array<{ id: string; name: string; createdAt: string }>,
  patientsByMonth: [] as Array<{ month: string; count: number }>,
};

export default async function DashboardPage() {
  const dbOnline = await testDatabaseConnection();
  const dashboardStats = dbOnline ? await getDashboardStats() : emptyStats;

  return (
    <ModulePageLayout
      title="Dashboard central"
      description="Panel de control clínico — ASIS Medical Head"
      maxWidth="7xl"
    >
      {!dbOnline && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-body-sm text-amber-900">
          No hay conexión con PostgreSQL (<span className="font-mono">localhost:5433</span>). El
          panel se muestra sin datos. Inicia el servicio de base de datos y recarga la página.
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
