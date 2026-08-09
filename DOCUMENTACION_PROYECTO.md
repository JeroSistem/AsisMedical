# 📋 Documentación del Proyecto AsisMediCare

## 🏥 Descripción General
**AsisMediCare** es un sistema integral de gestión médica desarrollado con tecnologías modernas. Es una aplicación web completa para la administración de centros de salud, manejo de pacientes, historias clínicas, triage, y gestión administrativa.

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **Next.js 15.0.0** - Framework de React con App Router
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript 5** - Tipado estático para JavaScript
- **Tailwind CSS 3.3.0** - Framework de CSS utilitario
- **Framer Motion** - Animaciones y transiciones
- **Lucide React** - Iconografía moderna

### **Backend**
- **Next.js API Routes** - API endpoints integrados
- **NextAuth.js 4.24.5** - Autenticación y autorización
- **Persistencia** - Actualmente en memoria; pendiente integrar ORM/SDK definitivo

### **Base de Datos**
- **No configurada** - El proyecto se entregó sin base de datos para permitir un diseño desde cero
- **Cliente de acceso** - Por definir (Prisma fue retirado)

### **UI/UX**
- **Radix UI** - Componentes accesibles y personalizables
- **Shadcn/ui** - Sistema de componentes
- **Class Variance Authority** - Gestión de variantes de clases
- **Tailwind Merge** - Optimización de clases CSS
- **Sonner** - Sistema de notificaciones toast

### **Validación y Formularios**
- **Zod 3.22.4** - Validación de esquemas
- **React Hook Form** - Manejo de formularios
- **@hookform/resolvers** - Resolvers para validación

### **Gráficos y Visualización**
- **Recharts 2.8.0** - Gráficos y visualizaciones
- **React Day Picker** - Selector de fechas

### **Características Adicionales**
- **Embla Carousel** - Carruseles responsivos
- **React DOM 18** - Renderizado del DOM

---

## 🗄️ Estructura de Base de Datos

### **Modelos Principales**

#### **Usuarios y Autenticación**
- `User` - Usuarios del sistema con roles
- `Account` - Cuentas de autenticación
- `Session` - Sesiones activas
- `VerificationToken` - Tokens de verificación

#### **Entidades y Módulos**
- `Entity` - Centros médicos (Hospital, Clínica, Centro Médico, Laboratorio)
- `Module` - Módulos del sistema
- `Permission` - Permisos específicos
- `EntityModule` - Relación entidad-módulo
- `UserPermission` - Permisos de usuario

#### **Gestión de Pacientes**
- `Patient` - Información completa del paciente
- `PatientAdmission` - Admisiones de pacientes
- `Appointment` - Citas médicas

#### **Historia Clínica**
- `MedicalRecord` - Registros médicos
- `Diagnosis` - Diagnósticos
- `Treatment` - Tratamientos
- `MedicalDocument` - Documentos médicos

#### **Triage y Urgencias**
- `Triage` - Evaluación inicial de triage
- `TriageAssessment` - Evaluación detallada de triage

### **Enums y Tipos**
- `EntityType`: HOSPITAL, CLINICA, CENTRO_MEDICO, LABORATORIO
- `EntityStatus`: ACTIVE, INACTIVE, PENDING
- `ModuleStatus`: ENABLED, DISABLED
- `UserRole`: SUPER_ADMIN, ENTITY_ADMIN, MEDICO, ENFERMERO, PACIENTE, USER

---

## 🏗️ Arquitectura del Proyecto

### **Estructura de Directorios**
```
AsisMediCare/
├── app/                    # App Router de Next.js
│   ├── admin/             # Módulos administrativos
│   ├── api/               # API endpoints
│   ├── configuracion/     # Configuración del sistema
│   ├── dashboard/         # Panel principal
│   ├── historias/         # Historias clínicas
│   ├── patients/          # Gestión de pacientes
│   ├── triage/            # Sistema de triage
│   └── ...                # Otros módulos
├── components/            # Componentes reutilizables
│   ├── modules/          # Componentes específicos por módulo
│   ├── shared/           # Componentes compartidos
│   └── ui/               # Componentes de UI base
├── lib/                  # Utilidades y lógica de negocio
│   ├── actions/          # Server actions
│   ├── contexts/         # Contextos de React
│   └── services/         # Servicios
├── hooks/                # Custom hooks
└── styles/               # Estilos globales
```

---

## 🎨 Sistema de Diseño

### **Colores**
- **Color Principal**: #24c8f1 (Azul claro)
- **Fuente**: Roboto
- **Tema**: Soporte para modo claro y oscuro

### **Componentes UI**
- Sistema de componentes basado en Radix UI
- Componentes personalizables con Tailwind CSS
- Diseño responsivo y accesible
- Animaciones suaves con Framer Motion

---

## 🌐 Configuración de Internacionalización

### **Idioma**
- **Idioma Principal**: Español (es)
- **Configuración**: Forzado a español en toda la aplicación
- **Detección Automática**: Deshabilitada

### **Variables de Entorno**
- `NEXT_PUBLIC_DEFAULT_LOCALE`: es
- `NEXT_PUBLIC_AVAILABLE_LOCALES`: es
- `NEXT_PUBLIC_FORCE_SPANISH`: true

---

## 🚀 Scripts Disponibles

### **Desarrollo**
- `npm run dev` - Servidor de desarrollo (puerto 9002)
- `npm run build` - Construcción para producción
- `npm run start` - Servidor de producción (puerto 9002)
- `npm run lint` - Linter de código

### **Persistencia (pendiente)**
- Scripts de base de datos eliminados. Se agregarán una vez se defina el nuevo stack de persistencia.

---

## 📱 Módulos del Sistema

### **Módulos Administrativos**
- **Usuarios** - Gestión de usuarios y roles
- **Entidades** - Centros médicos
- **Contratos** - Gestión de contratos
- **Listas de Precios** - Tarifas y precios
- **Resoluciones DIAN** - Configuración fiscal
- **Perfiles** - Perfiles de usuario
- **Roles** - Gestión de roles

### **Módulos Médicos**
- **Pacientes** - Gestión completa de pacientes
- **Historias Clínicas** - Registros médicos
- **Triage** - Evaluación de urgencias
- **Citas** - Sistema de citas médicas
- **Laboratorio** - Resultados de laboratorio
- **Farmacia** - Gestión farmacéutica

### **Módulos Operativos**
- **Dashboard** - Panel principal con estadísticas
- **Admisión** - Proceso de admisión
- **Facturación** - Gestión financiera
- **Reportes** - Generación de reportes
- **Auditoría** - Trazabilidad del sistema

---

## 🔐 Sistema de Autenticación

### **Características**
- Autenticación con NextAuth.js
- Soporte para múltiples proveedores
- Gestión de sesiones seguras
- Roles y permisos granulares
- Protección de rutas

### **Roles Disponibles**
- **SUPER_ADMIN** - Acceso completo al sistema
- **ENTITY_ADMIN** - Administrador de entidad
- **MEDICO** - Personal médico
- **ENFERMERO** - Personal de enfermería
- **PACIENTE** - Pacientes del sistema
- **USER** - Usuario básico

---

## 📊 Características Técnicas

### **Rendimiento**
- Server-side rendering (SSR)
- Static site generation (SSG)
- Optimización de imágenes
- Lazy loading de componentes
- Caching inteligente

### **Seguridad**
- Validación de datos con Zod
- Encriptación de contraseñas
- Protección CSRF
- Sanitización de inputs
- Headers de seguridad

### **Escalabilidad**
- Arquitectura modular
- Separación de responsabilidades
- API RESTful
- Base de datos optimizada
- Caching estratégico

---

## 🛡️ Configuración de Seguridad

### **Variables de Entorno Requeridas**
```env
NEXTAUTH_URL=http://localhost:9002
NEXTAUTH_SECRET=tu-secreto-aqui
```

> Nota: La conexión a base de datos se encuentra deshabilitada en este modo demo. Cuando se defina la nueva persistencia, agrega las variables necesarias (por ejemplo `DATABASE_URL`) y actualiza los servicios correspondientes.

### **Persistencia**
- Actualmente funciona con datos simulados en memoria
- Listo para integrar un ORM o cliente personalizado cuando se provea una base de datos real
- Scripts de migración y seed se eliminaron para iniciar desde cero

---

## 📈 Estado del Proyecto

### **Versión Actual**
- **Versión**: 0.1.0
- **Estado**: Desarrollo activo
- **Última actualización**: Diciembre 2024

### **Funcionalidades Implementadas**
- ✅ Sistema de autenticación completo
- ✅ Gestión de usuarios y roles
- ✅ CRUD de pacientes
- ✅ Sistema de triage
- ✅ Historias clínicas básicas
- ✅ Dashboard administrativo
- ✅ Sistema de navegación modular
- ✅ Interfaz responsiva

### **En Desarrollo**
- 🔄 Módulos de facturación
- 🔄 Sistema de reportes avanzado
- 🔄 Integración con laboratorio
- 🔄 Módulo de farmacia
- 🔄 Sistema de notificaciones

---

## 🚀 Instalación y Configuración

### **Requisitos Previos**
- Node.js 18+
- npm o yarn

### **Pasos de Instalación**
1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno
4. Configurar base de datos: `npm run db:push`
5. Poblar datos iniciales: `npm run db:seed`
6. Iniciar servidor: `npm run dev`

### **Acceso**
- **URL**: http://localhost:9002
- **Usuario demo**: admin@appasismedicare.test / admin123 (configurable vía variables AUTH_DEMO_*)

---

## 📞 Soporte y Contacto

Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo.

---

*Documentación generada automáticamente - Diciembre 2024*
