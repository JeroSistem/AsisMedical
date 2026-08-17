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
import {
  createMedicalRecord,
  getMedicalRecordByAdmissionNumber,
  getMedicalRecordById,
  updateMedicalRecord,
  MedicalRecordFormData,
} from '@/lib/actions/medical-records';
import { searchPatientByQuery, getPatientById } from '@/lib/actions/patients';
import {
  getPatientAdmissionById,
  searchAdmissionsByQuery,
} from '@/lib/actions/patient-admissions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2, Save, UserPlus, Search, List } from 'lucide-react';
import { Suspense } from 'react';
import { GENDER_OPTIONS, normalizeGenderToEs } from '@/lib/gender';

const EMPTY_FORM: Partial<MedicalRecordFormData> = {
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
  professionalLicense: '',
};

export default function HistoriaClinicaPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Cargando historia...</div>}>
      <HistoriaClinicaContent />
    </Suspense>
  );
}

function HistoriaClinicaContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    'Busque por número de admisión o documento para cargar el ingreso.'
  );
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedAdmissionId, setSelectedAdmissionId] = useState('');
  const [editingRecordId, setEditingRecordId] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [clinicalHistoryNumber, setClinicalHistoryNumber] = useState('');
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<Partial<MedicalRecordFormData>>({
    ...EMPTY_FORM,
  });

  const resetFormForNewHistory = () => {
    setFormData({ ...EMPTY_FORM });
    setSelectedPatientId('');
    setSelectedAdmissionId('');
    setEditingRecordId('');
    setAdmissionNumber('');
    setClinicalHistoryNumber('');
    setSearchQuery('');
  };

  const fillFromMedicalRecord = (record: any) => {
    if (!record?.id) return;
    setEditingRecordId(record.id);
    setSelectedPatientId(record.patientId || '');
    setSelectedAdmissionId(record.admissionId || '');
    setAdmissionNumber(record.admissionNumber ? String(record.admissionNumber) : '');
    setClinicalHistoryNumber(
      record.clinicalHistoryNumber ? String(record.clinicalHistoryNumber) : ''
    );
    setSearchQuery(record.patientIdentification || '');
    setFormData({
      ...EMPTY_FORM,
      patientName: record.patientName || '',
      patientAge: record.patientAge || 0,
      patientGender: normalizeGenderToEs(record.patientGender) || '',
      patientIdentification: record.patientIdentification || '',
      patientAddress: record.patientAddress || '',
      patientPhone: record.patientPhone || '',
      patientEmail: record.patientEmail || '',
      patientOccupation: record.patientOccupation || '',
      patientInsurance: record.patientInsurance || '',
      consultationReason: record.consultationReason || '',
      medicalHistory: record.medicalHistory || '',
      surgicalHistory: record.surgicalHistory || '',
      familyHistory: record.familyHistory || '',
      habits: record.habits || '',
      currentIllnessHistory: record.currentIllnessHistory || '',
      bloodPressure: record.bloodPressure || '',
      heartRate: record.heartRate || '',
      temperature: record.temperature || '',
      oxygenSaturation: record.oxygenSaturation || '',
      physicalExam: record.physicalExam || '',
      diagnosis: record.diagnosis || '',
      medications: record.medications || '',
      complementaryStudies: record.complementaryStudies || '',
      recommendations: record.recommendations || '',
      evolution: record.evolution || '',
      professionalName: record.professionalName || '',
      professionalLicense: record.professionalLicense || '',
    });
    setStatusMessage(
      `Historia clínica ${record.clinicalHistoryNumber || '—'} · Admisión ${record.admissionNumber || '—'} · ${record.patientName || 'Paciente'}`
    );
  };

  const plainAdmissionNumber = (value: unknown) => {
    if (value == null || value === '') return '';
    return (
      String(value).replace(/\D/g, '').replace(/^0+(?=\d)/, '') || String(value)
    );
  };

  const fillFromAdmission = (admission: any) => {
    const p = admission?.patient;
    if (!p?.id) {
      setStatusMessage('La admisión no tiene paciente asociado.');
      return;
    }
    setEditingRecordId('');
    setSelectedPatientId(p.id);
    setSelectedAdmissionId(admission.id);
    setAdmissionNumber(plainAdmissionNumber(admission.admissionNumber));
    setClinicalHistoryNumber('');
    const admDate = admission.admissionDate
      ? new Date(admission.admissionDate)
      : null;
    const admDateLabel =
      admDate && !Number.isNaN(admDate.getTime())
        ? admDate.toLocaleDateString('es-CO')
        : '—';
    setFormData({
      ...EMPTY_FORM,
      patientName: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
      patientAge: p.age || 0,
      patientGender: normalizeGenderToEs(p.gender),
      patientIdentification: p.documentNumber || '',
      patientAddress: p.address || '',
      patientPhone: p.mobilePhone || '',
      patientEmail: p.email || '',
      patientOccupation: p.occupation || '',
      patientInsurance: p.insuranceProvider || '',
      bloodPressure: admission.bloodPressure || '',
      heartRate: admission.heartRate || '',
      temperature: admission.temperature || '',
      oxygenSaturation: admission.oxygenSaturation || '',
      currentIllnessHistory: admission.observation || '',
      consultationReason: 'Atención por urgencias / triage',
    });
    setStatusMessage(
      `Ingreso listo para nueva HC: ${p.firstName || ''} ${p.lastName || ''} · Admisión ${admission.admissionNumber ?? '—'} · Ingreso ${admDateLabel} ${admission.admissionTime || ''}`
    );
  };

  /** Si la admisión ya tiene HC, abre esa; si no, prepara formulario nuevo. */
  const loadAdmissionForHistory = async (admission: any) => {
    const admNum = plainAdmissionNumber(admission?.admissionNumber);
    if (admNum) {
      const existing = await getMedicalRecordByAdmissionNumber(admNum);
      if (existing) {
        fillFromMedicalRecord(existing);
        toast({
          title: 'Admisión ya utilizada',
          description: `La admisión ${admNum} ya tiene la HC ${existing.clinicalHistoryNumber}. Se abrió esa historia (no se puede crear otra con la misma admisión).`,
        });
        setStatusMessage(
          `Admisión ${admNum} ya usada · HC ${existing.clinicalHistoryNumber} abierta en modo consulta/edición.`
        );
        return;
      }
    }
    fillFromAdmission(admission);
  };

  useEffect(() => {
    const recordId = searchParams.get('id');
    const patientIdFromUrl = searchParams.get('patientId');
    const admissionId = searchParams.get('admissionId');
    if (!recordId && !patientIdFromUrl && !admissionId) return;
    (async () => {
      if (recordId) {
        setStatusMessage('Cargando historia clínica…');
        const record = await getMedicalRecordById(recordId);
        if (record) {
          fillFromMedicalRecord(record);
          return;
        }
        setStatusMessage('No se encontró la historia clínica solicitada.');
        toast({
          title: 'Historia no encontrada',
          description: 'El registro no existe o no está disponible.',
          variant: 'destructive',
        });
        return;
      }
      if (admissionId) {
        const admission = await getPatientAdmissionById(admissionId);
        if (admission?.patient) {
          await loadAdmissionForHistory(admission);
          setSearchQuery(admission.patient.documentNumber || '');
          return;
        }
      }
      if (patientIdFromUrl) {
        const patient = await getPatientById(patientIdFromUrl);
        if (patient) {
          setSelectedPatientId(patient.id);
          setSearchQuery(patient.documentNumber);
          setFormData((prev) => ({
            ...prev,
            patientName: `${patient.firstName} ${patient.lastName}`.trim(),
            patientAge: patient.age || 0,
            patientGender: normalizeGenderToEs(patient.gender),
            patientIdentification: patient.documentNumber || '',
            patientPhone: patient.mobilePhone || '',
            patientEmail: patient.email || '',
            patientAddress: patient.address || '',
          }));
          const adm = await searchAdmissionsByQuery(patient.documentNumber);
          // Preferir la primera admisión (número más bajo, p. ej. #1)
          const first =
            adm.admissions?.slice().sort(
              (a: any, b: any) =>
                (a.admissionNumber ?? 0) - (b.admissionNumber ?? 0)
            )[0] || adm.admission;
          if (adm.found && first) await loadAdmissionForHistory(first);
        }
      }
    })();
  }, [searchParams]);

  const handleInputChange = (field: keyof MedicalRecordFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePatientSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = searchQuery.trim();
    if (!text) {
      setStatusMessage('Escriba número de admisión (ej. 1) o número de documento.');
      return;
    }
    setIsSearching(true);
    setStatusMessage('Buscando…');
    try {
      const adm = await Promise.race([
        searchAdmissionsByQuery(text),
        new Promise<{ found: false; error: string }>((resolve) =>
          setTimeout(
            () =>
              resolve({
                found: false,
                error:
                  'La búsqueda tardó demasiado. Recargue e inicie sesión de nuevo.',
              }),
            20000
          )
        ),
      ]);

      if (adm.found && 'admission' in adm && adm.admission) {
        await loadAdmissionForHistory(adm.admission);
        return;
      }
      if (adm.found && 'admissions' in adm && adm.admissions?.length) {
        await loadAdmissionForHistory(adm.admissions[0]);
        return;
      }

      if ('error' in adm && adm.error) {
        setStatusMessage(adm.error);
        return;
      }

      const patientRes = await Promise.race([
        searchPatientByQuery(text),
        new Promise<{ found: false; error: string }>((resolve) =>
          setTimeout(
            () =>
              resolve({
                found: false,
                error: 'Tiempo de espera agotado al buscar paciente.',
              }),
            15000
          )
        ),
      ]);

      if (patientRes.found && 'patient' in patientRes && patientRes.patient) {
        const patient = patientRes.patient;
        setSelectedPatientId(patient.id);
        setFormData((prev) => ({
          ...prev,
          patientName: `${patient.firstName} ${patient.lastName}`.trim(),
          patientAge: patient.age || 0,
          patientGender: normalizeGenderToEs(patient.gender),
          patientIdentification: patient.documentNumber || '',
          patientPhone: patient.mobilePhone || '',
          patientEmail: patient.email || '',
          patientAddress: patient.address || '',
        }));
        setStatusMessage(
          'Paciente encontrado, pero sin ingreso de urgencias. Registre la admisión primero o continúe la historia.'
        );
        return;
      }

      setStatusMessage(
        ('error' in patientRes && patientRes.error) ||
          'No se encontró admisión ni paciente. Pruebe con el número de admisión (ej. 1) o el documento.'
      );
    } catch (err: any) {
      console.error('handlePatientSearch:', err);
      setStatusMessage(err?.message || 'Error al buscar. Intente de nuevo.');
    } finally {
      setIsSearching(false);
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
      if (editingRecordId) {
        const result = await updateMedicalRecord(editingRecordId, formData);
        if (result.success) {
          toast({
            title: 'Historia clínica actualizada',
            description: `HC ${clinicalHistoryNumber || ''} (admisión ${admissionNumber || ''}) guardada.`,
          });
          setStatusMessage(
            `Historia clínica ${clinicalHistoryNumber || '—'} actualizada.`
          );
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Error al actualizar la historia clínica',
            variant: 'destructive',
          });
        }
        return;
      }

      const result = await createMedicalRecord({
        ...formData as MedicalRecordFormData,
        patientId: selectedPatientId,
        admissionId: selectedAdmissionId || undefined,
        admissionNumber: admissionNumber || undefined,
      });

      if (result.success) {
        const hc = String(result.clinicalHistoryNumber || '');
        const adm = String(result.admissionNumber || admissionNumber || '');

        toast({
          title: 'Historia clínica guardada',
          description: `HC ${hc} guardada correctamente (admisión ${adm}). El formulario quedó listo para una nueva historia.`,
        });

        resetFormForNewHistory();
        setStatusMessage(
          `Historia clínica ${hc} guardada. Formulario listo para una nueva HC.`
        );
      } else {
        if (result.alreadyUsed && result.medicalRecordId) {
          const existing = await getMedicalRecordById(result.medicalRecordId);
          if (existing) {
            fillFromMedicalRecord(existing);
          }
          toast({
            title: 'Admisión ya utilizada',
            description:
              result.error ||
              'Esa admisión ya tiene una historia clínica. Se abrió la existente.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Error al guardar la historia clínica',
            variant: 'destructive',
          });
        }
        if (result.clinicalHistoryNumber) {
          setClinicalHistoryNumber(String(result.clinicalHistoryNumber));
        }
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      toast({
        title: 'Error',
        description: 'Error inesperado al guardar la historia clínica',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const actions = (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant="outline">
        <Link href="/historias/listado">
          <List className="mr-2 h-4 w-4" />
          Listado de historias
        </Link>
      </Button>
      <Button asChild>
        <Link href="/patients/nuevo">
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Paciente
        </Link>
      </Button>
    </div>
  );

  return (
    <ModulePageLayout
      title={
        editingRecordId
          ? `Historia clínica ${clinicalHistoryNumber || ''}`.trim()
          : 'Crear Nueva Historia Clínica'
      }
      description={
        editingRecordId
          ? `Consulta / edición · Admisión ${admissionNumber || '—'}`
          : 'Formulario completo de historia clínica electrónica'
      }
      actions={actions}
      maxWidth="7xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Paciente / Ingreso de urgencias</CardTitle>
              <CardDescription>
                Busque por número de admisión (ej. 1) o por número de documento.
                Cada admisión solo puede usarse en una historia clínica.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1 space-y-2">
                  <Label htmlFor="patient-search">Buscar por admisión o documento</Label>
                  <Input
                    id="patient-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        void handlePatientSearch();
                      }
                    }}
                    placeholder="Ej. 1  ·  o documento del paciente"
                  />
                </div>
                <Button type="button" onClick={handlePatientSearch} disabled={isSearching}>
                  <Search className="mr-2 h-4 w-4" />
                  {isSearching ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{statusMessage}</p>
              {formData.patientName && (
                <div className="rounded-md border bg-slate-50 px-3 py-2 text-sm">
                  <strong>{formData.patientName}</strong>
                  {' · '}
                  Doc: {formData.patientIdentification}
                  {' · '}
                  Edad: {formData.patientAge}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Números de Identificación</CardTitle>
              <CardDescription>
                El número de admisión proviene del ingreso de triage; el de historia se asigna al guardar
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="admission-number">Número de Admisión</Label>
                <Input 
                  id="admission-number" 
                  value={admissionNumber || ''}
                  readOnly
                  className="bg-muted font-mono"
                  placeholder="Cargue el ingreso (ej. 1)" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinical-history-number">Número de Historia Clínica</Label>
                <Input 
                  id="clinical-history-number" 
                  value={clinicalHistoryNumber}
                  readOnly
                  className="bg-muted font-mono"
                  placeholder="Se asignará al guardar" 
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
                <Select
                  value={normalizeGenderToEs(formData.patientGender) || undefined}
                  onValueChange={(value) => handleInputChange('patientGender', value)}
                >
                  <SelectTrigger id="genero">
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  {editingRecordId
                    ? 'Actualizar Historia Clínica'
                    : 'Guardar Historia Clínica'}
                </>
              )}
            </Button>
          </div>
        </form>
    </ModulePageLayout>
  );
}
