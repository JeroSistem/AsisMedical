# Configuración General - Setup y Uso

> ⚠️ **Importante**: Esta guía corresponde a la versión anterior basada en PostgreSQL + Prisma. La base de datos se eliminó del proyecto y estos pasos quedan como referencia histórica hasta definir la nueva persistencia.

## 🚀 Configuración Inicial (versión anterior)

### 1. Configurar Base de Datos

En la versión anterior debías asegurarte de tener PostgreSQL instalado y configurado. Esta sección se conserva solo como referencia:

1. **Copiar variables de entorno:**
   ```bash
   cp env.example .env.local
   ```

2. **Configurar variables de entorno en `.env.local`:**
   ```env
   # DATABASE_URL se definirá cuando se escoja la nueva base de datos
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production
   ```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Base de Datos *(obsoleto)*

> Estos comandos pertenecen a la versión con Prisma y se mantienen solo como referencia. No se deben ejecutar hasta que exista una nueva base de datos.

```bash
# Generar el cliente de Prisma
npm run db:generate

# Crear las tablas en la base de datos
npm run db:push

# Ejecutar el seed para crear datos iniciales
npm run db:seed
```

### 4. Iniciar el Servidor

```bash
npm run dev
```

## 📊 Estructura de la Base de Datos

### Tablas Principales

#### `entities`
- **id**: UUID (Primary Key)
- **name**: Nombre de la entidad
- **type**: HOSPITAL | CLINICA | CENTRO_MEDICO | LABORATORIO
- **status**: ACTIVE | INACTIVE | PENDING
- **adminUserId**: ID del usuario administrador
- **createdAt**: Timestamp de creación
- **updatedAt**: Timestamp de actualización

#### `users`
- **id**: UUID (Primary Key)
- **name**: Nombre del usuario
- **email**: Email único
- **password**: Contraseña hasheada
- **role**: SUPER_ADMIN | ENTITY_ADMIN | MEDICO | ENFERMERO | PACIENTE | USER
- **entityId**: ID de la entidad asociada
- **status**: Active | Inactive
- **lastLogin**: Último acceso
- **createdAt**: Timestamp de creación
- **updatedAt**: Timestamp de actualización

#### `modules`
- **id**: UUID (Primary Key)
- **name**: Nombre del módulo
- **description**: Descripción del módulo
- **status**: ENABLED | DISABLED
- **config**: Configuración JSON del módulo
- **createdAt**: Timestamp de creación
- **updatedAt**: Timestamp de actualización

#### `permissions`
- **id**: UUID (Primary Key)
- **name**: Nombre del permiso
- **description**: Descripción del permiso
- **moduleId**: ID del módulo asociado
- **createdAt**: Timestamp de creación

#### `entity_modules`
- **id**: UUID (Primary Key)
- **entityId**: ID de la entidad
- **moduleId**: ID del módulo
- **enabled**: Boolean (habilitado/deshabilitado)
- **config**: Configuración específica para la entidad-módulo

#### `user_permissions`
- **id**: UUID (Primary Key)
- **userId**: ID del usuario
- **permissionId**: ID del permiso
- **granted**: Boolean (concedido/denegado)

## 🔧 Funcionalidades

### 1. Gestión de Entidades

#### Crear Nueva Entidad
1. Ir a la pestaña "Entidades"
2. Hacer clic en "Nueva Entidad"
3. Completar el formulario:
   - **Nombre**: Nombre de la entidad
   - **Tipo**: Hospital, Clínica, Centro Médico, Laboratorio
   - **Estado**: Activo, Inactivo, Pendiente
   - **Administrador**: Datos del usuario administrador
   - **Módulos**: Seleccionar módulos habilitados

#### Editar Entidad
1. Hacer clic en el botón "Editar" de la entidad
2. Modificar los campos necesarios
3. Guardar cambios

### 2. Gestión de Usuarios

#### Crear Nuevo Usuario
1. Ir a la pestaña "Usuarios"
2. Hacer clic en "Nuevo Usuario"
3. Completar el formulario:
   - **Datos básicos**: Nombre, email, rol
   - **Entidad**: Asociar a una entidad
   - **Contraseña**: Contraseña segura
   - **Permisos**: Asignar permisos específicos

#### Roles Disponibles
- **SUPER_ADMIN**: Acceso completo al sistema
- **ENTITY_ADMIN**: Administrador de entidad
- **MEDICO**: Médico
- **ENFERMERO**: Enfermero
- **PACIENTE**: Paciente
- **USER**: Usuario básico

### 3. Gestión de Módulos

#### Crear Nuevo Módulo
1. Ir a la pestaña "Módulos"
2. Hacer clic en "Nuevo Módulo"
3. Completar el formulario:
   - **Nombre**: Nombre del módulo
   - **Descripción**: Descripción detallada
   - **Estado**: Habilitado/Deshabilitado
   - **Configuración**: Configuración específica del módulo

#### Módulos Predefinidos
- **Historias Clínicas**: Gestión de historias clínicas
- **Triage**: Sistema de clasificación de urgencias
- **Asistencial**: Gestión de servicios asistenciales
- **Laboratorio**: Gestión de pruebas de laboratorio
- **Imágenes Diagnósticas**: Gestión de imágenes médicas
- **Farmacia**: Gestión de medicamentos
- **Facturación**: Gestión de facturación
- **Inventario**: Control de inventario
- **Auditoría**: Sistema de auditoría
- **Contabilidad**: Gestión contable
- **Presupuesto**: Gestión presupuestaria
- **Nómina**: Gestión de nómina
- **Cartera**: Gestión de cartera

## 🔐 Permisos y Seguridad

### Sistema de Permisos
- **read**: Leer datos
- **write**: Crear y editar datos
- **delete**: Eliminar datos
- **export**: Exportar datos
- **admin**: Acceso administrativo completo

### Validaciones
- Emails únicos
- Contraseñas hasheadas con bcrypt
- Validación de roles y permisos
- Verificación de entidades existentes

## 📈 Estadísticas

El dashboard muestra estadísticas en tiempo real:
- **Entidades**: Número total de entidades
- **Usuarios**: Número total de usuarios registrados
- **Módulos**: Número de módulos disponibles
- **Usuarios Activos**: Número de usuarios activos

## 🛠️ Comandos Útiles

```bash
# Ver datos en Prisma Studio
npm run db:studio

# Resetear base de datos y ejecutar seed
npm run db:reset

# Generar cliente de Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Ejecutar seed manualmente
npm run db:seed
```

## 🐛 Troubleshooting

### Error de Conexión a Base de Datos
1. (Histórico) Verificar que PostgreSQL esté ejecutándose
2. Verificar la URL de conexión en `.env.local`
3. Verificar que la base de datos exista

### Error de Permisos
1. Verificar que el usuario de la base de datos tenga permisos
2. Verificar que las tablas se hayan creado correctamente

### Error de Seed
1. Verificar que bcryptjs esté instalado
2. Verificar que las dependencias estén actualizadas
3. Ejecutar `npm run db:generate` antes del seed

## 📝 Notas Importantes

1. **Backup**: Siempre hacer backup antes de ejecutar migraciones
2. **Producción**: Cambiar las contraseñas por defecto en producción
3. **Seguridad**: Usar variables de entorno para datos sensibles
4. **Logs**: Revisar logs del servidor para debugging

## 🔄 Actualizaciones

Para actualizar el módulo:
1. Ejecutar `npm run db:migrate` para aplicar nuevas migraciones
2. Ejecutar `npm run db:seed` si hay nuevos datos de seed
3. Reiniciar el servidor de desarrollo

## 📞 Soporte

Para problemas o preguntas:
1. Revisar los logs del servidor
2. Verificar la configuración de la base de datos
3. Consultar la documentación de Prisma
4. Revisar los archivos de migración
