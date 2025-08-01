
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPatients, getDashboardStats } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, BedDouble, Calendar, FilePlus2, UserPlus, Users } from 'lucide-react';
import { PatientList } from '@/components/modules/patients';
import { DashboardStats, PatientsByGenderChart, PatientsByMonthChart, RecentPatients } from '@/components/modules/dashboard';

export default async function DashboardPage() {
  const patients = await getPatients();
  const dashboardStats = await getDashboardStats();
  const recentPatients = patients.slice(0, 5);

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        {/* Statistics Cards */}
        <DashboardStats stats={dashboardStats} />

        {/* Charts and Recent Data */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Gráfico de distribución por género */}
          <PatientsByGenderChart data={dashboardStats.patientsByGender} />
          
          {/* Gráfico de tendencia por mes */}
          <PatientsByMonthChart data={dashboardStats.patientsByMonth} />
          
          {/* Pacientes recientes */}
          <RecentPatients patients={dashboardStats.recentPatients} />
          
          {/* Acciones rápidas */}
          <Card className="col-span-full lg:col-span-3">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <Button size="lg" asChild>
                <Link href="/historias/historia-clinica">
                  <FilePlus2 className="mr-2 h-4 w-4" /> Nueva Historia Clínica
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/admin/usuarios/nuevo">
                  <UserPlus className="mr-2 h-4 w-4" /> Registrar Nuevo Usuario
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/patients">
                  <Users className="mr-2 h-4 w-4" /> Ver Todos los Pacientes
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>


      </div>
    </AppLayout>
  );
}
