# Módulos y Submódulos — AppAsisMedical

Catálogo de módulos y submódulos de la aplicación, según la navegación definida en `lib/navigation.ts`.

---

## 1. Dashboard

| ID | Nombre | Ruta |
|---|---|---|
| `dashboard` | Dashboard | `/dashboard` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `dashboard-principal` | Panel Principal | `/dashboard` |
| `dashboard-estadisticas` | Estadísticas | `/dashboard/estadisticas` |
| `dashboard-reportes` | Reportes | `/dashboard/reportes` |
| `dashboard-alertas` | Alertas | `/dashboard/alertas` |

---

## 2. Configuración General

| ID | Nombre | Ruta |
|---|---|---|
| `configuracion` | Configuración General | `/configuracion` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `configuracion-general` | Configuración General | `/configuracion/general` |
| `configuracion-sistema` | Configuración del Sistema | `/configuracion/sistema` |
| `configuracion-seguridad` | Seguridad | `/configuracion/seguridad` |
| `configuracion-notificaciones` | Notificaciones | `/configuracion/notificaciones` |
| `configuracion-backup` | Backup y Restauración | `/configuracion/backup` |

---

## 3. Pacientes

| ID | Nombre | Ruta |
|---|---|---|
| `patients` | Pacientes | `/patients` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `patients-lista` | Lista de Pacientes | `/patients` |
| `patients-nuevo` | Nuevo Paciente | `/patients/nuevo` |
| `patients-busqueda` | Búsqueda Avanzada | `/patients/busqueda` |
| `patients-importar` | Importar Pacientes | `/patients/importar` |

---

## 4. Administración

| ID | Nombre | Ruta |
|---|---|---|
| `admin` | Administración | `/admin` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `admin-institucion` | Institución | `/admin/institucion` |
| `admin-usuarios` | Usuarios del Sistema | `/admin/usuarios` |
| `admin-roles` | Roles y Permisos | `/admin/roles` |
| `admin-configuracion` | Configuración General | `/admin/configuracion` |
| `admin-contratos` | Contratos con entidades | `/admin/contratos` |
| `admin-habitaciones` | Habitaciones | `/admin/habitaciones` |
| `admin-camas` | Camas | `/admin/camas` |
| `admin-articulos` | Artículos | `/admin/articulos` |
| `admin-listas-precios` | Listas de precios | `/admin/listas-precios` |
| `admin-resoluciones-dian` | Resoluciones Dian | `/admin/resoluciones-dian` |
| `admin-cups-propios` | Cups propios | `/admin/cups-propios` |
| `admin-centros-servicios` | Centros de servicios | `/admin/centros-servicios` |
| `admin-centros-costos` | Centros de costos | `/admin/centros-costos` |
| `admin-conceptos-facturacion` | Conceptos de facturación | `/admin/conceptos-facturacion` |
| `admin-copagos` | Copagos | `/admin/copagos` |
| `admin-servicios-chatbot` | Servicios ChatBot | `/admin/servicios-chatbot` |
| `admin-soporte-tecnico` | Soporte Técnico | `/admin/soporte-tecnico` |
| `admin-informe` | Informe | `/admin/informe` |

#### Submódulos de Informe

| ID | Nombre | Ruta |
|---|---|---|
| `admin-informe-listado-camas` | Listado Camas | `/admin/informe/listado-camas` |
| `admin-informe-listado-articulos` | Listado Artículos | `/admin/informe/listado-articulos` |
| `admin-informe-listado-contratos` | Listado Contratos | `/admin/informe/listado-contratos` |
| `admin-informe-listado-entidades` | Listado Entidades | `/admin/informe/listado-entidades` |
| `admin-informe-listado-habitaciones` | Listado Habitaciones | `/admin/informe/listado-habitaciones` |
| `admin-informe-listado-usuarios` | Listado Usuarios | `/admin/informe/listado-usuarios` |
| `admin-informe-listado-conceptos` | Listado Conceptos | `/admin/informe/listado-conceptos` |
| `admin-informe-facturacion` | Facturación | `/admin/informe/facturacion` |

---

## 5. Facturación

| ID | Nombre | Ruta |
|---|---|---|
| `facturacion` | Facturación | `/facturacion` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `facturacion-pacientes` | Pacientes | `/facturacion/administracion/pacientes` |
| `facturacion-admisiones` | Admisiones | `/facturacion/administracion/admisiones` |
| `facturacion-recibos-caja` | Recibos de caja | `/facturacion/administracion/recibos-caja` |
| `facturacion-traslados` | Traslados | `/facturacion/administracion/traslados` |
| `facturacion-homologaciones-proc` | Homologaciones proc | `/facturacion/administracion/homologaciones-proc` |
| `facturacion-anexo-inconsistencia` | Anexo técnico Inconsistencia base de datos | `/facturacion/administracion/anexo-inconsistencia` |
| `facturacion-anexo-urgencia` | Anexo técnico Informe atención urgencia | `/facturacion/administracion/anexo-urgencia` |
| `facturacion-anexo-autorizaciones` | Anexo técnico Autorizaciones | `/facturacion/administracion/anexo-autorizaciones` |
| `facturacion-resolucion-202` | Resolución 202 | `/facturacion/administracion/resolucion-202` |
| `facturacion-resolucion-4505` | Resolución 4505 | `/facturacion/administracion/resolucion-4505` |
| `facturacion-grupos-etareos` | Grupos etareos | `/facturacion/administracion/grupos-etareos` |
| `facturacion-furips` | Furips | `/facturacion/administracion/furips` |
| `facturacion-furtran` | Furtran | `/facturacion/administracion/furtran` |
| `facturacion-anexo-tecnico-uno` | Anexo Técnico Uno | `/facturacion/administracion/anexo-tecnico-uno` |
| `facturacion-parejas` | Parejas | `/facturacion/administracion/parejas` |
| `facturacion-informe` | Informe | `/facturacion/informe` |
| `facturacion-proceso` | Proceso | `/facturacion/proceso` |

---

## 6. Citas

| ID | Nombre | Ruta |
|---|---|---|
| `citas` | Citas | `/citas` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `citas-consultorios` | Consultorios | `/citas/consultorios` |
| `citas-horarios` | Horarios citas | `/citas/horarios` |
| `citas-asignar` | Asignar citas | `/citas/asignar` |
| `citas-informe` | Informe | `/citas/informe` |

#### Submódulos de Informe

| ID | Nombre | Ruta |
|---|---|---|
| `citas-informe-listado-citas` | Listado Citas | `/citas/informe/listado-citas` |
| `citas-informe-citas-canceladas` | Citas Canceladas | `/citas/informe/citas-canceladas` |
| `citas-informe-inasistentes` | Inasistentes | `/citas/informe/inasistentes` |

---

## 7. Historias Clínicas

| ID | Nombre | Ruta |
|---|---|---|
| `historias` | Historias Clínicas | `/historias` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `historias-clinica` | Historia Clínica | `/historias/historia-clinica` |
| `historias-remisiones` | Remisiones | `/historias/remisiones` |
| `historias-paquetes-medicamentos` | Paquetes Medicamentos | `/historias/paquetes-medicamentos` |
| `historias-paquetes-procedimientos` | Paquetes Procedimientos | `/historias/paquetes-procedimientos` |
| `historias-partograma` | Partograma | `/historias/partograma` |
| `historias-evolucion-ambulatoria` | Evolución Ambulatoria | `/historias/evolucion-ambulatoria` |
| `historias-informe` | Informe | `/historias/informe` |

#### Submódulos de Informe

| ID | Nombre | Ruta |
|---|---|---|
| `historias-informe-listado-historias` | Listado Historias clínicas | `/historias/informe/listado-historias` |
| `historias-informe-listado-cronicos` | Listado Crónicos | `/historias/informe/listado-cronicos` |
| `historias-informe-listado-remisiones` | Listado remisiones | `/historias/informe/listado-remisiones` |
| `historias-informe-listado-prenatal` | Listado Prenatal | `/historias/informe/listado-prenatal` |
| `historias-informe-listado-evoluciones` | Listado Evoluciones | `/historias/informe/listado-evoluciones` |
| `historias-informe-listado-evoluciones-ambulatoria` | Listado Evoluciones Ambulatoria | `/historias/informe/listado-evoluciones-ambulatoria` |

---

## 8. Triage

| ID | Nombre | Ruta |
|---|---|---|
| `triage` | Triage | `/triage` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `triage-ingreso-paciente` | Ingreso paciente | `/triage/ingreso-paciente` |
| `triage-valoracion` | Valoración triage | `/triage/valoracion` |
| `triage-niveles` | Niveles de triage | `/triage/niveles` |
| `triage-informe` | Informe | `/triage/informe` |

#### Submódulos de Informe

| ID | Nombre | Ruta |
|---|---|---|
| `triage-informe-listado-ingreso` | Listado Ingreso Paciente | `/triage/informe/listado-ingreso` |
| `triage-informe-listado-valoracion` | Listado Valoración Triage | `/triage/informe/listado-valoracion` |

---

## 9. Asistencial

| ID | Nombre | Ruta |
|---|---|---|
| `asistencial` | Asistencial | `/asistencial` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `asistencial-ordenes-medicas` | Órdenes Médicas | `/asistencial/ordenes-medicas` |
| `asistencial-evoluciones` | Evoluciones | `/asistencial/evoluciones` |
| `asistencial-notas-enfermeria` | Notas de Enfermería | `/asistencial/notas-enfermeria` |
| `asistencial-remisiones` | Remisiones | `/asistencial/remisiones` |
| `asistencial-epicrisis` | Epicrisis | `/asistencial/epicrisis` |
| `asistencial-informes-quirurgicos` | Informes quirúrgicos | `/asistencial/informes-quirurgicos` |
| `asistencial-notas-historia` | Notas Historia | `/asistencial/notas-historia` |
| `asistencial-solicitud-articulos` | Solicitud de Artículos | `/asistencial/solicitud-articulos` |
| `asistencial-informe` | Informe | `/asistencial/informe` |

#### Submódulos de Informe

| ID | Nombre | Ruta |
|---|---|---|
| `asistencial-informe-listado-historias` | Listado Historias asistenciales | `/asistencial/informe/listado-historias` |
| `asistencial-informe-listado-epicrisis` | Listado Epicrisis | `/asistencial/informe/listado-epicrisis` |
| `asistencial-informe-listado-evoluciones` | Listado Evoluciones | `/asistencial/informe/listado-evoluciones` |
| `asistencial-informe-listado-ordenes` | Listado Órdenes Médicas | `/asistencial/informe/listado-ordenes` |
| `asistencial-informe-listado-notas-enfermeria` | Listado Notas de Enfermería | `/asistencial/informe/listado-notas-enfermeria` |
| `asistencial-informe-listado-remisiones` | Listado remisiones | `/asistencial/informe/listado-remisiones` |
| `asistencial-informe-censo-pacientes-medicamentos` | Censo de pacientes con medicamentos | `/asistencial/informe/censo-pacientes-medicamentos` |
| `asistencial-informe-hoja-administracion-medicamentos` | Hoja de administración de medicamentos | `/asistencial/informe/hoja-administracion-medicamentos` |
| `asistencial-informe-hoja-gastos-materiales` | Hoja de gastos materiales | `/asistencial/informe/hoja-gastos-materiales` |
| `asistencial-informe-listado-epicrisis-control` | Listado Epicrisis con control | `/asistencial/informe/listado-epicrisis-control` |
| `asistencial-informe-listado-administracion-medicamentos` | Listado Administración Medicamentos | `/asistencial/informe/listado-administracion-medicamentos` |
| `asistencial-informe-listado-administracion-insumos` | Listado Administración Insumos | `/asistencial/informe/listado-administracion-insumos` |

---

## 10. Inventario

| ID | Nombre | Ruta |
|---|---|---|
| `inventario` | Inventario | `/inventario` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `inventario-bodegas` | Bodegas | `/inventario/bodegas` |
| `inventario-equivalencias` | Equivalencias | `/inventario/equivalencias` |
| `inventario-proveedores` | Proveedores | `/inventario/proveedores` |
| `inventario-tipos-inventario` | Tipos de inventario | `/inventario/tipos-inventario` |
| `inventario-tipos-notas` | Tipos de notas | `/inventario/tipos-notas` |
| `inventario-tipo-ingreso` | Tipo ingreso artículos | `/inventario/tipo-ingreso` |
| `inventario-nota-salida` | Nota salida artículos | `/inventario/nota-salida` |
| `inventario-movimiento` | Movimiento de artículos | `/inventario/movimiento` |
| `inventario-ordenes-compra` | Órdenes de Compra | `/inventario/ordenes-compra` |
| `inventario-compras` | Compras | `/inventario/compras` |
| `inventario-entrega-ambulatorio` | Entrega Ambulatorio | `/inventario/entrega-ambulatorio` |
| `inventario-entrega-hospitalizacion` | Entrega Hospitalización | `/inventario/entrega-hospitalizacion` |
| `inventario-interface` | Interface Inventario | `/inventario/interface` |
| `inventario-informe` | Informe | `/inventario/informe` |

#### Submódulos de Informe

| ID | Nombre | Ruta |
|---|---|---|
| `inventario-informe-movimiento` | Listar Movimiento | `/inventario/informe/movimiento` |
| `inventario-informe-kardex` | Kardex | `/inventario/informe/kardex` |
| `inventario-informe-existencias` | Listado de existencias | `/inventario/informe/existencias` |
| `inventario-informe-ordenes-compra` | Listado órdenes de compra | `/inventario/informe/ordenes-compra` |
| `inventario-informe-entrega-ambulatorio` | Listado entrega artículos ambulatorio | `/inventario/informe/entrega-ambulatorio` |
| `inventario-informe-vendidos` | Listado vendidos | `/inventario/informe/vendidos` |
| `inventario-informe-pendientes` | Listado Pendientes | `/inventario/informe/pendientes` |
| `inventario-informe-planilla-dispensacion` | Listado Planilla Dispensación | `/inventario/informe/planilla-dispensacion` |

---

## 11. Auditoría

| ID | Nombre | Ruta |
|---|---|---|
| `auditoria` | Auditoría | `/auditoria` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `auditoria-nueva` | Nueva Auditoría | `/auditoria/nueva` |
| `auditoria-pendientes` | Auditorías Pendientes | `/auditoria/pendientes` |
| `auditoria-hallazgos` | Hallazgos Recientes | `/auditoria/hallazgos` |
| `auditoria-reportes` | Reportes de Auditoría | `/auditoria/reportes` |

---

## 12. Laboratorio

| ID | Nombre | Ruta |
|---|---|---|
| `laboratorio` | Laboratorio | `/laboratorio` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `laboratorio-parametrizar` | Parametrizar laboratorio clínico | `/laboratorio/parametrizacion` |
| `laboratorio-resultados-paciente` | Resultados laboratorio clínico por paciente | `/laboratorio/resultados-paciente` |
| `laboratorio-resultados-procedimiento` | Resultados laboratorio clínico por procedimiento | `/laboratorio/resultados-procedimiento` |
| `laboratorio-informe` | Informe | `#` |

#### Submódulos de Informe

| ID | Nombre | Ruta |
|---|---|---|
| `laboratorio-informe-listado-examenes` | Listado Exámenes Laboratorio | `/laboratorio/informe/listado_examenes_laboratorio` |

---

## 13. Calidad

| ID | Nombre | Ruta |
|---|---|---|
| `calidad` | Calidad | `/calidad` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `calidad-encuesta-satisfaccion` | Encuesta satisfacción | `/calidad/encuesta-satisfaccion` |
| `calidad-eventos-adversos` | Eventos adversos | `/calidad/eventos-adversos` |
| `calidad-parametrizacion-produccion` | Parametrización producción (2193) | `/calidad/parametrizacion-produccion` |
| `calidad-mensaje-difusion` | Mensaje difusión (demanda inducida) | `/calidad/mensaje-difusion` |
| `calidad-informes` | Informes | `#` |

#### Submódulos de Encuesta satisfacción

| ID | Nombre | Ruta |
|---|---|---|
| `calidad-encuesta-satisfaccion-listado` | Listado Encuestas | `/calidad/encuesta-satisfaccion/listado` |

#### Submódulos de Informes

| ID | Nombre | Ruta |
|---|---|---|
| `calidad-informes-oportunidad` | Informe Oportunidad | `/calidad/informes/informe-oportunidad` |
| `calidad-informes-1552` | Informe 1552 | `/calidad/informes/informe-1552` |
| `calidad-informes-0256` | Informe 0256 | `/calidad/informes/informe-0256` |
| `calidad-informes-resolucion-1604` | Resolución 1604 | `/calidad/informes/resolucion-1604` |
| `calidad-informes-totales-inventario` | Totales Inventario | `/calidad/informes/totales-inventario` |
| `calidad-informes-sismed` | Informe Sismed | `/calidad/informes/informe-sismed` |
| `calidad-informes-satisfaccion-global` | Informe Satisfacción Global | `/calidad/informes/informe-satisfaccion-global` |
| `calidad-informes-listado-reingresos` | Listado Reingresos | `/calidad/informes/listado-reingresos` |
| `calidad-informes-produccion-2193` | Informe Producción 2193 | `/calidad/informes/informe-produccion-2193` |
| `calidad-informes-resolucion-2175` | Resolución 2175 | `/calidad/informes/resolucion-2175` |

---

## 14. Imágenes Diagnósticas

| ID | Nombre | Ruta |
|---|---|---|
| `imagenes-diagnosticas` | Imágenes Diagnósticas | `/imagenes-diagnosticas` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `imagenes-nueva` | Nueva Imagen | `/imagenes-diagnosticas/nueva` |
| `imagenes-pendientes` | Imágenes Pendientes | `/imagenes-diagnosticas/pendientes` |
| `imagenes-tipos` | Tipos de Estudios | `/imagenes-diagnosticas/tipos` |
| `imagenes-interpretacion` | Interpretación | `/imagenes-diagnosticas/interpretacion` |

---

## 15. Farmacia

| ID | Nombre | Ruta |
|---|---|---|
| `farmacia` | Farmacia | `/farmacia` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `farmacia-medicamentos` | Medicamentos | `/farmacia/medicamentos` |
| `farmacia-recetas` | Recetas | `/farmacia/recetas` |
| `farmacia-dispensacion` | Dispensación | `/farmacia/dispensacion` |
| `farmacia-stock` | Control de Stock | `/farmacia/stock` |
| `farmacia-proveedores` | Proveedores | `/farmacia/proveedores` |

---

## 16. Contabilidad

| ID | Nombre | Ruta |
|---|---|---|
| `contabilidad` | Contabilidad | `/contabilidad` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `contabilidad-cargue-saldos-iniciales` | Cargue de Saldos Iniciales | `/contabilidad/cargue-saldos-iniciales` |
| `contabilidad-plan-cuentas` | Plan de Cuentas | `/contabilidad/plan-cuentas` |
| `contabilidad-documentos` | Documentos de Contabilidad | `/contabilidad/documentos` |
| `contabilidad-terceros` | Terceros | `/contabilidad/terceros` |
| `contabilidad-retenciones` | Retenciones | `/contabilidad/retenciones` |
| `contabilidad-comprobantes` | Comprobantes de Contabilidad | `/contabilidad/comprobantes` |
| `contabilidad-factura-venta` | Factura de Venta | `/contabilidad/factura-venta` |
| `contabilidad-factura-compra` | Factura de Compra | `/contabilidad/factura-compra` |
| `contabilidad-bancos` | Bancos | `/contabilidad/bancos` |
| `contabilidad-cuentas-bancarias` | Cuentas Bancarias | `/contabilidad/cuentas-bancarias` |
| `contabilidad-tesorería` | Tesorería | `/contabilidad/tesoreria` |
| `contabilidad-viaticos` | Viáticos | `/contabilidad/viaticos` |
| `contabilidad-asiento-cierre` | Asiento de cierre | `/contabilidad/asiento-cierre` |
| `contabilidad-deterioro-cartera` | Deterioro de Cartera | `/contabilidad/deterioro-cartera` |
| `contabilidad-reasignacion` | Reasignación | `/contabilidad/reasignacion` |
| `contabilidad-documento-soporte` | Documento Soporte | `/contabilidad/documento-soporte` |
| `contabilidad-informe` | Informe | `/contabilidad/informe` |

#### Submódulos de Informe

| ID | Nombre | Ruta |
|---|---|---|
| `contabilidad-informe-listado-retenciones` | Listado Retenciones | `/contabilidad/informe/listado-retenciones` |
| `contabilidad-informe-listado-documentos-descargados` | Listado Documentos Descargados | `/contabilidad/informe/listado-documentos-descargados` |
| `contabilidad-informe-seguimiento-cartera` | Seguimiento de Cartera | `/contabilidad/informe/seguimiento-cartera` |
| `contabilidad-informe-listado-comprobantes` | Listado Comprobantes de Contabilidad | `/contabilidad/informe/listado-comprobantes` |
| `contabilidad-informe-listado-auxiliares` | Listado auxiliares de contabilidad | `/contabilidad/informe/listado-auxiliares` |
| `contabilidad-informe-circular-030` | Informe circular 030 | `/contabilidad/informe/circular-030` |
| `contabilidad-informe-balance-general` | Balance general | `/contabilidad/informe/balance-general` |
| `contabilidad-informe-estado-resultados` | Estado de resultados | `/contabilidad/informe/estado-resultados` |
| `contabilidad-informe-libro-mayor` | Libro mayor | `/contabilidad/informe/libro-mayor` |
| `contabilidad-informe-hoja-trabajo-balance` | Hoja de trabajo y balance | `/contabilidad/informe/hoja-trabajo-balance` |
| `contabilidad-informe-listado-terceros` | Listado Terceros | `/contabilidad/informe/listado-terceros` |

---

## 17. Presupuesto

| ID | Nombre | Ruta |
|---|---|---|
| `presupuesto` | Presupuesto | `/presupuesto` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `presupuesto-terceros` | Terceros | `/presupuesto/terceros` |
| `presupuesto-vigencias` | Vigencias | `/presupuesto/vigencias` |
| `presupuesto-rubros-presupuestales` | Rubros presupuestales | `/presupuesto/rubros-presupuestales` |
| `presupuesto-movimiento-presupuestal` | Movimiento presupuestal | `/presupuesto/movimiento-presupuestal` |
| `presupuesto-certificado-disponibilidad` | Certificado Disponibilidad | `/presupuesto/certificado-disponibilidad` |
| `presupuesto-certificado-registro-presupuestal` | Certificado de registro presupuestal | `/presupuesto/certificado-registro-presupuestal` |
| `presupuesto-orden-pago` | Orden de pago | `/presupuesto/orden-pago` |
| `presupuesto-ingresos-pagos` | Ingresos/pagos | `/presupuesto/ingresos-pagos` |
| `presupuesto-liberacion-presupuestal` | Liberación Presupuestal | `/presupuesto/liberacion-presupuestal` |
| `presupuesto-informe` | Informe | `/presupuesto/informe` |

#### Submódulos de Informe

| ID | Nombre | Ruta |
|---|---|---|
| `presupuesto-informe-listado-auxiliares` | Listado de auxiliares de presupuesto | `/presupuesto/informe/listado-auxiliares` |
| `presupuesto-informe-ejecucion-presupuestal` | Ejecución Presupuestal | `/presupuesto/informe/ejecucion-presupuestal` |
| `presupuesto-informe-listado-auxiliar-tipo-documento` | Listado Auxiliar Por Tipo Documento | `/presupuesto/informe/listado-auxiliar-tipo-documento` |
| `presupuesto-informe-seguimiento-presupuesto` | Seguimiento de presupuesto | `/presupuesto/informe/seguimiento-presupuesto` |
| `presupuesto-informe-listado-cdp` | Listado CDP | `/presupuesto/informe/listado-cdp` |
| `presupuesto-informe-crp` | CRP | `/presupuesto/informe/crp` |
| `presupuesto-informe-libro-pagos` | Libro Pagos | `/presupuesto/informe/libro-pagos` |

---

## 18. Nómina

| ID | Nombre | Ruta |
|---|---|---|
| `nomina` | Nómina | `/nomina` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `nomina-empleados` | Empleados | `/nomina/empleados` |
| `nomina-cargos` | Cargos | `/nomina/cargos` |
| `nomina-departamentos` | Departamentos | `/nomina/departamentos` |
| `nomina-subdepartamentos` | Subdepartamentos | `/nomina/subdepartamentos` |
| `nomina-contratos` | Contratos | `/nomina/contratos` |
| `nomina-proceso` | Proceso | `/nomina/proceso` |

#### Submódulos de Proceso

| ID | Nombre | Ruta |
|---|---|---|
| `nomina-proceso-liquidacion` | Liquidación | `/nomina/proceso/liquidacion` |
| `nomina-proceso-configuracion-conceptos` | Configuración Conceptos | `/nomina/proceso/configuracion-conceptos` |

---

## 19. Cartera

| ID | Nombre | Ruta |
|---|---|---|
| `cartera` | Cartera | `/cartera` |

### Submódulos

| ID | Nombre | Ruta |
|---|---|---|
| `cartera-nueva-cobranza` | Nueva Cobranza | `/cartera/nueva-cobranza` |
| `cartera-facturas-vencidas` | Facturas Vencidas | `/cartera/facturas-vencidas` |
| `cartera-cobranzas` | Cobranzas Recientes | `/cartera/cobranzas` |
| `cartera-proyecciones` | Proyecciones de Cobranza | `/cartera/proyecciones` |

---

## Resumen

| # | Módulo | Submódulos (1.er nivel) | Sub-submódulos |
|---|---|---|---|
| 1 | Dashboard | 4 | 0 |
| 2 | Configuración General | 5 | 0 |
| 3 | Pacientes | 4 | 0 |
| 4 | Administración | 18 | 8 |
| 5 | Facturación | 17 | 0 |
| 6 | Citas | 4 | 3 |
| 7 | Historias Clínicas | 7 | 6 |
| 8 | Triage | 4 | 2 |
| 9 | Asistencial | 9 | 12 |
| 10 | Inventario | 14 | 8 |
| 11 | Auditoría | 4 | 0 |
| 12 | Laboratorio | 4 | 1 |
| 13 | Calidad | 5 | 11 |
| 14 | Imágenes Diagnósticas | 4 | 0 |
| 15 | Farmacia | 5 | 0 |
| 16 | Contabilidad | 17 | 11 |
| 17 | Presupuesto | 10 | 7 |
| 18 | Nómina | 6 | 2 |
| 19 | Cartera | 4 | 0 |
| | **Total** | **19 módulos** | **145 submódulos de 1.er nivel** | **71 sub-submódulos** |

### Nota

El módulo **Admisiones** (`admision`) está registrado en `MODULES_CONFIG`, pero no aparece como ítem de navegación principal en `MAIN_NAVIGATION`. Existe la ruta `/admision` en la aplicación.

---

*Fuente: `lib/navigation.ts` — AppAsisMedical*
