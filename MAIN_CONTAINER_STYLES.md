# 🎨 Estilos del Main Container (80%)

## 📐 Estructura Organizada

### **🏗️ Clases CSS Disponibles**

#### **1. Contenedor Principal**
```css
.main-content-80 {
  margin-left: 20vw;    /* Margen izquierdo del 20% */
  width: 80vw;          /* Ancho del 80% */
  min-height: 100vh;    /* Altura mínima completa */
  display: flex;         /* Layout flexible */
  flex-direction: column; /* Dirección vertical */
}
```

#### **2. Header Organizado**
```css
.main-content-80 .header-container {
  position: sticky;      /* Header fijo */
  top: 0;
  z-index: 30;
  background: hsl(var(--background));
  border-bottom: 1px solid hsl(var(--border));
  padding: 0 1.5rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

#### **3. Contenido de Página**
```css
.main-content-80 .page-content {
  flex: 1;               /* Ocupa espacio restante */
  padding: 1.5rem 2rem;  /* Márgenes internos */
  max-width: 1400px;     /* Ancho máximo */
  margin: 0 auto;        /* Centrado */
  width: 100%;
}
```

### **📱 Responsive Design**

#### **Desktop (≥1024px)**
- Sidebar: 20% del ancho
- Main: 80% del ancho
- Padding: 1.5rem 2rem

#### **Tablet (768px - 1024px)**
- Sidebar: Overlay
- Main: 100% del ancho
- Padding: 1rem

#### **Móvil (<768px)**
- Sidebar: Overlay
- Main: 100% del ancho
- Padding: 0.75rem

### **🎯 Clases Utilitarias**

#### **Grid Layout**
```css
.main-content-80 .content-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

#### **Cards**
```css
.main-content-80 .content-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

#### **Secciones**
```css
.main-content-80 .content-section {
  margin-bottom: 2rem;
}

.main-content-80 .section-header {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid hsl(var(--border));
}

.main-content-80 .section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin-bottom: 0.5rem;
}

.main-content-80 .section-subtitle {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
}
```

### **💡 Ejemplo de Uso**

```jsx
// En cualquier página
<div className="page-content">
  <div className="content-section">
    <div className="section-header">
      <h1 className="section-title">Dashboard</h1>
      <p className="section-subtitle">Resumen general del sistema</p>
    </div>
    
    <div className="content-grid">
      <div className="content-card">
        <h3>Estadísticas</h3>
        <p>Contenido de la tarjeta...</p>
      </div>
      
      <div className="content-card">
        <h3>Actividad Reciente</h3>
        <p>Contenido de la tarjeta...</p>
      </div>
    </div>
  </div>
</div>
```

### **🎨 Beneficios**

1. **✅ Márgenes Consistentes**: Padding uniforme en todos los dispositivos
2. **✅ Layout Responsive**: Se adapta automáticamente
3. **✅ Estructura Clara**: Clases semánticas y organizadas
4. **✅ Fácil Mantenimiento**: Estilos centralizados
5. **✅ Performance**: CSS optimizado y eficiente

### **🔧 Personalización**

Para personalizar los estilos, modifica las variables CSS en `globals.css`:

```css
:root {
  --background: 171 26% 93%;
  --foreground: 210 10% 23%;
  --card: 0 0% 100%;
  --border: 171 20% 80%;
  --muted-foreground: 210 10% 45%;
}
``` 