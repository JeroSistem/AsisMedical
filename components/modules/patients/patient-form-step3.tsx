'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Mail, MapPin, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { PatientFormData } from '@/lib/actions/patients';

interface PatientFormStep3Props {
  formData: PatientFormData;
  updateFormData: (data: Partial<PatientFormData>) => void;
}

const contactPreferences = [
  { value: 'llamada', label: 'Llamada telefónica' },
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Correo electrónico' },
  { value: 'whatsapp', label: 'WhatsApp' }
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

const colombianStates = [
  { value: 'ANT', label: 'Antioquia' },
  { value: 'ATL', label: 'Atlántico' },
  { value: 'BOG', label: 'Bogotá D.C.' },
  { value: 'BOL', label: 'Bolívar' },
  { value: 'BOY', label: 'Boyacá' },
  { value: 'CAL', label: 'Caldas' },
  { value: 'CAQ', label: 'Caquetá' },
  { value: 'CAU', label: 'Cauca' },
  { value: 'CES', label: 'Cesar' },
  { value: 'CHO', label: 'Chocó' },
  { value: 'COR', label: 'Córdoba' },
  { value: 'CUN', label: 'Cundinamarca' },
  { value: 'GUA', label: 'Guainía' },
  { value: 'GUV', label: 'Guaviare' },
  { value: 'HUI', label: 'Huila' },
  { value: 'LAG', label: 'La Guajira' },
  { value: 'MAG', label: 'Magdalena' },
  { value: 'MET', label: 'Meta' },
  { value: 'NAR', label: 'Nariño' },
  { value: 'NSA', label: 'Norte de Santander' },
  { value: 'PUT', label: 'Putumayo' },
  { value: 'QUI', label: 'Quindío' },
  { value: 'RIS', label: 'Risaralda' },
  { value: 'SAP', label: 'San Andrés y Providencia' },
  { value: 'SAN', label: 'Santander' },
  { value: 'SUC', label: 'Sucre' },
  { value: 'TOL', label: 'Tolima' },
  { value: 'VAC', label: 'Valle del Cauca' },
  { value: 'VAU', label: 'Vaupés' },
  { value: 'VID', label: 'Vichada' }
];

export function PatientFormStep3({ formData, updateFormData }: PatientFormStep3Props) {
  const [isMinor, setIsMinor] = useState(false);

  // Verificar si es menor de edad basado en la fecha de nacimiento
  useEffect(() => {
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      let calculatedAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      setIsMinor(calculatedAge < 18);
    }
  }, [formData.dateOfBirth]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  };

  return (
    <div className="space-y-6">
      {/* Información del paso */}
      <div className="text-center space-y-2">
        <Phone className="h-12 w-12 text-primary mx-auto" />
        <h3 className="text-lg font-semibold">Contacto y Dirección</h3>
        <p className="text-sm text-muted-foreground">
          Ingrese la información de contacto y dirección del paciente
        </p>
      </div>

      {/* Formulario */}
      <div className="space-y-6">
        {/* Información de contacto */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobilePhone" className="text-sm font-medium">
                  Teléfono Móvil *
                </Label>
                <Input
                  id="mobilePhone"
                  value={formData.mobilePhone}
                  onChange={(e) => updateFormData({ mobilePhone: e.target.value })}
                  placeholder="+57 300 123 4567"
                  className={formData.mobilePhone && !validatePhone(formData.mobilePhone) ? 'border-red-500' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landlinePhone" className="text-sm font-medium">
                  Teléfono Fijo
                </Label>
                <Input
                  id="landlinePhone"
                  value={formData.landlinePhone}
                  onChange={(e) => updateFormData({ landlinePhone: e.target.value })}
                  placeholder="+57 1 234 5678"
                  className={formData.landlinePhone && !validatePhone(formData.landlinePhone) ? 'border-red-500' : ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                placeholder="paciente@ejemplo.com"
                className={formData.email && !validateEmail(formData.email) ? 'border-red-500' : ''}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPreference" className="text-sm font-medium">
                  Preferencia de Contacto
                </Label>
                <Select
                  value={formData.contactPreference}
                  onValueChange={(value) => updateFormData({ contactPreference: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contactPreferences.map((pref) => (
                      <SelectItem key={pref.value} value={pref.value}>
                        {pref.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Notificaciones
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notificationsConsent"
                    checked={formData.notificationsConsent}
                    onCheckedChange={(checked) => updateFormData({ notificationsConsent: checked as boolean })}
                  />
                  <Label htmlFor="notificationsConsent" className="text-sm">
                    Acepto recibir notificaciones por SMS y email
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dirección */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Dirección
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">
                  País *
                </Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => updateFormData({ country: value })}
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

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  Ciudad
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData({ city: e.target.value })}
                  placeholder="Ciudad"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">
                  Departamento
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => updateFormData({ department: e.target.value })}
                  placeholder="Departamento"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Dirección Completa *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateFormData({ address: e.target.value })}
                placeholder="Calle, número, interior, complemento"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contacto de emergencia */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Contacto de Emergencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName" className="text-sm font-medium">
                  Nombre Completo
                </Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => updateFormData({ emergencyContactName: e.target.value })}
                  placeholder="Nombre del contacto de emergencia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelationship" className="text-sm font-medium">
                  Parentesco
                </Label>
                <Input
                  id="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => updateFormData({ emergencyContactRelationship: e.target.value })}
                  placeholder="Padre, madre, cónyuge, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone" className="text-sm font-medium">
                Teléfono de Emergencia
              </Label>
              <Input
                id="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={(e) => updateFormData({ emergencyContactPhone: e.target.value })}
                placeholder="+57 300 123 4567"
                className={formData.emergencyContactPhone && !validatePhone(formData.emergencyContactPhone) ? 'border-red-500' : ''}
              />
            </div>
          </CardContent>
        </Card>

        {/* Representante legal (solo para menores) */}
        {isMinor && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-yellow-800">
                <User className="h-4 w-4" />
                Representante Legal *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="legalRepresentativeName" className="text-sm font-medium">
                    Nombre Completo *
                  </Label>
                  <Input
                    id="legalRepresentativeName"
                    value={formData.legalRepresentativeName}
                    onChange={(e) => updateFormData({ legalRepresentativeName: e.target.value })}
                    placeholder="Nombre del representante legal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="legalRepresentativeDocument" className="text-sm font-medium">
                    Número de Documento *
                  </Label>
                  <Input
                    id="legalRepresentativeDocument"
                    value={formData.legalRepresentativeDocument}
                    onChange={(e) => updateFormData({ legalRepresentativeDocument: e.target.value })}
                    placeholder="CC del representante legal"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalRepresentativePhone" className="text-sm font-medium">
                  Teléfono *
                </Label>
                <Input
                  id="legalRepresentativePhone"
                  value={formData.legalRepresentativePhone}
                  onChange={(e) => updateFormData({ legalRepresentativePhone: e.target.value })}
                  placeholder="+57 300 123 4567"
                  className={formData.legalRepresentativePhone && !validatePhone(formData.legalRepresentativePhone) ? 'border-red-500' : ''}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Validaciones */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Validaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              {formData.mobilePhone ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
              <span>Teléfono móvil</span>
            </div>
            <div className="flex items-center gap-2">
              {formData.city ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
              <span>Ciudad</span>
            </div>
            <div className="flex items-center gap-2">
              {formData.address ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
              <span>Dirección completa</span>
            </div>
            {isMinor && (
              <div className="flex items-center gap-2">
                {formData.legalRepresentativeName && formData.legalRepresentativeDocument && formData.legalRepresentativePhone ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <span>Representante legal (requerido para menores)</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
