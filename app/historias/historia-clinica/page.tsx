'use client';

import { useState, useEffect } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createMedicalRecord, MedicalRecordFormData } from '@/lib/actions/medical-records';
import { getPatients } from '@/lib/actions/patients';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Save, UserPlus } from 'lucide-react';

export default function HistoriaClinicaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [clinicalHistoryNumber, setClinicalHistoryNumber] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado del formulario
  const [formData, setFormData] = useState<Partial<MedicalRecordFormData>>({
    patientName: '',
    patientAge: 0,
    patientGender: '',
    patientIdentification: '',
    patientAddress: '',
    patientPhone: '',
    patientEmail: '',
    patientOccupation: '',
    patientInsurance: '',
    consultationReason: '',
    medicalHistory: '',
    surgicalHistory: '',
    familyHistory: '',
    habits: '',
    currentIllnessHistory: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    oxygenSaturation: '',
    physicalExam: '',
    diagnosis: '',
    medications: '',
    complementaryStudies: '',
    recommendations: '',
    evolution: '',
    professionalName: '',
    professionalLicense: ''
  });

  // Cargar pacientes al montar el componente
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const patientsList = await getPatients();
        setPatients(patientsList);
        
        // Si hay un parámetro de paciente en la URL, seleccionarlo automáticamente
        const patientIdFromUrl = searchParams.get('patientId');
        if (patientIdFromUrl) {
          const patient = patientsList.find(p => p.id === patientIdFromUrl);
          if (patient) {
            setSelectedPatientId(patientIdFromUrl);
            setFormData(prev => ({
              ...prev,
              patientName: patient.name,
              patientAge: patient.age,
              patientGender: patient.gender,
              patientIdentification: patient.documentNumber,
              patientPhone: patient.contact,
              patientEmail: patient.contact.includes('@') ? patient.contact : ''
            }));
          }
        }
      } catch (error) {
        console.error('Error loading patients:', error);
        toast({
          title: "Error",
          description: "Error al cargar la lista de pacientes",
          variant: "destructive"
        });
      }
    };
    loadPatients();
  }, [toast, searchParams]);

  const handleInputChange = (field: keyof MedicalRecordFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patientName: patient.name,
        patientAge: patient.age,
        patientGender: patient.gender,
        patientIdentification: patient.documentNumber,
        patientPhone: patient.contact,
        patientEmail: patient.contact.includes('@') ? patient.contact : ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatientId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un paciente",
        variant: "destructive"
      });
      return;
    }

    // Validar campos requeridos
    const requiredFields = [
      'consultationReason', 'medicalHistory', 'currentIllnessHistory', 
      'diagnosis', 'professionalName', 'professionalLicense'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof MedicalRecordFormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: `Debe completar los campos: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Enviando datos:', { ...formData, patientId: selectedPatientId });
      
      const result = await createMedicalRecord({
        ...formData as MedicalRecordFormData,
        patientId: selectedPatientId
      });

      console.log('Resultado:', result);

      if (result.success) {
        // Mostrar los números generados
        setAdmissionNumber(result.admissionNumber || '');
        setClinicalHistoryNumber(result.clinicalHistoryNumber || '');
        
        toast({
          title: "Éxito",
          description: `Historia clínica guardada correctamente. Admisión: ${result.admissionNumber}, Historia: ${result.clinicalHistoryNumber}`,
        });
        
        // Redirigir a la página del paciente después de 3 segundos
        setTimeout(() => {
          router.push(`/patients/${selectedPatientId}`);
        }, 3000);
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al guardar la historia clínica",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      toast({
        title: "Error",
        description: "Error inesperado al guardar la historia clínica",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const actions = (
    <Button asChild>
      <a href="/patients/nuevo">
        <UserPlus className="mr-2 h-4 w-4" />
        Nuevo Paciente
      </a>
    </Button>
  );

  return (
    <ModulePageLayout
      title="Crear Nueva Historia Clínica"
      description="Formulario completo de historia clínica electrónica"
      actions={actions}
      maxWidth="7xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Selección del Paciente</CardTitle>
              <CardDescription>Seleccione el paciente para crear la historia clínica</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="patient-select">Paciente *</Label>
                <Select value={selectedPatientId} onValueChange={handlePatientSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.documentNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Números de Identificación</CardTitle>
              <CardDescription>Números únicos generados automáticamente para esta atención</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="admission-number">Número de Admisión</Label>
                <Input 
                  id="admission-number" 
                  value={admissionNumber}
                  readOnly
                  className="bg-muted font-mono"
                  placeholder="Se generará automáticamente al guardar" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinical-history-number">Número de Historia Clínica</Label>
                <Input 
                  id="clinical-history-number" 
                  value={clinicalHistoryNumber}
                  readOnly
                  className="bg-muted font-mono"
                  placeholder="Se generará automáticamente al guardar" 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Datos del Paciente</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre-completo">Nombre completo</Label>
                <Input 
                  id="nombre-completo" 
                  value={formData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  placeholder="John Doe" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edad">Edad</Label>
                <Input 
                  id="edad" 
                  type="number"
                  value={formData.patientAge || ''}
                  onChange={(e) => handleInputChange('patientAge', parseInt(e.target.value) || 0)}
                  placeholder="38" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genero">Género</Label>
                <Input 
                  id="genero" 
                  value={formData.patientGender}
                  onChange={(e) => handleInputChange('patientGender', e.target.value)}
                  placeholder="Masculino" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identificacion">Número de identificación</Label>
                <Input 
                  id="identificacion" 
                  value={formData.patientIdentification}
                  onChange={(e) => handleInputChange('patientIdentification', e.target.value)}
                  placeholder="123456789" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input 
                  id="direccion" 
                  value={formData.patientAddress}
                  onChange={(e) => handleInputChange('patientAddress', e.target.value)}
                  placeholder="Calle Falsa 123" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input 
                  id="telefono" 
                  value={formData.patientPhone}
                  onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                  placeholder="+57 300 1234567" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.patientEmail}
                  onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                  placeholder="john.doe@example.com" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ocupacion">Ocupación</Label>
                <Input 
                  id="ocupacion" 
                  value={formData.patientOccupation}
                  onChange={(e) => handleInputChange('patientOccupation', e.target.value)}
                  placeholder="Ingeniero de Software" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aseguradora">Aseguradora</Label>
                <Input 
                  id="aseguradora" 
                  value={formData.patientInsurance}
                  onChange={(e) => handleInputChange('patientInsurance', e.target.value)}
                  placeholder="Seguros Médicos ABC" 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Motivo de Consulta (MC) *</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={formData.consultationReason}
                onChange={(e) => handleInputChange('consultationReason', e.target.value)}
                placeholder="Describa el motivo principal de la consulta..." 
                required
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Antecedentes Personales y Familiares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="antecedentes-medicos" className="font-semibold">Antecedentes médicos (enfermedades previas) *</Label>
                <Textarea 
                  id="antecedentes-medicos" 
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  placeholder="Diabetes, hipertensión, alergias, etc." 
                  required
                />
              </div>
              <div>
                <Label htmlFor="antecedentes-quirurgicos" className="font-semibold">Antecedentes quirúrgicos</Label>
                <Textarea 
                  id="antecedentes-quirurgicos" 
                  value={formData.surgicalHistory}
                  onChange={(e) => handleInputChange('surgicalHistory', e.target.value)}
                  placeholder="Cirugías anteriores" 
                />
              </div>
              <div>
                <Label htmlFor="antecedentes-familiares" className="font-semibold">Antecedentes familiares</Label>
                <Textarea 
                  id="antecedentes-familiares" 
                  value={formData.familyHistory}
                  onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                  placeholder="Enfermedades relevantes en familiares directos" 
                />
              </div>
              <div>
                <Label htmlFor="habitos" className="font-semibold">Hábitos</Label>
                <Textarea 
                  id="habitos" 
                  value={formData.habits}
                  onChange={(e) => handleInputChange('habits', e.target.value)}
                  placeholder="Tabaco, alcohol, drogas, dieta, ejercicio" 
                />
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>6. Historia de la Enfermedad Actual (HEA) *</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={formData.currentIllnessHistory}
                onChange={(e) => handleInputChange('currentIllnessHistory', e.target.value)}
                placeholder="Cronología detallada de los síntomas: cuándo empezaron, cómo evolucionaron, tratamientos previos, etc." 
                required
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Examen Físico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="tension-arterial">Tensión arterial</Label>
                        <Input 
                          id="tension-arterial" 
                          value={formData.bloodPressure}
                          onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                          placeholder="120/80 mmHg"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="frecuencia-cardiaca">Frecuencia cardíaca</Label>
                        <Input 
                          id="frecuencia-cardiaca" 
                          value={formData.heartRate}
                          onChange={(e) => handleInputChange('heartRate', e.target.value)}
                          placeholder="75 lpm"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="temperatura">Temperatura</Label>
                        <Input 
                          id="temperatura" 
                          value={formData.temperature}
                          onChange={(e) => handleInputChange('temperature', e.target.value)}
                          placeholder="36.5 °C"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="saturacion">Saturación de O₂</Label>
                        <Input 
                          id="saturacion" 
                          value={formData.oxygenSaturation}
                          onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
                          placeholder="98%"
                        />
                    </div>
               </div>
               <Separator />
               <div>
                <Label htmlFor="examen-sistemas" className="font-semibold">Examen por sistemas</Label>
                <Textarea 
                  id="examen-sistemas" 
                  value={formData.physicalExam}
                  onChange={(e) => handleInputChange('physicalExam', e.target.value)}
                  placeholder="Cabeza y cuello, Cardiopulmonar, Abdomen, Extremidades, Neurológico, Piel, etc." 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Diagnóstico Presuntivo o Definitivo *</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={formData.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                placeholder="Hipótesis o conclusión médica basada en los datos recogidos." 
                required
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Plan de Tratamiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                <Label htmlFor="medicamentos" className="font-semibold">Medicamentos recetados</Label>
                <Textarea 
                  id="medicamentos" 
                  value={formData.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                  placeholder="Nombre, dosis, frecuencia..." 
                />
              </div>
               <div>
                <Label htmlFor="estudios" className="font-semibold">Estudios complementarios solicitados</Label>
                <Textarea 
                  id="estudios" 
                  value={formData.complementaryStudies}
                  onChange={(e) => handleInputChange('complementaryStudies', e.target.value)}
                  placeholder="Laboratorio, rayos X, etc." 
                />
              </div>
               <div>
                <Label htmlFor="recomendaciones" className="font-semibold">Recomendaciones</Label>
                <Textarea 
                  id="recomendaciones" 
                  value={formData.recommendations}
                  onChange={(e) => handleInputChange('recommendations', e.target.value)}
                  placeholder="Reposo, dieta, seguimiento..." 
                />
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>10. Evolución y Notas Adicionales</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={formData.evolution}
                onChange={(e) => handleInputChange('evolution', e.target.value)}
                placeholder="Registro de visitas posteriores, cambios en el tratamiento o evolución del paciente." 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Firma del Profesional *</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="nombre-profesional">Nombre del profesional *</Label>
                    <Input 
                      id="nombre-profesional" 
                      value={formData.professionalName}
                      onChange={(e) => handleInputChange('professionalName', e.target.value)}
                      placeholder="Dr. Juan Pérez" 
                      required
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="licencia-profesional">Número de licencia *</Label>
                    <Input 
                      id="licencia-profesional" 
                      value={formData.professionalLicense}
                      onChange={(e) => handleInputChange('professionalLicense', e.target.value)}
                      placeholder="12345" 
                      required
                    />
                </div>
                 <div className="space-y-2 col-span-full">
                    <Label htmlFor="firma-profesional">Firma</Label>
                    <div className="border bg-slate-100 rounded-md h-32 flex items-center justify-center text-gray-500">
                        Área de firma digital (implementación futura)
                    </div>
                </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Historia Clínica
                </>
              )}
            </Button>
          </div>
        </form>
    </ModulePageLayout>
  );
}
