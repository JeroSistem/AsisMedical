# Configuración de Idioma Español - AsisMediCare

## Descripción

La aplicación AsisMediCare está configurada para usar exclusivamente el idioma español. Esta configuración es permanente y no puede ser cambiada por los usuarios.

## Características Implementadas

### 1. Configuración de Next.js
- **Archivo**: `next.config.ts`
- **Configuración**: Internacionalización forzada a español
- **Características**:
  - Locale por defecto: `es`
  - Locales disponibles: Solo `es`
  - Detección automática de idioma: Deshabilitada

### 2. Contexto de Idioma
- **Archivo**: `lib/contexts/language-context.tsx`
- **Funcionalidades**:
  - Provider que fuerza el uso del español
  - Hooks para formateo de fechas y números
  - Prevención de cambios de idioma

### 3. Utilidades de Idioma
- **Archivo**: `lib/utils/language-utils.ts`
- **Funciones disponibles**:
  - `formatDateSpanish()` - Formatea fechas en español
  - `formatDateTimeSpanish()` - Formatea fecha y hora
  - `formatTimeSpanish()` - Formatea solo hora
  - `formatNumberSpanish()` - Formatea números
  - `formatCurrencySpanish()` - Formatea moneda (COP)
  - `formatPercentSpanish()` - Formatea porcentajes
  - `getMonthNameSpanish()` - Nombres de meses
  - `getDayNameSpanish()` - Nombres de días
  - `formatRelativeDateSpanish()` - Fechas relativas

### 4. Middleware de Idioma
- **Archivo**: `lib/middleware/language-middleware.ts`
- **Funcionalidades**:
  - Redirección automática a rutas en español
  - Establecimiento de headers de idioma
  - Validación de URLs

### 5. Configuración de Sistema
- **Archivos**: 
  - `app/configuracion/sistema/page.tsx`
  - `app/configuracion/notificaciones/page.tsx`
- **Cambios**:
  - Eliminación de opciones de idioma
  - Indicadores visuales de configuración permanente
  - Mensajes informativos

## Variables de Entorno

### Configuración Requerida
```bash
# Language Configuration
NEXT_PUBLIC_DEFAULT_LOCALE=es
NEXT_PUBLIC_AVAILABLE_LOCALES=es
NEXT_PUBLIC_FORCE_SPANISH=true
```

### Archivos de Configuración
- `env.example` - Ejemplo de configuración
- `env.local.example` - Ejemplo para desarrollo local

## Uso de las Utilidades

### En Componentes React
```typescript
import { useDateFormat, useNumberFormat } from '@/lib/contexts/language-context';

function MyComponent() {
  const { formatDate, formatDateTime } = useDateFormat();
  const { formatCurrency } = useNumberFormat();
  
  return (
    <div>
      <p>Fecha: {formatDate(new Date())}</p>
      <p>Moneda: {formatCurrency(1500000)}</p>
    </div>
  );
}
```

### En Funciones Utilitarias
```typescript
import { 
  formatDateSpanish, 
  formatCurrencySpanish,
  formatRelativeDateSpanish 
} from '@/lib/utils/language-utils';

// Formatear fecha
const fecha = formatDateSpanish(new Date());

// Formatear moneda
const moneda = formatCurrencySpanish(1500000);

// Fecha relativa
const relativa = formatRelativeDateSpanish('2024-01-15');
```

## Configuración del Navegador

### Headers HTTP
La aplicación establece automáticamente los siguientes headers:
- `Accept-Language: es,es-CO;q=0.9`
- `Content-Language: es`

### HTML Lang Attribute
El elemento `<html>` tiene el atributo `lang="es"` configurado permanentemente.

## Formateo de Datos

### Fechas
- **Formato**: `dd 'de' MMMM 'de' yyyy`
- **Ejemplo**: `15 de enero de 2024`
- **Locale**: `es-CO`

### Números
- **Separador de miles**: Punto (.)
- **Separador decimal**: Coma (,)
- **Ejemplo**: `1.500.000,50`

### Moneda
- **Moneda**: Pesos Colombianos (COP)
- **Formato**: `$ 1.500.000,00`
- **Locale**: `es-CO`

### Porcentajes
- **Formato**: `15,50%`
- **Decimales**: 2 por defecto

## Validación y Seguridad

### Prevención de Cambios
- El contexto de idioma previene cambios a otros idiomas
- El middleware redirige automáticamente a español
- Las configuraciones del sistema están bloqueadas

### Logs y Monitoreo
- Se registran intentos de cambio de idioma
- Advertencias en consola para cambios no permitidos
- Validación en tiempo de ejecución

## Migración de Código Existente

### Reemplazar Formateo de Fechas
```typescript
// Antes
date.toLocaleDateString('es-CO')

// Después
import { formatDateSpanish } from '@/lib/utils/language-utils';
formatDateSpanish(date)
```

### Reemplazar Formateo de Números
```typescript
// Antes
number.toLocaleString('es-CO')

// Después
import { formatNumberSpanish } from '@/lib/utils/language-utils';
formatNumberSpanish(number)
```

### Reemplazar Formateo de Moneda
```typescript
// Antes
new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount)

// Después
import { formatCurrencySpanish } from '@/lib/utils/language-utils';
formatCurrencySpanish(amount)
```

## Consideraciones de Rendimiento

### Optimizaciones
- Las funciones de formateo están optimizadas para español
- No hay overhead de detección de idioma
- Configuración estática en tiempo de compilación

### Caching
- Los formatos están predefinidos
- No se requieren consultas dinámicas de idioma
- Configuración en memoria

## Mantenimiento

### Actualizaciones
- Las utilidades de idioma son independientes
- Fácil actualización de formatos
- Configuración centralizada

### Debugging
- Logs informativos para cambios de idioma
- Validación en desarrollo
- Mensajes de error claros

## Compatibilidad

### Navegadores
- Soporte completo para `Intl` API
- Fallbacks para navegadores antiguos
- Validación de compatibilidad

### Dispositivos
- Formateo consistente en móviles
- Adaptación automática de formatos
- Soporte para diferentes resoluciones

## Conclusión

La configuración de idioma español está completamente implementada y es permanente. Todos los aspectos de la aplicación están configurados para usar exclusivamente el español, proporcionando una experiencia de usuario consistente y localizada.
