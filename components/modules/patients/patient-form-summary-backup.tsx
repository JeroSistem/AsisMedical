'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, FileText, User, Phone, MapPin, Shield, AlertTriangle } from 'lucide-react';
import { PatientFormData } from '@/lib/actions/patients';

interface PatientFormSummaryProps {
  formData: PatientFormData;
}

const documentTypes = {
  'CC': 'Cédula de Ciudadanía',
  'TI': 'Tarjeta de Identidad',
  'CE': 'Cédula de Extranjería',
  'PAS': 'Pasaporte',
  'PEP': 'Permiso Especial de Permanencia',
  'PPT': 'Permiso de Protección Temporal'
};

const countries = {
  'CO': 'Colombia',
  'VE': 'Venezuela',
  'EC': 'Ecuador',
  'PE': 'Perú',
  'BR': 'Brasil',
  'AR': 'Argentina',
  'CL': 'Chile',
  'MX': 'México',
  'US': 'Estados Unidos',
  'ES': 'España'
};

const colombianStates = {
  'ANT': 'Antioquia',
  'ATL': 'Atlántico',
  'BOG': 'Bogotá D.C.',
  'BOL': 'Bolívar',
  'BOY': 'Boyacá',
  'CAL': 'Caldas',
  'CAQ': 'Caquetá',
  'CAU': 'Cauca',
  'CES': 'Cesar',
  'CHO': 'Chocó',
  'COR': 'Córdoba',
  'CUN': 'Cundinamarca',
  'GUA': 'Guainía',
  'GUV': 'Guaviare',
  'HUI': 'Huila',
  'LAG': 'La Guajira',
  'MAG': 'Magdalena',
  'MET': 'Meta',
  'NAR': 'Nariño',
  'NSA': 'Norte de Santander',
  'PUT': 'Putumayo',
  'QUI': 'Quindío',
  'RIS': 'Risaralda',
  'SAP': 'San Andrés y Providencia',
  'SAN': 'Santander',
  'SUC': 'Sucre',
  'TOL': 'Tolima',
  'VAC': 'Valle del Cauca',
  'VAU': 'Vaupés',
  'VID': 'Vichada'
};

const genders = {
  'male': 'Masculino',
  'female': 'Femenino',
  'other': 'Otro',
  'unknown': 'No especificado'
};

const maritalStatuses = {
  'single': 'Soltero/a',
  'married': 'Casado/a',
  'divorced': 'Divorciado/a',
  'widowed': 'Viudo/a',
  'separated': 'Separado/a',
  'cohabiting': 'Unión libre'
};

const bloodTypes = {
  'A+': 'A+',
  'A-': 'A-',
  'B+': 'B+',
  'B-': 'B-',
  'AB+': 'AB+',
  'AB-': 'AB-',
  'O+': 'O+',
  'O-': 'O-',
  'unknown': 'No conocido'
};

const contactPreferences = {
  'llamada': 'Llamada telefónica',
  'sms': 'SMS',
  'email': 'Correo electrónico',
  'whatsapp': 'WhatsApp'
};

const insuranceProviders = {
  'EPS001': 'EPS Sura',
  'EPS002': 'EPS Famisanar',
  'EPS003': 'EPS Compensar',
  'EPS004': 'EPS Sanitas',
  'EPS005': 'EPS Coomeva',
  'EPS006': 'EPS Nueva EPS',
  'EPS007': 'EPS Salud Total',
  'EPS008': 'EPS Medimás',
  'EPS009': 'EPS Mutual SER',
  'EPS010': 'EPS Aliansalud',
  'PRIVADO': 'Seguro Privado',
  'PARTICULAR': 'Particular',
  'OTRO': 'Otro'
};

const admissionTypes = {
  'urgencias': 'Urgencias',
  'ambulatorio': 'Ambulatorio',
  'hospitalizacion': 'Hospitalización',
  'consulta_externa': 'Consulta Externa',
  'procedimiento': 'Procedimiento'
};

const languages = {
  'es': 'Español',
  'en': 'Inglés',
  'fr': 'Francés',
  'pt': 'Portugués',
  'other': 'Otro'
};

export function PatientFormSummary({ formData }: PatientFormSummaryProps) {
  // Calcular edad
  const calculateAge = () => {
    if (!formData.dateOfBirth) return null;
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    let calculatedAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    
    return calculatedAge;
  };

  const age = calculateAge();
  const isMinor = age !== null && age < 18;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return 'No especificada';
    const date = new Date(dateTimeString);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Información del paso */}
      <div className="text-center space-y-2">
        <CheckCircle className="h-12 w-12 text-primary mx-auto" />
        <h3 className="text-lg font-semibold">Resumen y Confirmación</h3>
        <p className="text-sm text-muted-foreground">
          Revise toda la información antes de crear el paciente
        </p>
      </div>

      {/* Resumen */}
      <div className="space-y-6">
        {/* Identificación */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Identificación Primaria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Tipo de Documento</p>
                                  <p className="text-sm font-medium">
                    {formData.documentType || 'No especificado'}
                  </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Número de Documento</p>
                <p className="text-sm font-medium font-mono">
                  {formData.documentNumber || 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">País de Expedición</p>
                                  <p className="text-sm font-medium">
                    {formData.countryOfIssue || 'No especificado'}
                  </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos Personales */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Datos Personales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Nombres Completos</p>
                <p className="text-sm font-medium">
                  {formData.firstName} {formData.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fecha de Nacimiento</p>
                <p className="text-sm font-medium">
                  {formatDate(formData.dateOfBirth)}
                  {age !== null && (
                    <Badge variant="secondary" className="ml-2">
                      {age} años
                    </Badge>
                  )}
                  {isMinor && (
                    <Badge variant="destructive" className="ml-2">
                      Menor de edad
                    </Badge>
                  )}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Género</p>
                                  <p className="text-sm font-medium">
                    {formData.gender || 'No especificado'}
                  </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estado Civil</p>
                                  <p className="text-sm font-medium">
                    {formData.maritalStatus || 'No especificado'}
                  </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Grupo Sanguíneo</p>
                                  <p className="text-sm font-medium">
                    {formData.bloodType || 'No especificado'}
                  </p>
              </div>
            </div>

            {formData.occupation && (
              <div>
                <p className="text-xs text-muted-foreground">Ocupación</p>
                <p className="text-sm font-medium">{formData.occupation}</p>
              </div>
            )}

            {/* Información clínica inicial */}
                              {(formData.allergies || formData.activeProblems || formData.initialObservations) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Información Clínica Inicial</h4>
                  
                  {formData.allergies && (
                    <div>
                      <p className="text-xs text-muted-foreground">Alergias Conocidas</p>
                      <p className="text-sm font-medium">{formData.allergies}</p>
                    </div>
                  )}
                  
                  {formData.activeProblems && (
                    <div>
                      <p className="text-xs text-muted-foreground">Problemas Activos</p>
                      <p className="text-sm font-medium">{formData.activeProblems}</p>
                    </div>
                  )}
                  
                  {formData.initialObservations && (
                    <div>
                      <p className="text-xs text-muted-foreground">Observaciones</p>
                      <p className="text-sm font-medium">{formData.initialObservations}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Contacto y Dirección */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contacto y Dirección
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Teléfono Móvil</p>
                <p className="text-sm font-medium">{formData.mobilePhone || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Teléfono Fijo</p>
                <p className="text-sm font-medium">{formData.landlinePhone || 'No especificado'}</p>
              </div>
            </div>

            {formData.email && (
              <div>
                <p className="text-xs text-muted-foreground">Correo Electrónico</p>
                <p className="text-sm font-medium">{formData.email}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Preferencia de Contacto</p>
                <p className="text-sm font-medium">
                  {formData.contactPreference || 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Notificaciones</p>
                <p className="text-sm font-medium">
                  {formData.notificationsConsent ? 'Aceptadas' : 'No aceptadas'}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-xs text-muted-foreground">Dirección Completa</p>
              <p className="text-sm font-medium">
                {formData.address}, {formData.city}
                {formData.department && `, ${formData.department}`}
                {formData.country && `, ${formData.country}`}
              </p>
            </div>

            {/* Contacto de emergencia */}
            {(formData.emergencyContactName || formData.emergencyContactPhone) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Contacto de Emergencia</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Nombre</p>
                      <p className="text-sm font-medium">{formData.emergencyContactName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Parentesco</p>
                      <p className="text-sm font-medium">{formData.emergencyContactRelationship}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="text-sm font-medium">{formData.emergencyContactPhone}</p>
                  </div>
                </div>
              </>
            )}

            {/* Representante legal */}
            {isMinor && (formData.legalRepresentativeName || formData.legalRepresentativeDocument) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Representante Legal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Nombre</p>
                      <p className="text-sm font-medium">{formData.legalRepresentativeName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Documento</p>
                      <p className="text-sm font-medium">{formData.legalRepresentativeDocument}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="text-sm font-medium">{formData.legalRepresentativePhone}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Seguro y Admisión */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Seguro y Admisión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Información de seguro */}
            {(formData.insuranceProvider || formData.insuranceNumber) && (
              <>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Información de Seguro</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Proveedor de Seguro</p>
                      <p className="text-sm font-medium">{formData.insuranceProvider || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Número de Seguro</p>
                      <p className="text-sm font-medium">{formData.insuranceNumber || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Admisión */}
            {formData.createAdmission && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Admisión</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo de Admisión</p>
                    <p className="text-sm font-medium">
                      {formData.admissionType || 'No especificado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha y Hora</p>
                    <p className="text-sm font-medium">
                      {formatDateTime(formData.admissionDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Consentimientos */}
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Consentimientos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {formData.dataProcessingConsent ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Tratamiento de datos personales</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Tratamiento de datos personales</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {formData.communicationConsent ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="text-sm">Comunicación médica</span>
                </div>
              </CardContent>
            </Card>

            {/* Validaciones finales */}
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Validaciones Finales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {formData.documentType && formData.documentNumber ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-red-300" />
                  )}
                  <span>Identificación completa</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.firstName && formData.lastName ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-red-300" />
                  )}
                  <span>Nombres completos</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.dateOfBirth ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-red-300" />
                  )}
                  <span>Fecha de nacimiento</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.gender ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-red-300" />
                  )}
                  <span>Género</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.mobilePhone ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-red-300" />
                  )}
                  <span>Teléfono móvil</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.city && formData.address ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-red-300" />
                  )}
                  <span>Dirección completa</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.dataProcessingConsent ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-red-300" />
                  )}
                  <span>Consentimiento de datos</span>
                </div>
                {isMinor && (
                  <div className="flex items-center gap-2">
                    {formData.legalRepresentativeName && formData.legalRepresentativeDocument && formData.legalRepresentativePhone ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-red-300" />
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
