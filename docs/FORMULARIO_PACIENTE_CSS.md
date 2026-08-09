# CSS del Formulario de Nuevo Paciente

## Resumen de Estilos Aplicados

Este documento describe todos los estilos CSS que se aplican al formulario de nuevo paciente (`patient-form-simple.tsx`).

---

## 1. Estilos del Contenedor Principal

### Formulario (`<form>`)
```css
.space-y-2 {
  /* Espaciado vertical entre secciones: 0.5rem (8px) */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
```

---

## 2. Estilos de ModuleCard

### Card Base
```css
/* De components/ui/card.tsx */
.rounded-lg {
  border-radius: 0.5rem;
}

.border {
  border-width: 1px;
  border-color: hsl(var(--border)); /* hsl(214.3 31.8% 91.4%) */
}

.bg-card {
  background-color: hsl(var(--card)); /* hsl(0 0% 100%) */
}

.text-card-foreground {
  color: hsl(var(--card-foreground)); /* hsl(222.2 84% 4.9%) */
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.p-2 {
  padding: 0.5rem; /* 8px - Padding personalizado del formulario */
}
```

### CardHeader (Sobrescrito)
```css
.pb-1 {
  padding-bottom: 0.25rem; /* 4px */
}

.px-0 {
  padding-left: 0;
  padding-right: 0;
}

.pt-0 {
  padding-top: 0;
}
```

### CardTitle
```css
/* Base de components/ui/card.tsx */
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.font-semibold {
  font-weight: 600;
}

.leading-none {
  line-height: 1;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

/* Sobrescrito en el formulario */
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-1.5 {
  gap: 0.375rem; /* 6px */
}
```

### CardContent (Sobrescrito)
```css
/* Base: p-6 pt-0 */
/* Sobrescrito en el formulario */
.space-y-2 {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* 8px */
}

.pt-1 {
  padding-top: 0.25rem; /* 4px */
}

.px-0 {
  padding-left: 0;
  padding-right: 0;
}

.pb-0 {
  padding-bottom: 0;
}
```

---

## 3. Estilos de Grid

```css
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.gap-2.5 {
  gap: 0.625rem; /* 10px */
}
```

---

## 4. Estilos de Labels

```css
/* Base de components/ui/label.tsx */
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.font-medium {
  font-weight: 500;
}

.leading-none {
  line-height: 1;
}

.peer-disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.peer-disabled\:opacity-70:disabled {
  opacity: 0.7;
}

/* Espaciado entre label e input */
.space-y-1 {
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* 4px */
}
```

---

## 5. Estilos de Input

```css
/* Base de components/ui/input.tsx */
.flex {
  display: flex;
}

.h-10 {
  height: 2.5rem; /* 40px */
}

.w-full {
  width: 100%;
}

.rounded-md {
  border-radius: 0.375rem;
}

.border {
  border-width: 1px;
  border-color: hsl(var(--input)); /* hsl(214.3 31.8% 91.4%) */
}

.bg-background {
  background-color: hsl(var(--background)); /* hsl(0 0% 100%) */
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}

@media (min-width: 768px) {
  .md\:text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}

.ring-offset-background {
  --tw-ring-offset-color: hsl(var(--background));
}

.placeholder\:text-muted-foreground::placeholder {
  color: hsl(var(--muted-foreground)); /* hsl(215.4 16.3% 46.9%) */
}

.focus-visible\:outline-none:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus-visible\:ring-2:focus-visible {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus-visible\:ring-ring:focus-visible {
  --tw-ring-color: hsl(var(--ring)); /* hsl(221.2 83.2% 53.3%) */
}

.focus-visible\:ring-offset-2:focus-visible {
  --tw-ring-offset-width: 2px;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
```

---

## 6. Estilos de Select

### SelectTrigger
```css
.flex {
  display: flex;
}

.h-10 {
  height: 2.5rem;
}

.w-full {
  width: 100%;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.rounded-md {
  border-radius: 0.375rem;
}

.border {
  border-width: 1px;
  border-color: hsl(var(--input));
}

.bg-background {
  background-color: hsl(var(--background));
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.text-sm {
  font-size: 0.875rem;
}

.ring-offset-background {
  --tw-ring-offset-color: hsl(var(--background));
}

.placeholder\:text-muted-foreground::placeholder {
  color: hsl(var(--muted-foreground));
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\:ring-ring:focus {
  --tw-ring-color: hsl(var(--ring));
}

.focus\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.\[\&amp;\>span\]\:line-clamp-1 > span {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
```

---

## 7. Estilos de Textarea

```css
.flex {
  display: flex;
}

.min-h-\[80px\] {
  min-height: 80px;
}

.w-full {
  width: 100%;
}

.rounded-md {
  border-radius: 0.375rem;
}

.border {
  border-width: 1px;
  border-color: hsl(var(--input));
}

.bg-background {
  background-color: hsl(var(--background));
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.text-base {
  font-size: 1rem;
}

@media (min-width: 768px) {
  .md\:text-sm {
    font-size: 0.875rem;
  }
}

.ring-offset-background {
  --tw-ring-offset-color: hsl(var(--background));
}

.placeholder\:text-muted-foreground::placeholder {
  color: hsl(var(--muted-foreground));
}

.focus-visible\:outline-none:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus-visible\:ring-2:focus-visible {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus-visible\:ring-ring:focus-visible {
  --tw-ring-color: hsl(var(--ring));
}

.focus-visible\:ring-offset-2:focus-visible {
  --tw-ring-offset-width: 2px;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
```

---

## 8. Estilos de Botones

### Botón Principal (Submit)
```css
/* Base de components/ui/button.tsx */
.inline-flex {
  display: inline-flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.gap-2 {
  gap: 0.5rem;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.rounded-md {
  border-radius: 0.375rem;
}

.text-sm {
  font-size: 0.875rem;
}

.font-medium {
  font-weight: 500;
}

.ring-offset-background {
  --tw-ring-offset-color: hsl(var(--background));
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.focus-visible\:outline-none:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus-visible\:ring-2:focus-visible {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus-visible\:ring-ring:focus-visible {
  --tw-ring-color: hsl(var(--ring));
}

.focus-visible\:ring-offset-2:focus-visible {
  --tw-ring-offset-width: 2px;
}

.disabled\:pointer-events-none:disabled {
  pointer-events: none;
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

/* Variante default */
.bg-primary {
  background-color: hsl(var(--primary)); /* hsl(221.2 83.2% 53.3%) */
}

.text-primary-foreground {
  color: hsl(var(--primary-foreground)); /* hsl(210 40% 98%) */
}

.hover\:bg-primary\/90:hover {
  background-color: hsl(var(--primary) / 0.9);
}

.h-10 {
  height: 2.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
```

### Botón Outline (Cancelar)
```css
/* Variante outline */
.border {
  border-width: 1px;
  border-color: hsl(var(--input));
}

.bg-background {
  background-color: hsl(var(--background));
}

.hover\:bg-accent:hover {
  background-color: hsl(var(--accent));
}

.hover\:text-accent-foreground:hover {
  color: hsl(var(--accent-foreground));
}
```

---

## 9. Variables CSS Globales

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}
```

---

## 10. Espaciado Personalizado del Formulario

### Resumen de Espaciados Aplicados:

- **Formulario principal**: `space-y-2` (8px entre secciones)
- **ModuleCard padding**: `p-2` (8px)
- **CardHeader padding**: `pb-1 px-0 pt-0` (4px inferior, 0 horizontal y superior)
- **CardContent padding**: `pt-1 px-0 pb-0` (4px superior, 0 horizontal e inferior)
- **CardContent spacing**: `space-y-2` (8px entre elementos internos)
- **Grid gaps**: `gap-2.5` (10px entre columnas)
- **Label-Input spacing**: `space-y-1` (4px)
- **Botones spacing**: `gap-2` (8px entre botones)
- **Botones padding superior**: `pt-2` (8px)

---

## 11. Iconos

```css
.h-3.5 {
  height: 0.875rem; /* 14px */
}

.w-3.5 {
  width: 0.875rem; /* 14px */
}
```

---

## 12. Responsive Breakpoints

- **Mobile**: `< 640px` - Una columna
- **Tablet**: `≥ 768px` (md:) - Dos o tres columnas según el grid
- **Desktop**: `≥ 1024px` - Layout completo

---

## Archivos CSS Relacionados

1. **`app/globals.css`** - Variables CSS globales y estilos base
2. **`components/ui/card.tsx`** - Estilos base de Card
3. **`components/ui/input.tsx`** - Estilos base de Input
4. **`components/ui/label.tsx`** - Estilos base de Label
5. **`components/ui/select.tsx`** - Estilos base de Select
6. **`components/ui/textarea.tsx`** - Estilos base de Textarea
7. **`components/ui/button.tsx`** - Estilos base de Button
8. **`tailwind.config.ts`** - Configuración de Tailwind CSS

---

## Notas Importantes

- Todos los estilos utilizan **Tailwind CSS** con clases utilitarias
- Las variables CSS (`--primary`, `--background`, etc.) permiten cambiar fácilmente el tema
- El formulario está optimizado para ser compacto con márgenes mínimos
- Los estilos son completamente responsive usando breakpoints de Tailwind
