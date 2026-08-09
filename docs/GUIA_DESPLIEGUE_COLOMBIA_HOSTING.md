# 🚀 Guía de Despliegue en Colombia Hosting

Esta guía te llevará paso a paso para subir tu aplicación AppAsisMedical a Colombia Hosting.

## 📋 Índice

1. [Preparación Local](#1-preparación-local)
2. [Preparar Archivos para Subir](#2-preparar-archivos-para-subir)
3. [Configuración en el Servidor](#3-configuración-en-el-servidor)
4. [Base de Datos](#4-base-de-datos)
5. [Despliegue](#5-despliegue)
6. [Verificación](#6-verificación)
7. [Solución de Problemas](#7-solución-de-problemas)

---

## 1. Preparación Local

### Paso 1.1: Limpiar la Base de Datos Local (Opcional)

Si quieres empezar limpio en producción:

```bash
# Hacer backup primero (IMPORTANTE)
pg_dump -h localhost -U postgres -d asis_medical > backup_local.sql

# Limpiar base de datos (solo superusuario)
npm run db:clean
```

### Paso 1.2: Verificar que el Proyecto Funciona

```bash
# Instalar dependencias
npm install

# Generar cliente de Prisma
npm run db:generate

# Construir para producción (prueba local)
npm run build

# Probar que funciona
npm start
```

Si todo funciona correctamente, continúa.

---

## 2. Preparar Archivos para Subir

### Paso 2.1: Crear Lista de Archivos a Subir

**✅ INCLUIR estos archivos y carpetas:**

```
AppAsisMedical/
├── app/                    # ✅ Toda la carpeta
├── components/             # ✅ Toda la carpeta
├── lib/                    # ✅ Toda la carpeta
├── hooks/                  # ✅ Toda la carpeta
├── styles/                 # ✅ Toda la carpeta
├── prisma/                 # ✅ Toda la carpeta (schema.prisma y seed.ts)
├── scripts/                # ✅ Toda la carpeta
├── public/                 # ✅ Si existe
├── package.json            # ✅
├── package-lock.json       # ✅
├── tsconfig.json           # ✅
├── next.config.ts          # ✅
├── tailwind.config.ts      # ✅
├── postcss.config.mjs      # ✅
├── middleware.ts           # ✅
├── .eslintrc.json          # ✅
├── .gitignore              # ✅
├── .nvmrc                  # ✅ Versión de Node.js
└── README.md               # ✅ Opcional
```

**❌ NO INCLUIR:**

```
├── .env                    # ❌ Variables de entorno locales
├── .env.local              # ❌ Variables de entorno locales
├── .next/                  # ❌ Se regenera en el servidor
├── node_modules/           # ❌ Se instala en el servidor
├── .git/                   # ❌ Historial de Git
├── test/                   # ❌ Tests (opcional)
├── .github/                 # ❌ CI/CD (opcional)
└── *.log                   # ❌ Archivos de log
```

### Paso 2.2: Crear Archivo ZIP (Opcional)

Si prefieres subir por FTP/SFTP:

```bash
# En PowerShell (Windows)
Compress-Archive -Path app,components,lib,hooks,styles,prisma,scripts,package.json,package-lock.json,tsconfig.json,next.config.ts,tailwind.config.ts,postcss.config.mjs,middleware.ts,.eslintrc.json,.gitignore,.nvmrc -DestinationPath AppAsisMedical-production.zip -Force
```

O manualmente:
1. Selecciona todas las carpetas y archivos mencionados arriba
2. Crea un ZIP excluyendo `.env`, `.next`, `node_modules`, etc.

---

## 3. Configuración en el Servidor

### Paso 3.1: Acceder al Servidor

**Opción A: cPanel (más común en Colombia Hosting)**
1. Accede a `https://tu-dominio.com/cpanel`
2. Usa File Manager o Terminal

**Opción B: SSH**
```bash
ssh usuario@tu-servidor.com
```

### Paso 3.2: Verificar Node.js y npm

```bash
# Verificar versión de Node.js (debe ser >= 18.18)
node --version

# Verificar npm
npm --version

# Si no está instalado o es versión incorrecta, contacta al soporte
```

### Paso 3.3: Crear Directorio del Proyecto

```bash
# Navegar al directorio público (normalmente public_html o www)
cd ~/public_html

# O crear un subdirectorio para la app
mkdir asismedicare
cd asismedicare
```

---

## 4. Base de Datos

### Paso 4.1: Crear Base de Datos PostgreSQL

**En cPanel:**
1. Ve a **PostgreSQL Databases** o **Bases de Datos PostgreSQL**
2. Crea una nueva base de datos (ej: `asismed_db`)
3. Crea un usuario (ej: `asismed_user`)
4. Asigna el usuario a la base de datos
5. **Anota las credenciales:**
   - Host: `localhost` (o el que te den)
   - Puerto: `5432` (o el que te den)
   - Base de datos: `asismed_db`
   - Usuario: `asismed_user`
   - Contraseña: `[la que creaste]`

**Por SSH (si tienes acceso):**
```bash
# Conectarte a PostgreSQL
sudo -u postgres psql

# Crear base de datos
CREATE DATABASE asismed_db;

# Crear usuario
CREATE USER asismed_user WITH PASSWORD 'tu_contraseña_segura';

# Dar permisos
GRANT ALL PRIVILEGES ON DATABASE asismed_db TO asismed_user;

# Salir
\q
```

### Paso 4.2: Construir la URL de Conexión

La URL debe tener este formato:

```
postgresql://usuario:contraseña@host:puerto/nombre_bd
```

**Ejemplo:**
```
postgresql://asismed_user:MiPassword123@localhost:5432/asismed_db
```

**⚠️ IMPORTANTE:** Si la contraseña tiene caracteres especiales, codifícalos:
- `@` → `%40`
- `#` → `%23`
- ` ` (espacio) → `%20`
- `&` → `%26`

**Ejemplo con contraseña `P@ss#123`:**
```
postgresql://asismed_user:P%40ss%23123@localhost:5432/asismed_db
```

---

## 5. Despliegue

### Paso 5.1: Subir Archivos al Servidor

**Opción A: cPanel File Manager**
1. Ve a **File Manager**
2. Navega a `public_html/asismedicare` (o donde quieras)
3. Sube el ZIP y extráelo, o sube las carpetas directamente

**Opción B: FTP/SFTP**
```bash
# Usando FileZilla o similar
# Sube todas las carpetas y archivos mencionados en el Paso 2.1
```

**Opción C: Git (si está configurado)**
```bash
cd ~/public_html/asismedicare
git clone tu-repositorio .
```

### Paso 5.2: Instalar Dependencias

```bash
# Navegar al directorio del proyecto
cd ~/public_html/asismedicare

# Instalar dependencias de producción
npm install --production

# O instalar todas (incluyendo devDependencies)
npm install
```

### Paso 5.3: Configurar Variables de Entorno

Crea un archivo `.env` o `.env.production` en el servidor:

```bash
nano .env
```

O usa el editor de archivos en cPanel.

**Contenido del archivo `.env`:**

```env
# Base de Datos (USA LA URL QUE CONSTRUISTE EN EL PASO 4.2)
DATABASE_URL="postgresql://asismed_user:MiPassword123@localhost:5432/asismed_db"

# NextAuth - CAMBIA ESTOS VALORES
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="genera-un-secret-aleatorio-minimo-32-caracteres-aqui"

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

# Admin (opcional, se puede crear después)
ADMIN_EMAIL="admin@tu-dominio.com"
ADMIN_PASSWORD="cambiar-en-produccion"
ADMIN_NAME="Administrador"
```

**Generar NEXTAUTH_SECRET:**
```bash
# En el servidor, ejecuta:
openssl rand -base64 32
# Copia el resultado y úsalo como NEXTAUTH_SECRET
```

### Paso 5.4: Generar Cliente de Prisma

```bash
npm run db:generate
```

### Paso 5.5: Ejecutar Migraciones de Base de Datos

```bash
# Opción 1: Migraciones (si tienes migraciones)
npx prisma migrate deploy

# Opción 2: Push del schema (si es primera vez)
npx prisma db push
```

### Paso 5.6: Crear el Superusuario

```bash
# Opción 1: Usar el seed
npm run db:seed

# Opción 2: Usar el script
node scripts/create-admin-user.js
```

**Credenciales por defecto:**
- Email: `admin@asismedicare.com` (o el de `ADMIN_EMAIL`)
- Contraseña: `admin123` (o la de `ADMIN_PASSWORD`)

**⚠️ CAMBIA LA CONTRASEÑA INMEDIATAMENTE después del primer login.**

### Paso 5.7: Construir la Aplicación

```bash
npm run build
```

Esto creará la carpeta `.next/` con la aplicación compilada.

### Paso 5.8: Configurar el Servidor Web

**Opción A: Node.js con PM2 (Recomendado)**

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la aplicación
pm2 start npm --name "asismedicare" -- start

# Guardar configuración para que inicie al reiniciar
pm2 save
pm2 startup
```

**Opción B: Usar el proceso de Node.js directamente**

```bash
npm start
```

**Opción C: Configurar con cPanel Node.js Selector**

1. Ve a **Node.js Selector** en cPanel
2. Crea una nueva aplicación
3. Versión de Node.js: `18.x` o `20.x`
4. Directorio: `asismedicare`
5. Archivo de inicio: `server.js` (si existe) o configura el comando
6. Comando: `npm start`
7. Puerto: `9002` (o el que uses)

### Paso 5.9: Configurar Proxy Reverso (si es necesario)

Si tu hosting usa Apache/Nginx y necesitas que funcione en el puerto 80/443:

**En cPanel, crear archivo `.htaccess`:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^(.*)$ http://localhost:9002/$1 [P,L]
</IfModule>
```

O configura un proxy reverso en Nginx (si tienes acceso).

---

## 6. Verificación

### Paso 6.1: Verificar que la Aplicación Inicia

```bash
# Ver logs de PM2
pm2 logs asismedicare

# O ver logs directamente
npm start
# Debe mostrar: "Ready on http://localhost:9002"
```

### Paso 6.2: Probar el Acceso Web

1. Abre tu navegador
2. Ve a `https://tu-dominio.com` (o `http://tu-dominio.com:9002`)
3. Debe cargar la página de login

### Paso 6.3: Probar Login

1. Usa las credenciales del superusuario
2. Debe iniciar sesión correctamente
3. Verifica que puedes navegar por la aplicación

### Paso 6.4: Verificar Base de Datos

En la aplicación, verifica que:
- Los datos se guardan correctamente
- Las consultas funcionan
- No hay errores de conexión

---

## 7. Solución de Problemas

### Error: "Cannot find module '@prisma/client'"

```bash
npm run db:generate
npm install
```

### Error: "DATABASE_URL no está definida"

Verifica que el archivo `.env` existe y tiene `DATABASE_URL` correctamente configurada.

### Error: "Connection refused" o "28P01"

1. Verifica que PostgreSQL está corriendo
2. Verifica las credenciales en `.env`
3. Verifica que el host y puerto son correctos
4. Verifica que el usuario tiene permisos en la base de datos

### Error: "Port 9002 already in use"

```bash
# Ver qué proceso usa el puerto
lsof -i :9002

# O cambiar el puerto en package.json y .env
```

### La aplicación no carga en el navegador

1. Verifica que el proceso está corriendo: `pm2 list` o `ps aux | grep node`
2. Verifica los logs: `pm2 logs` o `npm start`
3. Verifica el firewall del servidor
4. Verifica la configuración del proxy reverso

### Error: "Module not found"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
npm run build
```

### La aplicación funciona pero es lenta

1. Verifica que estás usando `npm run build` (no `npm run dev`)
2. Verifica que `NODE_ENV=production`
3. Considera usar un CDN para archivos estáticos
4. Optimiza las imágenes

---

## 📞 Soporte Adicional

Si tienes problemas específicos con Colombia Hosting:

1. **Revisa los logs:**
   ```bash
   pm2 logs asismedicare --lines 100
   ```

2. **Verifica la configuración:**
   - Variables de entorno
   - Conexión a base de datos
   - Permisos de archivos

3. **Contacta al soporte de Colombia Hosting** con:
   - Versión de Node.js disponible
   - Versión de PostgreSQL disponible
   - Si tienen PM2 instalado
   - Configuración de proxy reverso

---

## ✅ Checklist Final

Antes de considerar el despliegue completo:

- [ ] ✅ Base de datos creada y migraciones ejecutadas
- [ ] ✅ Superusuario creado
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Aplicación construida (`npm run build`)
- [ ] ✅ Aplicación iniciada y corriendo
- [ ] ✅ Acceso web funcionando
- [ ] ✅ Login funciona correctamente
- [ ] ✅ Base de datos funciona (crear/leer datos)
- [ ] ✅ SSL/HTTPS configurado (recomendado)
- [ ] ✅ Contraseñas cambiadas de las por defecto
- [ ] ✅ Backup de base de datos configurado

---

¡Felicitaciones! Tu aplicación debería estar funcionando en producción. 🎉
