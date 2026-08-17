'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { PatientFormSimple } from '@/components/modules/patients/patient-form-simple';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function NuevoPacienteContent() {
  const searchParams = useSearchParams();

  const initialData = useMemo(() => {
    const documentType = searchParams.get('documentType') || '';
    const documentNumber = searchParams.get('documentNumber') || '';
    if (!documentType && !documentNumber) return undefined;
    return {
      documentType,
      documentNumber,
    };
  }, [searchParams]);

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
        <PatientFormSimple initialData={initialData} />
      </div>
    </ModulePageLayout>
  );
}

export default function NuevoPacientePage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Cargando formulario...</div>}>
      <NuevoPacienteContent />
    </Suspense>
  );
}
