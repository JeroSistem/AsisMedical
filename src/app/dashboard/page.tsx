
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPatients } from '@/lib/data';
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
import { PatientList } from '@/components/patient-list';

export default function DashboardPage() {
  const patients = getPatients();
  const recentPatients = patients.slice(0, 5);

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pacientes Activos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120</div>
              <p className="text-xs text-muted-foreground">
                +2% que el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Citas para Hoy
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
               <p className="text-xs text-muted-foreground">
                8 urgencias, 16 programadas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Recientes</CardTitle>
              <BedDouble className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                en las últimas 24 horas
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
           <Card className="col-span-full lg:col-span-4">
             <CardHeader>
               <CardTitle>Pacientes Recientes</CardTitle>
             </CardHeader>
             <CardContent>
                <PatientList patients={recentPatients} />
                <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/dashboard">
                        Ver todos los pacientes <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
             </CardContent>
           </Card>

           <Card className="col-span-full lg:col-span-3">
            <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
                <Button size="lg" asChild>
                    <Link href="/historias/historia-clinica"><FilePlus2 /> Nueva Historia Clínica</Link>
                </Button>
                 <Button size="lg" variant="secondary" asChild>
                    <Link href="/admin/usuarios/nuevo"><UserPlus /> Registrar Nuevo Usuario</Link>
                </Button>
                 <Button size="lg" variant="secondary" asChild>
                    <Link href="#"><Calendar /> Agendar Cita</Link>
                </Button>
            </CardContent>
           </Card>
        </div>


      </div>
    </AppLayout>
  );
}
