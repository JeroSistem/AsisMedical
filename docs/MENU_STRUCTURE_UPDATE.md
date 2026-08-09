# Estructura de Menús Actualizada - AsisMediCare

## Resumen de Cambios

Se ha actualizado el sistema de navegación para incluir todos los módulos y submódulos solicitados, organizados en una estructura jerárquica clara y funcional.

## Módulos Principales Agregados

### 1. Facturación (💰)
**Descripción:** Gestión financiera y facturación completa del sistema médico.

#### Submódulos:
- **Administración:**
  - Facturación
  - Pacientes
  - Admisiones
  - Recibos de caja
  - Traslados
  - Homologaciones proc
  - Anexo técnico Inconsistencia base de datos
  - Anexo técnico Informe atención urgencia
  - Anexo técnico Autorizaciones
  - Resolución 202
  - Grupos etareos
  - Furips
  - Furtran
  - Anexo Técnico Uno

- **Informe:**
  - Listado Admisiones
  - Listado Consultas facturadas
  - Listado procedimientos facturados
  - Listado diagnósticos por grupos etareos
  - Listado anexos inconsistencia base de datos
  - Listado recibos de caja
  - Listado anexo informe atención urgencia
  - Listado furips
  - Listado resolución 202
  - Listado Estancias facturadas
  - Listado Medicamentos Facturados
  - Listado Materiales e insumos Facturados
  - Listado de Factura Electrónica
  - Listado Otros Conceptos Facturados

- **Proceso:**
  - Listado prefacturas
  - Listado facturas
  - Generar Factura
  - Interface Recibos de caja
  - Cuentas de cobro
  - Generar Rips
  - Administrar facturas
  - Radicación/Interface facturas
  - Notas crédito
  - Notas débito
  - Listado Facturas por CUPS
  - Reasignación Admisiones

### 2. Citas (🗓️)
**Descripción:** Gestión completa de citas médicas y consultorios.

#### Submódulos:
- **Gestión:**
  - Consultorios
  - Horarios citas
  - Asignar citas

- **Informe:**
  - Listado Citas
  - Citas Canceladas
  - Inasistentes

### 3. Laboratorio (🧪)
**Descripción:** Exámenes y resultados de laboratorio clínico.

#### Submódulos:
- **Gestión:**
  - Parametrizar laboratorio clínico
  - Resultados laboratorio clínico por paciente
  - Resultados laboratorio clínico por procedimiento

- **Informe:**
  - Listado Exámenes Laboratorio

### 4. Calidad (⭐)
**Descripción:** Gestión de calidad y satisfacción del paciente.

#### Submódulos:
- **Gestión:**
  - Encuesta satisfacción
  - Eventos adversos
  - Parametrización producción (2193)
  - Mensaje difusión (demanda inducida)

### 5. Contabilidad (📈)
**Descripción:** Gestión contable, financiera y tesorería.

#### Submódulos:
- **Gestión:**
  - Cargue de Saldos Iniciales
  - Plan de Cuentas
  - Documentos de Contabilidad
  - Terceros
  - Retenciones
  - Comprobantes de Contabilidad
  - Factura de Venta
  - Factura de Compra
  - Bancos
  - Cuentas Bancarias
  - Tesorería
  - Viáticos
  - Asiento de cierre
  - Deterioro de Cartera
  - Reasignación
  - Documento Soporte

- **Informe:**
  - Listado Retenciones
  - Listado Documentos Descargados
  - Seguimiento de Cartera
  - Listado Comprobantes de Contabilidad
  - Listado auxiliares de contabilidad
  - Informe circular 030
  - Balance general
  - Estado de resultados
  - Libro mayor
  - Hoja de trabajo y balance
  - Listado Terceros

### 6. Presupuesto (📋)
**Descripción:** Gestión presupuestaria y ejecución financiera.

#### Submódulos:
- **Gestión:**
  - Terceros
  - Vigencias
  - Rubros presupuestales
  - Movimiento presupuestal
  - Certificado Disponibilidad
  - Certificado de registro presupuestal
  - Orden de pago
  - Ingresos/pagos
  - Liberación Presupuestal

- **Informe:**
  - Listado de auxiliares de presupuesto
  - Ejecución Presupuestal
  - Listado Auxiliar Por Tipo Documento
  - Seguimiento de presupuesto
  - Listado CDP
  - CRP
  - Libro Pagos

### 7. Nómina (👥)
**Descripción:** Gestión de recursos humanos y liquidación de nómina.

#### Submódulos:
- **Gestión:**
  - Empleados
  - Cargos
  - Departamentos
  - Subdepartamentos
  - Contratos

- **Proceso:**
  - Liquidación
  - Configuración Conceptos

### 8. Admisiones (🏥)
**Descripción:** Gestión de admisiones de pacientes.

### 9. Farmacia (💊)
**Descripción:** Gestión de medicamentos y dispensación.

## Estructura de Permisos

### Roles de Usuario:
- **Administrador:** Acceso completo a todos los módulos
- **Médico:** Acceso a módulos clínicos y asistenciales
- **Enfermero:** Acceso a módulos clínicos y asistenciales
- **Usuario:** Acceso limitado según configuración

### Permisos por Módulo:

#### Facturación
- **Administrador:** Acceso completo
- **Médico:** Sin acceso
- **Enfermero:** Sin acceso

#### Citas
- **Administrador:** Acceso completo
- **Médico:** Acceso completo
- **Enfermero:** Acceso completo

#### Laboratorio
- **Administrador:** Acceso completo
- **Médico:** Acceso completo
- **Enfermero:** Acceso completo

#### Calidad
- **Administrador:** Acceso completo
- **Médico:** Sin acceso
- **Enfermero:** Sin acceso

#### Contabilidad
- **Administrador:** Acceso completo
- **Médico:** Sin acceso
- **Enfermero:** Sin acceso

#### Presupuesto
- **Administrador:** Acceso completo
- **Médico:** Sin acceso
- **Enfermero:** Sin acceso

#### Nómina
- **Administrador:** Acceso completo
- **Médico:** Sin acceso
- **Enfermero:** Sin acceso

#### Historias Clínicas
- **Administrador:** Acceso completo
- **Médico:** Acceso completo
- **Enfermero:** Acceso completo

#### Triage
- **Administrador:** Acceso completo
- **Médico:** Acceso completo
- **Enfermero:** Acceso completo

#### Asistencial
- **Administrador:** Acceso completo
- **Médico:** Acceso completo
- **Enfermero:** Acceso completo

## Rutas Implementadas

### Facturación
```
/facturacion/administracion/*
/facturacion/informe/*
/facturacion/proceso/*
```

### Citas
```
/citas/consultorios
/citas/horarios
/citas/asignar
/citas/informe/*
```

### Laboratorio
```
/laboratorio/parametrizar
/laboratorio/resultados-paciente
/laboratorio/resultados-procedimiento
/laboratorio/informe/*
```

### Calidad
```
/calidad/encuesta-satisfaccion
/calidad/eventos-adversos
/calidad/parametrizacion-produccion
/calidad/mensaje-difusion
```

### Contabilidad
```
/contabilidad/cargue-saldos-iniciales
/contabilidad/plan-cuentas
/contabilidad/documentos
/contabilidad/terceros
/contabilidad/retenciones
/contabilidad/comprobantes
/contabilidad/factura-venta
/contabilidad/factura-compra
/contabilidad/bancos
/contabilidad/cuentas-bancarias
/contabilidad/tesoreria
/contabilidad/viaticos
/contabilidad/asiento-cierre
/contabilidad/deterioro-cartera
/contabilidad/reasignacion
/contabilidad/documento-soporte
/contabilidad/informe/*
```

### Presupuesto
```
/presupuesto/terceros
/presupuesto/vigencias
/presupuesto/rubros-presupuestales
/presupuesto/movimiento-presupuestal
/presupuesto/certificado-disponibilidad
/presupuesto/certificado-registro-presupuestal
/presupuesto/orden-pago
/presupuesto/ingresos-pagos
/presupuesto/liberacion-presupuestal
/presupuesto/informe/*
```

### Nómina
```
/nomina/empleados
/nomina/cargos
/nomina/departamentos
/nomina/subdepartamentos
/nomina/contratos
/nomina/proceso/*
```

### Inventario
```
/inventario/bodegas
/inventario/equivalencias
/inventario/proveedores
/inventario/tipos-inventario
/inventario/tipos-notas
/inventario/tipo-ingreso
/inventario/nota-salida
/inventario/movimiento
/inventario/ordenes-compra
/inventario/compras
/inventario/entrega-ambulatorio
/inventario/entrega-hospitalizacion
/inventario/interface
/inventario/informe/*
```

### Inventario (📦)
**Descripción:** Control de inventario, bodegas, proveedores y movimientos de artículos.

#### Submódulos:
- **Gestión:**
  - Bodegas
  - Equivalencias
  - Proveedores
  - Tipos de inventario
  - Tipos de notas
  - Tipo ingreso artículos
  - Nota salida artículos
  - Movimiento de artículos
  - Órdenes de Compra
  - Compras
  - Entrega Ambulatorio
  - Entrega Hospitalización
  - Interface Inventario

- **Informe:**
  - Listar Movimiento
  - Kardex
  - Listado de existencias
  - Listado órdenes de compra
  - Listado entrega artículos ambulatorio
  - Listado vendidos
  - Listado Pendientes
  - Listado Planilla Dispensación

### Otros Módulos
```
/admision
/farmacia
```

## Características Técnicas

### Iconos Utilizados
- 💰 Facturación
- 🗓️ Citas
- 🧪 Laboratorio
- ⭐ Calidad
- 📈 Contabilidad
- 📋 Presupuesto
- 👥 Nómina
- 📦 Inventario
- 🏥 Admisiones
- 💊 Farmacia
- 📋 Historias Clínicas
- 🚨 Triage
- 🏨 Asistencial

### Colores de Módulos
- Facturación: `bg-emerald-500`
- Citas: `bg-indigo-500`
- Laboratorio: `bg-cyan-500`
- Calidad: `bg-yellow-500`
- Contabilidad: `bg-lime-500`
- Presupuesto: `bg-sky-500`
- Nómina: `bg-fuchsia-500`
- Inventario: `bg-amber-500`
- Admisiones: `bg-orange-500`
- Farmacia: `bg-green-500`

## Implementación

### Archivos Modificados:
1. `lib/navigation.ts` - Estructura de navegación principal
2. `lib/types.ts` - Tipos de módulos actualizados

### Funciones de Utilidad:
- `getModulesByRole()` - Obtiene módulos por rol
- `getNavigationByRole()` - Obtiene navegación por rol
- `getSubmodulesByRole()` - Obtiene submódulos por rol
- `getModuleWithSubmodules()` - Obtiene módulo con submódulos
- `getAllAccessibleItems()` - Obtiene todos los elementos accesibles

## Próximos Pasos

1. **Crear páginas para cada ruta** implementada
2. **Implementar componentes** específicos para cada submódulo
3. **Configurar permisos** en la base de datos
4. **Crear formularios** para cada funcionalidad
5. **Implementar reportes** para los módulos de informe

## Notas Importantes

- Todos los módulos requieren autenticación (`requiresAuth: true`)
- Los permisos se validan tanto en el frontend como en el backend
- La estructura es escalable y permite agregar nuevos módulos fácilmente
- Se mantiene la consistencia con el diseño existente del sistema
