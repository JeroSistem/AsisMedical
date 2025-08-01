"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, FileText, Activity } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
}

function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  stats: {
    totalPatients: number;
    totalUsers: number;
    totalMedicalRecords: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Pacientes Totales"
        value={stats.totalPatients}
        icon={<Users className="h-4 w-4" />}
        description="Total de pacientes registrados"
      />
      <StatsCard
        title="Usuarios Activos"
        value={stats.totalUsers}
        icon={<UserCheck className="h-4 w-4" />}
        description="Personal médico registrado"
      />
      <StatsCard
        title="Historias Clínicas"
        value={stats.totalMedicalRecords}
        icon={<FileText className="h-4 w-4" />}
        description="Expedientes médicos"
      />
      <StatsCard
        title="Actividad Reciente"
        value={stats.totalPatients > 0 ? Math.round((stats.totalMedicalRecords / stats.totalPatients) * 100) : 0}
        icon={<Activity className="h-4 w-4" />}
        description="% de pacientes con historial"
      />
    </div>
  );
} 