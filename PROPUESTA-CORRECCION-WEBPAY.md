# 📋 PROPUESTA DE CORRECCIÓN - FLUJO WEBPAY

**Fecha:** $(date)  
**Estado:** PASO 3 - PROPUESTA DE CORRECCIÓN

---

## 🎯 OBJETIVO

Corregir el flujo de Webpay para que:
1. ✅ Solo `response_code === 0` apruebe pagos
2. ✅ El frontend NO interprete `responseCode`
3. ✅ El backend NO fuerce aprobaciones
4. ✅ Se mantenga la arquitectura existente (controllers/services/modules)
5. ✅ NO se rompa funcionalidad existente

---

## 📝 CAMBIOS PROPUESTOS

### **CAMBIO #1: Backend - Simplificar lógica de aprobación**

**Archivo:** `frontend/src/pages/api/webpay/confirm.ts`

**Cambios específicos:**

1. **Eliminar criterios incorrectos (líneas 323-341):**
   ```typescript
   // ❌ ELIMINAR ESTO:
   const hasTransactionDate = !!commitResponse.transactionDate;
   const hasAmount = !!commitResponse.amount;
   const hasTransactionData = hasTransactionDate && hasAmount;
   const hasAuthorizationCode = !!commitResponse.authorizationCode;
   const isApproved = hasTransactionData || hasResponseCodeZero || hasAuthorizationCode;
   
   // ✅ REEMPLAZAR CON:
   // SOLO usar response_code === 0 según estándar de Transbank
   const isApproved = commitResponse.responseCode === 0 || commitResponse.responseCode === '0';
   ```

2. **NO forzar responseCode (líneas 1053-1056):**
   ```typescript
   // ❌ ELIMINAR ESTO:
   const finalResponseCode = finalIsApproved ? 0 : (commitResponse.responseCode ?? -1);
   
   // ✅ REEMPLAZAR CON:
   // Usar el responseCode real de Transbank, sin modificarlo
   const finalResponseCode = commitResponse.responseCode ?? -1;
   const isApproved = finalResponseCode === 0 || finalResponseCode === '0';
   ```

3. **Simplificar respuesta (líneas 1072-1093):**
   ```typescript
   // ✅ AGREGAR campo claro:
   const responseData = {
     success: isApproved,  // Basado SOLO en response_code === 0
     paymentApproved: isApproved,  // Campo claro para frontend
     responseCode: commitResponse.responseCode,  // Real de Transbank
     responseMessage: commitResponse.responseMessage,
     // ... resto de campos
   };
   ```

4. **Simplificar actualización de estado:**
   - Eliminar múltiples reintentos y verificaciones
   - Mantener solo la lógica esencial
   - Asegurar que si `isApproved = true`, el estado se actualice a 'paid'

---

### **CAMBIO #2: Frontend - Eliminar interpretación de responseCode**

**Archivo:** `frontend/src/pages/pago/confirmar.astro`

**Cambios específicos:**

1. **Eliminar lógica de interpretación (líneas 124-170):**
   ```typescript
   // ❌ ELIMINAR TODO ESTO:
   const responseCodeIsZero = result.responseCode === 0 || result.responseCode === '0';
   const successIsTrue = result.success === true || result.success === 'true';
   const hasAuthorizationCode = !!result.authorizationCode;
   const hasTransactionData = !!(result.transactionDate && result.amount);
   const isPaymentApproved = responseCodeIsZero || successIsTrue || hasAuthorizationCode || (hasTransactionData && !hasExplicitError);
   
   // ✅ REEMPLAZAR CON:
   // El frontend solo confía en lo que el backend le dice
   const isPaymentApproved = result.paymentApproved === true || result.success === true;
   ```

2. **Simplificar lógica de visualización:**
   - Usar solo `result.paymentApproved` o `result.success`
   - NO usar `authorizationCode`, `transactionDate`, `amount` como criterios
   - Mostrar mensaje basado solo en `isPaymentApproved`

---

## 🔄 FLUJO CORREGIDO

### **Backend (`confirm.ts`):**

```typescript
// 1. Recibir token_ws
const { token_ws } = body;

// 2. Llamar commit de Webpay
const commitResponse = await webpayPlus.commit(token_ws);

// 3. Evaluar SOLO con response_code === 0
const isApproved = commitResponse.responseCode === 0 || commitResponse.responseCode === '0';

// 4. Actualizar estado solo si isApproved = true
if (isApproved) {
  await supabase
    .from('orders')
    .update({ 
      status: 'paid',
      payment_reference: `${token_ws}-confirmed`,
      payment_details: { ...commitResponse, stockDeducted: true },
      updated_at: new Date().toISOString()
    })
    .eq('id', order.id);
  
  // Descontar stock, enviar email, etc.
}

// 5. Retornar respuesta clara
return {
  success: isApproved,
  paymentApproved: isApproved,  // Campo claro
  responseCode: commitResponse.responseCode,  // Real de Transbank
  responseMessage: commitResponse.responseMessage,
  // ... resto de campos
};
```

### **Frontend (`confirmar.astro`):**

```typescript
// 1. Llamar al backend
const response = await fetch('/api/webpay/confirm', {
  method: 'POST',
  body: JSON.stringify({ token_ws: tokenWs })
});

const result = await response.json();

// 2. Usar solo lo que el backend le dice
const isPaymentApproved = result.paymentApproved === true || result.success === true;

// 3. Mostrar resultado
if (isPaymentApproved) {
  // Mostrar "pago exitoso"
} else {
  // Mostrar "pago rechazado"
}
```

---

## ✅ VALIDACIONES REQUERIDAS

### **Validación #1: Solo response_code === 0 aprueba**
- ✅ Verificar que `isApproved` solo se calcula con `responseCode === 0`
- ✅ NO usar `authorizationCode`, `transactionDate`, `amount` como criterios

### **Validación #2: Frontend no interpreta**
- ✅ Verificar que el frontend solo usa `result.paymentApproved` o `result.success`
- ✅ NO interpreta `responseCode` directamente

### **Validación #3: Backend no fuerza**
- ✅ Verificar que `responseCode` no se modifica
- ✅ Se usa el valor real de Transbank

### **Validación #4: Orden solo se marca como pagada una vez**
- ✅ Verificar que si la orden ya está en 'paid', no se procesa nuevamente
- ✅ Evitar doble descuento de stock

### **Validación #5: Monto pagado coincide con orden**
- ✅ Verificar que `commitResponse.amount === order.total_amount`
- ✅ Si no coincide, rechazar el pago

---

## 🚨 CASOS ESPECIALES

### **Caso 1: TBK_TOKEN (Cancelación)**
- ✅ Ya está manejado correctamente (líneas 104-123)
- ✅ NO se llama commit
- ✅ NO se actualiza estado

### **Caso 2: Orden ya pagada**
- ✅ Verificar estado antes de procesar
- ✅ Si ya está 'paid', retornar sin procesar

### **Caso 3: Monto no coincide**
- ✅ Verificar que `commitResponse.amount === order.total_amount`
- ✅ Si no coincide, rechazar el pago

### **Caso 4: Error en commit**
- ✅ Capturar error y retornar `success: false`
- ✅ NO actualizar estado
- ✅ Mostrar error al usuario

---

## 📊 IMPACTO DE LOS CAMBIOS

### **✅ Ventajas:**
- ✅ Cumple con estándar de Transbank
- ✅ Elimina falsos positivos
- ✅ Simplifica el código
- ✅ Facilita debugging
- ✅ Consistencia entre frontend y backend

### **⚠️ Consideraciones:**
- ⚠️ Algunos pagos que antes se aprobaban incorrectamente ahora se rechazarán
- ⚠️ Esto es CORRECTO según Transbank
- ⚠️ Puede requerir revisar órdenes históricas

---

## 🔧 ARCHIVOS A MODIFICAR

1. **`frontend/src/pages/api/webpay/confirm.ts`**
   - Simplificar lógica de aprobación
   - Eliminar criterios incorrectos
   - NO forzar responseCode
   - Agregar campo `paymentApproved`

2. **`frontend/src/pages/pago/confirmar.astro`**
   - Eliminar interpretación de responseCode
   - Usar solo `result.paymentApproved`
   - Simplificar lógica de visualización

---

## 📝 PRÓXIMOS PASOS

1. **PASO 4:** Implementar correcciones en backend
2. **PASO 5:** Implementar correcciones en frontend
3. **PASO 6:** Validar que todo funciona correctamente

---

**FIN DE PROPUESTA - PASO 3 COMPLETADO**

