# Archivos Necesarios para Hosting en Colombia

Este documento lista los archivos y carpetas que deben incluirse al subir el proyecto al hosting en Colombia.

## 📦 Archivos y Carpetas a INCLUIR

### Estructura del Proyecto
```
AppAsisMedical/
├── app/                    # ✅ Aplicación Next.js (páginas y rutas)
├── components/             # ✅ Componentes React
├── lib/                    # ✅ Utilidades y lógica de negocio
├── hooks/                  # ✅ React hooks personalizados
├── styles/                 # ✅ Estilos globales
├── prisma/                 # ✅ Schema y seed de Prisma
│   ├── schema.prisma       # ✅ Esquema de base de datos
│   └── seed.ts             # ✅ Seed para crear superusuario
├── scripts/                # ✅ Scripts de utilidad
│   ├── clean-database.js   # ✅ Script de limpieza
│   └── create-admin-user.js # ✅ Script para crear admin
├── public/                 # ✅ Archivos estáticos (si existe)
├── .next/                  # ✅ Build de producción (generado con npm run build)
├── node_modules/           # ✅ Dependencias (instaladas con npm install)
├── package.json            # ✅ Dependencias del proyecto
├── package-lock.json       # ✅ Lock file de dependencias
├── tsconfig.json           # ✅ Configuración TypeScript
├── next.config.ts          # ✅ Configuración Next.js
├── tailwind.config.ts      # ✅ Configuración Tailwind CSS
├── postcss.config.mjs      # ✅ Configuración PostCSS
├── middleware.ts           # ✅ Middleware de Next.js
├── .eslintrc.json          # ✅ Configuración ESLint
├── .gitignore              # ✅ Archivos a ignorar
├── .nvmrc                  # ✅ Versión de Node.js
├── Dockerfile              # ✅ Configuración Docker (si se usa)
├── docker-compose.yml      # ✅ Docker Compose (si se usa)
└── README.md               # ✅ Documentación del proyecto
```

## 🚫 Archivos y Carpetas a EXCLUIR

### Archivos de Desarrollo
```
├── .env                    # ❌ Variables de entorno locales
├── .env.local              # ❌ Variables de entorno locales
├── .env.development        # ❌ Variables de entorno locales
├── .next/                  # ❌ Se regenera en producción
├── node_modules/           # ❌ Se instala en el servidor
├── .git/                   # ❌ Historial de Git (opcional)
├── .idx/                   # ❌ Archivos de desarrollo
├── test/                   # ❌ Tests (opcional, depende del hosting)
├── .github/                 # ❌ Workflows de CI/CD (opcional)
├── AsisMedical.zip         # ❌ Archivos temporales
└── *.log                   # ❌ Archivos de log
```

### Archivos de Documentación (Opcional)
```
├── docs/                   # ⚠️ Opcional (puede incluirse o no)
├── SECURITY.md             # ⚠️ Opcional
├── DOCUMENTACION_PROYECTO.md # ⚠️ Opcional
└── GUIA_PRUEBA_CONFIGURACION.md # ⚠️ Opcional
```

## 🔧 Configuración Necesaria en el Hosting

### Variables de Entorno (.env)
Crear un archivo `.env` o `.env.production` en el servidor con:

```env
# Base de Datos
DATABASE_URL="postgresql://usuario:password@host:puerto/nombre_bd"

# NextAuth
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="tu-secret-key-minimo-32-caracteres"

# Aplicación
NODE_ENV="production"
LOG_LEVEL="info"

# Internacionalización
NEXT_PUBLIC_DEFAULT_LOCALE="es"
NEXT_PUBLIC_AVAILABLE_LOCALES="es"
NEXT_PUBLIC_FORCE_SPANISH="true"

# Rate Limiting
RATE_LIMIT_POINTS="100"
RATE_LIMIT_DURATION="60"

# Admin (opcional, se puede crear con el script)
ADMIN_EMAIL="admin@asismedicare.com"
ADMIN_PASSWORD="cambiar-en-produccion"
ADMIN_NAME="Administrador"

# Google AI (opcional)
GOOGLE_AI_API_KEY="tu-api-key-si-se-usa"
```

## 📋 Pasos para Desplegar

### 1. Preparar la Base de Datos
```bash
# En el servidor, ejecutar migraciones
npx prisma migrate deploy

# O si es primera vez
npx prisma db push
```

### 2. Crear el Superusuario
```bash
# Opción 1: Usar el seed
npm run db:seed

# Opción 2: Usar el script
node scripts/create-admin-user.js
```

### 3. Limpiar Datos de Prueba (si es necesario)
```bash
node scripts/clean-database.js
```

### 4. Construir la Aplicación
```bash
npm install
npm run build
```

### 5. Iniciar en Producción
```bash
npm start
# O con PM2
pm2 start npm --name "asismedicare" -- start
```

## 🗄️ Base de Datos

### Estructura
- La base de datos debe estar vacía o solo con el superusuario
- Ejecutar las migraciones de Prisma antes de iniciar la aplicación
- El schema está en `prisma/schema.prisma`

### Backup Recomendado
Antes de limpiar, hacer backup de la base de datos:
```bash
pg_dump -h host -U usuario -d nombre_bd > backup.sql
```

## 📝 Notas Importantes

1. **Seguridad**: Cambiar todas las contraseñas por defecto en producción
2. **Variables de Entorno**: Nunca subir archivos `.env` al repositorio
3. **Base de Datos**: Asegurar que la conexión a la BD esté configurada correctamente
4. **SSL**: Configurar certificados SSL para HTTPS en producción
5. **Logs**: Configurar rotación de logs en producción

## 🔍 Verificación Post-Despliegue

1. Verificar que la aplicación inicia sin errores
2. Probar login con el superusuario
3. Verificar conexión a la base de datos
4. Revisar logs de errores
5. Verificar que las rutas principales funcionan
