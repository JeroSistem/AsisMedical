
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/shared';
import { PatientDetailClient } from '@/components/modules/patients';
import { getPatientById } from '@/lib/actions/patients';
import { getMedicalRecordByPatientId } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatientById(id);
  const medicalRecord = await getMedicalRecordByPatientId(id);

  if (!patient || !medicalRecord) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
         <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver a la lista de pacientes</span>
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Historia Clínica: {patient.name}
          </h2>
        </div>
        <PatientDetailClient patient={patient} medicalRecord={medicalRecord} />
      </div>
    </AppLayout>
  );
}
