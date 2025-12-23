# 🚀 Guía para Pasar Webpay a Producción

## 📋 Identificación de Credenciales

Transbank te proporcionó dos credenciales:

### 1. **Tbk-Api-Key-Id** = Código de Comercio (Commerce Code)
- **Variable de entorno**: `PUBLIC_WEBPAY_COMMERCE_CODE`
- **Uso**: Identifica tu comercio en Transbank
- **Ejemplo**: `597055555532` (en integración) → Tu código real en producción

### 2. **Tbk-Api-Key-Secret** = API Key (Clave Secreta)
- **Variable de entorno**: `PUBLIC_WEBPAY_API_KEY`
- **Uso**: Autenticación con la API de Transbank
- **Ejemplo**: `579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C` (en integración) → Tu clave real en producción

## 🔧 Configuración en Vercel (Producción)

### Paso 1: Ir a Configuración de Variables de Entorno

1. Ve a tu proyecto en [Vercel](https://vercel.com)
2. Ve a **Settings** → **Environment Variables**
3. Busca las siguientes variables y actualízalas:

### Paso 2: Actualizar Variables de Entorno

Actualiza estas variables con tus credenciales de producción:

```env
PUBLIC_WEBPAY_ENVIRONMENT=production
PUBLIC_WEBPAY_COMMERCE_CODE=tu_tbk_api_key_id_aqui
PUBLIC_WEBPAY_API_KEY=tu_tbk_api_key_secret_aqui
```

**Importante**: 
- Reemplaza `tu_tbk_api_key_id_aqui` con el valor de **Tbk-Api-Key-Id** que te dieron
- Reemplaza `tu_tbk_api_key_secret_aqui` con el valor de **Tbk-Api-Key-Secret** que te dieron

### Paso 3: Configurar para Todos los Ambientes

Asegúrate de que las variables estén configuradas para:
- ✅ **Production** (producción)
- ✅ **Preview** (opcional, para pruebas)
- ❌ **Development** (mantén las de integración aquí)

### Paso 4: Hacer Deploy

1. Después de actualizar las variables, haz un nuevo deploy:
   - Puedes hacer un commit vacío y push, o
   - Ve a **Deployments** → **Redeploy** del último deployment

## 💻 Configuración Local (Opcional - Solo para Pruebas)

Si quieres probar localmente con producción (⚠️ **NO RECOMENDADO**), crea o actualiza tu archivo `.env` en `frontend/`:

```env
PUBLIC_WEBPAY_ENVIRONMENT=production
PUBLIC_WEBPAY_COMMERCE_CODE=tu_tbk_api_key_id_aqui
PUBLIC_WEBPAY_API_KEY=tu_tbk_api_key_secret_aqui
```

**⚠️ ADVERTENCIA**: 
- **NUNCA** subas el archivo `.env` con credenciales de producción a Git
- Asegúrate de que `.env` esté en `.gitignore`
- Las pruebas de producción deben hacerse en Vercel, no localmente

## 🧪 Proceso de Validación de Transbank

Transbank requiere que completes estos pasos para finalizar la habilitación:

### Paso 1: Habilitar Producto de Prueba ($50)

1. **Crear un producto de prueba en tu sitio**:
   - Ve a tu panel de administración o crea manualmente un producto
   - Configura el precio en **exactamente $50 CLP** (o el equivalente en tu moneda)
   - Asegúrate de que el producto esté visible y disponible para compra

2. **Verificar que el producto funcione**:
   - Agrega el producto al carrito
   - Ve al checkout
   - Verifica que el monto total sea $50

### Paso 2: Realizar Transacción Real de Validación

1. **Usar una tarjeta REAL** (no de prueba):
   - Puede ser tu tarjeta de crédito o débito personal
   - O una tarjeta de prueba que Transbank te proporcione específicamente para validación

2. **Completar la transacción**:
   - Agrega el producto de $50 al carrito
   - Completa el proceso de pago
   - Usa la tarjeta real en el formulario de Webpay
   - Completa la transacción exitosamente

3. **Verificar el resultado**:
   - La transacción debe aparecer como aprobada
   - El pedido debe quedar marcado como "paid" en tu sistema
   - Debes recibir confirmación de Transbank

### Paso 3: Documentar la Transacción

Transbank puede pedirte evidencia de la transacción:
- Screenshot de la página de confirmación de pago
- Número de orden generado
- Token de transacción (si es necesario)
- Comprobante de la transacción en Webpay

## 📝 Checklist de Configuración

Antes de hacer la transacción de validación, verifica:

- [ ] Variables de entorno actualizadas en Vercel:
  - [ ] `PUBLIC_WEBPAY_ENVIRONMENT=production`
  - [ ] `PUBLIC_WEBPAY_COMMERCE_CODE` = Tu Tbk-Api-Key-Id
  - [ ] `PUBLIC_WEBPAY_API_KEY` = Tu Tbk-Api-Key-Secret
- [ ] Deploy realizado en Vercel con las nuevas variables
- [ ] Producto de prueba creado con precio de $50
- [ ] Sitio funcionando correctamente en producción
- [ ] Flujo de pago completo probado (sin completar transacción real aún)

## 🔍 Verificación de Configuración

### Verificar que las Variables Estén Configuradas

Puedes verificar que las variables estén correctamente configuradas revisando los logs de Vercel durante el deploy. El código mostrará en los logs:

```
💰 Monto para Webpay (pesos): [monto]
📋 Datos de transacción: { buyOrder, sessionId, amount, returnUrl }
```

Si ves errores relacionados con autenticación o credenciales, verifica que:
1. Las variables estén escritas correctamente (sin espacios extra)
2. Los valores sean exactamente los que te proporcionó Transbank
3. El ambiente esté configurado como `production`

### Probar el Flujo (Sin Completar Pago)

1. Ve a tu sitio en producción
2. Agrega el producto de $50 al carrito
3. Ve al checkout
4. Haz clic en "Pagar ahora"
5. Deberías ser redirigido a Webpay (debe ser la URL de producción, no de integración)
6. **NO completes el pago aún**, solo verifica que la redirección funcione
7. Vuelve atrás y verifica que todo esté funcionando

## ⚠️ Importante: Diferencias entre Integración y Producción

### Ambiente de Integración (Pruebas)
- URL: `https://webpay3gint.transbank.cl`
- Usa tarjetas de prueba
- No se procesan pagos reales
- Credenciales de prueba

### Ambiente de Producción (Real)
- URL: `https://webpay3g.transbank.cl`
- Usa tarjetas reales
- **Se procesan pagos reales con dinero real**
- Credenciales de producción

**⚠️ ADVERTENCIA CRÍTICA**: 
- Una vez en producción, **TODAS las transacciones son REALES**
- Asegúrate de que tu código esté completamente probado antes de pasar a producción
- Realiza la transacción de validación con cuidado

## 🐛 Solución de Problemas

### Error: "Invalid credentials"
- Verifica que las credenciales estén correctamente copiadas (sin espacios)
- Verifica que `PUBLIC_WEBPAY_ENVIRONMENT=production`
- Verifica que el deploy se haya realizado después de actualizar las variables

### Error: "Commerce code not found"
- Verifica que `PUBLIC_WEBPAY_COMMERCE_CODE` tenga el valor correcto de **Tbk-Api-Key-Id**
- Verifica que no haya espacios extra en el valor

### La transacción no se completa
- Verifica los logs de Vercel para ver errores del servidor
- Verifica que el endpoint `/api/webpay/confirm` esté funcionando
- Verifica que `PUBLIC_SITE_URL` esté configurada correctamente en Vercel

### Redirección a ambiente de integración
- Verifica que `PUBLIC_WEBPAY_ENVIRONMENT=production` esté configurado
- Verifica que el deploy se haya realizado después de cambiar la variable
- Limpia la caché del navegador

## 📚 Recursos Adicionales

- [Documentación de Transbank - Configuración de Producción](https://transbankdevelopers.cl/documentacion/como_empezar#configuracion-de-produccion)
- [Portal de Transbank Developers](https://www.transbankdevelopers.cl/)
- [SDK de Node.js de Transbank](https://github.com/TransbankDevelopers/transbank-sdk-nodejs)

## ✅ Checklist Final

Antes de contactar a Transbank para confirmar que todo está listo:

- [ ] Variables de producción configuradas en Vercel
- [ ] Deploy realizado exitosamente
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

