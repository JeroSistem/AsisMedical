# 🧭 Sistema de Menú con Submódulos - AsisMediCare

## 📋 Descripción General

El sistema de menú de AsisMediCare ha sido completamente rediseñado para soportar una navegación jerárquica con módulos y submódulos, proporcionando una experiencia de usuario más organizada y escalable.

## 🏗️ Arquitectura del Sistema

### Estructura de Datos

```typescript
interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon: string;
  description?: string;
  badge?: string;
  children?: NavigationItem[]; // Submódulos
  requiresAuth: boolean;
  roles?: string[];
}
```

### Jerarquía de Navegación

```
📊 Dashboard
├── 📊 Panel Principal
└── 📈 Estadísticas

👥 Pacientes
├── 📋 Lista de Pacientes
├── ➕ Nuevo Paciente
└── 🔍 Búsqueda Avanzada

🏥 Triage
├── ➕ Nuevo Triage
├── 📋 Lista de Triage
└── 📊 Estadísticas

📋 Historias Clínicas
├── ➕ Nueva Historia
├── 📋 Lista de Historias
├── 📈 Evolución del Paciente
└── 🤖 Resumen AI
```

## 🎯 Componentes Disponibles

### 1. ModuleNavigation
Navegación principal en formato de tarjetas con preview de submódulos.

```tsx
<ModuleNavigation 
  userRole="Médico" 
  variant="grid" 
  className="custom-class" 
/>
```

**Variantes:**
- `grid`: Vista de tarjetas (por defecto)
- `sidebar`: Vista compacta para sidebar
- `compact`: Vista minimalista

### 2. CompactModuleNavigation
Navegación compacta para sidebar con expansión de submódulos.

```tsx
<CompactModuleNavigation userRole="Médico" />
```

**Características:**
- Expansión/colapso de submódulos
- Indicadores visuales de estado activo
- Badges con número de submódulos
- Animaciones suaves



### 4. BreadcrumbNavigation
Navegación de migas de pan para mostrar la ruta actual.

```tsx
<BreadcrumbNavigation userRole="Médico" />
```

### 5. QuickAccessNavigation
Acceso rápido a los módulos más utilizados.

```tsx
<QuickAccessNavigation userRole="Médico" />
```

### 6. CategoryNavigation
Navegación organizada por categorías.

```tsx
<CategoryNavigation userRole="Médico" />
```

## 🔧 Configuración de Módulos

### Definición de Módulos

Los módulos se definen en `lib/navigation.ts`:

```typescript
export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    id: 'patients',
    title: 'Pacientes',
    href: '/patients',
    icon: '👥',
    description: 'Gestión de pacientes',
    requiresAuth: true,
    roles: ['Médico', 'Enfermero', 'Administrador'],
    children: [
      {
        id: 'patients-list',
        title: 'Lista de Pacientes',
        href: '/patients',
        icon: '📋',
        requiresAuth: true,
        roles: ['Médico', 'Enfermero', 'Administrador'],
      },
      {
        id: 'patients-new',
        title: 'Nuevo Paciente',
        href: '/patients/nuevo',
        icon: '➕',
        requiresAuth: true,
        roles: ['Médico', 'Enfermero', 'Administrador'],
      },
    ],
  },
];
```

### Configuración de Roles

Cada módulo y submódulo puede tener roles específicos:

```typescript
roles: ['Médico', 'Enfermero', 'Administrador']
```

### Estados de Módulos

```typescript
// En MODULES_CONFIG
{
  isActive: true, // Módulo disponible
  isActive: false, // Módulo en desarrollo
}
```

## 🎨 Personalización

### Temas y Colores

Los componentes utilizan las variables CSS del tema:

```css
:root {
  --sidebar-background: hsl(var(--background));
  --sidebar-foreground: hsl(var(--foreground));
  --sidebar-accent: hsl(var(--accent));
  --sidebar-border: hsl(var(--border));
}
```

### Estilos Personalizados

```tsx
// Clases CSS personalizadas
<ModuleNavigation 
  className="custom-grid-layout" 
/>

// Estilos inline
<div className="sidebar-nav-item sidebar-hover-effect">
  {/* Contenido */}
</div>
```

## 🔍 Funcionalidades Avanzadas

### Búsqueda en Tiempo Real

```tsx
// Búsqueda automática en todos los módulos y submódulos
const filteredItems = allItems.filter(item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.description?.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### Filtrado por Rol

```tsx
// Obtener módulos accesibles para un rol específico
const accessibleModules = getNavigationByRole(userRole);

// Verificar acceso a un módulo específico
const hasAccess = isModuleAccessible('patients', userRole);
```

### Navegación Jerárquica

```tsx
// Obtener módulo con sus submódulos
const moduleWithSubmodules = getModuleWithSubmodules('patients', userRole);

// Obtener todos los elementos accesibles
const allItems = getAllAccessibleItems(userRole);
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px - Vista compacta
- **Tablet**: 768px - 1024px - Vista intermedia
- **Desktop**: > 1024px - Vista completa

### Adaptaciones

```tsx
// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

// Sidebar adaptativo
<aside className="sidebar-20 fixed left-0 top-0 z-40 h-screen transform border-r bg-sidebar-background transition-transform duration-300 ease-in-out lg:translate-x-0">
```

## 🚀 Implementación

### 1. Instalación

Los componentes ya están disponibles en `components/shared/`:

```tsx
import { 
  ModuleNavigation, 
  CompactModuleNavigation 
} from '@/components/shared';
```

### 2. Uso Básico

```tsx

```

### 3. Integración con Sidebar

```tsx
// En app-layout.tsx
import { CompactModuleNavigation } from '@/components/shared';

// Dentro del sidebar
<CompactModuleNavigation userRole={userRole} />
```

## 🎯 Casos de Uso



### 2. Sidebar de Navegación
- **Componente**: `CompactModuleNavigation`
- **Uso**: Navegación rápida con expansión de submódulos

### 3. Búsqueda Global
- **Componente**: `ModuleNavigation` con filtrado
- **Uso**: Búsqueda en tiempo real de módulos

### 4. Acceso Rápido
- **Componente**: `QuickAccessNavigation`
- **Uso**: Módulos más utilizados

## 🔧 Utilidades Disponibles

### Funciones de Navegación

```typescript
// Obtener módulos por rol
getModulesByRole(userRole: string): ModuleConfig[]

// Obtener navegación por rol
getNavigationByRole(userRole: string): NavigationItem[]

// Verificar acceso a módulo
isModuleAccessible(moduleId: ModuleType, userRole: string): boolean

// Obtener submódulos por rol
getSubmodulesByRole(userRole: string): NavigationItem[]

// Obtener módulo con submódulos
getModuleWithSubmodules(moduleId: string, userRole: string): NavigationItem | null

// Obtener todos los elementos accesibles
getAllAccessibleItems(userRole: string): NavigationItem[]
```

## 🎨 Temas y Estilos

### Variables CSS del Sidebar

```css
:root {
  --sidebar-background: hsl(var(--background));
  --sidebar-foreground: hsl(var(--foreground));
  --sidebar-primary: hsl(var(--primary));
  --sidebar-primary-foreground: hsl(var(--primary-foreground));
  --sidebar-accent: hsl(var(--accent));
  --sidebar-accent-foreground: hsl(var(--accent-foreground));
  --sidebar-border: hsl(var(--border));
  --sidebar-ring: hsl(var(--ring));
  --sidebar-muted-foreground: hsl(var(--muted-foreground));
}
```

### Clases CSS Utilitarias

```css
.sidebar-nav-item {
  @apply transition-all duration-200;
}

.sidebar-hover-effect {
  @apply hover:bg-sidebar-accent hover:text-sidebar-accent-foreground;
}

.sidebar-20 {
  width: 20%;
}

.main-content-80 {
  width: 80%;
  margin-left: 20%;
}
```

## 🔮 Futuras Mejoras

### Funcionalidades Planificadas

1. **Favoritos Personalizados**
   - Guardar módulos favoritos por usuario
   - Sincronización con base de datos

2. **Historial de Navegación**
   - Tracking de módulos visitados
   - Sugerencias inteligentes

3. **Búsqueda Avanzada**
   - Filtros por categoría
   - Búsqueda por tags

4. **Personalización de UI**
   - Temas personalizables
   - Layouts configurables

5. **Analytics de Uso**
   - Métricas de navegación
   - Reportes de uso

### Optimizaciones Técnicas

1. **Lazy Loading**
   - Carga diferida de submódulos
   - Optimización de rendimiento

2. **Caching**
   - Cache de navegación
   - Persistencia de estado

3. **Accesibilidad**
   - Navegación por teclado
   - Screen readers

## 📚 Referencias

- [Next.js App Router](https://nextjs.org/docs/app)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Desarrollado para AsisMediCare** 🏥
*Sistema de Gestión Hospitalaria Avanzado* 