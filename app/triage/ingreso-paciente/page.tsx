'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { usePathname, useRouter } from 'next/navigation';
import { listActivePartnersForAdmission } from '@/lib/actions/entity-contracts';
import { GENDER_OPTIONS, normalizeGenderToEs } from '@/lib/gender';
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
import {
  createPatient,
  searchPatientByQuery,
  type PatientFormData,
} from '@/lib/actions/patients';
import { createPatientAdmission, PatientAdmissionFormData } from '@/lib/actions/patient-admissions';

interface PatientAdmissionForm extends PatientAdmissionFormData {
  patientId: string;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  mobilePhone: string;
  email: string;
  admissionDate: string;
  admissionTime: string;
  priorityAttention: string;
  observation: string;
  entity: string;
  contract: string;
  absent: boolean;
  responsibleName: string;
  responsibleRelationship: string;
  responsiblePhone: string;
  companionName: string;
  companionAddress: string;
  companionPhone: string;
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

const emptyAdmissionForm = (): PatientAdmissionForm => ({
  patientId: '',
  documentType: 'CC',
  documentNumber: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  age: '',
  gender: '',
  mobilePhone: '',
  email: '',
  admissionDate: new Date().toISOString().split('T')[0],
  admissionTime: new Date().toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
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
  oxygenSaturation: '',
});

export default function PatientAdmissionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    'Escriba documento o nombre y busque. Si no existe, complete los datos y guarde.'
  );
  const [statusTone, setStatusTone] = useState<'muted' | 'ok' | 'warn' | 'error'>('muted');
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const returnTo = pathname?.startsWith('/admision') ? '/admision' : '/triage';

  const [formData, setFormData] = useState<PatientAdmissionForm>(emptyAdmissionForm());
  const [partners, setPartners] = useState<Array<{ name: string; tipo: string }>>([]);
  const [contracts, setContracts] = useState<
    Array<{
      id: string;
      numero: string;
      entidad: string;
      tipo: string;
      tipoContrato: string;
      label: string;
    }>
  >([]);
  const [loadingPartners, setLoadingPartners] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingPartners(true);
      try {
        const res = await listActivePartnersForAdmission();
        if (cancelled) return;
        if (res.success) {
          setPartners(res.partners);
          setContracts(res.contracts);
        } else {
          setPartners([]);
          setContracts([]);
        }
      } catch {
        if (!cancelled) {
          setPartners([]);
          setContracts([]);
        }
      } finally {
        if (!cancelled) setLoadingPartners(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const contractsForPartner = useMemo(() => {
    if (!formData.entity) return [];
    const key = formData.entity.trim().toLowerCase();
    return contracts.filter((c) => c.entidad.trim().toLowerCase() === key);
  }, [contracts, formData.entity]);

  const handleInputChange = (field: keyof PatientAdmissionForm, value: string | boolean) => {
    setFormData((prev) => {
      if (field === 'entity') {
        return { ...prev, entity: String(value), contract: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  const handlePatientSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = searchQuery.trim();
    if (!text) {
      setStatusTone('error');
      setStatusMessage('Escriba un número de documento o un nombre para buscar.');
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchPatientByQuery(text);
      if (result.error) {
        setStatusTone('error');
        setStatusMessage(result.error);
        return;
      }

      if (result.found && result.patient) {
        const p = result.patient;
        setFormData((prev) => ({
          ...prev,
          patientId: p.id,
          documentType: p.documentType || 'CC',
          documentNumber: p.documentNumber || '',
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          dateOfBirth: p.dateOfBirth || '',
          age: p.age ? String(p.age) : '',
          gender: normalizeGenderToEs(p.gender),
          mobilePhone: p.mobilePhone || '',
          email: p.email || '',
        }));
        setStatusTone('ok');
        setStatusMessage('Paciente encontrado. Se cargaron los campos principales.');
        return;
      }

      const looksLikeDocument = /^[0-9A-Za-z.-]{4,}$/.test(text) && !/\s/.test(text);
      setFormData((prev) => ({
        ...prev,
        patientId: '',
        documentType: prev.documentType || 'CC',
        documentNumber: looksLikeDocument ? text : '',
        firstName: !looksLikeDocument ? text : '',
        lastName: '',
        dateOfBirth: '',
        age: '',
        gender: '',
        mobilePhone: '',
        email: '',
      }));
      setStatusTone('warn');
      setStatusMessage(
        'El paciente no está creado. Complete los campos y guarde para registrarlo con el ingreso.'
      );
    } catch {
      setStatusTone('error');
      setStatusMessage('No se pudo consultar. Intente de nuevo.');
    } finally {
      setIsSearching(false);
    }
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

    if (!formData.documentNumber.trim() || !formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: 'Error',
        description: 'Complete documento, nombres y apellidos del paciente',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.admissionDate || !formData.admissionTime || !formData.priorityAttention) {
      toast({
        title: 'Error',
        description: 'Complete fecha, hora y atención prioritaria',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.entity?.trim() || !formData.contract?.trim()) {
      toast({
        title: 'Error',
        description: 'Seleccione una EPS/entidad y un contrato creados en Administración → Contratos',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      let patientId = formData.patientId;

      if (!patientId) {
        if (!formData.dateOfBirth || !formData.gender) {
          toast({
            title: 'Error',
            description: 'Para crear el paciente indique fecha de nacimiento y género',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const patientPayload: PatientFormData = {
          documentType: formData.documentType || 'CC',
          documentNumber: formData.documentNumber.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          dateOfBirth: formData.dateOfBirth,
          age: Number(formData.age) || 0,
          gender: formData.gender,
          mobilePhone: formData.mobilePhone,
          email: formData.email,
          country: 'Colombia',
          notificationsConsent: true,
          createAdmission: false,
          dataProcessingConsent: true,
          medicalConsent: false,
          privacyConsent: false,
          communicationConsent: false,
        };

        const created = await createPatient(patientPayload);
        if (!created.success || !created.patient) {
          toast({
            title: 'Error',
            description: created.error || 'No se pudo crear el paciente',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
        patientId = created.patient.id;
      }

      const result = await createPatientAdmission({
        ...formData,
        patientId,
      });

      if (result.success) {
        toast({
          title: 'Éxito',
          description: `Ingreso registrado. Número de admisión: ${result.admissionNumber ?? result.admission?.admissionNumber}`,
        });
        router.push(returnTo.startsWith('/') ? returnTo : '/admision');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Error al registrar el ingreso del paciente',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      toast({
        title: 'Error',
        description: 'Error inesperado al registrar el ingreso',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(emptyAdmissionForm());
    setSearchQuery('');
    setStatusTone('muted');
    setStatusMessage(
      'Escriba documento o nombre y busque. Si no existe, complete los datos y guarde.'
    );
  };

  const statusClass =
    statusTone === 'ok'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : statusTone === 'warn'
        ? 'border-amber-200 bg-amber-50 text-amber-950'
        : statusTone === 'error'
          ? 'border-red-200 bg-red-50 text-red-800'
          : 'border-slate-200 bg-slate-50 text-slate-600';

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {pathname?.startsWith('/admision') ? 'Nueva Admisión' : 'Ingreso Paciente'}
            </h1>
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
          {/* Buscador */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Search className="h-5 w-5" />
                Buscar paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1 space-y-2">
                  <Label htmlFor="patient-search">Documento o nombre</Label>
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
                    placeholder="Número de documento o nombre..."
                    autoFocus
                  />
                </div>
                <Button
                  type="button"
                  onClick={handlePatientSearch}
                  disabled={isSearching}
                  className="sm:w-40"
                >
                  {isSearching ? 'Buscando...' : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
              <div className={`rounded-md border px-3 py-2 text-sm ${statusClass}`}>
                {statusMessage}
              </div>
            </CardContent>
          </Card>

          {/* Sección: Paciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <User className="h-5 w-5" />
                Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Tipo de documento *</Label>
                  <Select
                    value={formData.documentType}
                    onValueChange={(value) => handleInputChange('documentType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                      <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                      <SelectItem value="PAS">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document-number">Número de documento *</Label>
                  <Input
                    id="document-number"
                    value={formData.documentNumber}
                    onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                    placeholder="Documento"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="first-name">Nombres *</Label>
                  <Input
                    id="first-name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Nombres"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Apellidos *</Label>
                  <Input
                    id="last-name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Apellidos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-of-birth">Fecha de nacimiento</Label>
                  <Input
                    id="date-of-birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Género</Label>
                  <Select
                    value={normalizeGenderToEs(formData.gender) || undefined}
                    onValueChange={(value) => handleInputChange('gender', value)}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Edad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile-phone">Teléfono</Label>
                  <Input
                    id="mobile-phone"
                    value={formData.mobilePhone}
                    onChange={(e) => handleInputChange('mobilePhone', e.target.value)}
                    placeholder="Teléfono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
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
                  <Label htmlFor="entity">Entidades (EPS) *</Label>
                  <div className="relative">
                    <Select
                      value={formData.entity || undefined}
                      onValueChange={(value) => handleInputChange('entity', value)}
                      disabled={loadingPartners || partners.length === 0}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue
                          placeholder={
                            loadingPartners
                              ? 'Cargando…'
                              : partners.length === 0
                                ? 'Sin EPS/contratos creados'
                                : 'Seleccione EPS…'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {partners.map((p) => (
                          <SelectItem key={p.name} value={p.name}>
                            {p.tipo ? `${p.name} (${p.tipo.toUpperCase()})` : p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract">Contratos *</Label>
                  <div className="relative">
                    <Select
                      value={formData.contract || undefined}
                      onValueChange={(value) => handleInputChange('contract', value)}
                      disabled={!formData.entity || contractsForPartner.length === 0}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue
                          placeholder={
                            !formData.entity
                              ? 'Seleccione primero la EPS'
                              : contractsForPartner.length === 0
                                ? 'Sin contratos para esta EPS'
                                : 'Seleccione contrato…'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {contractsForPartner.map((c) => (
                          <SelectItem key={c.id} value={c.numero}>
                            {c.label || c.numero}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="absent"
                      checked={formData.absent}
                      onCheckedChange={(checked) => handleInputChange('absent', checked as boolean)}
                    />
                    <Label htmlFor="absent">Ausente</Label>
                  </div>
                  {!loadingPartners && partners.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Cree EPS y contratos en{' '}
                      <Link href="/admin/contratos" className="underline text-primary">
                        Administración → Contratos
                      </Link>
                      .
                    </p>
                  )}
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
