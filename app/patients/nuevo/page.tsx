'use client';

import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { PatientFormSimple } from '@/components/modules/patients/patient-form-simple';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NuevoPacientePage() {
  const actions = (
    <Button asChild variant="outline" size="sm">
      <Link href="/patients">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Pacientes
      </Link>
    </Button>
  );

  return (
    <ModulePageLayout
      title="Nuevo Paciente"
      description="Registre la información del nuevo paciente en el sistema"
      actions={actions}
      maxWidth="full"
      showBackButton={true}
    >
      <div className="mx-[20px]">
        <PatientFormSimple />
      </div>
    </ModulePageLayout>
  );
}
