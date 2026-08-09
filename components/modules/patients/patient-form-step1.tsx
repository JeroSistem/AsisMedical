'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, UserCheck } from 'lucide-react';
import { PatientFormData } from '@/lib/actions/patients';

interface PatientFormStep1Props {
  formData: PatientFormData;
  updateFormData: (data: Partial<PatientFormData>) => void;
}

const documentTypes = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PAS', label: 'Pasaporte' },
  { value: 'PEP', label: 'Permiso Especial de Permanencia' },
  { value: 'PPT', label: 'Permiso de Protección Temporal' }
];

const countries = [
  { value: 'CO', label: 'Colombia' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'PE', label: 'Perú' },
  { value: 'BR', label: 'Brasil' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CL', label: 'Chile' },
  { value: 'MX', label: 'México' },
  { value: 'US', label: 'Estados Unidos' },
  { value: 'ES', label: 'España' }
];

export function PatientFormStep1({ formData, updateFormData }: PatientFormStep1Props) {
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [duplicateCheckResult, setDuplicateCheckResult] = useState<{
    found: boolean;
    message: string;
    type: 'success' | 'warning' | 'error';
  } | null>(null);

  const checkDuplicates = async () => {
    if (!formData.documentType || !formData.documentNumber) {
      setDuplicateCheckResult({
        found: false,
        message: 'Complete el tipo y número de documento para verificar duplicados',
        type: 'warning'
      });
      return;
    }

    setIsCheckingDuplicates(true);
    
    // Simular verificación de duplicados
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock: simular que no se encontraron duplicados
    const mockDuplicates = [
      { documentType: 'CC', documentNumber: '12345678', name: 'Juan Pérez' },
      { documentType: 'TI', documentNumber: '987654321', name: 'María García' }
    ];
    
    const found = mockDuplicates.some(
      dup => dup.documentType === formData.documentType && 
             dup.documentNumber === formData.documentNumber
    );
    
    setDuplicateCheckResult({
      found,
      message: found 
        ? 'Se encontró un paciente con este documento. Verifique los datos antes de continuar.'
        : 'No se encontraron pacientes con este documento. Puede continuar.',
      type: found ? 'error' : 'success'
    });
    
    setIsCheckingDuplicates(false);
  };

  const validateDocumentNumber = (value: string) => {
    if (!formData.documentType) return true;
    
    const numericTypes = ['CC', 'TI'];
    const alphanumericTypes = ['CE', 'PAS', 'PEP', 'PPT'];
    
    if (numericTypes.includes(formData.documentType)) {
      return /^\d+$/.test(value);
    }
    
    if (alphanumericTypes.includes(formData.documentType)) {
      return /^[A-Za-z0-9]+$/.test(value);
    }
    
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Información del paso */}
      <div className="text-center space-y-2">
        <UserCheck className="h-12 w-12 text-primary mx-auto" />
        <h3 className="text-lg font-semibold">Identificación Primaria</h3>
        <p className="text-sm text-muted-foreground">
          Ingrese la información del documento de identidad del paciente
        </p>
      </div>

      {/* Formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de documento */}
        <div className="space-y-2">
          <Label htmlFor="documentType" className="text-sm font-medium">
            Tipo de Documento *
          </Label>
          <Select
            value={formData.documentType}
            onValueChange={(value) => updateFormData({ documentType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el tipo de documento" />
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

        {/* Número de documento */}
        <div className="space-y-2">
          <Label htmlFor="documentNumber" className="text-sm font-medium">
            Número de Documento *
          </Label>
          <Input
            id="documentNumber"
            value={formData.documentNumber}
            onChange={(e) => {
              const value = e.target.value;
              if (validateDocumentNumber(value)) {
                updateFormData({ documentNumber: value });
              }
            }}
            placeholder="Ingrese el número de documento"
            className="font-mono"
          />
        </div>

        {/* País de expedición */}
        <div className="space-y-2">
          <Label htmlFor="countryOfIssue" className="text-sm font-medium">
            País de Expedición
          </Label>
          <Select
            value={formData.countryOfIssue}
            onValueChange={(value) => updateFormData({ countryOfIssue: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botón de verificación */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-transparent">
            Verificar Duplicados
          </Label>
          <Button
            type="button"
            variant="outline"
            onClick={checkDuplicates}
            disabled={isCheckingDuplicates || !formData.documentType || !formData.documentNumber}
            className="w-full"
          >
            {isCheckingDuplicates ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                Verificando...
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                Verificar Duplicados
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Resultado de verificación */}
      {duplicateCheckResult && (
        <Alert className={duplicateCheckResult.type === 'error' ? 'border-red-200 bg-red-50' : 
                        duplicateCheckResult.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 
                        'border-green-200 bg-green-50'}>
          {duplicateCheckResult.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : duplicateCheckResult.type === 'warning' ? (
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={
            duplicateCheckResult.type === 'error' ? 'text-red-800' : 
            duplicateCheckResult.type === 'warning' ? 'text-yellow-800' : 
            'text-green-800'
          }>
            {duplicateCheckResult.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Información adicional */}
      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Información Importante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• El número de documento debe ser único en el sistema</p>
          <p>• Para CC y TI solo se permiten números</p>
          <p>• Para otros documentos se permiten letras y números</p>
          <p>• Se recomienda verificar duplicados antes de continuar</p>
        </CardContent>
      </Card>
    </div>
  );
}
