# ❌ Cómo Generar una Transacción Rechazada

## 🎯 Objetivo

Obtener el token de una transacción **rechazada** usando las tarjetas de prueba de Transbank.

## 💳 Tarjetas que Generan Rechazo

### Opción 1: MASTERCARD (Recomendada)
- **Número**: `5186 0595 5959 0568`
- **CVV**: `123`
- **Fecha**: Cualquier fecha futura (ej: 12/25)
- **Resultado**: ❌ Transacción rechazada

### Opción 2: Redcompra (Rechazada)
- **Número**: `5186 0085 4123 3829`
- **Resultado**: ❌ Transacción rechazada

### Opción 3: Prepago MASTERCARD
- **Número**: `5186 1741 1062 9480`
- **CVV**: `123`
- **Fecha**: Cualquier fecha futura
- **Resultado**: ❌ Transacción rechazada

## 📋 Pasos para Generar el Token de Rechazo

### Paso 1: Configurar para Integración

Asegúrate de que tu `.env.local` tenga:

```env
PUBLIC_WEBPAY_ENVIRONMENT=integration
PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
PUBLIC_SITE_URL=http://localhost:4321
```

### Paso 2: Hacer una Transacción Completa

1. **Agrega productos al carrito** en `/tienda`
2. **Ve a `/checkout`** y confirma el pedido
3. **Serás redirigido a `/pago?orderId=TU_ORDER_ID`**
4. **Haz clic en "Pagar ahora"**
5. **Serás redirigido a Webpay**

### Paso 3: Usar Tarjeta que Rechaza

Cuando llegues a la página de Webpay:

1. **Ingresa los datos de la tarjeta MASTERCARD de rechazo:**
   - Número: `5186 0595 5959 0568`
   - CVV: `123`
   - Fecha: Cualquier fecha futura (ej: 12/25)
   - Nombre: Cualquier nombre

2. **Completa el pago** (si pide RUT: `11.111.111-1` y clave: `123`)

3. **Webpay procesará la transacción y la RECHAZARÁ**

### Paso 4: Obtener el Token

Cuando Webpay te redirige de vuelta, la URL será algo como:

```
http://localhost:4321/pago/confirmar?orderId=TU_ORDER_ID&token_ws=EL_TOKEN_AQUI
```

**El token está en el parámetro `token_ws` de la URL.**

Incluso si la transacción fue rechazada, **el token se genera igual** y puedes usarlo.

## 🔍 Ver el Token en la Página de Confirmación

Después de que Webpay te redirige, la página `/pago/confirmar` mostrará:

- **Estado**: "Pago Rechazado"
- **Token**: Está en la URL
- **Mensaje de error**: El motivo del rechazo

## 📝 Token de Ejemplo

Un token de transacción rechazada se ve igual que uno aprobado, algo como:

```
01ab23cd45ef67gh89ij01kl23mn45op67qr89st01uv23wx45yz67ab89cd01ef
```

**La diferencia está en el resultado de la confirmación, no en el token mismo.**

## 🎯 Método Rápido

### Opción A: Transacción Completa (Recomendada)

1. Agrega productos → Checkout → Pago
2. Usa tarjeta `5186 0595 5959 0568` (MASTERCARD rechazada)
3. Copia el token de la URL cuando Webpay te redirige

### Opción B: Solo Iniciar Transacción

1. Ve a `/test-webpay`
2. Haz clic en "Probar Conexión"
3. Copia el token que aparece
4. **Nota**: Este token es solo de inicio, no de una transacción completada

## ⚠️ Importante

- **El token se genera ANTES de saber si será aprobado o rechazado**
- **El token es el mismo formato** para aprobadas y rechazadas
- **La diferencia está en el resultado** cuando confirmas el token
- **Para Transbank, necesitas el token de una transacción completada** (aunque sea rechazada)

## 📋 Qué Enviar a Transbank

Cuando tengas el token de una transacción rechazada, envíales:

```
Transacción de prueba rechazada:
- Ambiente: Integración
- Token: [el token que obtuviste]
- Tarjeta usada: MASTERCARD 5186 0595 5959 0568
- Resultado: Rechazada (como se esperaba)
- Código de respuesta: [el código que aparece]
```

## 🔄 Si Necesitas Ambos Tokens

1. **Token de aprobada**: Usa tarjeta VISA `4051 8856 0044 6623`
2. **Token de rechazada**: Usa tarjeta MASTERCARD `5186 0595 5959 0568`

Ambos tokens se obtienen de la misma manera, solo cambia la tarjeta.

