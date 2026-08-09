import React from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { PatientList } from '@/components/modules/patients';
import { getPatients } from '@/lib/actions/patients';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';

export default async function PatientsPage() {
  const patients = await getPatients();

  const actions = (
    <Button asChild>
      <Link href="/patients/nuevo">
        <UserPlus className="mr-2 h-4 w-4" />
        Nuevo Paciente
      </Link>
    </Button>
  );

  return (
    <ModulePageLayout
      title="Gestión de pacientes"
      description="Maestro de usuarios — búsqueda, registro y consulta clínica"
      actions={actions}
      maxWidth="7xl"
    >
      <ModuleCard className="overflow-hidden p-0">
        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
          <p className="font-geist text-label-md uppercase tracking-wide text-[#45464d]">
            Listado maestro
          </p>
        </div>
        <div className="p-4">
          <PatientList users={patients} />
        </div>
      </ModuleCard>
    </ModulePageLayout>
  );
} 