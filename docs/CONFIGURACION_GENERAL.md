# Módulo de Configuración General

## Descripción

El módulo de **Configuración General** es el centro de control principal de toda la aplicación AsisMediCare. Desde este módulo se gestiona toda la configuración del sistema, usuarios, entidades y permisos.

## Funcionalidades Principales

### 🏢 Gestión de Entidades
- **Crear nuevas entidades** (hospitales, clínicas, centros médicos, laboratorios)
- **Configurar usuario administrador principal** para cada entidad
- **Habilitar/deshabilitar módulos** específicos por entidad
- **Gestionar estado** de las entidades (activo, inactivo, pendiente)

### 👥 Gestión de Usuarios
- **Crear usuarios** con diferentes roles (Super Admin, Entity Admin, User)
- **Asignar permisos granulares** por módulo y funcionalidad
- **Gestionar acceso** a entidades específicas
- **Configurar contraseñas** y seguridad

### ⚙️ Configuración de Módulos
- **Habilitar/deshabilitar módulos** del sistema
- **Configurar permisos** específicos por módulo
- **Ajustar parámetros** avanzados de cada módulo
- **Gestionar configuraciones** específicas

### 📊 Monitoreo del Sistema
- **Estado en tiempo real** del sistema
- **Estadísticas de uso** de recursos
- **Información de usuarios** activos
- **Métricas de rendimiento**

## Estructura de Roles

### Super Administrador
- Acceso completo a todo el sistema
- Puede crear y gestionar entidades
- Puede crear usuarios con cualquier rol
- Acceso a todas las configuraciones

### Administrador de Entidad
- Gestiona una entidad específica
- Puede crear usuarios para su entidad
- Acceso a módulos habilitados para su entidad
- Configuración limitada a su entidad

### Usuario
- Acceso limitado según permisos asignados
- Solo puede ver y usar módulos autorizados
- Sin acceso a configuraciones del sistema

## Módulos Disponibles

| Módulo | Descripción | Permisos |
|--------|-------------|----------|
| **Historias Clínicas** | Gestión de historias clínicas | Leer, Escribir, Eliminar, Exportar, Imprimir |
| **Triage** | Sistema de clasificación de urgencias | Leer, Escribir, Asignar, Priorizar |
| **Asistencial** | Gestión de servicios asistenciales | Leer, Escribir, Programar, Cancelar |
| **Laboratorio** | Gestión de pruebas de laboratorio | Leer, Escribir, Resultados, Aprobar |
| **Imágenes Diagnósticas** | Gestión de imágenes médicas | Leer, Escribir, Análisis |
| **Farmacia** | Gestión de medicamentos | Leer, Escribir, Inventario |
| **Facturación** | Gestión de facturación | Leer, Escribir, Aprobar |
| **Inventario** | Control de inventario | Leer, Escribir, Stock |
| **Auditoría** | Sistema de auditoría | Leer, Escribir, Reportes |
| **Contabilidad** | Gestión contable | Leer, Escribir, Reportes |
| **Presupuesto** | Gestión presupuestaria | Leer, Escribir, Aprobar |
| **Nómina** | Gestión de nómina | Leer, Escribir, Pagos |
| **Cartera** | Gestión de cartera | Leer, Escribir, Cobros |

## Tipos de Entidades

### Hospital
- Entidad médica completa con múltiples especialidades
- Acceso a todos los módulos principales
- Capacidad de gestión de múltiples usuarios

### Clínica
- Entidad médica especializada
- Módulos limitados según especialidad
- Gestión de usuarios especializados

### Centro Médico
- Entidad de atención primaria
- Módulos básicos de atención
- Gestión simplificada

### Laboratorio
- Entidad especializada en análisis
- Módulos de laboratorio y resultados
- Gestión de técnicos y especialistas

## Configuraciones Avanzadas

### Historias Clínicas
- **Auto-guardado**: Guardar automáticamente los cambios
- **Backup automático**: Crear copias de seguridad automáticas
- **Tamaño máximo de archivo**: Configurar límite de archivos adjuntos
- **Días de retención**: Configurar tiempo de conservación

### Triage
- **Asignación automática**: Asignar pacientes automáticamente
- **Tiempo máximo de espera**: Configurar límites de tiempo
- **Niveles de prioridad**: Personalizar niveles de urgencia

### Asistencial
- **Duración de cita**: Configurar tiempo por cita
- **Máximo citas por día**: Establecer límites de capacidad
- **Recordatorios**: Configurar notificaciones automáticas

### Laboratorio
- **Validación automática**: Validar resultados automáticamente
- **Notificación de resultados**: Alertar cuando estén listos
- **Período de retención**: Configurar conservación de resultados

## Seguridad

### Contraseñas
- Política de contraseñas seguras
- Cambio obligatorio en primer acceso
- Encriptación de contraseñas

### Sesiones
- Control de sesiones activas
- Timeout automático
- Registro de accesos

### Permisos
- Sistema granular de permisos
- Verificación en tiempo real
- Auditoría de accesos

## Backup y Recuperación

### Backup Automático
- Copias de seguridad diarias
- Almacenamiento seguro
- Verificación de integridad

### Recuperación
- Restauración rápida de datos
- Puntos de restauración
- Pruebas de recuperación

## Monitoreo

### Recursos del Sistema
- Uso de CPU en tiempo real
- Consumo de memoria
- Espacio de almacenamiento

### Actividad de Usuarios
- Usuarios activos
- Sesiones concurrentes
- Actividad por módulo

### Rendimiento
- Tiempo de respuesta
- Errores del sistema
- Métricas de uso

## API Endpoints

### Entidades
```
GET    /api/entities          # Listar entidades
POST   /api/entities          # Crear entidad
PUT    /api/entities/:id      # Actualizar entidad
DELETE /api/entities/:id      # Eliminar entidad
```

### Usuarios
```
GET    /api/users             # Listar usuarios
POST   /api/users             # Crear usuario
PUT    /api/users/:id         # Actualizar usuario
DELETE /api/users/:id         # Eliminar usuario
```

### Módulos
```
GET    /api/modules           # Listar módulos
PUT    /api/modules/:id       # Actualizar módulo
POST   /api/modules/:id/config # Configurar módulo
```

### Sistema
```
GET    /api/system/status     # Estado del sistema
GET    /api/system/stats      # Estadísticas
POST   /api/system/backup     # Crear backup
```

## Componentes

### EntityForm
Formulario para crear y editar entidades con:
- Información básica de la entidad
- Configuración del usuario administrador
- Selección de módulos habilitados

### UserForm
Formulario para gestionar usuarios con:
- Información personal del usuario
- Asignación de roles y entidades
- Configuración granular de permisos

### ModuleForm
Formulario para configurar módulos con:
- Estado del módulo
- Configuración de permisos
- Parámetros avanzados específicos

### SystemStatus
Componente de monitoreo con:
- Estado en tiempo real
- Estadísticas de recursos
- Información del sistema

## Uso

### Acceso
1. Navegar a **Configuración > General**
2. Seleccionar la pestaña deseada
3. Usar los botones de acción para gestionar elementos

### Crear Entidad
1. Hacer clic en **"Nueva Entidad"**
2. Completar información básica
3. Configurar usuario administrador
4. Seleccionar módulos habilitados
5. Guardar configuración

### Crear Usuario
1. Hacer clic en **"Nuevo Usuario"**
2. Completar información personal
3. Asignar rol y entidad
4. Configurar permisos específicos
5. Establecer contraseña
6. Guardar usuario

### Configurar Módulo
1. Hacer clic en **"Editar"** en el módulo deseado
2. Ajustar estado del módulo
3. Configurar permisos disponibles
4. Ajustar parámetros avanzados
5. Guardar configuración

## Consideraciones

### Rendimiento
- El sistema está optimizado para manejar múltiples entidades
- Las consultas están indexadas para mejor rendimiento
- Se implementa caché para operaciones frecuentes

### Escalabilidad
- Arquitectura preparada para crecimiento
- Separación clara de responsabilidades
- Sistema modular y extensible

### Mantenimiento
- Código documentado y estructurado
- Pruebas automatizadas implementadas
- Proceso de actualización simplificado

## Soporte

Para soporte técnico o consultas sobre el módulo de configuración general, contactar al equipo de desarrollo o consultar la documentación técnica adicional.
