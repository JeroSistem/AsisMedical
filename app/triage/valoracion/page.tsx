'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { 
  Save, 
  Trash2, 
  Search, 
  HelpCircle, 
  User, 
  Activity,
  Thermometer,
  Heart,
  Droplets,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle,
  Brain,
  Zap,
  Stethoscope,
  FileText,
  Calendar,
  Clock as ClockIcon
} from 'lucide-react';
import { searchAdmissionsByQuery } from '@/lib/actions/patient-admissions';
import { createTriageAssessment } from '@/lib/actions/triage-assessment';

interface Patient {
  id: string;
  name: string;
  documentNumber: string;
  documentType: string;
  age: number;
  gender: string;
  mobilePhone?: string;
  email?: string;
}

interface TriageAssessmentForm {
  // Paciente
  patientId: string;
  
  // Datos básicos
  arrivalTime: string;
  assessmentDate: string;
  assessmentTime: string;
  
  // Signos vitales
  bloodPressure: string;
  heartRate: string;
  respiratoryRate: string;
  temperature: string;
  oxygenSaturation: string;
  painLevel: number;
  
  // Nivel de consciencia (Glasgow)
  eyeOpening: number;
  verbalResponse: number;
  motorResponse: number;
  glasgowTotal: number;
  
  // Evaluación del dolor
  painLocation: string;
  painCharacter: string;
  painIntensity: number;
  painDuration: string;
  
  // Síntomas principales
  mainSymptom: string;
  symptomDuration: string;
  associatedSymptoms: string;
  
  // Factores de riesgo
  riskFactors: string[];
  
  // Clasificación de urgencia
  urgencyLevel: string;
  triageCategory: string;
  estimatedWaitTime: string;
  
  // Observaciones
  observations: string;
  recommendations: string;
  
  // Profesional
  professionalName: string;
  professionalLicense: string;
}

const PAIN_SCALE = [
  { value: 0, label: "0 - Sin dolor", color: "bg-green-100 text-green-800" },
  { value: 1, label: "1 - Dolor leve", color: "bg-green-100 text-green-800" },
  { value: 2, label: "2 - Dolor leve", color: "bg-green-100 text-green-800" },
  { value: 3, label: "3 - Dolor moderado", color: "bg-yellow-100 text-yellow-800" },
  { value: 4, label: "4 - Dolor moderado", color: "bg-yellow-100 text-yellow-800" },
  { value: 5, label: "5 - Dolor moderado", color: "bg-yellow-100 text-yellow-800" },
  { value: 6, label: "6 - Dolor intenso", color: "bg-orange-100 text-orange-800" },
  { value: 7, label: "7 - Dolor intenso", color: "bg-orange-100 text-orange-800" },
  { value: 8, label: "8 - Dolor muy intenso", color: "bg-red-100 text-red-800" },
  { value: 9, label: "9 - Dolor muy intenso", color: "bg-red-100 text-red-800" },
  { value: 10, label: "10 - Dolor insoportable", color: "bg-red-100 text-red-800" }
];

const GLASGOW_EYE = [
  { value: 4, label: "4 - Espontáneo" },
  { value: 3, label: "3 - A estímulos verbales" },
  { value: 2, label: "2 - Al dolor" },
  { value: 1, label: "1 - Ninguna" }
];

const GLASGOW_VERBAL = [
  { value: 5, label: "5 - Orientado" },
  { value: 4, label: "4 - Confuso" },
  { value: 3, label: "3 - Palabras inapropiadas" },
  { value: 2, label: "2 - Sonidos incomprensibles" },
  { value: 1, label: "1 - Ninguna" }
];

const GLASGOW_MOTOR = [
  { value: 6, label: "6 - Obedece órdenes" },
  { value: 5, label: "5 - Localiza el dolor" },
  { value: 4, label: "4 - Retirada al dolor" },
  { value: 3, label: "3 - Flexión anormal" },
  { value: 2, label: "2 - Extensión anormal" },
  { value: 1, label: "1 - Ninguna" }
];

const URGENCY_LEVELS = [
  { value: "RESUCITACION", label: "Resucitación", color: "bg-red-600", waitTime: "Inmediato", description: "Amenaza vital inmediata" },
  { value: "MUY_URGENTE", label: "Muy Urgente", color: "bg-orange-600", waitTime: "< 10 min", description: "Amenaza vital potencial" },
  { value: "URGENTE", label: "Urgente", color: "bg-yellow-600", waitTime: "< 60 min", description: "Urgencia real" },
  { value: "POCO_URGENTE", label: "Poco Urgente", color: "bg-blue-600", waitTime: "< 120 min", description: "Urgencia menor" },
  { value: "NO_URGENTE", label: "No Urgente", color: "bg-green-600", waitTime: "< 240 min", description: "Consulta programable" }
];

const RISK_FACTORS = [
  "Edad > 65 años",
  "Enfermedad cardiovascular",
  "Diabetes mellitus",
  "Inmunosupresión",
  "Embarazo",
  "Antecedentes de cáncer",
  "Enfermedad pulmonar crónica",
  "Insuficiencia renal",
  "Anticoagulación",
  "Alergias medicamentosas"
];

export default function TriageAssessmentPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Cargando valoración...</div>}>
      <TriageAssessmentContent />
    </Suspense>
  );
}

function TriageAssessmentContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    'Busque por documento o nombre para cargar el ingreso del paciente.'
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState('');
  const [selectedAdmissionNumber, setSelectedAdmissionNumber] = useState<number | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado del formulario
  const [formData, setFormData] = useState<TriageAssessmentForm>({
    patientId: '',
    arrivalTime: new Date().toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
    assessmentDate: new Date().toISOString().split('T')[0],
    assessmentTime: new Date().toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    temperature: '',
    oxygenSaturation: '',
    painLevel: 0,
    eyeOpening: 4,
    verbalResponse: 5,
    motorResponse: 6,
    glasgowTotal: 15,
    painLocation: '',
    painCharacter: '',
    painIntensity: 0,
    painDuration: '',
    mainSymptom: '',
    symptomDuration: '',
    associatedSymptoms: '',
    riskFactors: [],
    urgencyLevel: 'URGENTE',
    triageCategory: 'URGENTE',
    estimatedWaitTime: '< 60 min',
    observations: '',
    recommendations: '',
    professionalName: '',
    professionalLicense: ''
  });

  const applyAdmission = (admission: any) => {
    const p = admission.patient;
    if (!p) return;
    setSelectedPatient({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`.trim(),
      documentNumber: p.documentNumber,
      documentType: p.documentType || '',
      age: p.age,
      gender: p.gender,
      mobilePhone: p.mobilePhone || '',
      email: p.email || '',
    });
    setSelectedAdmissionId(admission.id);
    setSelectedAdmissionNumber(
      admission.admissionNumber != null ? Number(admission.admissionNumber) : null
    );
    setFormData((prev) => ({
      ...prev,
      patientId: p.id,
      bloodPressure: admission.bloodPressure || prev.bloodPressure,
      heartRate: admission.heartRate || prev.heartRate,
      respiratoryRate: admission.respiratoryRate || prev.respiratoryRate,
      temperature: admission.temperature || prev.temperature,
      oxygenSaturation: admission.oxygenSaturation || prev.oxygenSaturation,
      observations: admission.observation || prev.observations,
      arrivalTime: admission.admissionTime || prev.arrivalTime,
    }));
    setStatusMessage(
      `Ingreso cargado: ${p.firstName} ${p.lastName} · Admisión ${admission.admissionNumber ?? '—'} · ${p.documentType || 'Doc'} ${p.documentNumber}`
    );
  };

  useEffect(() => {
    const patientId = searchParams.get('patientId');
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
    if (!patientId && !q) return;
    (async () => {
      const result = await searchAdmissionsByQuery(q || patientId || '');
      if (result.found && result.admission) {
        applyAdmission(result.admission);
      } else if (patientId) {
        const res = await fetch(`/api/triage`);
        const json = await res.json();
        const match = (json.data || []).find((x: any) => x.patientId === patientId);
        if (match) {
          setSelectedPatient(match.patient);
          setFormData((prev) => ({
            ...prev,
            patientId: match.patientId,
            bloodPressure: match.admission?.bloodPressure || '',
            heartRate: match.admission?.heartRate || '',
            respiratoryRate: match.admission?.respiratoryRate || '',
            temperature: match.admission?.temperature || '',
            oxygenSaturation: match.admission?.oxygenSaturation || '',
            observations: match.observations || '',
          }));
          setStatusMessage(`Ingreso cargado: ${match.patientName}`);
        }
      }
    })();
  }, [searchParams]);

  const handlePatientSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = searchQuery.trim();
    if (!text) {
      setStatusMessage('Escriba documento o nombre para buscar el ingreso.');
      return;
    }
    setIsSearching(true);
    try {
      const result = await searchAdmissionsByQuery(text);
      if (result.error) {
        setStatusMessage(result.error);
        return;
      }
      if (result.found && result.admission) {
        applyAdmission(result.admission);
        return;
      }
      setSelectedPatient(null);
      setFormData((prev) => ({ ...prev, patientId: '' }));
      setStatusMessage('No hay ingreso de triage para ese paciente. Regístrelo primero en Ingreso Paciente.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (field: keyof TriageAssessmentForm, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calcular Glasgow automáticamente
  useEffect(() => {
    const total = formData.eyeOpening + formData.verbalResponse + formData.motorResponse;
    setFormData(prev => ({
      ...prev,
      glasgowTotal: total
    }));
  }, [formData.eyeOpening, formData.verbalResponse, formData.motorResponse]);

  // Determinar nivel de urgencia basado en signos vitales y Glasgow
  const determineUrgencyLevel = () => {
    const hr = parseInt(formData.heartRate);
    const bp = formData.bloodPressure;
    const rr = parseInt(formData.respiratoryRate);
    const temp = parseFloat(formData.temperature);
    const o2 = parseInt(formData.oxygenSaturation);
    const glasgow = formData.glasgowTotal;
    const pain = formData.painIntensity;

    // Criterios de resucitación
    if (glasgow < 9 || o2 < 90 || hr < 50 || hr > 150) {
      return "RESUCITACION";
    }

    // Criterios muy urgentes
    if (glasgow < 13 || o2 < 95 || hr < 60 || hr > 120 || rr < 12 || rr > 25 || temp > 39) {
      return "MUY_URGENTE";
    }

    // Criterios urgentes
    if (pain >= 7 || hr > 100 || rr > 20 || temp > 38) {
      return "URGENTE";
    }

    // Criterios poco urgentes
    if (pain >= 4 || hr > 90 || temp > 37.5) {
      return "POCO_URGENTE";
    }

    return "NO_URGENTE";
  };

  // Actualizar nivel de urgencia cuando cambian los signos vitales
  useEffect(() => {
    const urgencyLevel = determineUrgencyLevel();
    const urgencyInfo = URGENCY_LEVELS.find(u => u.value === urgencyLevel);
    
    setFormData(prev => ({
      ...prev,
      urgencyLevel,
      triageCategory: urgencyInfo?.label || 'Urgente',
      estimatedWaitTime: urgencyInfo?.waitTime || '< 60 min'
    }));
  }, [formData.heartRate, formData.bloodPressure, formData.respiratoryRate, 
      formData.temperature, formData.oxygenSaturation, formData.glasgowTotal, 
      formData.painIntensity]);

  const handleRiskFactorToggle = (factor: string) => {
    setFormData(prev => ({
      ...prev,
      riskFactors: prev.riskFactors.includes(factor)
        ? prev.riskFactors.filter(f => f !== factor)
        : [...prev.riskFactors, factor]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un paciente",
        variant: "destructive"
      });
      return;
    }

    // Validar campos requeridos
    const requiredFields = [
      'assessmentDate', 'assessmentTime', 'urgencyLevel', 'professionalName', 'professionalLicense'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof TriageAssessmentForm]);
    
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
      const result = await createTriageAssessment({
        ...formData,
        admissionId: selectedAdmissionId || undefined,
        admissionNumber: selectedAdmissionNumber ?? undefined,
      });
      
      if (result.success) {
        toast({
          title: "Éxito",
          description: selectedAdmissionNumber != null
            ? `Valoración registrada (Admisión ${selectedAdmissionNumber})`
            : 'Valoración de triage registrada correctamente',
        });
        
        // Redirigir a la lista de triage
        router.push('/triage');
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al registrar la valoración de triage",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      toast({
        title: "Error",
        description: "Error inesperado al registrar la valoración",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      patientId: '',
      arrivalTime: new Date().toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      assessmentDate: new Date().toISOString().split('T')[0],
      assessmentTime: new Date().toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      temperature: '',
      oxygenSaturation: '',
      painLevel: 0,
      eyeOpening: 4,
      verbalResponse: 5,
      motorResponse: 6,
      glasgowTotal: 15,
      painLocation: '',
      painCharacter: '',
      painIntensity: 0,
      painDuration: '',
      mainSymptom: '',
      symptomDuration: '',
      associatedSymptoms: '',
      riskFactors: [],
      urgencyLevel: 'URGENTE',
      triageCategory: 'Urgente',
      estimatedWaitTime: '< 60 min',
      observations: '',
      recommendations: '',
      professionalName: '',
      professionalLicense: ''
    });
    setSelectedPatient(null);
  };

  const getUrgencyColor = (level: string) => {
    const urgency = URGENCY_LEVELS.find(u => u.value === level);
    return urgency?.color || 'bg-gray-600';
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Valoración Triage</h1>
            <Stethoscope className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push('/triage')}>
              <Search className="mr-2 h-4 w-4" />
              Listado
            </Button>
            <Button variant="outline">
              <HelpCircle className="mr-2 h-4 w-4" />
              Ayuda
            </Button>
          </div>
        </div>

                 <form onSubmit={handleSubmit} className="space-y-6">

          {/* Sección: Paciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <User className="h-5 w-5" />
                Paciente / Ingreso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1 space-y-2">
                  <Label htmlFor="patient-search">Buscar por documento o nombre</Label>
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
                    placeholder="Documento o nombre..."
                  />
                </div>
                <Button type="button" onClick={handlePatientSearch} disabled={isSearching}>
                  <Search className="mr-2 h-4 w-4" />
                  {isSearching ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{statusMessage}</p>
              {selectedPatient && (
                <div className="rounded-md border bg-slate-50 px-3 py-2 text-sm">
                  <strong>{selectedPatient.name}</strong>
                  {' · '}
                  {selectedPatient.documentType}: {selectedPatient.documentNumber}
                  {' · '}
                  Edad: {selectedPatient.age} · Género: {selectedPatient.gender}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sección: Datos de Valoración */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Calendar className="h-5 w-5" />
                Datos de Valoración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arrival-time">Hora de llegada</Label>
                  <div className="relative">
                    <Input
                      id="arrival-time"
                      type="time"
                      value={formData.arrivalTime}
                      onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                      className="pl-10"
                    />
                    <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessment-date">Fecha de valoración *</Label>
                  <div className="relative">
                    <Input
                      id="assessment-date"
                      type="date"
                      value={formData.assessmentDate}
                      onChange={(e) => handleInputChange('assessmentDate', e.target.value)}
                      className="pl-10"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessment-time">Hora de valoración *</Label>
                  <div className="relative">
                    <Input
                      id="assessment-time"
                      type="time"
                      value={formData.assessmentTime}
                      onChange={(e) => handleInputChange('assessmentTime', e.target.value)}
                      className="pl-10"
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Signos Vitales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Activity className="h-5 w-5" />
                Signos Vitales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blood-pressure">Tensión arterial</Label>
                  <div className="relative">
                    <Input
                      id="blood-pressure"
                      value={formData.bloodPressure}
                      onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                      placeholder="120/80"
                      className="pl-10"
                    />
                    <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heart-rate">Frecuencia cardíaca</Label>
                  <div className="relative">
                    <Input
                      id="heart-rate"
                      value={formData.heartRate}
                      onChange={(e) => handleInputChange('heartRate', e.target.value)}
                      placeholder="75"
                      className="pl-10"
                    />
                    <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="respiratory-rate">Frecuencia respiratoria</Label>
                  <div className="relative">
                    <Input
                      id="respiratory-rate"
                      value={formData.respiratoryRate}
                      onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
                      placeholder="16"
                      className="pl-10"
                    />
                    <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperatura</Label>
                  <div className="relative">
                    <Input
                      id="temperature"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange('temperature', e.target.value)}
                      placeholder="36.5"
                      className="pl-10"
                    />
                    <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oxygen-saturation">Saturación O₂</Label>
                  <div className="relative">
                    <Input
                      id="oxygen-saturation"
                      value={formData.oxygenSaturation}
                      onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
                      placeholder="98"
                      className="pl-10"
                    />
                    <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pain-level">Nivel de dolor</Label>
                  <Select value={formData.painLevel.toString()} onValueChange={(value) => handleInputChange('painLevel', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAIN_SCALE.map((pain) => (
                        <SelectItem key={pain.value} value={pain.value.toString()}>
                          {pain.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Escala de Glasgow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Brain className="h-5 w-5" />
                Escala de Glasgow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Apertura Ocular</Label>
                  <RadioGroup value={formData.eyeOpening.toString()} onValueChange={(value) => handleInputChange('eyeOpening', parseInt(value))}>
                    {GLASGOW_EYE.map((item) => (
                      <div key={item.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={item.value.toString()} id={`eye-${item.value}`} />
                        <Label htmlFor={`eye-${item.value}`}>{item.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Respuesta Verbal</Label>
                  <RadioGroup value={formData.verbalResponse.toString()} onValueChange={(value) => handleInputChange('verbalResponse', parseInt(value))}>
                    {GLASGOW_VERBAL.map((item) => (
                      <div key={item.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={item.value.toString()} id={`verbal-${item.value}`} />
                        <Label htmlFor={`verbal-${item.value}`}>{item.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Respuesta Motora</Label>
                  <RadioGroup value={formData.motorResponse.toString()} onValueChange={(value) => handleInputChange('motorResponse', parseInt(value))}>
                    {GLASGOW_MOTOR.map((item) => (
                      <div key={item.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={item.value.toString()} id={`motor-${item.value}`} />
                        <Label htmlFor={`motor-${item.value}`}>{item.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Total Glasgow</Label>
                  <div className="text-center">
                    <div className={`text-3xl font-bold p-4 rounded-lg ${
                      formData.glasgowTotal >= 13 ? 'bg-green-100 text-green-800' :
                      formData.glasgowTotal >= 9 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formData.glasgowTotal}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {formData.glasgowTotal >= 13 ? 'Leve' :
                       formData.glasgowTotal >= 9 ? 'Moderado' : 'Severo'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Evaluación del Dolor */}
          <Card>
            <CardHeader>
                             <CardTitle className="flex items-center gap-2 text-blue-700">
                 <Zap className="h-5 w-5" />
                 Evaluación del Dolor
               </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pain-location">Localización del dolor</Label>
                  <Input
                    id="pain-location"
                    value={formData.painLocation}
                    onChange={(e) => handleInputChange('painLocation', e.target.value)}
                    placeholder="Ej: Abdomen, pecho, cabeza..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pain-character">Características del dolor</Label>
                  <Select value={formData.painCharacter} onValueChange={(value) => handleInputChange('painCharacter', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="punzante">Punzante</SelectItem>
                      <SelectItem value="opresivo">Opresivo</SelectItem>
                      <SelectItem value="quemante">Quemante</SelectItem>
                      <SelectItem value="sordo">Sordo</SelectItem>
                      <SelectItem value="cólico">Cólico</SelectItem>
                      <SelectItem value="pulsátil">Pulsátil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pain-intensity">Intensidad del dolor</Label>
                  <Select value={formData.painIntensity.toString()} onValueChange={(value) => handleInputChange('painIntensity', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAIN_SCALE.map((pain) => (
                        <SelectItem key={pain.value} value={pain.value.toString()}>
                          {pain.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pain-duration">Duración del dolor</Label>
                  <Input
                    id="pain-duration"
                    value={formData.painDuration}
                    onChange={(e) => handleInputChange('painDuration', e.target.value)}
                    placeholder="Ej: 2 horas, 3 días..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Síntomas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <FileText className="h-5 w-5" />
                Síntomas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="main-symptom">Síntoma principal *</Label>
                  <Textarea
                    id="main-symptom"
                    value={formData.mainSymptom}
                    onChange={(e) => handleInputChange('mainSymptom', e.target.value)}
                    placeholder="Describa el síntoma principal que motiva la consulta..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="symptom-duration">Duración de los síntomas</Label>
                    <Input
                      id="symptom-duration"
                      value={formData.symptomDuration}
                      onChange={(e) => handleInputChange('symptomDuration', e.target.value)}
                      placeholder="Ej: 2 horas, 1 día..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="associated-symptoms">Síntomas asociados</Label>
                    <Input
                      id="associated-symptoms"
                      value={formData.associatedSymptoms}
                      onChange={(e) => handleInputChange('associatedSymptoms', e.target.value)}
                      placeholder="Ej: náuseas, vómitos, fiebre..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Factores de Riesgo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <AlertTriangle className="h-5 w-5" />
                Factores de Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {RISK_FACTORS.map((factor) => (
                  <div key={factor} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={factor}
                      checked={formData.riskFactors.includes(factor)}
                      onChange={() => handleRiskFactorToggle(factor)}
                      className="rounded"
                    />
                    <Label htmlFor={factor} className="text-sm">{factor}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sección: Clasificación de Urgencia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <AlertTriangle className="h-5 w-5" />
                Clasificación de Urgencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Nivel de Urgencia</Label>
                    <div className={`text-white text-center p-3 rounded-lg ${getUrgencyColor(formData.urgencyLevel)}`}>
                      <div className="font-bold">{formData.triageCategory}</div>
                      <div className="text-sm opacity-90">{formData.estimatedWaitTime}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {URGENCY_LEVELS.find(u => u.value === formData.urgencyLevel)?.description}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Indicadores Críticos</Label>
                    <div className="space-y-1">
                      {formData.glasgowTotal < 13 && (
                        <Badge variant="destructive">Glasgow &lt; 13</Badge>
                      )}
                      {parseInt(formData.heartRate) > 120 && (
                        <Badge variant="destructive">FC &gt; 120</Badge>
                      )}
                      {parseInt(formData.oxygenSaturation) < 95 && (
                        <Badge variant="destructive">O₂ &lt; 95%</Badge>
                      )}
                      {formData.painIntensity >= 7 && (
                        <Badge variant="destructive">Dolor &gt;= 7</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Observaciones y Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <FileText className="h-5 w-5" />
                Observaciones y Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="observations">Observaciones</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => handleInputChange('observations', e.target.value)}
                    placeholder="Observaciones adicionales de la valoración..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recommendations">Recomendaciones</Label>
                  <Textarea
                    id="recommendations"
                    value={formData.recommendations}
                    onChange={(e) => handleInputChange('recommendations', e.target.value)}
                    placeholder="Recomendaciones para el manejo del paciente..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Profesional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <User className="h-5 w-5" />
                Profesional Responsable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="professional-name">Nombre del profesional *</Label>
                  <Input
                    id="professional-name"
                    value={formData.professionalName}
                    onChange={(e) => handleInputChange('professionalName', e.target.value)}
                    placeholder="Nombre completo del profesional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="professional-license">Número de licencia *</Label>
                  <Input
                    id="professional-license"
                    value={formData.professionalLicense}
                    onChange={(e) => handleInputChange('professionalLicense', e.target.value)}
                    placeholder="Número de licencia profesional"
                  />
                </div>
              </div>
                         </CardContent>
           </Card>

           {/* Botones de acción al final */}
           <div className="flex items-center gap-2 pt-4">
             <Button type="submit" disabled={isLoading}>
               <Save className="mr-2 h-4 w-4" />
               {isLoading ? 'Guardando...' : 'Guardar'}
             </Button>
             <Button type="button" variant="outline" onClick={handleClear}>
               <Trash2 className="mr-2 h-4 w-4" />
               Limpiar
             </Button>
           </div>
         </form>
       </div>
     </AppLayout>
   );
 }
