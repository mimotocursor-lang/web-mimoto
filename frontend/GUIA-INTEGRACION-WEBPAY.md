# 🚀 Guía de Integración con Webpay (Transbank)

## 📋 Resumen

Esta guía explica cómo completar la integración con Webpay de Transbank, incluyendo las pruebas de integración necesarias.

## ⚠️ IMPORTANTE: Ambiente de Pruebas vs Producción

### **Las pruebas se hacen en INTEGRACIÓN (NO en producción)**

- **Ambiente de INTEGRACIÓN**: Para pruebas y desarrollo
- **Ambiente de PRODUCCIÓN**: Solo después de completar las pruebas exitosamente

## 🔧 Configuración Actual

Tu código ya está configurado para usar el ambiente de integración:

```typescript
const environment = import.meta.env.PUBLIC_WEBPAY_ENVIRONMENT === 'production' 
  ? Environment.Production 
  : Environment.Integration;
```

**Por defecto usa INTEGRACIÓN** (a menos que configures `PUBLIC_WEBPAY_ENVIRONMENT=production`).

## 📝 Variables de Entorno Necesarias

### Para INTEGRACIÓN (Pruebas)

```env
PUBLIC_WEBPAY_ENVIRONMENT=integration
PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
```

Estas son las credenciales de **prueba** que Transbank proporciona.

### Para PRODUCCIÓN (Después de las pruebas)

```env
PUBLIC_WEBPAY_ENVIRONMENT=production
PUBLIC_WEBPAY_COMMERCE_CODE=tu_codigo_comercio_real
PUBLIC_WEBPAY_API_KEY=tu_api_key_real
```

## 🧪 Pruebas de Integración Requeridas

Transbank requiere que realices **varias transacciones de prueba** con diferentes escenarios antes de habilitar el ambiente de producción.

### Tarjetas de Prueba de Transbank

Transbank proporciona tarjetas de prueba específicas para diferentes escenarios:

#### ✅ Transacciones Aprobadas

| Tarjeta | CVV | Resultado |
|---------|-----|-----------|
| 4051885600446623 | 123 | Aprobada |
| 4051885600446623 | 123 | Aprobada (normal) |

#### ❌ Transacciones Rechazadas

| Tarjeta | CVV | Resultado |
|---------|-----|-----------|
| 4051885600446623 | 123 | Rechazada (simular con monto específico) |

#### 💳 Transacciones en Cuotas

| Tarjeta | CVV | Cuotas | Resultado |
|---------|-----|--------|-----------|
| 4051885600446623 | 123 | 3, 6, 12 | Aprobada en cuotas |

### Escenarios de Prueba Requeridos

1. **Transacción Aprobada Normal**
   - Monto: Cualquiera
   - Resultado esperado: Pago exitoso, orden marcada como "paid"

2. **Transacción Rechazada**
   - Monto: Cualquiera
   - Resultado esperado: Pago rechazado, orden permanece como "pending_payment"

3. **Transacción en Cuotas (3 cuotas)**
   - Monto: Cualquiera
   - Cuotas: 3
   - Resultado esperado: Pago aprobado en 3 cuotas

4. **Transacción en Cuotas (6 cuotas)**
   - Monto: Cualquiera
   - Cuotas: 6
   - Resultado esperado: Pago aprobado en 6 cuotas

5. **Transacción en Cuotas (12 cuotas)**
   - Monto: Cualquiera
   - Cuotas: 12
   - Resultado esperado: Pago aprobado en 12 cuotas

## 🔄 Flujo de Pruebas

### 1. Realizar Pruebas en Desarrollo

1. Asegúrate de tener las variables de entorno configuradas para INTEGRACIÓN
2. Realiza las transacciones de prueba usando las tarjetas proporcionadas
3. Verifica que cada escenario funcione correctamente:
   - ✅ Transacciones aprobadas actualizan el estado de la orden
   - ❌ Transacciones rechazadas muestran el error correctamente
   - 💳 Transacciones en cuotas se procesan correctamente

### 2. Documentar las Pruebas

Transbank puede pedirte evidencia de las pruebas. Documenta:
- Screenshots de cada transacción
- Logs del servidor
- Confirmación de que cada escenario funciona

### 3. Solicitar Habilitación de Producción

Una vez completadas las pruebas:
1. Contacta a Transbank (a través de su portal o soporte)
2. Proporciona evidencia de las pruebas realizadas
3. Solicita las credenciales de producción
4. Transbank te habilitará el ambiente de producción

### 4. Cambiar a Producción

Una vez que Transbank te proporcione las credenciales de producción:
1. Actualiza las variables de entorno en Vercel:
   - `PUBLIC_WEBPAY_ENVIRONMENT=production`
   - `PUBLIC_WEBPAY_COMMERCE_CODE=tu_codigo_real`
   - `PUBLIC_WEBPAY_API_KEY=tu_api_key_real`
2. Re-deploy el proyecto
3. Realiza una transacción de prueba en producción (con monto mínimo)
4. Verifica que todo funcione correctamente

## 🐛 Solución de Problemas

### Botón de Pago Deshabilitado

Si el botón de pago está deshabilitado:
1. Verifica que `orderId` esté en la URL
2. Verifica que `orderTotal` se haya cargado correctamente
3. Revisa la consola del navegador para errores
4. Verifica que Supabase esté cargado correctamente

### Error al Iniciar Pago

Si hay error al hacer clic en "Pagar ahora":
1. Verifica las variables de entorno de Webpay
2. Verifica que el endpoint `/api/webpay/init` esté funcionando
3. Revisa los logs del servidor en Vercel
4. Verifica que `SUPABASE_SERVICE_ROLE_KEY` esté configurada

### Error en Confirmación de Pago

Si hay error al confirmar el pago:
1. Verifica que el endpoint `/api/webpay/confirm` esté funcionando
2. Verifica que el `token_ws` se esté recibiendo correctamente
3. Revisa los logs del servidor

## 📚 Recursos Adicionales

- [Documentación de Transbank](https://www.transbankdevelopers.cl/)
- [SDK de Node.js de Transbank](https://github.com/TransbankDevelopers/transbank-sdk-nodejs)
- [Portal de Transbank Developers](https://www.transbankdevelopers.cl/documentacion/como_empezar)

## ✅ Checklist de Integración

- [ ] Variables de entorno configuradas para INTEGRACIÓN
- [ ] Realizar transacción aprobada normal
- [ ] Realizar transacción rechazada
- [ ] Realizar transacción en 3 cuotas
- [ ] Realizar transacción en 6 cuotas
- [ ] Realizar transacción en 12 cuotas
- [ ] Documentar todas las pruebas
- [ ] Solicitar credenciales de producción a Transbank
- [ ] Configurar variables de producción
- [ ] Realizar prueba final en producción

