# 🧭 Guía del Sistema de Submenús - AsisMediCare

## 📋 Descripción General

El sistema de submenús de AsisMediCare proporciona una navegación jerárquica y organizada que permite a los usuarios acceder de manera eficiente a todas las funcionalidades del sistema según su rol y permisos.

## 🏗️ Arquitectura del Sistema

### Estructura de Datos

```typescript
interface NavigationItem {
  id: string;                    // Identificador único
  title: string;                 // Título visible
  href: string;                  // URL de navegación
  icon: string;                  // Emoji o icono
  description?: string;          // Descripción opcional
  requiresAuth: boolean;         // Requiere autenticación
  roles: string[];               // Roles permitidos
  children?: NavigationItem[];   // Submódulos
}
```

### Jerarquía de Navegación

```
📊 Dashboard
├── 📊 Panel Principal
├── 📈 Estadísticas
├── 📋 Reportes
└── ⚠️ Alertas

👥 Pacientes
├── 📋 Lista de Pacientes
├── ➕ Nuevo Paciente
├── 🔍 Búsqueda Avanzada
└── 📥 Importar Pacientes

🏥 Triage
├── ➕ Nuevo Triage
├── 📋 Lista de Triage
├── ⏳ Pendientes
├── ⚙️ Configuración
└── 📊 Estadísticas
```

## 🎯 Componentes Principales

### 1. CompactModuleNavigationWithSubmodules

Componente principal para el sidebar con expansión de submódulos.

**Características:**
- Expansión/colapso automático
- Indicadores visuales de estado activo
- Badges con número de submódulos
- Animaciones suaves
- Auto-expansión cuando un submódulo está activo

**Uso:**
```tsx
<CompactModuleNavigationWithSubmodules userRole="Administrador" />
```

### 2. SidebarNav

Componente alternativo para sidebar usando componentes UI nativos.

**Características:**
- Usa componentes de shadcn/ui
- Navegación con iconos
- Estado persistente
- Responsive design

**Uso:**
```tsx
<SidebarNav userRole="Administrador" />
```

## 🔧 Configuración de Módulos

### Agregar un Nuevo Módulo

1. **Editar `lib/navigation.ts`**
```typescript
{
  id: 'mi-modulo',
  title: 'Mi Módulo',
  href: '/mi-modulo',
  icon: '🔧',
  description: 'Descripción del módulo',
  requiresAuth: true,
  roles: ['Administrador', 'Médico'],
  children: [
    {
      id: 'mi-modulo-sub1',
      title: 'Submódulo 1',
      href: '/mi-modulo/sub1',
      icon: '📋',
      requiresAuth: true,
      roles: ['Administrador'],
    }
  ],
}
```

2. **Crear las páginas correspondientes**
```bash
mkdir -p app/mi-modulo/sub1
touch app/mi-modulo/page.tsx
touch app/mi-modulo/sub1/page.tsx
```

### Agregar Submódulos a un Módulo Existente

```typescript
// En lib/navigation.ts, dentro del children del módulo
{
  id: 'modulo-existente-nuevo-sub',
  title: 'Nuevo Submódulo',
  href: '/modulo-existente/nuevo-sub',
  icon: '🆕',
  requiresAuth: true,
  roles: ['Administrador'],
}
```

## 🎨 Personalización Visual

### Estilos CSS

Los submenús usan variables CSS personalizables:

```css
:root {
  --sidebar-background: hsl(var(--background));
  --sidebar-foreground: hsl(var(--foreground));
  --sidebar-muted: hsl(var(--muted));
  --sidebar-muted-foreground: hsl(var(--muted-foreground));
  --sidebar-accent: hsl(var(--accent));
  --sidebar-accent-foreground: hsl(var(--accent-foreground));
  --sidebar-border: hsl(var(--border));
}
```

### Clases de Utilidad

- `sidebar-nav-item`: Estilo base para elementos de navegación
- `sidebar-accent`: Color de acento para elementos activos
- `sidebar-muted-foreground`: Color para texto secundario

## 🔐 Sistema de Roles y Permisos

### Roles Disponibles

- **Administrador**: Acceso completo a todos los módulos
- **Médico**: Acceso a módulos clínicos y asistenciales
- **Enfermero**: Acceso limitado a módulos de atención

### Filtrado por Rol

```typescript
// Obtener navegación filtrada por rol
const navigation = getNavigationByRole(userRole);

// Verificar acceso a un módulo específico
const hasAccess = isModuleAccessible('admin', userRole);
```

## 📱 Responsive Design

### Comportamiento en Diferentes Dispositivos

- **Desktop**: Sidebar expandido con todos los submódulos visibles
- **Tablet**: Sidebar colapsible con indicadores de submódulos
- **Mobile**: Sidebar oculto, navegación por overlay

### Breakpoints

```css
/* Desktop */
@media (min-width: 1024px) {
  .sidebar-20 { width: 20%; }
}

/* Tablet */
@media (max-width: 1023px) {
  .sidebar-20 { width: 280px; }
}

/* Mobile */
@media (max-width: 767px) {
  .sidebar-20 { display: none; }
}
```

## 🧪 Pruebas y Demostración

### Página de Prueba

Visita `/test-submenus` para ver una demostración completa del sistema:

- Selector de roles en tiempo real
- Tres vistas diferentes (tarjetas, lista, árbol)
- Estadísticas de módulos y submódulos
- Interactividad completa

### Comandos de Prueba

```bash
# Ejecutar el servidor de desarrollo
npm run dev

# Visitar la página de prueba
http://localhost:3000/test-submenus
```

## 🔄 Funcionalidades Avanzadas

### Auto-expansión Inteligente

Los módulos se expanden automáticamente cuando:
- Un submódulo está activo
- El usuario navega a una página del módulo
- Se recarga la página en una ruta del submódulo

### Estado Persistente

El estado de expansión se mantiene durante la sesión:
- Módulos expandidos permanecen abiertos
- Estado se restaura al recargar la página
- Transiciones suaves entre estados

### Indicadores Visuales

- **Badges**: Muestran el número de submódulos
- **Iconos animados**: Escalan al hacer hover
- **Indicadores de estado activo**: Punto pulsante
- **Flechas de expansión**: Rotan al expandir/colapsar

## 🚀 Mejores Prácticas

### Organización de Módulos

1. **Agrupar funcionalidades relacionadas**
2. **Usar iconos descriptivos**
3. **Mantener jerarquías lógicas**
4. **Limitar profundidad a 3 niveles**

### Nomenclatura

1. **IDs únicos y descriptivos**
2. **Títulos claros y concisos**
3. **URLs semánticas**
4. **Iconos consistentes**

### Rendimiento

1. **Lazy loading de submódulos**
2. **Memoización de componentes**
3. **Optimización de re-renders**
4. **Código splitting por módulos**

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Submódulos no aparecen**
   - Verificar roles del usuario
   - Comprobar estructura de datos
   - Revisar permisos de autenticación

2. **Navegación no funciona**
   - Verificar rutas en `app/`
   - Comprobar configuración de Next.js
   - Revisar middleware de autenticación

3. **Estilos no se aplican**
   - Verificar importación de CSS
   - Comprobar variables CSS
   - Revisar clases de Tailwind

### Debugging

```typescript
// Verificar navegación disponible
console.log(getNavigationByRole('Administrador'));

// Verificar acceso a módulo
console.log(isModuleAccessible('admin', 'Administrador'));

// Verificar ruta activa
console.log(pathname);
```

## 📚 Recursos Adicionales

- [Documentación de shadcn/ui](https://ui.shadcn.com/)
- [Guía de Next.js App Router](https://nextjs.org/docs/app)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Sistema de tipos TypeScript](https://www.typescriptlang.org/docs/)

---

**Última actualización**: Diciembre 2024
**Versión**: 1.0.0
**Autor**: Equipo de Desarrollo AsisMediCare
