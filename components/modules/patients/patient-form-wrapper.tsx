'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PatientFormStep1, PatientFormStep2, PatientFormStep3, PatientFormStep4, PatientFormSummary } from './index';
import { PatientFormData, createPatient, updatePatient } from '@/lib/actions/patients';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PatientFormWrapperProps {
  initialData?: Partial<PatientFormData>;
  isEditing?: boolean;
  patientId?: string;
}

const initialFormData: PatientFormData = {
  // Información de identificación
  documentType: '',
  documentNumber: '',
  countryOfIssue: 'CO',
  
  // Información personal
  firstName: '',
  lastName: '',
  secondLastName: '',
  dateOfBirth: '',
  age: 0,
  gender: '',
  maritalStatus: '',
  bloodType: '',
  occupation: '',
  
  // Información clínica inicial
  allergies: '',
  activeProblems: '',
  initialObservations: '',
  
  // Información de contacto
  mobilePhone: '',
  landlinePhone: '',
  email: '',
  contactPreference: 'mobile',
  notificationsConsent: true,
  
  // Dirección
  address: '',
  city: '',
  department: '',
  country: 'Colombia',
  
  // Contacto de emergencia
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  
  // Representante legal (para menores)
  legalRepresentativeName: '',
  legalRepresentativeDocument: '',
  legalRepresentativePhone: '',
  legalRepresentativeRelationship: '',
  
  // Información de seguro
  insuranceProvider: '',
  insuranceNumber: '',
  
  // Información de admisión
  createAdmission: false,
  admissionType: '',
  admissionDate: '',
  
  // Consentimientos
  dataProcessingConsent: false,
  medicalConsent: false,
  privacyConsent: false,
  communicationConsent: false,
};

export function PatientFormWrapper({ initialData, isEditing = false, patientId }: PatientFormWrapperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PatientFormData>({ ...initialFormData, ...initialData });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();

  const totalSteps = 5;

  const updateFormData = (data: Partial<PatientFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      let result;
      
      if (isEditing && patientId) {
        result = await updatePatient(patientId, formData);
      } else {
        result = await createPatient(formData);
      }

      if (result.success) {
        setSubmitResult({
          success: true,
          message: isEditing 
            ? 'Paciente actualizado exitosamente' 
            : 'Paciente creado exitosamente',
          type: 'success'
        });

        toast({
          title: "Éxito",
          description: result.message || (isEditing ? 'Paciente actualizado' : 'Paciente creado'),
        });

        // Redirigir después de un breve delay
        setTimeout(() => {
          router.push('/patients');
        }, 2000);
      } else {
        setSubmitResult({
          success: false,
          message: result.error || 'Error al procesar la solicitud',
          type: 'error'
        });

        toast({
          title: "Error",
          description: result.error || 'Error al procesar la solicitud',
          variant: "destructive",
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'Error inesperado al procesar la solicitud',
        type: 'error'
      });

      toast({
        title: "Error",
        description: 'Error inesperado al procesar la solicitud',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PatientFormStep1 formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <PatientFormStep2 formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <PatientFormStep3 formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <PatientFormStep4 formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <PatientFormSummary formData={formData} />;
      default:
        return <PatientFormStep1 formData={formData} updateFormData={updateFormData} />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Información de Identificación';
      case 2: return 'Información Personal y Clínica';
      case 3: return 'Información de Contacto y Dirección';
      case 4: return 'Información Adicional y Consentimientos';
      case 5: return 'Resumen y Confirmación';
      default: return 'Información del Paciente';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con progreso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}</span>
            <span className="text-sm text-gray-500">
              Paso {currentStep} de {totalSteps}
            </span>
          </CardTitle>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Contenido del paso actual */}
      <Card>
        <CardHeader>
          <CardTitle>{getStepTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Resultado del envío */}
      {submitResult && (
        <Alert className={submitResult.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {submitResult.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={submitResult.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {submitResult.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Navegación */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div className="flex gap-2">
          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              className="flex items-center gap-2"
            >
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Actualizar Paciente' : 'Crear Paciente'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
