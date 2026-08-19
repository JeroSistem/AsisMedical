"use client";

import { MetricCard } from "@/components/design-system";

interface DashboardStatsProps {
  stats: {
    totalPatients: number;
    totalUsers: number;
    totalMedicalRecords: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const activity =
    stats.totalPatients > 0
      ? Math.round((stats.totalMedicalRecords / stats.totalPatients) * 100)
      : 0;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard
        label="Pacientes totales"
        value={stats.totalPatients.toLocaleString()}
        icon="group"
        meta="Registrados"
      />
      <MetricCard
        label="Usuarios activos"
        value={stats.totalUsers.toLocaleString()}
        icon="badge"
        meta="Personal"
      />
      <MetricCard
        label="Historias clínicas"
        value={stats.totalMedicalRecords.toLocaleString()}
        icon="folder_shared"
        meta="Expedientes"
      />
      <MetricCard
        label="Cobertura HC"
        value={`${activity}%`}
        icon="monitoring"
        meta="Con historial"
        trendUp={activity >= 50}
        trend={activity >= 50 ? "OK" : undefined}
      />
    </div>
  );
}
