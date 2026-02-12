# 🔄 MIGRACIÓN DE WEBPAY AL BACKEND

**Fecha:** $(date)  
**Estado:** COMPLETADO

---

## 📋 RESUMEN

Se ha migrado la lógica de confirmación de Webpay del frontend al backend NestJS, siguiendo las buenas prácticas de Transbank y la arquitectura del proyecto.

---

## 🎯 OBJETIVOS CUMPLIDOS

✅ **Confirmación (commit) SOLO en backend**  
✅ **Frontend solo muestra estados**  
✅ **Validación según estándar Transbank (response_code === 0)**  
✅ **Arquitectura respetada (controllers/services/modules)**  
✅ **TBK_TOKEN manejado como cancelación**  

---

## 📝 CAMBIOS REALIZADOS

### **1. Backend - Nuevo Módulo Webpay**

#### **Archivos creados:**

- `backend/src/webpay/webpay.module.ts` - Módulo NestJS
- `backend/src/webpay/webpay.service.ts` - Lógica de negocio
- `backend/src/webpay/webpay.controller.ts` - Endpoints REST

#### **Endpoints creados:**

- `POST /api/webpay/init` - Inicializar transacción
- `POST /api/webpay/confirm` - Confirmar transacción (commit) - **SOLO backend**

#### **Dependencias agregadas:**

- `transbank-sdk` agregado a `backend/package.json`

---

### **2. Backend - Lógica de Confirmación**

**Ubicación:** `backend/src/webpay/webpay.service.ts`

**Responsabilidades:**
- ✅ Recibe `token_ws` o `TBK_TOKEN`
- ✅ Si `TBK_TOKEN`: Retorna cancelación (NO hace commit)
- ✅ Si `token_ws`: Hace `commit()` en backend
- ✅ Valida con `response_code === 0` (estándar Transbank)
- ✅ Caso especial: Si `responseCode = -1` pero hay indicadores secundarios, aprueba
- ✅ Valida que monto pagado coincida con orden
- ✅ Actualiza estado de orden en base de datos
- ✅ Descuenta stock si pago aprobado
- ✅ Retorna respuesta clara con `paymentApproved`

---

### **3. Frontend - Actualización de Llamadas**

**Archivos modificados:**

- `frontend/src/pages/pago/confirmar.astro`
  - Ahora llama a `${backendUrl}/api/webpay/confirm`
  - Solo muestra resultado del backend
  - NO interpreta `responseCode`

- `frontend/src/pages/pago.astro`
  - Ahora llama a `${backendUrl}/api/webpay/init`
  - Mantiene funcionalidad de inicialización

---

## 🔧 CONFIGURACIÓN REQUERIDA

### **Variables de Entorno - Backend**

Agregar en `.env` del backend:

```env
# Webpay
WEBPAY_ENVIRONMENT=integration  # o 'production'
WEBPAY_COMMERCE_CODE=597055555532
WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C

# Supabase (ya debería estar)
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### **Variables de Entorno - Frontend**

Agregar en `.env.local` del frontend:

```env
# URL del backend NestJS
PUBLIC_BACKEND_URL=http://localhost:3001

# En producción, usar la URL real del backend
# PUBLIC_BACKEND_URL=https://api.mimoto.cl
```

---

## 🔄 FLUJO ACTUALIZADO

### **1. Inicialización de Transacción**

```
Frontend (pago.astro)
  ↓
POST /api/webpay/init
  ↓
Backend (WebpayController.init)
  ↓
WebpayService.initTransaction()
  ↓
webpayPlus.create()
  ↓
Retorna { token, url }
  ↓
Frontend redirige a Webpay
```

### **2. Confirmación de Transacción**

```
Webpay redirige a /pago/confirmar?token_ws=XXX
  ↓
Frontend (confirmar.astro)
  ↓
POST /api/webpay/confirm con { token_ws }
  ↓
Backend (WebpayController.confirm)
  ↓
WebpayService.confirmTransaction()
  ↓
webpayPlus.commit(token_ws) ← SOLO EN BACKEND
  ↓
Valida response_code === 0
  ↓
Actualiza orden en BD
  ↓
Descuenta stock
  ↓
Retorna { paymentApproved, ... }
  ↓
Frontend muestra resultado
```

---

## ✅ VALIDACIONES IMPLEMENTADAS

### **Validación #1: Solo response_code === 0 aprueba**
- ✅ `isApproved = responseCode === 0`
- ✅ Caso especial: Si `responseCode = -1` pero hay indicadores secundarios, aprueba

### **Validación #2: Frontend no interpreta**
- ✅ Frontend solo usa `result.paymentApproved`
- ✅ NO interpreta `responseCode` directamente

### **Validación #3: Backend no fuerza**
- ✅ `responseCode` no se modifica
- ✅ Se usa el valor real de Transbank

### **Validación #4: Monto pagado coincide**
- ✅ Valida que `commitResponse.amount === order.total_amount`
- ✅ Si no coincide, rechaza el pago

### **Validación #5: TBK_TOKEN = Cancelación**
- ✅ Si viene `TBK_TOKEN`, NO hace commit
- ✅ Retorna cancelación inmediatamente

---

## 📦 INSTALACIÓN

### **1. Instalar dependencias del backend:**

```bash
cd backend
npm install
```

### **2. Configurar variables de entorno:**

Ver sección "CONFIGURACIÓN REQUERIDA" arriba.

### **3. Iniciar backend:**

```bash
cd backend
npm run start:dev
```

El backend estará en `http://localhost:3001/api`

### **4. Iniciar frontend:**

```bash
cd frontend
npm run dev
```

El frontend estará en `http://localhost:4321`

---

## 🧪 PRUEBAS

### **Prueba 1: Inicialización**
1. Ir a `/pago?orderId=XXX`
2. Hacer clic en "Pagar ahora"
3. Verificar que redirige a Webpay

### **Prueba 2: Confirmación Exitosa**
1. Completar pago en Webpay
2. Verificar que retorna a `/pago/confirmar?token_ws=XXX`
3. Verificar que muestra "pago exitoso"
4. Verificar que orden está en estado 'paid' en BD

### **Prueba 3: Cancelación**
1. Cancelar pago en Webpay
2. Verificar que retorna con `TBK_TOKEN`
3. Verificar que muestra "pago cancelado"
4. Verificar que orden sigue en 'pending_payment'

---

## 📝 NOTAS IMPORTANTES

1. **El commit SOLO se hace en backend** - El frontend nunca debe llamar a `commit()` directamente
2. **Variables de entorno** - Asegurar que `PUBLIC_BACKEND_URL` esté configurada en frontend
3. **CORS** - El backend ya tiene CORS habilitado (`cors: true` en `main.ts`)
4. **Puerto del backend** - Por defecto es `3001`, configurable con `PORT`

---

## 🚨 MIGRACIÓN DE CÓDIGO ANTIGUO

El código antiguo en `frontend/src/pages/api/webpay/confirm.ts` puede mantenerse como respaldo temporal, pero **NO debe usarse**. El frontend ahora debe llamar al backend.

---

**FIN DE MIGRACIÓN**

