
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { PatientDetailClient } from '@/components/patient-detail-client';
import { getPatientById, getMedicalRecordByPatientId } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = getPatientById(params.id);
  const medicalRecord = getMedicalRecordByPatientId(params.id);

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
