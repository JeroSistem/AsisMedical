# 🔒 Política de Seguridad - AsisMediCare

## 🚨 Reportar Vulnerabilidades

Si descubres una vulnerabilidad de seguridad, por favor:

1. **NO** la reportes públicamente
2. Envía un email a: security@asismedicare.com
3. Incluye detalles específicos de la vulnerabilidad
4. Espera confirmación antes de hacer público

## 🔐 Gestión de Secretos

### Variables de Entorno Críticas

**NUNCA** versiones estos archivos:
- `.env`
- `.env.local`
- `.env.production`

**SÍ** versiones:
- `env.example` (sin secretos reales)

### Secretos que Rotar Regularmente

- `NEXTAUTH_SECRET` - Cada 90 días
- API keys externas - Según política del proveedor
- Variables adicionales se definirán al integrar la nueva base de datos

### Comando para generar nuevo NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## 🛡️ Medidas de Seguridad Implementadas

### Autenticación
- ✅ NextAuth.js con JWT
- ⚠️ Hashing pendiente (modo demo sin base de datos)
- ✅ Sesiones con expiración automática
- ✅ Protección CSRF

### Autorización
- ✅ RBAC (Role-Based Access Control)
- ✅ Middleware de protección de rutas
- ✅ Validación de permisos por módulo
- ✅ Scoping automático por entidad

### Validación de Datos
- ✅ Esquemas Zod para todas las APIs
- ✅ Sanitización de inputs
- ✅ Validación de tipos en runtime
- ✅ Escape de HTML en outputs

### Protección de APIs
- ✅ Rate limiting por IP
- ✅ Logging estructurado de acceso
- ✅ Validación de headers

### Base de Datos
- ⚠️ No configurada en modo demo actual
- 📌 Al habilitar persistencia, asegurar conexiones con SSL/TLS y prepared statements
- 📌 Implementar scoping automático por tenant y logging de operaciones sensibles

## 🔍 Auditoría de Seguridad

### Checklist de Revisión
- [ ] Todas las rutas protegidas por middleware
- [ ] Validación Zod en todos los endpoints
- [ ] Rate limiting aplicado
- [ ] Logging de eventos de seguridad
- [ ] Headers de seguridad configurados
- [ ] CORS configurado apropiadamente

### Herramientas de Análisis
```bash
# Análisis de dependencias
npm audit

# Análisis de código
npm run lint

# Tests de seguridad
npm run test:security

# Escaneo de vulnerabilidades
npx snyk test
```

## 📋 Mejores Prácticas para Desarrolladores

### Código Seguro
```typescript
// ✅ CORRECTO - Validar inputs
const data = schema.parse(req.body)

// ❌ INCORRECTO - Confiar en inputs
const data = req.body

// ⚠️ Recordatorio: sustituir mocks por repositorios reales cuando exista base de datos
```

### Manejo de Errores
```typescript
// ✅ CORRECTO - No exponer detalles internos
catch (error) {
  logger.error('Internal error', { error })
  return serverError('Something went wrong')
}

// ❌ INCORRECTO - Exponer stack traces
catch (error) {
  return Response.json({ error: error.stack })
}
```

## 🚫 Comportamientos Prohibidos

- **NUNCA** hardcodear secretos en el código
- **NUNCA** exponer logs de debug en producción
- **NUNCA** usar `eval()` o `Function()`
- **NUNCA** confiar en inputs del usuario sin validar
- **NUNCA** hacer queries SQL directas; usar ORM o repositorios seguros cuando se habilite la persistencia
- **NUNCA** almacenar contraseñas en texto plano

## 🔄 Proceso de Actualización de Seguridad

1. **Identificación** - Detectar vulnerabilidad
2. **Evaluación** - Calcular riesgo y impacto
3. **Desarrollo** - Crear fix sin romper funcionalidad
4. **Testing** - Verificar que el fix funciona
5. **Despliegue** - Aplicar en producción
6. **Monitoreo** - Verificar que no hay regresiones
7. **Documentación** - Actualizar este documento

## 📞 Contacto de Seguridad

- **Email**: security@asismedicare.com
- **PGP Key**: [Descargar](https://asismedicare.com/security.asc)
- **Respuesta**: 24-48 horas para confirmación
- **Disclosure**: 90 días después del fix

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
