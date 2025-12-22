# ¿Qué Código de Comercio Usar?

## 🔍 Respuesta Corta

**Depende del ambiente en el que estés:**

### Ambiente de INTEGRACIÓN (Pruebas)
- **Usa el código de comercio de integración** que Transbank te proporciona
- El código `597055555532` que está en el código es un código de prueba **público** que Transbank ofrece
- **PERO** si ya tienes tu propio código de comercio de integración de Transbank, **usa ese**

### Ambiente de PRODUCCIÓN (Real)
- **DEBES usar tu código de comercio REAL** que Transbank te da cuando contratas Webpay Plus
- **NO uses** el código de prueba en producción

## 📋 Cómo Saber Qué Código Usar

### Si estás en INTEGRACIÓN (Pruebas):

1. **Opción 1: Usar el código público de prueba**
   ```env
   PUBLIC_WEBPAY_ENVIRONMENT=integration
   PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
   PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
   ```
   - Este código funciona para todos
   - Es público y cualquiera puede usarlo
   - Solo para pruebas

2. **Opción 2: Usar tu código de integración personal**
   ```env
   PUBLIC_WEBPAY_ENVIRONMENT=integration
   PUBLIC_WEBPAY_COMMERCE_CODE=TU_CODIGO_DE_INTEGRACION
   PUBLIC_WEBPAY_API_KEY=TU_API_KEY_DE_INTEGRACION
   ```
   - Si ya tienes cuenta en Transbank y te dieron un código de integración
   - Lo encuentras en el Portal de Clientes de Transbank
   - Es específico para tu cuenta

### Si estás en PRODUCCIÓN (Real):

**DEBES usar tu código real:**
```env
PUBLIC_WEBPAY_ENVIRONMENT=production
PUBLIC_WEBPAY_COMMERCE_CODE=TU_CODIGO_REAL
PUBLIC_WEBPAY_API_KEY=TU_API_KEY_REAL
```

- Este código te lo da Transbank cuando contratas Webpay Plus
- Es único para tu comercio
- Solo funciona en producción

## 🎯 Recomendación

### Para empezar (si no tienes cuenta en Transbank):
- **Usa el código público de prueba** (`597055555532`)
- Es el más fácil para empezar
- No necesitas cuenta en Transbank
- Solo para pruebas

### Si ya tienes cuenta en Transbank:
- **Usa tu código de integración personal**
- Lo encuentras en el Portal de Clientes de Transbank
- Es mejor porque está asociado a tu cuenta
- Puedes ver las transacciones en el portal

### Para producción:
- **Solo usa tu código real** cuando:
  1. Ya contrataste Webpay Plus
  2. Transbank te dio tus credenciales de producción
  3. Ya probaste todo en integración
  4. Estás listo para recibir pagos reales

## 🔐 Dónde Encontrar Tu Código de Comercio

1. **Portal de Clientes de Transbank**: https://www.transbank.cl/
2. Inicia sesión con tu cuenta
3. Ve a "Mis Productos" o "Webpay Plus"
4. Ahí verás:
   - Código de Comercio de Integración
   - Código de Comercio de Producción
   - API Keys correspondientes

## ⚠️ Importante

- **NO mezcles códigos**: Si usas código de integración, usa API Key de integración
- **NO uses código de producción en integración**: No funcionará
- **NO uses código de integración en producción**: No funcionará
- **El código público** (`597055555532`) solo funciona en integración

## 📝 Resumen

| Ambiente | Código a Usar | API Key |
|----------|---------------|---------|
| **Integración (sin cuenta)** | `597055555532` (público) | `579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C` |
| **Integración (con cuenta)** | Tu código de integración | Tu API Key de integración |
| **Producción** | Tu código real | Tu API Key real |


