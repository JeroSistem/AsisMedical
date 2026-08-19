'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CreditCard, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { PatientFormData } from '@/lib/actions/patients';

interface PatientFormStep4Props {
  formData: PatientFormData;
  updateFormData: (data: Partial<PatientFormData>) => void;
}

const insuranceProviders = [
  { value: 'EPS001', label: 'EPS Sura' },
  { value: 'EPS002', label: 'EPS Famisanar' },
  { value: 'EPS003', label: 'EPS Compensar' },
  { value: 'EPS004', label: 'EPS Sanitas' },
  { value: 'EPS005', label: 'EPS Coomeva' },
  { value: 'EPS006', label: 'EPS Nueva EPS' },
  { value: 'EPS007', label: 'EPS Salud Total' },
  { value: 'EPS008', label: 'EPS Medimás' },
  { value: 'EPS009', label: 'EPS Mutual SER' },
  { value: 'EPS010', label: 'EPS Aliansalud' },
  { value: 'PRIVADO', label: 'Seguro Privado' },
  { value: 'PARTICULAR', label: 'Particular' },
  { value: 'OTRO', label: 'Otro' }
];

const admissionTypes = [
  { value: 'urgencias', label: 'Urgencias' },
  { value: 'ambulatorio', label: 'Ambulatorio' },
  { value: 'hospitalizacion', label: 'Hospitalización' },
  { value: 'consulta_externa', label: 'Consulta Externa' },
  { value: 'procedimiento', label: 'Procedimiento' }
];

const languages = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' },
  { value: 'fr', label: 'Francés' },
  { value: 'pt', label: 'Portugués' },
  { value: 'other', label: 'Otro' }
];

export function PatientFormStep4({ formData, updateFormData }: PatientFormStep4Props) {
  const [showAdmissionFields, setShowAdmissionFields] = useState(formData.createAdmission);

  const handleAdmissionToggle = (checked: boolean) => {
    setShowAdmissionFields(checked);
    updateFormData({ 
      createAdmission: checked,
      admissionType: checked ? formData.admissionType : '',
      admissionDate: checked ? formData.admissionDate : ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Información del paso */}
      <div className="text-center space-y-2">
        <Shield className="h-12 w-12 text-primary mx-auto" />
        <h3 className="text-lg font-semibold">Seguro y Admisión</h3>
        <p className="text-sm text-muted-foreground">
          Configure la información de seguro y opciones de admisión
        </p>
      </div>

      {/* Formulario */}
      <div className="space-y-6">
        {/* Información de seguro */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Información de Seguro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider" className="text-sm font-medium">
                  Proveedor de Seguro
                </Label>
                <Input
                  id="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={(e) => updateFormData({ insuranceProvider: e.target.value })}
                  placeholder="Nombre de la aseguradora"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceNumber" className="text-sm font-medium">
                  Número de Seguro
                </Label>
                <Input
                  id="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={(e) => updateFormData({ insuranceNumber: e.target.value })}
                  placeholder="Número de afiliación"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crear admisión */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Crear Admisión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="createAdmission"
                checked={formData.createAdmission}
                onCheckedChange={handleAdmissionToggle}
              />
              <Label htmlFor="createAdmission" className="text-sm font-medium">
                Crear admisión ahora
              </Label>
            </div>

            {showAdmissionFields && (
              <div className="space-y-4 pl-6 border-l-2 border-muted">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admissionType" className="text-sm font-medium">
                      Tipo de Admisión *
                    </Label>
                    <Select
                      value={formData.admissionType}
                      onValueChange={(value) => updateFormData({ admissionType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo de admisión" />
                      </SelectTrigger>
                      <SelectContent>
                        {admissionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admissionDate" className="text-sm font-medium">
                      Fecha y Hora de Admisión *
                    </Label>
                    <Input
                      id="admissionDate"
                      type="datetime-local"
                      value={formData.admissionDate}
                      onChange={(e) => updateFormData({ admissionDate: e.target.value })}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Se generará automáticamente un número de admisión único para este episodio.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consentimientos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Consentimientos y Autorizaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="dataProcessingConsent"
                  checked={formData.dataProcessingConsent}
                  onCheckedChange={(checked) => 
                    updateFormData({ dataProcessingConsent: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor="dataProcessingConsent" className="text-sm font-medium">
                    Consentimiento para el tratamiento de datos personales *
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Autorizo el tratamiento de mis datos personales conforme a la política de privacidad de la institución.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="communicationConsent"
                  checked={formData.communicationConsent}
                  onCheckedChange={(checked) => 
                    updateFormData({ communicationConsent: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor="communicationConsent" className="text-sm font-medium">
                    Consentimiento para Comunicación Médica
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Autorizo la comunicación de información médica relevante
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferencias y accesibilidad */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Preferencias y Accesibilidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            </div>
          </CardContent>
        </Card>

        {/* Alerta de consentimiento obligatorio */}
        {!formData.dataProcessingConsent && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              El consentimiento para tratamiento de datos personales es obligatorio para completar el registro.
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
              {formData.dataProcessingConsent ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <span>Consentimiento de datos personales</span>
            </div>
            {showAdmissionFields && (
              <>
                <div className="flex items-center gap-2">
                  {formData.admissionType ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                  <span>Tipo de admisión</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.admissionDate ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                  <span>Fecha de admisión</span>
                </div>
              </>
            )}
            {formData.insuranceProvider && (
              <div className="flex items-center gap-2">
                {formData.insuranceNumber ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                )}
                <span>Número de afiliación (recomendado)</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
