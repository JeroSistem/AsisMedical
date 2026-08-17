# 🏥 AsisMediCare

Sistema integral de gestión hospitalaria con autenticación, RBAC y arquitectura multi-tenant.

## 🚀 Características

- **Autenticación segura** con NextAuth.js
- **Control de acceso basado en roles** (RBAC)
- **Arquitectura multi-tenant** por entidad
- **Validación de datos** con Zod
- **Modo demo sin base de datos** listo para configurar persistencia más adelante
- **UI moderna** con shadcn/ui + Tailwind CSS
- **Testing completo** con Vitest + Playwright
- **Docker** para desarrollo reproducible

## 📋 Requisitos

- Node.js >= 18.18 (recomendado: 18.20.3)
- Docker & Docker Compose (opcional)

## 🛠️ Instalación

### 1. Clonar repositorio
```bash
git clone <repository-url>
cd AsisMediCare
```

### 2. Instalar dependencias
```bash
npm ci
```

### 3. Configurar variables de entorno
```bash
cp env.example .env.local
# Editar .env.local con tus credenciales
```

### 4. Iniciar desarrollo
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:9002](http://localhost:9002)

## 🐳 Docker (Alternativa)

### Iniciar con Docker Compose
```bash
npm run docker:up
```

### Ver logs
```bash
npm run docker:logs
```

### Detener servicios
```bash
npm run docker:down
```

## 🧪 Testing

### Tests unitarios
```bash
# Ejecutar tests
npm run test

# Tests en modo watch
npm run test:run

# UI de tests
npm run test:ui
```

### Tests E2E
```bash
# Instalar Playwright
npx playwright install

# Ejecutar tests E2E
npm run test:e2E

# UI de tests E2E
npm run test:e2e:ui
```

## 📚 Scripts disponibles

- `npm run dev` - Desarrollo local
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run test` - Tests unitarios
- `npm run test:e2e` - Tests E2E
- `npm run docker:up` - Levantar con Docker

## 🏗️ Arquitectura

```
app/
├── api/           # API Routes
├── admin/         # Panel administrativo
├── pacientes/     # Gestión de pacientes
├── admisiones/    # Admisiones hospitalarias
├── triage/        # Evaluación de urgencias
├── historias/     # Historias clínicas
└── dashboard/     # Panel principal

lib/
├── auth.ts        # Configuración NextAuth
├── rbac.ts        # Control de acceso
├── validator.ts   # Esquemas de validación
├── logger.ts      # Logger estructurado
└── http.ts        # Helpers de respuesta HTTP
```

## 🔐 Autenticación y Roles

- **ADMIN**: Acceso completo al sistema
- **DOCTOR**: Gestión de pacientes y historias
- **NURSE**: Triage y admisiones
- **RECEPTIONIST**: Admisiones y citas

## 🗄️ Persistencia

La aplicación usa **MySQL 8.4** con Prisma. Configura `DATABASE_URL` en `.env.local` (ver `env.example`).

## 🚨 Seguridad

- Autenticación JWT con NextAuth.js
- Validación estricta de inputs con Zod
- Rate limiting en endpoints públicos
- Middleware de protección de rutas
- Scoping automático por entidad (multi-tenant)

## 📝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas, contacta al equipo de desarrollo.
