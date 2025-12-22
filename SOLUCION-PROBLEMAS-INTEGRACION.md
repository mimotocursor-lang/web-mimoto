# 🔧 Solución a Problemas de Integración con Transbank

## 📋 Problemas Identificados

1. **❌ AUTH ROTO**: No se puede iniciar sesión ni con correo/contraseña ni con Google
2. **❌ Productos no se muestran**: Los productos en repuestos y accesorios no aparecen
3. **❌ Deploy falla en Vercel**: Error de runtime inválido (nodejs18.x)

## ✅ Soluciones Aplicadas

### 1. Problema de Runtime en Vercel

**Error**: `Error: The following Serverless Functions contain an invalid "runtime": nodejs18.x`

**Causa**: Vercel ha descontinuado Node.js 18. Necesita Node.js 20.

**Solución aplicada**:
- ✅ Actualizado `package.json` para especificar Node.js 20:
  ```json
  {
    "engines": {
      "node": ">=20.0.0"
    }
  }
  ```
- ✅ Actualizado `astro.config.mjs` para configurar el adaptador de Vercel:
  ```javascript
  adapter: vercel({
    functionPerRoute: false,
  })
  ```

### 2. Problema de Autenticación (Supabase)

**Causa**: El cliente de Supabase en `frontend/lib/supabase/client.ts` no tenía fallbacks correctos y se inicializaba con valores vacíos si las variables de entorno no estaban disponibles.

**Solución aplicada**:
- ✅ Actualizado `frontend/lib/supabase/client.ts` con fallbacks seguros:
  - Intenta obtener variables desde `import.meta.env` (tiempo de compilación)
  - Fallback a `window.PUBLIC_SUPABASE_URL` y `window.PUBLIC_SUPABASE_ANON_KEY`
  - Fallback final a valores por defecto del proyecto
  - Configuración correcta de autenticación con `flowType: 'pkce'`

### 3. Problema de Productos no se Muestran

**Causa**: Si la conexión a Supabase falla, los productos no se cargan y no hay mensajes de error visibles.

**Solución aplicada**:
- ✅ Mejorado el manejo de errores en `frontend/src/pages/tienda.astro`:
  - Try-catch para capturar errores de conexión
  - Mensajes de error visibles cuando falla la conexión
  - Logs de consola para debugging

## 🔍 Verificaciones Necesarias

### Variables de Entorno en Vercel

Asegúrate de que estas variables estén configuradas en el dashboard de Vercel:

**Variables Públicas (PUBLIC_*)**:
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_WEBPAY_ENVIRONMENT` (opcional, para Transbank)
- `PUBLIC_WEBPAY_COMMERCE_CODE` (opcional, para Transbank)
- `PUBLIC_WEBPAY_API_KEY` (opcional, para Transbank)

**Variables Privadas**:
- `SUPABASE_SERVICE_ROLE_KEY` (solo para funciones del servidor)

### Variables de Entorno en Desarrollo

Crea un archivo `.env` en `frontend/` con:

```env
PUBLIC_SUPABASE_URL=https://prizpqahcluomioxnmex.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role_aqui

# Variables de Transbank (opcional)
PUBLIC_WEBPAY_ENVIRONMENT=integration
PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
PUBLIC_WEBPAY_API_KEY=tu_api_key_aqui
```

## 🚀 Próximos Pasos

1. **Verificar variables de entorno en Vercel**:
   - Ve a tu proyecto en Vercel Dashboard
   - Settings → Environment Variables
   - Asegúrate de que todas las variables `PUBLIC_SUPABASE_*` estén configuradas

2. **Hacer deploy nuevamente**:
   - El deploy debería funcionar ahora con Node.js 20
   - Si aún falla, verifica los logs de build en Vercel

3. **Probar autenticación**:
   - Intenta iniciar sesión con correo/contraseña
   - Intenta iniciar sesión con Google
   - Revisa la consola del navegador para ver errores

4. **Verificar productos**:
   - Visita la página `/tienda`
   - Si hay errores, deberías ver mensajes de error visibles
   - Revisa la consola del navegador para logs detallados

## 📝 Notas Importantes

- **No hay interferencia entre Transbank y Supabase**: Las variables de Transbank (`PUBLIC_WEBPAY_*`) no interfieren con las de Supabase (`PUBLIC_SUPABASE_*`)
- **El cliente de Supabase ahora tiene fallbacks**: Si las variables de entorno no están disponibles, usará valores por defecto
- **Mensajes de error visibles**: Si hay problemas de conexión, se mostrarán mensajes claros en la página

## 🐛 Si los Problemas Persisten

1. **Verifica las variables de entorno**:
   - En desarrollo: Revisa el archivo `.env` en `frontend/`
   - En producción: Revisa las variables en Vercel Dashboard

2. **Revisa los logs**:
   - Consola del navegador (F12) para errores del cliente
   - Logs de Vercel para errores del servidor

3. **Prueba la conexión a Supabase**:
   - Ve a tu proyecto en Supabase Dashboard
   - Verifica que la URL y las claves sean correctas
   - Verifica que las tablas `products` y `banners` existan

4. **Contacta soporte**:
   - Si el problema persiste, contacta a soporte de Vercel o Supabase

