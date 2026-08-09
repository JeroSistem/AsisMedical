# ⚡ Despliegue Rápido - Colombia Hosting

## 🚀 Pasos Rápidos

### 1. Preparar Localmente
```bash
npm install
npm run build  # Verificar que compila
```

### 2. Subir al Servidor
- Sube todas las carpetas EXCEPTO: `.env`, `.next`, `node_modules`, `.git`

### 3. En el Servidor

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env con:
DATABASE_URL="postgresql://usuario:password@host:puerto/bd"
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="genera-con: openssl rand -base64 32"
NODE_ENV="production"

# 3. Generar Prisma
npm run db:generate

# 4. Crear base de datos
npx prisma db push

# 5. Crear superusuario
npm run db:seed

# 6. Construir
npm run build

# 7. Iniciar con PM2
npm install -g pm2
pm2 start npm --name "asismedicare" -- start
pm2 save
```

### 4. Verificar
- Abre `https://tu-dominio.com`
- Login con: `admin@asismedicare.com` / `admin123`
- **CAMBIA LA CONTRASEÑA INMEDIATAMENTE**

---

📚 **Guía completa:** Ver `docs/GUIA_DESPLIEGUE_COLOMBIA_HOSTING.md`
