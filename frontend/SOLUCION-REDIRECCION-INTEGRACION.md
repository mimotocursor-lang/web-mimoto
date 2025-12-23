# 🔧 Solución: Redirección a Integración en lugar de Producción

## 🔍 Diagnóstico

Si después del deploy sigues siendo redirigido a `https://webpay3gint.transbank.cl` (integración) en lugar de `https://webpay3g.transbank.cl` (producción), significa que la variable `PUBLIC_WEBPAY_ENVIRONMENT` no está configurada correctamente en Vercel.

## ✅ Verificación Rápida

### Paso 1: Verificar Variables en Vercel

1. Ve a tu proyecto en [Vercel](https://vercel.com)
2. Ve a **Settings** → **Environment Variables**
3. Busca `PUBLIC_WEBPAY_ENVIRONMENT`
4. Verifica que:
   - ✅ El valor sea exactamente `production` (sin comillas, sin espacios)
   - ✅ Esté marcada para **Production** (no solo Preview)
   - ✅ Esté habilitada (no deshabilitada)

### Paso 2: Usar el Endpoint de Diagnóstico

He creado un endpoint de diagnóstico. Accede a:

```
https://tu-sitio.vercel.app/api/webpay/debug-env
```

Este endpoint te mostrará:
- Qué valor tiene `PUBLIC_WEBPAY_ENVIRONMENT`
- Si está usando producción o integración
- A qué host de Webpay redirigirá
- Recomendaciones para corregir

**Ejemplo de respuesta correcta:**
```json
{
  "success": true,
  "environment": {
    "PUBLIC_WEBPAY_ENVIRONMENT": "production",
    "resolvedEnvironment": "Production",
    "isProduction": true,
    "webpayHost": "https://webpay3g.transbank.cl",
    ...
  },
  "diagnostic": {
    "willUseProduction": true,
    "willRedirectTo": "https://webpay3g.transbank.cl",
    "recommendation": "✅ Configuración correcta para producción"
  }
}
```

**Ejemplo de respuesta incorrecta (problema):**
```json
{
  "success": true,
  "environment": {
    "PUBLIC_WEBPAY_ENVIRONMENT": "NO CONFIGURADO (usando integración)",
    "resolvedEnvironment": "Integration",
    "isProduction": false,
    "webpayHost": "https://webpay3gint.transbank.cl",
    ...
  },
  "diagnostic": {
    "willUseProduction": false,
    "willRedirectTo": "https://webpay3gint.transbank.cl",
    "recommendation": "⚠️ Configuración usando integración. Para producción, configura PUBLIC_WEBPAY_ENVIRONMENT=production en Vercel"
  }
}
```

### Paso 3: Verificar Logs de Vercel

1. Ve a **Deployments** → Selecciona el último deployment
2. Ve a **Functions** → Busca `/api/webpay/init`
3. Busca en los logs el mensaje `🔧 ===== CONFIGURACIÓN DE WEBPAY =====`
4. Verifica que muestre:
   ```
   🔧 PUBLIC_WEBPAY_ENVIRONMENT: production
   🔧 Ambiente resuelto: ✅ Production
   🔧 Es producción? true
   🔧 Host de Webpay: https://webpay3g.transbank.cl
   ```

Si ves `⚠️ Integration` o `webpay3gint`, la variable no está configurada correctamente.

## 🔧 Solución

### Opción 1: Configurar Variable en Vercel (Recomendado)

1. Ve a **Settings** → **Environment Variables**
2. Busca `PUBLIC_WEBPAY_ENVIRONMENT`
3. Si no existe, haz clic en **Add New**
4. Configura:
   - **Key**: `PUBLIC_WEBPAY_ENVIRONMENT`
   - **Value**: `production` (exactamente, sin comillas, sin espacios)
   - **Environment**: Marca **Production** (y opcionalmente Preview, pero NO Development)
5. Haz clic en **Save**
6. **IMPORTANTE**: Haz un nuevo deploy:
   - Ve a **Deployments**
   - Haz clic en los tres puntos del último deployment
   - Selecciona **Redeploy**

### Opción 2: Verificar que la Variable Esté para Production

A veces la variable existe pero solo está configurada para Preview o Development:

1. Ve a **Settings** → **Environment Variables**
2. Busca `PUBLIC_WEBPAY_ENVIRONMENT`
3. Haz clic en ella para editarla
4. Verifica que **Production** esté marcado
5. Si no está marcado, márcalo y guarda
6. Haz un nuevo deploy

### Opción 3: Eliminar y Recrear la Variable

Si la variable tiene un valor incorrecto:

1. Ve a **Settings** → **Environment Variables**
2. Busca `PUBLIC_WEBPAY_ENVIRONMENT`
3. Elimínala
4. Crea una nueva con:
   - **Key**: `PUBLIC_WEBPAY_ENVIRONMENT`
   - **Value**: `production` (exactamente)
   - **Environment**: **Production**
5. Guarda y haz un nuevo deploy

## ⚠️ Errores Comunes

### Error 1: Variable con espacios
```
❌ Value: " production "  (con espacios)
✅ Value: "production"     (sin espacios)
```

### Error 2: Variable con comillas
```
❌ Value: '"production"'   (con comillas)
✅ Value: "production"     (sin comillas)
```

### Error 3: Variable solo para Preview
```
❌ Environment: Preview only
✅ Environment: Production (y opcionalmente Preview)
```

### Error 4: No hacer redeploy después de cambiar
```
❌ Cambiar variable pero no hacer redeploy
✅ Cambiar variable Y hacer redeploy
```

### Error 5: Variable con mayúsculas incorrectas
```
❌ Value: "Production"    (con mayúscula)
✅ Value: "production"     (todo minúsculas)
```

## 🧪 Verificación Final

Después de configurar y hacer deploy:

1. **Verifica el endpoint de diagnóstico:**
   ```
   https://tu-sitio.vercel.app/api/webpay/debug-env
   ```
   Debe mostrar `"isProduction": true` y `"webpayHost": "https://webpay3g.transbank.cl"`

2. **Verifica los logs de Vercel:**
   - Debe mostrar `🔧 Ambiente resuelto: ✅ Production`
   - Debe mostrar `🔧 Host de Webpay: https://webpay3g.transbank.cl`

3. **Prueba el flujo completo:**
   - Agrega un producto al carrito
   - Ve a checkout y confirma
   - Haz clic en "Pagar ahora"
   - **Debe redirigir a `https://webpay3g.transbank.cl`** (producción)

## 📝 Checklist de Verificación

- [ ] Variable `PUBLIC_WEBPAY_ENVIRONMENT` existe en Vercel
- [ ] Valor es exactamente `production` (sin espacios, sin comillas, minúsculas)
- [ ] Variable está marcada para **Production**
- [ ] Se hizo un nuevo deploy después de configurar
- [ ] Endpoint `/api/webpay/debug-env` muestra `isProduction: true`
- [ ] Logs de Vercel muestran `✅ Production` y `webpay3g.transbank.cl`
- [ ] Al hacer clic en "Pagar ahora" redirige a `webpay3g.transbank.cl`

## 🆘 Si Aún No Funciona

1. **Verifica que no haya caché:**
   - Limpia la caché del navegador
   - Prueba en modo incógnito
   - Espera unos minutos después del deploy

2. **Verifica que el deploy se completó:**
   - Ve a **Deployments** en Vercel
   - Verifica que el último deployment esté en estado "Ready"
   - Si hay errores, revísalos

3. **Verifica las otras variables:**
   - `PUBLIC_WEBPAY_COMMERCE_CODE` debe tener tu código de producción
   - `PUBLIC_WEBPAY_API_KEY` debe tener tu API key de producción

4. **Contacta soporte:**
   - Si después de todo esto sigue sin funcionar, comparte:
     - El resultado de `/api/webpay/debug-env`
     - Los logs de Vercel del endpoint `/api/webpay/init`
     - Una captura de pantalla de tus variables de entorno en Vercel (oculta los valores sensibles)

---

**Nota**: Las variables de entorno en Vercel solo se aplican después de un nuevo deploy. Si cambias una variable, siempre debes hacer un redeploy.

