# 🔧 Solución: Error 401 "Not Authorized" en Webpay

## 🔍 Diagnóstico

El error **401 "Not Authorized"** significa que las credenciales de Webpay (código de comercio o API key) están incorrectas o no están configuradas para el ambiente correcto.

## ✅ Verificación de Credenciales

### Paso 1: Verificar Variables en Vercel

Ve a **Vercel → Settings → Environment Variables** y verifica:

1. **`PUBLIC_WEBPAY_ENVIRONMENT`**
   - Debe ser exactamente `production` (sin comillas, sin espacios)
   - Debe estar marcada para **Production**

2. **`PUBLIC_WEBPAY_COMMERCE_CODE`**
   - Debe tener tu **Tbk-Api-Key-Id** de producción
   - NO debe tener espacios al inicio o final
   - Debe estar marcada para **Production**

3. **`PUBLIC_WEBPAY_API_KEY`**
   - Debe tener tu **Tbk-Api-Key-Secret** de producción
   - NO debe tener espacios al inicio o final
   - Debe estar marcada para **Production**

### Paso 2: Verificar que las Credenciales Sean de Producción

⚠️ **IMPORTANTE**: Las credenciales de producción son **diferentes** a las de integración:

- **Integración**: `597055555532` / `579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C`
- **Producción**: Tus credenciales reales de Transbank (las que te dieron)

Si estás usando las credenciales de integración en producción, obtendrás un error 401.

### Paso 3: Usar el Endpoint de Diagnóstico

Accede a:
```
https://tu-sitio.vercel.app/api/webpay/debug-env
```

Verifica que muestre:
- `"isProduction": true`
- `"webpayHost": "https://webpay3g.transbank.cl"`
- `"commerceCode"` debe mostrar tus credenciales (no las de integración)

### Paso 4: Verificar Logs de Vercel

En los logs de Vercel del endpoint `/api/webpay/init`, busca:

```
🔧 ===== CONFIGURACIÓN DE WEBPAY =====
🔧 PUBLIC_WEBPAY_ENVIRONMENT: production
🔧 Ambiente resuelto: ✅ Production
🔧 Commerce Code: [tus-primeros-6-caracteres]...
🔧 API Key: [tus-primeros-10-caracteres]...
```

Si ves las credenciales de integración (`597055...`), significa que no están configuradas las de producción.

## 🔧 Solución

### Opción 1: Configurar Credenciales de Producción

1. Ve a **Vercel → Settings → Environment Variables**
2. Busca `PUBLIC_WEBPAY_COMMERCE_CODE`
3. Verifica que tenga tu **Tbk-Api-Key-Id** de producción (no el de integración)
4. Si está mal, edítala o créala con el valor correcto
5. Haz lo mismo con `PUBLIC_WEBPAY_API_KEY` (tu **Tbk-Api-Key-Secret** de producción)
6. Asegúrate de que ambas estén marcadas para **Production**
7. **Haz un nuevo deploy**

### Opción 2: Verificar que No Haya Espacios

A veces las credenciales tienen espacios invisibles:

1. Copia las credenciales desde el mensaje de Transbank
2. Pégalas en un editor de texto plano
3. Elimina cualquier espacio al inicio o final
4. Copia nuevamente y pégalas en Vercel

### Opción 3: Eliminar y Recrear Variables

Si sospechas que las variables están corruptas:

1. Elimina `PUBLIC_WEBPAY_COMMERCE_CODE` y `PUBLIC_WEBPAY_API_KEY`
2. Créalas nuevamente con los valores correctos
3. Asegúrate de que estén marcadas para **Production**
4. Haz un nuevo deploy

## ⚠️ Errores Comunes

### Error 1: Usar Credenciales de Integración en Producción
```
❌ PUBLIC_WEBPAY_COMMERCE_CODE = 597055555532 (integración)
✅ PUBLIC_WEBPAY_COMMERCE_CODE = tu_codigo_real_de_produccion
```

### Error 2: Credenciales con Espacios
```
❌ Value: " tu_codigo "  (con espacios)
✅ Value: "tu_codigo"    (sin espacios)
```

### Error 3: Credenciales Solo para Preview
```
❌ Environment: Preview only
✅ Environment: Production (y opcionalmente Preview)
```

### Error 4: No Hacer Redeploy
```
❌ Cambiar credenciales pero no hacer redeploy
✅ Cambiar credenciales Y hacer redeploy
```

### Error 5: Ambiente Incorrecto
```
❌ PUBLIC_WEBPAY_ENVIRONMENT = integration (con credenciales de producción)
✅ PUBLIC_WEBPAY_ENVIRONMENT = production (con credenciales de producción)
```

## 🧪 Verificación Final

Después de configurar y hacer deploy:

1. **Verifica el endpoint de diagnóstico:**
   ```
   https://tu-sitio.vercel.app/api/webpay/debug-env
   ```
   Debe mostrar tus credenciales de producción (no las de integración)

2. **Verifica los logs de Vercel:**
   - Debe mostrar `🔧 Commerce Code: [tus-credenciales]...`
   - NO debe mostrar `597055...` (ese es el de integración)

3. **Prueba el flujo:**
   - Agrega un producto al carrito
   - Ve a checkout y confirma
   - Haz clic en "Pagar ahora"
   - **NO debe aparecer error 401**

## 📝 Checklist de Verificación

- [ ] `PUBLIC_WEBPAY_ENVIRONMENT=production` configurado
- [ ] `PUBLIC_WEBPAY_COMMERCE_CODE` tiene tu **Tbk-Api-Key-Id** de producción (no el de integración)
- [ ] `PUBLIC_WEBPAY_API_KEY` tiene tu **Tbk-Api-Key-Secret** de producción (no el de integración)
- [ ] Ambas variables están marcadas para **Production**
- [ ] No hay espacios en las credenciales
- [ ] Se hizo un nuevo deploy después de configurar
- [ ] Endpoint `/api/webpay/debug-env` muestra credenciales de producción
- [ ] Logs de Vercel muestran las credenciales correctas
- [ ] Al hacer clic en "Pagar ahora" NO aparece error 401

## 🆘 Si Aún No Funciona

1. **Verifica con Transbank:**
   - Confirma que las credenciales que te dieron son correctas
   - Verifica que tu cuenta esté habilitada para producción
   - Pregunta si hay algún paso adicional necesario

2. **Verifica los logs completos:**
   - Revisa los logs de Vercel del endpoint `/api/webpay/init`
   - Busca el error completo que Transbank está devolviendo
   - Comparte los logs (ocultando credenciales sensibles) para diagnóstico

3. **Prueba con integración primero:**
   - Temporalmente, cambia `PUBLIC_WEBPAY_ENVIRONMENT=integration`
   - Usa las credenciales de integración
   - Si funciona, el problema es con las credenciales de producción
   - Si no funciona, el problema es más general

---

**Nota**: El error 401 específicamente indica un problema de autenticación. En el 99% de los casos, es porque las credenciales están incorrectas o no están configuradas para el ambiente correcto.

