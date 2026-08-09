import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/shared';
import { PatientFormWrapper } from '@/components/modules/patients';
import { getPatientById } from '@/lib/actions/patients';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  // Convertir el paciente al formato esperado por el formulario
  const patientFormData = {
    // Información de identificación
    documentType: patient.documentType,
    documentNumber: patient.documentNumber,
    countryOfIssue: patient.countryOfIssue,
    
    // Información personal
    firstName: patient.firstName,
    lastName: patient.lastName,
    secondLastName: patient.secondLastName,
    dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0], // Convertir Date a string YYYY-MM-DD
    age: patient.age,
    gender: patient.gender,
    maritalStatus: patient.maritalStatus,
    bloodType: patient.bloodType,
    occupation: patient.occupation,
    
    // Información clínica inicial
    allergies: patient.allergies,
    activeProblems: patient.activeProblems,
    initialObservations: patient.initialObservations,
    
    // Información de contacto
    mobilePhone: patient.mobilePhone,
    landlinePhone: patient.landlinePhone,
    email: patient.email,
    contactPreference: patient.contactPreference,
    notificationsConsent: patient.notificationsConsent,
    
    // Dirección
    address: patient.address,
    city: patient.city,
    department: patient.department,
    country: patient.country,
    
    // Contacto de emergencia
    emergencyContactName: patient.emergencyContactName,
    emergencyContactPhone: patient.emergencyContactPhone,
    emergencyContactRelationship: patient.emergencyContactRelationship,
    
    // Representante legal (para menores)
    legalRepresentativeName: patient.legalRepresentativeName,
    legalRepresentativeDocument: patient.legalRepresentativeDocument,
    legalRepresentativePhone: patient.legalRepresentativePhone,
    legalRepresentativeRelationship: patient.legalRepresentativeRelationship,
    
    // Información de seguro
    insuranceProvider: patient.insuranceProvider,
    insuranceNumber: patient.insuranceNumber,
    
    // Información de admisión
    createAdmission: patient.createAdmission,
    admissionType: patient.admissionType,
    admissionDate: patient.admissionDate ? patient.admissionDate.toISOString().split('T')[0] : '',
    
    // Consentimientos
    dataProcessingConsent: patient.dataProcessingConsent,
    medicalConsent: patient.medicalConsent,
    privacyConsent: patient.privacyConsent,
    communicationConsent: patient.communicationConsent,
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Header de la página */}
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/patients">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver a la lista de pacientes</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Editar Paciente</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Modificando información de: {patient.firstName} {patient.lastName}
            </p>
          </div>
        </div>

        {/* Formulario de edición */}
        <PatientFormWrapper 
          initialData={patientFormData} 
          isEditing={true} 
          patientId={id}
        />
      </div>
    </AppLayout>
  );
}
