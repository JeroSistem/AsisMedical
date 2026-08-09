# Guía de Limpieza del Proyecto para Hosting

Esta guía explica cómo limpiar el proyecto antes de subirlo al hosting en Colombia, dejando solo el superusuario y datos en cero.

## 🧹 Limpieza de Base de Datos

### Opción 1: Script de Limpieza (Recomendado)

Ejecuta el script de limpieza que elimina todos los datos excepto el superusuario:

```bash
npm run db:clean
```

O directamente:

```bash
node scripts/clean-database.js
```

**¿Qué hace este script?**
- ✅ Conserva el superusuario (SUPER_ADMIN)
- 🗑️ Elimina todos los pacientes
- 🗑️ Elimina todas las historias clínicas
- 🗑️ Elimina todos los diagnósticos y tratamientos
- 🗑️ Elimina todas las citas y admisiones
- 🗑️ Elimina todos los registros de triage
- 🗑️ Elimina todos los usuarios excepto el superusuario
- 🗑️ Elimina todas las entidades (excepto la del superusuario si existe)
- 🗑️ Elimina todas las configuraciones del sistema
- 🗑️ Elimina todos los módulos y permisos

### Opción 2: Reset Completo + Seed

Si prefieres empezar desde cero:

```bash
# Reset completo de la base de datos (CUIDADO: elimina TODO)
npm run db:reset

# Luego crear solo el superusuario
npm run db:seed
```

### Opción 3: Reset Manual con Prisma Studio

1. Abre Prisma Studio: `npm run db:studio`
2. Elimina manualmente los registros en orden inverso a las relaciones
3. Conserva solo el superusuario

## 👤 Crear/Verificar Superusuario

### Verificar si existe un superusuario

El script de limpieza mostrará si encuentra un superusuario. Si no existe, puedes crearlo:

### Opción 1: Usar el Seed

```bash
npm run db:seed
```

Esto creará un superusuario con:
- **Email**: `admin@asismedicare.com` (o el valor de `ADMIN_EMAIL` en `.env`)
- **Contraseña**: `admin123` (o el valor de `ADMIN_PASSWORD` en `.env`)
- **Nombre**: `Administrador` (o el valor de `ADMIN_NAME` en `.env`)

### Opción 2: Script Específico

```bash
npm run db:create-admin
```

O directamente:

```bash
node scripts/create-admin-user.js
```

## 📋 Checklist de Limpieza

Antes de subir al hosting, verifica:

- [ ] ✅ Base de datos limpia (solo superusuario)
- [ ] ✅ Variables de entorno configuradas para producción
- [ ] ✅ Contraseñas cambiadas (no usar las de desarrollo)
- [ ] ✅ `.env` y `.env.local` NO incluidos en el despliegue
- [ ] ✅ Build de producción generado (`npm run build`)
- [ ] ✅ Migraciones de base de datos ejecutadas
- [ ] ✅ Superusuario creado y probado
- [ ] ✅ Logs revisados sin errores críticos

## 🔐 Configuración del Superusuario en Producción

**IMPORTANTE**: Cambia las credenciales por defecto en producción.

### Variables de Entorno Recomendadas

En el archivo `.env` del servidor:

```env
ADMIN_EMAIL="admin@tu-dominio.com"
ADMIN_PASSWORD="contraseña-segura-minimo-12-caracteres"
ADMIN_NAME="Administrador Principal"
```

Luego ejecuta:

```bash
npm run db:seed
```

O:

```bash
node scripts/create-admin-user.js
```

## 🗄️ Backup Antes de Limpiar

**SIEMPRE** haz un backup antes de limpiar:

```bash
# PostgreSQL
pg_dump -h localhost -U usuario -d nombre_bd > backup_antes_limpieza.sql

# O con Prisma
npx prisma db pull --schema=prisma/schema.prisma
```

## 🚀 Proceso Completo de Preparación

1. **Backup de la base de datos actual**
   ```bash
   pg_dump -h localhost -U usuario -d nombre_bd > backup.sql
   ```

2. **Limpiar la base de datos**
   ```bash
   npm run db:clean
   ```

3. **Verificar que solo existe el superusuario**
   ```bash
   npm run db:studio
   # Revisar que solo hay un usuario con rol SUPER_ADMIN
   ```

4. **Crear/Actualizar superusuario si es necesario**
   ```bash
   npm run db:seed
   ```

5. **Probar login con el superusuario**
   - Acceder a la aplicación
   - Login con las credenciales del superusuario
   - Verificar que funciona correctamente

6. **Preparar archivos para hosting**
   - Ver `docs/ARCHIVOS_HOSTING.md` para la lista completa

## ⚠️ Advertencias

- ⚠️ **El script de limpieza es IRREVERSIBLE**. Asegúrate de tener backup.
- ⚠️ **No ejecutes en producción sin backup**.
- ⚠️ **Verifica las credenciales del superusuario** antes de limpiar.
- ⚠️ **En producción, cambia todas las contraseñas por defecto**.

## 📞 Soporte

Si tienes problemas:
1. Verifica los logs del script
2. Revisa la conexión a la base de datos
3. Verifica que las variables de entorno estén configuradas
4. Consulta `docs/ARCHIVOS_HOSTING.md` para más detalles
