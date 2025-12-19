# 🚀 Configuración para Producción - Transbank

## ⚠️ IMPORTANTE: Antes de Ir a Producción

1. **Debes tener Webpay Plus contratado** con Transbank
2. **Debes haber hecho la transacción de prueba en INTEGRACIÓN** (no en producción)
3. **Transbank debe haber aprobado tu integración** después de ver la prueba
4. **Debes tener tus credenciales de producción** (código de comercio y API Key)
5. **Debes haber probado todo en integración primero**

### 🧪 Transacción de Prueba de Transbank

**IMPORTANTE:** La transacción de prueba que Transbank solicita es en **INTEGRACIÓN (desarrollo)**, NO en producción.

- Usa `PUBLIC_WEBPAY_ENVIRONMENT=integration`
- Usa credenciales de integración
- Haz la transacción de prueba
- Envía el token a Transbank
- Cuando aprueben, entonces sí pasas a producción

**Ver guía completa en:** `TRANSACCION-PRUEBA-TRANSBANK.md`

## 📝 Variables de Entorno para Producción

Crea o edita el archivo `frontend/.env.local` con estos valores:

```env
# AMBIENTE: Cambiar a production
PUBLIC_WEBPAY_ENVIRONMENT=production

# TUS CREDENCIALES REALES DE PRODUCCIÓN
PUBLIC_WEBPAY_COMMERCE_CODE=TU_CODIGO_REAL_DE_PRODUCCION
PUBLIC_WEBPAY_API_KEY=TU_API_KEY_REAL_DE_PRODUCCION

# URL DE TU SITIO EN PRODUCCIÓN
PUBLIC_SITE_URL=https://mimoto.cl
```

## 🔄 Cambios Necesarios

### ✅ SÍ Cambiar:

1. **PUBLIC_WEBPAY_ENVIRONMENT**
   - De: `integration`
   - A: `production`

2. **PUBLIC_WEBPAY_COMMERCE_CODE**
   - De: `597055555532` (código de prueba)
   - A: Tu código real de producción

3. **PUBLIC_WEBPAY_API_KEY**
   - De: `579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C` (key de prueba)
   - A: Tu API Key real de producción

4. **PUBLIC_SITE_URL**
   - De: `http://localhost:4321`
   - A: `https://mimoto.cl` (o tu dominio real)

### ❌ NO Cambiar:

- La estructura del código
- Los endpoints de la API
- La lógica de confirmación

## 📋 Ejemplo Completo para Producción

```env
PUBLIC_WEBPAY_ENVIRONMENT=production
PUBLIC_WEBPAY_COMMERCE_CODE=1234567890
PUBLIC_WEBPAY_API_KEY=ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890
PUBLIC_SITE_URL=https://mimoto.cl
```

## 🔐 Dónde Obtener Tus Credenciales de Producción

### Paso a Paso:

1. **Portal de Clientes de Transbank**: https://www.transbank.cl/
2. **Inicia sesión** con tu cuenta de Transbank
3. Ve a **"Mis Productos"** → **"Webpay Plus"**
4. Busca la sección de **"Credenciales"** o **"Configuración Técnica"**
5. Ahí encontrarás:
   - **Código de Comercio de Producción**
   - **API Key de Producción** (una cadena larga de letras y números)

### ⚠️ Si No Encuentras la API Key:

- **Verifica que Webpay Plus esté contratado** - Si no lo tienes, contrátalo primero
- **Asegúrate de estar en la sección de "Producción"** - No confundas con integración
- **Contacta a soporte de Transbank** - Diles que necesitas tu API Key de producción

**Ver guía completa en:** `COMO-OBTENER-API-KEY.md`

## ⚠️ IMPORTANTE: Verificaciones Antes de Producción

- [ ] Ya probaste todo en integración
- [ ] Tienes Webpay Plus contratado
- [ ] Tienes tus credenciales de producción
- [ ] Cambiaste `PUBLIC_WEBPAY_ENVIRONMENT=production`
- [ ] Cambiaste el código de comercio a tu código real
- [ ] Cambiaste la API Key a tu key real
- [ ] Cambiaste `PUBLIC_SITE_URL` a `https://mimoto.cl`
- [ ] Probaste con una transacción pequeña primero

## 🧪 Probar en Producción

1. **Configura las variables** en `.env.local`
2. **Reconstruye el proyecto**: `npm run build`
3. **Despliega a producción** (Vercel, Netlify, etc.)
4. **Prueba con una transacción pequeña** primero
5. **Verifica que funcione** antes de hacer transacciones grandes

## 🔄 Si Necesitas Volver a Integración

Si quieres volver a pruebas, cambia:

```env
PUBLIC_WEBPAY_ENVIRONMENT=integration
PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
PUBLIC_SITE_URL=http://localhost:4321
```

## 📝 Notas Importantes

- **En producción SÍ se cobra dinero real** - Ten cuidado
- **Las tarjetas de prueba NO funcionan en producción** - Solo tarjetas reales
- **El código de comercio de producción es único** - No lo compartas
- **La API Key de producción es secreta** - No la subas a Git
- **Verifica que `.env.local` esté en `.gitignore`** - Para no subir credenciales

## 🎯 Resumen Rápido

Para producción, tu `.env.local` debe tener:

```env
PUBLIC_WEBPAY_ENVIRONMENT=production
PUBLIC_WEBPAY_COMMERCE_CODE=TU_CODIGO_REAL
PUBLIC_WEBPAY_API_KEY=TU_API_KEY_REAL
PUBLIC_SITE_URL=https://mimoto.cl
```

**Sí, pon `https://mimoto.cl` en PUBLIC_SITE_URL** (o el dominio que uses en producción).

