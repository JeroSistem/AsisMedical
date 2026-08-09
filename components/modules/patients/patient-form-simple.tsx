'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PatientFormData, createPatient, updatePatient } from '@/lib/actions/patients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleCard } from '@/components/shared/module-page-layout';
import { Save, User, Phone, MapPin, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PatientFormSimpleProps {
  initialData?: Partial<PatientFormData>;
  isEditing?: boolean;
  patientId?: string;
}

const documentTypes = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PAS', label: 'Pasaporte' },
];

const genders = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'other', label: 'Otro' },
];

const initialFormData: PatientFormData = {
  documentType: '',
  documentNumber: '',
  countryOfIssue: 'CO',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  age: 0,
  gender: '',
  mobilePhone: '',
  email: '',
  address: '',
  city: '',
  department: '',
  country: 'Colombia',
  dataProcessingConsent: false,
  medicalConsent: false,
  privacyConsent: false,
  communicationConsent: false,
  notificationsConsent: true,
  createAdmission: false,
};

export function PatientFormSimple({ initialData, isEditing = false, patientId }: PatientFormSimpleProps) {
  const [formData, setFormData] = useState<PatientFormData>({ ...initialFormData, ...initialData });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Calcular edad automáticamente
  useEffect(() => {
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const ageDiff = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      let calculatedAge = ageDiff;
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      setAge(calculatedAge);
      setFormData(prev => ({ ...prev, age: calculatedAge }));
    }
  }, [formData.dateOfBirth]);

  const updateField = (field: keyof PatientFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.documentType || !formData.documentNumber) {
      toast({
        title: "Error",
        description: "El tipo y número de documento son obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (!formData.firstName || !formData.lastName) {
      toast({
        title: "Error",
        description: "Los nombres y apellidos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (!formData.dateOfBirth || !formData.gender) {
      toast({
        title: "Error",
        description: "La fecha de nacimiento y género son obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (!formData.dataProcessingConsent) {
      toast({
        title: "Error",
        description: "Debe aceptar el consentimiento de tratamiento de datos",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      
      if (isEditing && patientId) {
        result = await updatePatient(patientId, formData);
      } else {
        result = await createPatient(formData);
      }

      if (result.success) {
        toast({
          title: "Éxito",
          description: isEditing ? 'Paciente actualizado exitosamente' : 'Paciente creado exitosamente',
        });

        setTimeout(() => {
          router.push('/patients');
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: result.error || 'Error al procesar la solicitud',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Error inesperado al procesar la solicitud',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1.5">
      {/* Identificación */}
      <ModuleCard className="p-1.5">
        <CardHeader className="pb-0.5 px-0 pt-0">
          <CardTitle className="flex items-center gap-1 text-sm font-semibold">
            <User className="h-3.5 w-3.5" />
            Información de Identificación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 pt-0.5 px-0 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="space-y-0.5">
              <Label htmlFor="documentType" className="text-sm">Tipo de Documento *</Label>
              <Select
                value={formData.documentType}
                onValueChange={(value) => updateField('documentType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="documentNumber" className="text-sm">Número de Documento *</Label>
              <Input
                id="documentNumber"
                value={formData.documentNumber}
                onChange={(e) => updateField('documentNumber', e.target.value)}
                placeholder="Número de documento"
                required
              />
            </div>

            {age !== null && (
              <div className="space-y-2 flex items-end">
                <div className="w-full p-2 bg-muted rounded-md text-sm text-center">
                  <span className="font-medium">{age} años</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </ModuleCard>

      {/* Datos Personales */}
      <ModuleCard className="p-1.5">
        <CardHeader className="pb-0.5 px-0 pt-0">
          <CardTitle className="flex items-center gap-1 text-sm font-semibold">
            <User className="h-3.5 w-3.5" />
            Datos Personales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 pt-0.5 px-0 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <Label htmlFor="firstName" className="text-sm">Nombres *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="Nombres completos"
                required
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="lastName" className="text-sm">Apellidos *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder="Apellidos completos"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <Label htmlFor="dateOfBirth" className="text-sm">Fecha de Nacimiento *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="gender" className="text-sm">Género *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => updateField('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </ModuleCard>

      {/* Contacto */}
      <ModuleCard className="p-1.5">
        <CardHeader className="pb-0.5 px-0 pt-0">
          <CardTitle className="flex items-center gap-1 text-sm font-semibold">
            <Phone className="h-3.5 w-3.5" />
            Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 pt-0.5 px-0 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <Label htmlFor="mobilePhone" className="text-sm">Teléfono Móvil</Label>
              <Input
                id="mobilePhone"
                value={formData.mobilePhone || ''}
                onChange={(e) => updateField('mobilePhone', e.target.value)}
                placeholder="+57 300 123 4567"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="email" className="text-sm">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>
        </CardContent>
      </ModuleCard>

      {/* Dirección */}
      <ModuleCard className="p-1.5">
        <CardHeader className="pb-0.5 px-0 pt-0">
          <CardTitle className="flex items-center gap-1 text-sm font-semibold">
            <MapPin className="h-3.5 w-3.5" />
            Dirección
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 pt-0.5 px-0 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <Label htmlFor="city" className="text-sm">Ciudad</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="Ciudad"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="department" className="text-sm">Departamento</Label>
              <Input
                id="department"
                value={formData.department || ''}
                onChange={(e) => updateField('department', e.target.value)}
                placeholder="Departamento"
              />
            </div>
          </div>

          <div className="space-y-0.5">
            <Label htmlFor="address" className="text-sm">Dirección Completa</Label>
            <Textarea
              id="address"
              value={formData.address || ''}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Dirección completa"
              rows={2}
            />
          </div>
        </CardContent>
      </ModuleCard>

      {/* Consentimientos */}
      <ModuleCard className="p-1.5">
        <CardHeader className="pb-0.5 px-0 pt-0">
          <CardTitle className="flex items-center gap-1 text-sm font-semibold">
            <Shield className="h-3.5 w-3.5" />
            Consentimientos y Autorizaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 pt-0.5 px-0 pb-0">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="dataProcessingConsent"
              checked={formData.dataProcessingConsent}
              onCheckedChange={(checked) => updateField('dataProcessingConsent', checked)}
              required
            />
            <Label htmlFor="dataProcessingConsent" className="text-sm font-normal cursor-pointer">
              Autorizo el tratamiento de mis datos personales conforme a la política de privacidad *
            </Label>
          </div>
        </CardContent>
      </ModuleCard>

      {/* Botones */}
      <div className="flex justify-end gap-2 pt-1.5 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {isEditing ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Actualizar Paciente' : 'Crear Paciente'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
