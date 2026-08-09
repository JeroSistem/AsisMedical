# 🧹 Limpieza Rápida del Proyecto

## Pasos Rápidos para Limpiar el Proyecto

### 1. Limpiar Base de Datos (Solo Superusuario)

```bash
npm run db:clean
```

Esto eliminará todos los datos excepto el superusuario.

### 2. Verificar/Crear Superusuario

Si no existe un superusuario, créalo:

```bash
npm run db:seed
```

O:

```bash
npm run db:create-admin
```

### 3. Credenciales por Defecto

- **Email**: `admin@asismedicare.com`
- **Contraseña**: `admin123`

⚠️ **IMPORTANTE**: Cambia estas credenciales en producción.

## 📚 Documentación Completa

- **Limpieza detallada**: Ver `docs/LIMPIEZA_PROYECTO.md`
- **Archivos para hosting**: Ver `docs/ARCHIVOS_HOSTING.md`

## ⚠️ Antes de Limpiar

1. ✅ Haz backup de la base de datos
2. ✅ Verifica que tienes las credenciales del superusuario
3. ✅ Asegúrate de estar en el entorno correcto (no producción sin backup)

## 🚀 Después de Limpiar

1. Verifica que solo existe el superusuario
2. Prueba el login con las credenciales
3. Prepara los archivos para el hosting según `docs/ARCHIVOS_HOSTING.md`
