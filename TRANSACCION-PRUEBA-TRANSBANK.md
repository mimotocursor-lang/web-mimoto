# 🧪 Transacción de Prueba que Transbank Solicita

## ✅ Respuesta Correcta

**SÍ, la transacción de prueba es en INTEGRACIÓN (desarrollo), NO en producción.**

## 🎯 ¿Por Qué?

Transbank quiere verificar que:
1. **Tu integración funciona correctamente** antes de darte acceso a producción
2. **Sabes cómo usar su API** correctamente
3. **Tu código está bien implementado**

**NO quieren que uses producción** para pruebas porque:
- En producción se cobra dinero real
- Puede generar transacciones reales no deseadas
- Es más seguro probar primero en integración

## 📋 Proceso Normal con Transbank

### Paso 1: Integración (Pruebas) ← AQUÍ ESTÁS
- Usas el ambiente de **integración**
- Usas credenciales de **prueba** (o las públicas)
- Haces transacciones de **prueba**
- **NO se cobra dinero real**
- Transbank revisa que funcione

### Paso 2: Certificación (Opcional)
- Transbank puede pedirte que demuestres que funciona
- Haces una transacción de prueba en integración
- Les muestras el token y el resultado
- Ellos verifican que todo esté correcto

### Paso 3: Producción (Real)
- **Solo después** de que aprueben tu integración
- Te dan credenciales de producción
- Ahí sí usas producción
- Ahí sí se cobra dinero real

## 🔧 Configuración para la Transacción de Prueba

Para hacer la transacción de prueba que Transbank solicita, usa:

```env
PUBLIC_WEBPAY_ENVIRONMENT=integration
PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
PUBLIC_SITE_URL=http://localhost:4321
```

**O si tienes tus propias credenciales de integración:**

```env
PUBLIC_WEBPAY_ENVIRONMENT=integration
PUBLIC_WEBPAY_COMMERCE_CODE=TU_CODIGO_DE_INTEGRACION
PUBLIC_WEBPAY_API_KEY=TU_API_KEY_DE_INTEGRACION
PUBLIC_SITE_URL=http://localhost:4321
```

## 🧪 Cómo Hacer la Transacción de Prueba

### Opción 1: Página de Prueba (Más Fácil)

1. Ve a: `http://localhost:4321/test-webpay`
2. Haz clic en "Probar Conexión con Webpay"
3. Verás el token generado
4. **Copia ese token** y envíalo a Transbank

### Opción 2: Transacción Completa

1. Agrega productos al carrito
2. Ve a `/checkout` y confirma
3. Ve a `/pago?orderId=TU_ORDER_ID`
4. Haz clic en "Pagar ahora"
5. Completa el pago en Webpay con tarjeta de prueba
6. Cuando Webpay te redirige, el token está en la URL
7. **Copia ese token** y envíalo a Transbank

## 📝 Qué Enviar a Transbank

Cuando Transbank te pida la transacción de prueba, envíales:

1. **El token** (`token_ws`) que se generó
2. **El ambiente usado**: "integración"
3. **El código de comercio usado**: El que usaste (público o el tuyo)
4. **Captura de pantalla** (opcional pero útil) de:
   - La página de Webpay
   - El resultado de la transacción
   - El token en la URL

## 💡 Ejemplo de Respuesta a Transbank

```
Hola,

He realizado la transacción de prueba en el ambiente de integración:

- Ambiente: Integración
- Código de Comercio: 597055555532
- Token generado: 01ab23cd45ef67gh89ij01kl23mn45op67qr89st01uv23wx45yz67ab89cd01ef
- Resultado: Transacción aprobada exitosamente

La integración está funcionando correctamente. ¿Puedo proceder con la activación de producción?

Saludos
```

## ⚠️ Importante

- **NO uses producción** para la transacción de prueba
- **SÍ usa integración** (desarrollo/pruebas)
- **NO se cobra dinero** en integración
- **SÍ se cobra dinero** en producción

## 🎯 Resumen

| Aspecto | Integración (Pruebas) | Producción (Real) |
|---------|---------------------|-------------------|
| **Ambiente** | `integration` | `production` |
| **Código** | Público o de integración | Tu código real |
| **API Key** | Pública o de integración | Tu key real |
| **Dinero** | ❌ NO se cobra | ✅ SÍ se cobra |
| **Para qué** | Pruebas y certificación | Operación real |
| **Transbank pide prueba** | ✅ AQUÍ | ❌ NO aquí |

## ✅ Conclusión

**Sí, la transacción de prueba es en INTEGRACIÓN (desarrollo), no en producción.**

Usa:
- `PUBLIC_WEBPAY_ENVIRONMENT=integration`
- Credenciales de integración (públicas o las tuyas)
- Haz la transacción
- Envía el token a Transbank
- Cuando aprueben, entonces sí pasas a producción


