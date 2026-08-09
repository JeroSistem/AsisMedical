'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { PatientFormData } from '@/lib/actions/patients';

interface PatientFormStep2Props {
  formData: PatientFormData;
  updateFormData: (data: Partial<PatientFormData>) => void;
}

const genders = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'other', label: 'Otro' },
  { value: 'unknown', label: 'No especificado' }
];

const maritalStatuses = [
  { value: 'single', label: 'Soltero/a' },
  { value: 'married', label: 'Casado/a' },
  { value: 'divorced', label: 'Divorciado/a' },
  { value: 'widowed', label: 'Viudo/a' },
  { value: 'separated', label: 'Separado/a' },
  { value: 'cohabiting', label: 'Unión libre' }
];

const bloodTypes = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
  { value: 'unknown', label: 'No conocido' }
];

export function PatientFormStep2({ formData, updateFormData }: PatientFormStep2Props) {
  const [age, setAge] = useState<number | null>(null);
  const [isMinor, setIsMinor] = useState(false);

  // Calcular edad cuando cambia la fecha de nacimiento
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
      setIsMinor(calculatedAge < 18);
    } else {
      setAge(null);
      setIsMinor(false);
    }
  }, [formData.dateOfBirth]);

  const validateBirthDate = (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate <= today;
  };

  return (
    <div className="space-y-6">
      {/* Información del paso */}
      <div className="text-center space-y-2">
        <User className="h-12 w-12 text-primary mx-auto" />
        <h3 className="text-lg font-semibold">Datos Personales</h3>
        <p className="text-sm text-muted-foreground">
          Ingrese la información personal básica del paciente
        </p>
      </div>

      {/* Formulario */}
      <div className="space-y-6">
        {/* Nombres y apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              Nombres *
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
              placeholder="Ingrese los nombres"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Apellidos *
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => updateFormData({ lastName: e.target.value })}
              placeholder="Ingrese los apellidos"
            />
          </div>
        </div>

        {/* Fecha de nacimiento y género */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-sm font-medium">
              Fecha de Nacimiento *
            </Label>
            <div className="relative">
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => {
                  if (validateBirthDate(e.target.value)) {
                    updateFormData({ dateOfBirth: e.target.value });
                  }
                }}
                max={new Date().toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {age !== null && (
              <div className="flex items-center gap-2">
                <Badge variant={isMinor ? "destructive" : "secondary"}>
                  {age} años
                </Badge>
                {isMinor && (
                  <Badge variant="destructive">
                    Menor de edad
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium">
              Género *
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => updateFormData({ gender: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el género" />
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

        {/* Estado civil y grupo sanguíneo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="maritalStatus" className="text-sm font-medium">
              Estado Civil
            </Label>
            <Select
              value={formData.maritalStatus}
              onValueChange={(value) => updateFormData({ maritalStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el estado civil" />
              </SelectTrigger>
              <SelectContent>
                {maritalStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodType" className="text-sm font-medium">
              Grupo Sanguíneo
            </Label>
            <Select
              value={formData.bloodType}
              onValueChange={(value) => updateFormData({ bloodType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el grupo sanguíneo" />
              </SelectTrigger>
              <SelectContent>
                {bloodTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ocupación */}
        <div className="space-y-2">
          <Label htmlFor="occupation" className="text-sm font-medium">
            Ocupación
          </Label>
          <Input
            id="occupation"
            value={formData.occupation}
            onChange={(e) => updateFormData({ occupation: e.target.value })}
            placeholder="Ingrese la ocupación del paciente"
          />
        </div>

        {/* Información clínica inicial */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Información Clínica Inicial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="allergies" className="text-sm font-medium">
                Alergias Conocidas
              </Label>
              <Textarea
                id="allergies"
                value={formData.allergies || ''}
                onChange={(e) => updateFormData({ allergies: e.target.value })}
                placeholder="Ingrese las alergias separadas por comas (ej: Penicilina, Látex, Polen)"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activeProblems" className="text-sm font-medium">
                Problemas Activos Relevantes
              </Label>
              <Textarea
                id="activeProblems"
                value={formData.activeProblems}
                onChange={(e) => updateFormData({ activeProblems: e.target.value })}
                placeholder="Describa problemas de salud activos relevantes"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialObservations" className="text-sm font-medium">
                Observaciones Iniciales
              </Label>
              <Textarea
                id="initialObservations"
                value={formData.initialObservations}
                onChange={(e) => updateFormData({ initialObservations: e.target.value })}
                placeholder="Observaciones adicionales del paciente"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Alerta para menores de edad */}
        {isMinor && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              El paciente es menor de edad. En el siguiente paso se solicitará información del representante legal.
            </AlertDescription>
          </Alert>
        )}

        {/* Validaciones */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Validaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              {formData.firstName ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
              <span>Nombres completos</span>
            </div>
            <div className="flex items-center gap-2">
              {formData.lastName ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
              <span>Apellidos completos</span>
            </div>
            <div className="flex items-center gap-2">
              {formData.dateOfBirth ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
              <span>Fecha de nacimiento válida</span>
            </div>
            <div className="flex items-center gap-2">
              {formData.gender ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
              <span>Género seleccionado</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
