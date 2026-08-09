# Solución para Error 28P01: Fallo de Autenticación PostgreSQL

## 🔴 ¿Qué significa el error 28P01?

El código `28P01` es un error específico de PostgreSQL que significa **"authentication failed"** (fallo de autenticación). Esto indica que:

- La contraseña es incorrecta
- El usuario no existe
- El usuario no tiene permisos para conectarse desde localhost

---

## ✅ Solución Paso a Paso

### Paso 1: Verificar que PostgreSQL esté corriendo

1. Abre el **Administrador de Tareas** (Ctrl+Shift+Esc)
2. Busca procesos que contengan `postgres` o `postgresql`
3. Si no aparece, inicia el servicio:
   - Presiona `Win+R`, escribe `services.msc` y presiona Enter
   - Busca "PostgreSQL" en la lista
   - Haz clic derecho → **Iniciar**

---

### Paso 2: Verificar las credenciales manualmente

Abre **pgAdmin** o una terminal de PostgreSQL y prueba conectarte:

#### Opción A: Usando pgAdmin

1. Abre pgAdmin
2. Crea una nueva conexión:
   - **Nombre:** Test Connection
   - **Host:** localhost
   - **Puerto:** 5432
   - **Usuario:** postgres
   - **Contraseña:** `JR2026@@` (sin codificar)
3. Haz clic en "Guardar" y luego "Conectar"
4. Si falla, la contraseña es incorrecta

#### Opción B: Usando psql (línea de comandos)

Abre PowerShell y ejecuta:

```powershell
# Intenta conectarte directamente
psql -U postgres -h localhost -p 5432 -d postgres
```

Cuando te pida la contraseña, escribe: `JR2026@@`

Si falla, necesitas cambiar la contraseña.

---

### Paso 3: Cambiar la contraseña de PostgreSQL (si es necesario)

Si las credenciales son incorrectas, puedes cambiar la contraseña:

#### Método 1: Usando psql como administrador

1. Abre PowerShell como **Administrador**
2. Ejecuta:

```powershell
# Conectarte como superusuario (puede que no pida contraseña)
psql -U postgres

# Una vez dentro de psql, ejecuta:
ALTER USER postgres WITH PASSWORD 'JR2026@@';

# Salir
\q
```

#### Método 2: Usando pgAdmin

1. Abre pgAdmin
2. Conéctate al servidor (si puedes)
3. Expande: **Servidores** → **PostgreSQL** → **Login/Group Roles**
4. Haz clic derecho en `postgres` → **Properties**
5. Ve a la pestaña **Definition**
6. Cambia la contraseña a `JR2026@@`
7. Guarda

---

### Paso 4: Verificar que la base de datos existe

Si la autenticación funciona pero la base de datos no existe:

```powershell
# Conectarte a PostgreSQL
psql -U postgres -h localhost -p 5432

# Crear la base de datos
CREATE DATABASE asis_medical;

# Verificar que se creó
\l

# Salir
\q
```

---

### Paso 5: Verificar el archivo .env.local

Abre `.env.local` y verifica que tenga exactamente:

```env
DATABASE_URL=postgresql://postgres:JR2026%40%40@localhost:5432/asis_medical
```

**Importante:**
- `JR2026%40%40` es la contraseña codificada (donde `%40` = `@`)
- Si cambiaste la contraseña, actualiza esta línea
- No debe haber espacios antes o después del `=`

---

### Paso 6: Reiniciar el servidor de desarrollo

Después de cambiar la contraseña o crear la base de datos:

1. Detén el servidor (Ctrl+C en la terminal donde corre `npm run dev`)
2. Espera unos segundos
3. Inicia de nuevo: `npm run dev`
4. Prueba la conexión en: `http://localhost:9002/test-config`

---

## 🔍 Verificación Rápida

Ejecuta estos comandos en PowerShell para diagnosticar:

```powershell
# 1. Verificar que PostgreSQL está corriendo
Get-Service | Where-Object {$_.Name -like "*postgres*"}

# 2. Intentar conectarte directamente
psql -U postgres -h localhost -p 5432 -d postgres

# 3. Verificar que la base de datos existe
psql -U postgres -h localhost -p 5432 -c "\l" | Select-String "asis_medical"
```

---

## 📝 Notas Importantes

1. **La contraseña en `.env.local` debe estar codificada:**
   - `@` → `%40`
   - `#` → `%23`
   - ` ` (espacio) → `%20`

2. **Si usas una contraseña diferente**, actualiza `.env.local` con la nueva contraseña codificada.

3. **PostgreSQL puede tener múltiples usuarios.** Asegúrate de usar el usuario correcto (normalmente `postgres`).

---

## 🆘 Si Nada Funciona

Si después de seguir estos pasos sigue fallando:

1. **Verifica los logs de PostgreSQL:**
   - Ubicación típica: `C:\Program Files\PostgreSQL\[versión]\data\log\`
   - Busca errores relacionados con autenticación

2. **Verifica el archivo `pg_hba.conf`:**
   - Ubicación: `C:\Program Files\PostgreSQL\[versión]\data\pg_hba.conf`
   - Debe tener una línea como:
     ```
     host    all             all             127.0.0.1/32            md5
     ```

3. **Reinicia el servicio de PostgreSQL:**
   ```powershell
   Restart-Service postgresql*
   ```

---

¿Necesitas ayuda con algún paso específico? ¡Avísame!
