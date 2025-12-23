# ✅ Checklist de Producción - Webpay Plus

## 🔧 Variables de Entorno en Vercel

Verifica que estas variables estén configuradas en **Vercel → Settings → Environment Variables**:

### Variables Requeridas:

- [ ] **`PUBLIC_WEBPAY_ENVIRONMENT`** = `production`
- [ ] **`PUBLIC_WEBPAY_COMMERCE_CODE`** = Tu **Tbk-Api-Key-Id** de producción
- [ ] **`PUBLIC_WEBPAY_API_KEY`** = Tu **Tbk-Api-Key-Secret** de producción
- [ ] **`PUBLIC_SITE_URL`** = URL de tu sitio en producción (ej: `https://tusitio.vercel.app`)
- [ ] **`PUBLIC_SUPABASE_URL`** = Tu URL de Supabase
- [ ] **`PUBLIC_SUPABASE_ANON_KEY`** = Tu anon key de Supabase
- [ ] **`SUPABASE_SERVICE_ROLE_KEY`** = Tu service role key de Supabase

### ⚠️ Importante:

- Asegúrate de que las variables estén configuradas para **Production** (no solo Preview)
- Verifica que los valores no tengan espacios extra al inicio o final
- Las credenciales de producción son diferentes a las de integración

## 🚀 Verificación del Código

El código ya está preparado para producción. Verifica que:

- [ ] El código detecta correctamente `PUBLIC_WEBPAY_ENVIRONMENT=production`
- [ ] Usa `Environment.Production` del SDK de Transbank
- [ ] Redirige a `https://webpay3g.transbank.cl` (no a `webpay3gint`)
- [ ] Los montos se envían en pesos chilenos (no en centavos)
- [ ] El endpoint `/api/webpay/confirm` maneja cancelaciones correctamente

## 📋 Proceso de Validación de Transbank

### Paso 1: Crear Producto de Prueba ($50)

- [ ] Crear un producto con precio exacto de **$50 CLP**
- [ ] Producto visible y disponible para compra
- [ ] Verificar que el producto se puede agregar al carrito

### Paso 2: Probar Flujo (Sin Completar Pago)

- [ ] Agregar producto de $50 al carrito
- [ ] Ir a checkout → Verificar que muestra datos del comprador
- [ ] Confirmar compra → Verificar que crea el pedido
- [ ] Ir a página de pago → Verificar que muestra el pedido y monto
- [ ] Hacer clic en "Pagar ahora" → **Verificar que redirige a `https://webpay3g.transbank.cl`** (producción)
- [ ] **NO completar el pago aún**, solo verificar la redirección
- [ ] Volver atrás y verificar que todo funciona

### Paso 3: Transacción Real de Validación

- [ ] Usar una tarjeta REAL (no de prueba)
- [ ] Completar la transacción de $50
- [ ] Verificar que la transacción se aprueba
- [ ] Verificar que el pedido queda marcado como "paid"
- [ ] Documentar la transacción (screenshot, número de orden, token)

## 🔍 Verificación de Logs

Después de hacer deploy, verifica en los logs de Vercel que aparezca:

```
🔧 Configuración de Webpay:
  - PUBLIC_WEBPAY_ENVIRONMENT: production
  - resolvedEnvironment: Production
  - isProduction: true
  - webpayHost: https://webpay3g.transbank.cl
```

Si ves `Integration` o `webpay3gint`, las variables no están configuradas correctamente.

## ⚠️ Errores Comunes

### Error: "Invalid credentials"
- Verifica que las credenciales estén correctamente copiadas (sin espacios)
- Verifica que `PUBLIC_WEBPAY_ENVIRONMENT=production`
- Verifica que el deploy se haya realizado después de actualizar las variables

### Error: "Commerce code not found"
- Verifica que `PUBLIC_WEBPAY_COMMERCE_CODE` tenga el valor correcto de **Tbk-Api-Key-Id**
- Verifica que no haya espacios extra en el valor

### Redirección a ambiente de integración
- Verifica que `PUBLIC_WEBPAY_ENVIRONMENT=production` esté configurado
- Verifica que el deploy se haya realizado después de cambiar la variable
- Limpia la caché del navegador

### La transacción no se completa
- Verifica los logs de Vercel para ver errores del servidor
- Verifica que el endpoint `/api/webpay/confirm` esté funcionando
- Verifica que `PUBLIC_SITE_URL` esté configurada correctamente

## 📝 Checklist Final

Antes de contactar a Transbank:

- [ ] Todas las variables de entorno configuradas en Vercel
- [ ] Deploy realizado exitosamente
- [ ] Logs muestran `Production` y `webpay3g.transbank.cl`
- [ ] Producto de $50 creado y disponible
- [ ] Flujo de pago probado (redirección funciona)
- [ ] Transacción real completada exitosamente
- [ ] Pedido marcado como "paid" en el sistema
- [ ] Evidencia documentada (screenshots, número de orden, etc.)

## 🎯 Siguiente Paso

Una vez completada la transacción de validación:

1. **Contacta a Transbank** con la evidencia de la transacción
2. **Confirma que todo está funcionando** correctamente
3. **Transbank habilitará completamente** tu integración en producción
4. **¡Listo para recibir pagos reales!** 🎉

---

**Nota**: Si tienes dudas durante el proceso, consulta la [documentación oficial de Transbank](https://transbankdevelopers.cl/documentacion/como_empezar#configuracion-de-produccion) o contacta su soporte.

