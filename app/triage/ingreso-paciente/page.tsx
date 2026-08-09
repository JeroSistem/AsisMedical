'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Trash2, 
  Search, 
  HelpCircle, 
  User, 
  Calendar, 
  Clock, 
  Building, 
  FileText,
  Phone,
  MapPin,
  Activity,
  Thermometer,
  Heart,
  Ruler,
  Scale,
  Droplets
} from 'lucide-react';
import { getPatients } from '@/lib/actions/patients';
import { createPatientAdmission, PatientAdmissionFormData } from '@/lib/actions/patient-admissions';

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

interface PatientAdmissionForm extends PatientAdmissionFormData {
  // Paciente
  patientId: string;
  
  // Ingreso
  admissionDate: string;
  admissionTime: string;
  priorityAttention: string;
  observation: string;
  
  // Entidad
  entity: string;
  contract: string;
  absent: boolean;
  
  // Responsable
  responsibleName: string;
  responsibleRelationship: string;
  responsiblePhone: string;
  
  // Acompañante
  companionName: string;
  companionAddress: string;
  companionPhone: string;
  
  // Hallazgos Físicos
  bloodPressure: string;
  respiratoryRate: string;
  temperature: string;
  heartRate: string;
  height: string;
  weight: string;
  bmi: string;
  bsa: string;
  oxygenSaturation: string;
}

export default function PatientAdmissionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Estado del formulario
  const [formData, setFormData] = useState<PatientAdmissionForm>({
    patientId: '',
    admissionDate: new Date().toISOString().split('T')[0],
    admissionTime: new Date().toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    priorityAttention: 'normal',
    observation: '',
    entity: '',
    contract: '',
    absent: false,
    responsibleName: '',
    responsibleRelationship: '',
    responsiblePhone: '',
    companionName: '',
    companionAddress: '',
    companionPhone: '',
    bloodPressure: '',
    respiratoryRate: '',
    temperature: '',
    heartRate: '',
    height: '',
    weight: '',
    bmi: '0',
    bsa: '',
    oxygenSaturation: ''
  });

  // Cargar pacientes al montar el componente
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const patientsList = await getPatients();
        setPatients(patientsList);
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
  }, [toast]);

  const handleInputChange = (field: keyof PatientAdmissionForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient || null);
    setFormData(prev => ({
      ...prev,
      patientId
    }));
  };

  const calculateBMI = () => {
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    
    if (height && weight && height > 0) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setFormData(prev => ({
        ...prev,
        bmi
      }));
    }
  };

  const calculateBSA = () => {
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    
    if (height && weight && height > 0) {
      // Fórmula de DuBois y DuBois
      const bsa = (0.007184 * Math.pow(height, 0.725) * Math.pow(weight, 0.425)).toFixed(2);
      setFormData(prev => ({
        ...prev,
        bsa
      }));
    }
  };

  // Calcular BMI y BSA cuando cambian altura o peso
  useEffect(() => {
    calculateBMI();
    calculateBSA();
  }, [formData.height, formData.weight]);

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
      'admissionDate', 'admissionTime', 'priorityAttention'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof PatientAdmissionForm]);
    
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
      const result = await createPatientAdmission(formData);
      
      if (result.success) {
        toast({
          title: "Éxito",
          description: "Ingreso del paciente registrado correctamente",
        });
        
        // Redirigir a la lista de triage
        router.push('/triage');
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al registrar el ingreso del paciente",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      toast({
        title: "Error",
        description: "Error inesperado al registrar el ingreso",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      patientId: '',
      admissionDate: new Date().toISOString().split('T')[0],
      admissionTime: new Date().toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      priorityAttention: 'normal',
      observation: '',
      entity: '',
      contract: '',
      absent: false,
      responsibleName: '',
      responsibleRelationship: '',
      responsiblePhone: '',
      companionName: '',
      companionAddress: '',
      companionPhone: '',
      bloodPressure: '',
      respiratoryRate: '',
      temperature: '',
      heartRate: '',
      height: '',
      weight: '',
      bmi: '0',
      bsa: '',
      oxygenSaturation: ''
    });
    setSelectedPatient(null);
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Ingreso Paciente</h1>
            <HelpCircle className="h-6 w-6 text-muted-foreground" />
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
              <CardTitle className="flex items-center gap-2 text-green-700">
                <User className="h-5 w-5" />
                Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-select">Paciente *</Label>
                  <div className="relative">
                    <Select value={formData.patientId} onValueChange={handlePatientSelect}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Escribe para buscar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} - {patient.documentNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {selectedPatient && (
                    <div className="text-sm text-muted-foreground">
                      {selectedPatient.name} | {selectedPatient.documentType}: {selectedPatient.documentNumber} | 
                      Edad: {selectedPatient.age} años | Género: {selectedPatient.gender}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Ingreso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Calendar className="h-5 w-5" />
                Ingreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admission-date">Fecha *</Label>
                  <div className="relative">
                    <Input
                      id="admission-date"
                      type="date"
                      value={formData.admissionDate}
                      onChange={(e) => handleInputChange('admissionDate', e.target.value)}
                      className="pl-10"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admission-time">Hora *</Label>
                  <div className="relative">
                    <Input
                      id="admission-time"
                      type="time"
                      value={formData.admissionTime}
                      onChange={(e) => handleInputChange('admissionTime', e.target.value)}
                      className="pl-10"
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority-attention">Atención prioritaria</Label>
                  <Select value={formData.priorityAttention} onValueChange={(value) => handleInputChange('priorityAttention', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                      <SelectItem value="emergency">Emergencia</SelectItem>
                      <SelectItem value="critical">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observation">Observación</Label>
                  <Textarea
                    id="observation"
                    value={formData.observation}
                    onChange={(e) => handleInputChange('observation', e.target.value)}
                    placeholder="Observaciones adicionales..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Entidad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Building className="h-5 w-5" />
                Entidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entity">Entidades *</Label>
                  <div className="relative">
                    <Select value={formData.entity} onValueChange={(value) => handleInputChange('entity', value)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Escribe para buscar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eps-sura">EPS Sura</SelectItem>
                        <SelectItem value="eps-nueva-eps">EPS Nueva EPS</SelectItem>
                        <SelectItem value="eps-famisanar">EPS Famisanar</SelectItem>
                        <SelectItem value="particular">Particular</SelectItem>
                      </SelectContent>
                    </Select>
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract">Contratos *</Label>
                  <div className="relative">
                    <Select value={formData.contract} onValueChange={(value) => handleInputChange('contract', value)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Escribe para buscar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plan-basico">Plan Básico</SelectItem>
                        <SelectItem value="plan-premium">Plan Premium</SelectItem>
                        <SelectItem value="plan-familiar">Plan Familiar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="absent"
                    checked={formData.absent}
                    onCheckedChange={(checked) => handleInputChange('absent', checked as boolean)}
                  />
                  <Label htmlFor="absent">Ausente</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Responsable */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <User className="h-5 w-5" />
                Responsable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsible-name">Nombre responsable</Label>
                  <Input
                    id="responsible-name"
                    value={formData.responsibleName}
                    onChange={(e) => handleInputChange('responsibleName', e.target.value)}
                    placeholder="Nombre completo del responsable"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsible-relationship">Parentesco responsable</Label>
                  <Input
                    id="responsible-relationship"
                    value={formData.responsibleRelationship}
                    onChange={(e) => handleInputChange('responsibleRelationship', e.target.value)}
                    placeholder="Padre, madre, tutor, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsible-phone">Teléfono responsable</Label>
                  <div className="relative">
                    <Input
                      id="responsible-phone"
                      value={formData.responsiblePhone}
                      onChange={(e) => handleInputChange('responsiblePhone', e.target.value)}
                      placeholder="Número de teléfono"
                      className="pl-10"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Acompañante */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <User className="h-5 w-5" />
                Acompañante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companion-name">Nombre acompañante</Label>
                  <Input
                    id="companion-name"
                    value={formData.companionName}
                    onChange={(e) => handleInputChange('companionName', e.target.value)}
                    placeholder="Nombre completo del acompañante"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companion-address">Dirección acompañante</Label>
                  <div className="relative">
                    <Input
                      id="companion-address"
                      value={formData.companionAddress}
                      onChange={(e) => handleInputChange('companionAddress', e.target.value)}
                      placeholder="Dirección completa"
                      className="pl-10"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companion-phone">Teléfono acompañante</Label>
                  <div className="relative">
                    <Input
                      id="companion-phone"
                      value={formData.companionPhone}
                      onChange={(e) => handleInputChange('companionPhone', e.target.value)}
                      placeholder="Número de teléfono"
                      className="pl-10"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Hallazgos Físicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Activity className="h-5 w-5" />
                Hallazgos Físicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blood-pressure">Tensión arterial / 99/99</Label>
                  <Input
                    id="blood-pressure"
                    value={formData.bloodPressure}
                    onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                    placeholder="120/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="respiratory-rate">Frecuencia respiratoria / rpm</Label>
                  <Input
                    id="respiratory-rate"
                    value={formData.respiratoryRate}
                    onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
                    placeholder="16"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperatura / Grados centígrados</Label>
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
                  <Label htmlFor="heart-rate">Frecuencia cardiaca / lpm</Label>
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
                  <Label htmlFor="height">Talla / Centímetros</Label>
                  <div className="relative">
                    <Input
                      id="height"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="170"
                      className="pl-10"
                    />
                    <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso / Kilos</Label>
                  <div className="relative">
                    <Input
                      id="weight"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="70"
                      className="pl-10"
                    />
                    <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bmi">IDMC</Label>
                  <Input
                    id="bmi"
                    value={formData.bmi}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bsa">SC / Metros cuadrados</Label>
                  <Input
                    id="bsa"
                    value={formData.bsa}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oxygen-saturation">Saturación Oxígeno</Label>
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
