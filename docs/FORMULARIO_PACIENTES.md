# Formulario de Registro de Pacientes

## Descripción General

El formulario de registro de pacientes es un sistema completo y robusto diseñado para capturar toda la información necesaria de un nuevo paciente en el sistema médico. Está estructurado en 5 pasos para facilitar la experiencia del usuario y asegurar la calidad de los datos.

## Estructura del Formulario

### Paso 1: Identificación Primaria
**Objetivo**: Verificar la identidad del paciente y evitar duplicados

#### Campos Incluidos:
- **Tipo de Documento** (obligatorio)
  - CC: Cédula de Ciudadanía
  - TI: Tarjeta de Identidad
  - CE: Cédula de Extranjería
  - PAS: Pasaporte
  - PEP: Permiso Especial de Permanencia
  - PPT: Permiso por Protección Temporal
  - NIT: NIT
  - RUT: RUT

- **Número de Documento** (obligatorio)
  - Validación automática según tipo de documento
  - Verificación de formato en tiempo real

- **País de Expedición** (opcional)
  - Lista de países disponibles

#### Funcionalidades:
- ✅ Verificación automática de duplicados
- ✅ Validación de formato por tipo de documento
- ✅ Búsqueda en tiempo real
- ✅ Alertas de posibles duplicados

### Paso 2: Datos Personales
**Objetivo**: Capturar información básica del paciente

#### Campos Incluidos:
- **Nombres** (obligatorio)
- **Apellidos** (obligatorio)
- **Fecha de Nacimiento** (obligatorio)
  - Cálculo automático de edad
  - Validación de fecha futura
- **Sexo/Género** (obligatorio)
  - Masculino, Femenino, Otro, No especificado
- **Estado Civil** (opcional)
- **Grupo Sanguíneo/RH** (opcional)
- **Ocupación** (opcional)

#### Información Clínica Inicial (Opcional):
- **Alergias Conocidas**
- **Problemas Activos Relevantes**
- **Observaciones Iniciales**

#### Funcionalidades:
- ✅ Cálculo automático de edad
- ✅ Detección de menores de edad
- ✅ Validación de fecha de nacimiento
- ✅ Gestión de alergias con etiquetas

### Paso 3: Contacto y Dirección
**Objetivo**: Establecer canales de comunicación y ubicación

#### Información de Contacto:
- **Teléfono Móvil** (obligatorio)
  - Validación de formato internacional
- **Teléfono Fijo** (opcional)
- **Correo Electrónico** (opcional)
  - Validación de formato RFC
- **Preferencia de Contacto**
  - Llamada, SMS, Email, WhatsApp
- **Acepta Notificaciones** (checkbox)

#### Dirección:
- **País** (por defecto: Colombia)
- **Departamento/Estado**
- **Ciudad/Municipio** (obligatorio)
- **Dirección** (opcional)
- **Código Postal** (opcional)
- **Barrio/Referencia** (opcional)

#### Contacto de Emergencia:
- **Nombre del Contacto**
- **Parentesco**
- **Teléfono de Emergencia**

#### Representante Legal (condicional):
- Se muestra automáticamente para menores de edad
- **Nombre del Representante** (obligatorio)
- **Documento del Representante** (obligatorio)
- **Teléfono del Representante** (obligatorio)

#### Funcionalidades:
- ✅ Validación de teléfonos en formato E.164
- ✅ Validación de email
- ✅ Detección automática de menores de edad
- ✅ Campos condicionales según edad

### Paso 4: Seguro y Admisión
**Objetivo**: Gestionar cobertura médica y admisión

#### Seguro / Pagador:
- **Aseguradora/Plan** (opcional)
  - Lista de EPS colombianas
  - Seguros privados
  - Opción "Otro"
- **Número de Afiliación** (opcional)

#### Crear Admisión:
- **Crear ingreso ahora** (toggle)
- **Tipo de Ingreso** (si se crea admisión)
  - Urgencias, Ambulatorio, Hospitalización, Cirugía de Día, UCI/UCC
- **Fecha y Hora de Admisión** (si se crea admisión)

#### Consentimientos:
- **Tratamiento de Datos Personales** (obligatorio)
  - Enlace a política de privacidad
- **Autorización de Comunicación** (opcional)
- **Intercambio con Aseguradora** (opcional)

#### Preferencias y Accesibilidad:
- **Idioma Preferido**
  - Español, Inglés, Francés, Portugués, Otro
- **Necesita Intérprete** (checkbox)

#### Funcionalidades:
- ✅ Campos condicionales según creación de admisión
- ✅ Validación de consentimientos obligatorios
- ✅ Información contextual según selecciones

### Paso 5: Resumen y Confirmación
**Objetivo**: Revisar toda la información antes de guardar

#### Secciones del Resumen:
1. **Información Personal**
2. **Información de Contacto**
3. **Dirección**
4. **Información Clínica Inicial** (si aplica)
5. **Seguro y Admisión** (si aplica)
6. **Contacto de Emergencia** (si aplica)
7. **Representante Legal** (si es menor de edad)
8. **Consentimientos**
9. **Validaciones Finales**
10. **Información del Sistema**

#### Funcionalidades:
- ✅ Vista completa de todos los datos
- ✅ Validaciones finales con indicadores visuales
- ✅ Información del sistema (MRN, admisión)
- ✅ Confirmación antes de guardar

## Validaciones Implementadas

### Validaciones de Formato:
- **Documentos**: Formato específico por tipo
- **Teléfonos**: Formato internacional E.164
- **Emails**: RFC básico
- **Fechas**: No futuras, cálculo de edad

### Validaciones de Negocio:
- **Duplicados**: Verificación automática
- **Edad**: Detección de menores de edad
- **Consentimientos**: Obligatorios para completar
- **Admisión**: Campos requeridos si se crea

### Validaciones de Integridad:
- **Campos obligatorios**: Marcados claramente
- **Dependencias**: Campos condicionales
- **Consistencia**: Validación cruzada de datos

## Características Técnicas

### Tecnologías Utilizadas:
- **Next.js 14** con App Router
- **TypeScript** para tipado fuerte
- **Tailwind CSS** para estilos
- **Shadcn/ui** para componentes
- **React Hook Form** para gestión de formularios
- **Zod** para validaciones

### Arquitectura:
- **Componentes modulares** por paso
- **Estado centralizado** en el componente padre
- **Validaciones en tiempo real**
- **Navegación por pasos**
- **Persistencia de datos** entre pasos

### Experiencia de Usuario:
- **Navegación intuitiva** con indicadores de progreso
- **Validaciones visuales** con iconos y colores
- **Mensajes de error** claros y específicos
- **Campos condicionales** que aparecen según contexto
- **Resumen completo** antes de confirmar

## Flujo de Datos

### Estructura de Datos:
```typescript
interface PatientFormData {
  // Identificación
  documentType: string;
  documentNumber: string;
  countryOfIssue: string;
  
  // Datos personales
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  maritalStatus: string;
  bloodType: string;
  occupation: string;
  
  // Contacto
  mobilePhone: string;
  landlinePhone: string;
  email: string;
  contactPreference: string;
  acceptNotifications: boolean;
  
  // Dirección
  country: string;
  state: string;
  city: string;
  address: string;
  postalCode: string;
  neighborhood: string;
  
  // Contacto de emergencia
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  
  // Representante legal
  legalRepresentativeName: string;
  legalRepresentativeDocument: string;
  legalRepresentativePhone: string;
  
  // Seguro y admisión
  insuranceProvider: string;
  insuranceNumber: string;
  createAdmission: boolean;
  admissionType: string;
  admissionDate: string;
  
  // Consentimientos
  dataTreatmentConsent: boolean;
  communicationConsent: boolean;
  insuranceExchangeConsent: boolean;
  
  // Preferencias
  preferredLanguage: string;
  needsInterpreter: boolean;
  
  // Información clínica
  allergies: string[];
  activeProblems: string;
  initialObservations: string;
}
```

### Persistencia:
- Los datos se mantienen en el estado del componente
- Navegación entre pasos sin pérdida de información
- Posibilidad de volver y modificar datos anteriores

## Integración con el Sistema

### Rutas:
- **Formulario completo**: `/patients/nuevo`
- **Formulario rápido**: Modal en `/patients`

### Base de Datos:
- Preparado para integración con Prisma
- Estructura compatible con FHIR
- Índices únicos para evitar duplicados

### API:
- Endpoints preparados para:
  - Crear paciente
  - Verificar duplicados
  - Generar MRN
  - Crear admisión

## Consideraciones de Seguridad

### Validación de Datos:
- Validación tanto en frontend como backend
- Sanitización de inputs
- Prevención de inyección SQL

### Privacidad:
- Consentimientos obligatorios
- Política de privacidad integrada
- Auditoría de cambios

### Acceso:
- Control de acceso basado en roles
- Logs de auditoría
- Trazabilidad de cambios

## Mejoras Futuras

### Funcionalidades Planificadas:
- **Escaneo de documentos** con OCR
- **Validación con RENIEC** (Colombia)
- **Integración con EPS** para verificación
- **Firma digital** de consentimientos
- **Carga de documentos** adjuntos
- **Historial de cambios** del paciente

### Optimizaciones:
- **Caché de datos** para mejor rendimiento
- **Validación offline** con Service Workers
- **Sincronización** cuando hay conexión
- **Exportación** de datos en múltiples formatos

## Conclusión

El formulario de registro de pacientes es una solución completa y robusta que cumple con los estándares médicos y de usabilidad. Su diseño modular permite fácil mantenimiento y extensión, mientras que las validaciones exhaustivas aseguran la calidad de los datos capturados.

La experiencia de usuario está optimizada para ser intuitiva y eficiente, reduciendo errores y mejorando la satisfacción del personal médico que lo utiliza.
