# Guía Paso a Paso: Prueba de Configuración

## 📋 Preparación

### Paso 1: Verificar que el servidor esté corriendo

1. Abre una terminal en la carpeta del proyecto
2. Ejecuta:
   ```bash
   npm run dev
   ```
3. Espera a que veas el mensaje: `Ready on http://localhost:9002`
4. ✅ Si ves este mensaje, el servidor está corriendo correctamente

---

## 🔍 Paso 2: Verificar Conexión a PostgreSQL

### Opción A: Usando la página de prueba rápida

1. Abre tu navegador y ve a: `http://localhost:9002/test-config`
2. En la sección "1. Prueba de Conexión a Base de Datos"
3. Haz clic en el botón **"Probar Conexión"**
4. **Resultado esperado:**
   - ✅ Si funciona: Verás un mensaje verde "✅ Conexión a la base de datos exitosa"
   - ❌ Si falla: Verás un mensaje rojo con el error

### Opción B: Usando la página de diagnóstico

1. Ve a: `http://localhost:9002/test-connection`
2. Esta página mostrará información detallada sobre la conexión

### Opción C: Verificar manualmente

Si las opciones anteriores fallan, verifica:

1. **PostgreSQL está corriendo:**
   - Abre el Administrador de Tareas (Ctrl+Shift+Esc)
   - Busca `postgres.exe` o `postgresql` en los procesos
   - Si no está, inicia el servicio de PostgreSQL

2. **Credenciales correctas:**
   - Abre `.env.local` en la raíz del proyecto
   - Verifica que `DATABASE_URL` tenga la contraseña correcta
   - La contraseña debe estar codificada (ej: `JR2026@@` → `JR2026%40%40`)

---

## 💾 Paso 3: Probar Guardar Configuración

1. En la página `http://localhost:9002/test-config`
2. Ve a la sección **"2. Guardar Configuración"**
3. Deja los valores por defecto o cambia:
   - **Clave:** `test.configuracion`
   - **Valor:** `valor de prueba`
4. Haz clic en **"Guardar en Base de Datos"**
5. **Resultado esperado:**
   - ✅ Verás un mensaje verde "✅ Configuración guardada correctamente"
   - Aparecerá un cuadro verde mostrando los datos guardados

---

## 📥 Paso 4: Probar Cargar Configuración

1. En la misma página `http://localhost:9002/test-config`
2. Ve a la sección **"3. Cargar Configuración"**
3. Asegúrate de que la clave sea `test.configuracion` (la misma que guardaste)
4. Haz clic en **"Cargar desde Base de Datos"**
5. **Resultado esperado:**
   - ✅ Verás un mensaje verde "✅ Configuración cargada correctamente"
   - El campo "Valor Cargado" mostrará el valor que guardaste anteriormente

---

## ⚙️ Paso 5: Probar Configuración General Completa

1. Ve a: `http://localhost:9002/admin/configuracion`
2. Espera a que cargue (verás "Cargando configuración desde la base de datos...")
3. Completa algunos campos, por ejemplo:
   - **Nombre del Sistema:** `AsisMediCare Test`
   - **Idioma por Defecto:** `es`
   - **Zona Horaria:** `America/Bogota`
4. Haz clic en **"Guardar Configuración"** (botón en la parte superior)
5. **Resultado esperado:**
   - ✅ Verás un mensaje verde "Configuración guardada correctamente en la base de datos"
6. **Recarga la página** (F5)
7. **Verifica:** Los valores que guardaste deben aparecer en los campos

---

## 🖥️ Paso 6: Verificar en Prisma Studio

1. Abre una nueva terminal (mantén el servidor corriendo)
2. Ejecuta:
   ```bash
   npm run db:studio
   ```
3. Se abrirá Prisma Studio en tu navegador (normalmente `http://localhost:5555`)
4. En el menú lateral, busca y haz clic en **`SystemConfiguration`**
5. **Deberías ver:**
   - Las configuraciones que guardaste en los pasos anteriores
   - Cada configuración tiene: `key`, `category`, `value`, `description`
6. Puedes hacer clic en cualquier registro para ver los detalles

---

## 🔧 Paso 7: Probar Configuración del Sistema

1. Ve a: `http://localhost:9002/configuracion/sistema`
2. Espera a que cargue la configuración
3. Modifica algunos valores, por ejemplo:
   - **Puerto del Servidor:** `9002`
   - **Host de Base de Datos:** `localhost`
   - **Puerto de Base de Datos:** `5432`
4. Haz clic en **"Guardar Configuración"**
5. **Recarga la página** y verifica que los valores persistan

---

## ✅ Checklist de Verificación

Marca cada paso cuando lo completes:

- [ ] Servidor de desarrollo corriendo (`npm run dev`)
- [ ] Conexión a PostgreSQL exitosa (Paso 2)
- [ ] Guardar configuración de prueba funciona (Paso 3)
- [ ] Cargar configuración de prueba funciona (Paso 4)
- [ ] Configuración general guarda y carga correctamente (Paso 5)
- [ ] Puedo ver los datos en Prisma Studio (Paso 6)
- [ ] Configuración del sistema funciona (Paso 7)

---

## 🐛 Solución de Problemas

### Si la conexión falla:

1. **Verifica PostgreSQL:**
   ```bash
   # En PowerShell, verifica si PostgreSQL está corriendo
   Get-Service -Name "*postgres*"
   ```

2. **Prueba conectarte manualmente:**
   - Abre pgAdmin o una terminal de PostgreSQL
   - Intenta conectarte con usuario `postgres` y contraseña `JR2026@@`

3. **Verifica la base de datos existe:**
   ```sql
   -- En PostgreSQL, ejecuta:
   SELECT datname FROM pg_database WHERE datname = 'asis_medical';
   ```

### Si el guardado falla:

1. Revisa la consola del servidor (donde corre `npm run dev`)
2. Busca mensajes de error en rojo
3. Verifica que la tabla `system_configurations` exista:
   ```bash
   npm run db:studio
   ```
   Y busca la tabla en el menú lateral

### Si los datos no persisten:

1. Verifica que estés guardando correctamente (debe aparecer mensaje de éxito)
2. Revisa Prisma Studio para confirmar que los datos se guardaron
3. Verifica que estés cargando la misma categoría que guardaste

---

## 📝 Notas Importantes

- **Cada configuración se guarda con un prefijo:** 
  - Configuración general: `general.nombreCampo`
  - Configuración del sistema: `sistema.nombreCampo`
  
- **Las configuraciones se organizan por categoría:**
  - `general` - Configuración general
  - `sistema` - Configuración del sistema
  - `test` - Configuraciones de prueba

- **Los valores se guardan como JSON:**
  - Pueden ser strings, números, booleanos u objetos complejos

---

## 🎯 Siguiente Paso

Una vez que hayas completado todos los pasos y verificado que todo funciona:

1. Puedes empezar a usar los formularios de configuración normalmente
2. Todos los datos se guardarán automáticamente en PostgreSQL
3. Los datos persistirán entre reinicios del servidor

¿Necesitas ayuda con algún paso específico? ¡Avísame!
