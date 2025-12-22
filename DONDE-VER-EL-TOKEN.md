# 🔑 Dónde Ver el Token de Transbank

## 📍 Lugares Donde Aparece el Token

El token (`token_ws`) aparece en **3 lugares principales**:

### 1. 🧪 Página de Prueba (Más Fácil)

**URL:** `http://localhost:4321/test-webpay`

1. Haz clic en "Probar Conexión con Webpay"
2. Si es exitoso, verás una caja verde con el **token destacado**
3. El token aparece en grande y puedes copiarlo con un botón
4. **Este es el lugar más fácil para verlo**

### 2. 🌐 En la URL (Después del Pago)

Cuando Webpay te redirige de vuelta a tu sitio, el token aparece en la URL:

```
http://localhost:4321/pago/confirmar?orderId=TU_ORDER_ID&token_ws=EL_TOKEN_AQUI
```

**Cómo verlo:**
- Mira la barra de direcciones del navegador
- Busca el parámetro `token_ws=`
- Todo lo que viene después del `=` es el token

### 3. 💻 En la Consola del Navegador

Si abres la consola del navegador (F12), verás el token en los logs:

1. Presiona `F12` para abrir las herramientas de desarrollador
2. Ve a la pestaña "Console"
3. Busca mensajes que digan "token" o "token_ws"
4. El token aparecerá ahí

## 🎯 Cómo Hacer una Transacción de Prueba Completa

### Paso 1: Iniciar la Transacción

1. Agrega productos al carrito
2. Ve a `/checkout`
3. Confirma el pedido
4. Serás redirigido a `/pago?orderId=TU_ORDER_ID`

### Paso 2: Hacer Clic en "Pagar Ahora"

1. En la página de pago, haz clic en "Pagar ahora"
2. Tu servidor llama a `/api/webpay/init`
3. **Aquí se genera el token** (lo puedes ver en la consola del navegador)
4. Serás redirigido a Webpay

### Paso 3: Completar el Pago en Webpay

1. Ingresa los datos de la tarjeta de prueba
2. Completa el pago
3. Webpay te redirige de vuelta

### Paso 4: Ver el Token en la URL

Cuando Webpay te redirige, la URL será algo como:

```
http://localhost:4321/pago/confirmar?orderId=abc123&token_ws=01ab23cd45ef67gh89ij01kl23mn45op67qr89st01uv23wx45yz67ab89cd01ef
```

**El token es:** `01ab23cd45ef67gh89ij01kl23mn45op67qr89st01uv23wx45yz67ab89cd01ef`

## 🔍 Método Más Rápido: Página de Prueba

**La forma más fácil es usar la página de prueba:**

1. Ve a: `http://localhost:4321/test-webpay`
2. Haz clic en "Probar Conexión con Webpay"
3. El token aparecerá en una caja verde destacada
4. Puedes copiarlo con un solo clic

## 📋 Qué Hacer con el Token

Una vez que tengas el token, Transbank te puede pedir que:

1. **Lo envíes por email** - Cópialo y pégalo en el email
2. **Lo ingreses en un formulario** - Cópialo y pégalo donde te lo pidan
3. **Lo uses para consultar el estado** - Puedes usarlo en la API de Transbank

## 🛠️ Ver el Token en el Código

Si quieres ver el token en el código del servidor, puedes agregar un `console.log`:

**En `frontend/src/pages/api/webpay/init.ts`:**

```typescript
const createResponse = await webpayPlus.create(...);

console.log('🔑 Token generado:', createResponse.token); // ← Aquí verás el token

return new Response(...);
```

Luego revisa los logs del servidor cuando hagas una transacción.

## 💡 Tips

- **El token es único por transacción** - Cada vez que inicias un pago, se genera uno nuevo
- **El token expira** - Si pasas mucho tiempo, el token puede expirar
- **Copia el token completo** - Asegúrate de copiar todo el token, es una cadena larga
- **No compartas tokens de producción** - Los tokens de producción son sensibles

## 🎬 Ejemplo Visual

```
1. Haces clic en "Pagar ahora"
   ↓
2. Tu servidor genera el token
   Token: 01ab23cd45ef67gh...
   ↓
3. Te redirige a Webpay
   ↓
4. Completas el pago
   ↓
5. Webpay te redirige de vuelta
   URL: /pago/confirmar?token_ws=01ab23cd45ef67gh...
   ↑
   AQUÍ ESTÁ EL TOKEN EN LA URL
```

## ❓ ¿Necesitas el Token para Algo Específico?

Si Transbank te pidió el token para algo específico, dímelo y te ayudo a encontrarlo o usarlo correctamente.


