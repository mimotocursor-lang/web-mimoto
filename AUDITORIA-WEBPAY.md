# 🔍 AUDITORÍA COMPLETA DEL FLUJO DE COMPRA Y WEBPAY

**Fecha:** $(date)  
**Estado:** PASO 1 - AUDITORÍA COMPLETA (SIN MODIFICAR CÓDIGO)

---

## 📋 RESUMEN EJECUTIVO

Se ha completado la auditoría del flujo de compra y Webpay. Se identificaron **4 problemas críticos** que violan las buenas prácticas de Transbank y las reglas establecidas.

---

## 🔄 FLUJO ACTUAL DOCUMENTADO

### 1. **CREACIÓN DEL CARRITO**
- **Ubicación:** Frontend (localStorage)
- **Archivos:**
  - `frontend/src/layouts/BaseLayout.astro` (líneas 1131-1217)
  - `frontend/components/cart/CartSummary.tsx`
- **Funcionamiento:**
  - El carrito se guarda en `localStorage` con clave `mimoto_cart_v1`
  - Se agregan productos mediante botones con `data-add-to-cart`
  - Estructura: `[{ id, name, price, quantity }]`

### 2. **CÁLCULO DE TOTALES**
- **Ubicaciones múltiples:**
  - **Frontend:**
    - `frontend/src/pages/checkout.astro` (líneas 87-103)
    - `frontend/components/cart/CartSummary.tsx` (línea 39: `subtotal`)
  - **Backend:**
    - `frontend/src/pages/api/orders/create.ts` (líneas 177-179, 308-310)
- **Fórmula:** `total = sum(item.price * item.quantity)`
- **⚠️ PROBLEMA POTENCIAL:** El total se calcula en múltiples lugares, puede haber discrepancias

### 3. **CREACIÓN DE ORDEN**
- **Ubicación:** `frontend/src/pages/api/orders/create.ts`
- **Endpoint:** `POST /api/orders/create`
- **Flujo:**
  1. Recibe items del carrito + datos del cliente
  2. Calcula `total_amount` (líneas 177-179 o 308-310)
  3. Crea orden en Supabase con status `pending_payment` o `pending`
  4. Crea `order_items` asociados
  5. Retorna `order.id`
- **Estado inicial:** `pending_payment` o `pending`

### 4. **INICIO DE TRANSACCIÓN WEBPAY**
- **Ubicación:** `frontend/src/pages/api/webpay/init.ts`
- **Endpoint:** `POST /api/webpay/init`
- **Flujo:**
  1. Recibe `orderId` y `returnUrl`
  2. Obtiene orden de Supabase
  3. Configura Webpay Plus SDK
  4. Llama a `webpayPlus.create(buyOrder, sessionId, amount, returnUrl)` (línea 123)
  5. Guarda `token` en `orders.payment_reference` (línea 183)
  6. Retorna `{ token, url }` al frontend
- **✅ CORRECTO:** El commit NO se hace aquí

### 5. **REDIRECCIÓN A WEBPAY**
- **Ubicación:** `frontend/src/pages/pago.astro` (líneas 368-443)
- **Flujo:**
  1. Usuario hace clic en "Pagar ahora"
  2. Frontend llama a `/api/webpay/init`
  3. Recibe `token` y `url`
  4. Crea formulario POST con `token_ws` y redirige a Webpay

### 6. **RETORNO DESDE WEBPAY**
- **Ubicación:** `frontend/src/pages/pago/confirmar.astro`
- **URL:** `/pago/confirmar?token_ws=XXX` o `/pago/confirmar?TBK_TOKEN=XXX`
- **Flujo:**
  1. Detecta si viene `TBK_TOKEN` (cancelado) o `token_ws` (pago normal)
  2. Si `TBK_TOKEN`: Muestra mensaje de cancelación (líneas 41-72) ✅ CORRECTO
  3. Si `token_ws`: Llama a `/api/webpay/confirm` (línea 103)

### 7. **CONFIRMACIÓN DEL PAGO (BACKEND)**
- **Ubicación:** `frontend/src/pages/api/webpay/confirm.ts`
- **Endpoint:** `POST /api/webpay/confirm`
- **Flujo actual:**
  1. Recibe `token_ws` o `TBK_TOKEN`
  2. Si `TBK_TOKEN`: Retorna cancelación (líneas 104-123) ✅ CORRECTO
  3. Si `token_ws`:
     - Busca orden por `payment_reference` (línea 157)
     - Llama a `webpayPlus.commit(token_ws)` (línea 283) ✅ CORRECTO (en backend)
     - **❌ PROBLEMA:** Usa criterios incorrectos para aprobar (líneas 323-341)
     - **❌ PROBLEMA:** Fuerza `responseCode` a 0 si `isApproved` (líneas 1053-1056)
     - Actualiza estado de orden
     - Descuenta stock
     - Envía email
     - Retorna respuesta al frontend

### 8. **INTERPRETACIÓN EN FRONTEND**
- **Ubicación:** `frontend/src/pages/pago/confirmar.astro` (líneas 94-414)
- **❌ PROBLEMA CRÍTICO:** El frontend está interpretando si el pago fue aprobado
- **Lógica actual (INCORRECTA):**
  - Líneas 124-146: Analiza `responseCode`, `authorizationCode`, `transactionDate`, `amount`
  - Línea 146: `isPaymentApproved = responseCodeIsZero || successIsTrue || hasAuthorizationCode || (hasTransactionData && !hasExplicitError)`
  - **VIOLA REGLAS:** El frontend NO debe decidir si un pago fue aprobado

---

## 🚨 PROBLEMAS CRÍTICOS IDENTIFICADOS

### **PROBLEMA #1: FRONTEND INTERPRETA responseCode** ⚠️ CRÍTICO
**Ubicación:** `frontend/src/pages/pago/confirmar.astro` (líneas 124-146)

**Código problemático:**
```typescript
const responseCodeIsZero = result.responseCode === 0 || result.responseCode === '0';
const successIsTrue = result.success === true || result.success === 'true';
const hasAuthorizationCode = !!result.authorizationCode;
const hasTransactionData = !!(result.transactionDate && result.amount);
const isPaymentApproved = responseCodeIsZero || successIsTrue || hasAuthorizationCode || (hasTransactionData && !hasExplicitError);
```

**Problema:**
- El frontend está decidiendo si el pago fue aprobado usando múltiples criterios
- **VIOLA REGLA:** "El frontend solo puede leer token_ws o TBK_TOKEN, mostrar estados visuales, redirigir o llamar a backend"
- **VIOLA REGLA:** "No interpretar responseCode en frontend"

**Impacto:**
- El frontend puede mostrar "pago exitoso" aunque el backend no haya aprobado
- Riesgo de inconsistencia entre frontend y backend

---

### **PROBLEMA #2: BACKEND USA CRITERIOS INCORRECTOS** ⚠️ CRÍTICO
**Ubicación:** `frontend/src/pages/api/webpay/confirm.ts` (líneas 323-341)

**Código problemático:**
```typescript
 const hasAmount = !!commitResponse.amount;
const hasTransactionData = hasTransactionDate && hasAmount;
const hasResponseCodeZero = commitResponse.responseCode === 0 || commitResponse.responseCode === '0';
const hasAuthorizationCode = !!commitResponse.authorizationCode;
const isApproved = hasTransactionData || hasResponseCodeZero || hasAuthorizationCode;
```

**Problema:**
- El backend está usando `transactionDate && amount` como criterio principal
- Está usando `authorizationCode` como criterio
- **VIOLA REGLA:** "Solo response_code === 0 es válido para aprobar pagos"
- **VIOLA REGLA:** "authorizationCode, transactionDate o success NO son criterio válido"

**Impacto:**
- Puede aprobar pagos que Transbank rechazó (responseCode !== 0)
- Puede marcar órdenes como pagadas incorrectamente

---

### **PROBLEMA #3: BACKEND FUERZA responseCode A 0** ⚠️ CRÍTICO
**Ubicación:** `frontend/src/pages/api/webpay/confirm.ts` (líneas 1053-1056)

**Código problemático:**
```typescript
const finalIsApproved = finalCheckIsApproved || statusIsApproved;
const finalSuccess = finalIsApproved;
const finalResponseCode = finalIsApproved ? 0 : (commitResponse.responseCode ?? -1);
```

**Problema:**
- Si `finalIsApproved` es true (por criterios incorrectos), fuerza `responseCode` a 0
- Esto oculta el `responseCode` real de Transbank
- **VIOLA REGLA:** "No forzar aprobaciones"

**Impacto:**
- Oculta errores reales de Transbank
- Dificulta el debugging
- Puede aprobar pagos rechazados

---

### **PROBLEMA #4: LÓGICA COMPLEJA Y REDUNDANTE** ⚠️ MEDIO
**Ubicación:** `frontend/src/pages/api/webpay/confirm.ts` (múltiples secciones)

**Problema:**
- Hay múltiples verificaciones y recálculos de `isApproved`
- Código muy largo (1118 líneas) con lógica duplicada
- Múltiples intentos de forzar actualización de estado

**Impacto:**
- Dificulta el mantenimiento
- Aumenta riesgo de bugs
- Hace difícil entender el flujo

---

## ✅ ASPECTOS CORRECTOS ENCONTRADOS

1. **✅ Commit se hace en backend:** `webpayPlus.commit()` se llama en `confirm.ts` (línea 283)
2. **✅ TBK_TOKEN se maneja correctamente:** No se llama commit si viene `TBK_TOKEN` (líneas 104-123)
3. **✅ token_ws se envía al backend:** El frontend solo lee el token y lo envía (línea 108)
4. **✅ Inicialización correcta:** `webpayPlus.create()` se hace en backend (línea 123)

---

## 📊 DIAGNÓSTICO DEL PROBLEMA REPORTADO

**Problema reportado:** "Webpay muestra 'pago exitoso' pero la orden queda pendiente/rechazada"

**Causa raíz identificada:**
1. El backend está usando criterios incorrectos (`transactionDate && amount`) en lugar de solo `response_code === 0`
2. El frontend está interpretando la respuesta y puede mostrar éxito aunque el backend no haya aprobado
3. Hay múltiples verificaciones que pueden fallar, dejando la orden en estado incorrecto

**Flujo problemático actual:**
```
1. Usuario paga en Webpay → Transbank procesa
2. Webpay retorna con token_ws
3. Backend llama commit() → Recibe responseCode = -1 (rechazado)
4. Backend verifica: "¿Hay transactionDate y amount?" → SÍ (aunque responseCode = -1)
5. Backend marca como isApproved = true (INCORRECTO)
6. Backend intenta actualizar estado a 'paid' pero puede fallar
7. Frontend recibe respuesta con success = true (por criterios incorrectos)
8. Frontend muestra "pago exitoso" aunque la orden quedó pendiente
```

**Solución requerida:**
- Usar SOLO `response_code === 0` para aprobar
- El frontend solo debe mostrar lo que el backend le dice
- Simplificar la lógica de confirmación

---

## 📝 PRÓXIMOS PASOS

1. **PASO 2:** Diagnosticar problemas específicos
2. **PASO 3:** Proponer corrección del flujo
3. **PASO 4:** Implementar correcciones

---

**FIN DE AUDITORÍA - PASO 1 COMPLETADO**

