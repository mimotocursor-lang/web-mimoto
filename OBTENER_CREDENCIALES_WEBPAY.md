# 🔑 Cómo Obtener las Credenciales de Webpay Plus

## 📋 Resumen Rápido

Hay **DOS tipos de credenciales**:

1. **Credenciales de INTEGRACIÓN (Pruebas)** - ✅ Puedes usarlas AHORA para probar
2. **Credenciales de PRODUCCIÓN** - ⏳ Las obtienes después de contratar Webpay Plus

---

## 🧪 Credenciales de INTEGRACIÓN (Para Probar AHORA)

Estas credenciales son **PÚBLICAS** y las puedes usar **INMEDIATAMENTE** para probar:

```env
PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
PUBLIC_WEBPAY_ENVIRONMENT=integration
```

**¿Dónde las conseguí?**
- Son las credenciales **oficiales de Transbank para pruebas**
- Están en la documentación pública de Transbank
- **NO son tus credenciales personales**, son para que todos puedan probar

**¿Para qué sirven?**
- ✅ Probar que la integración funciona
- ✅ Desarrollar y testear tu código
- ✅ Ver cómo funciona Webpay Plus
- ❌ **NO sirven para recibir pagos reales**

**¿Cómo las uso?**
1. Agrégalas a tu archivo `.env` en la carpeta `frontend`
2. Inicia el servidor: `npm run dev`
3. Prueba el endpoint: `http://localhost:4321/api/webpay/test?commerceCode=597055555532&apiKey=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C&environment=integration`

---

## 🏭 Credenciales de PRODUCCIÓN (Para Pagos Reales)

Estas credenciales son **TUS credenciales personales** y las obtienes de Transbank:

### Paso 1: Contratar Webpay Plus

1. **Ve al Portal de Clientes de Transbank:**
   - URL: [www.transbank.cl](https://www.transbank.cl)
   - Inicia sesión con tu RUT y contraseña

2. **Solicitar el Producto:**
   - En el menú lateral, busca **"Solicitar Productos"**
   - O ve directamente a: [Portal → Solicitar Productos](https://www.transbank.cl/portal/empresas/solicitar-productos)
   - Selecciona **"Venta por internet"**
   - Elige **"Webpay Plus"**
   - Completa el formulario con los datos de tu empresa

3. **Esperar Aprobación:**
   - Transbank revisará tu solicitud
   - El proceso puede tardar **2-5 días hábiles**
   - Te notificarán por email cuando esté aprobado

### Paso 2: Obtener las Credenciales

Una vez que Webpay Plus esté aprobado:

1. **Ingresa al Portal de Clientes:**
   - Ve a [www.transbank.cl](https://www.transbank.cl)
   - Inicia sesión

2. **Ve a "Mis Productos" o "Productos Contratados":**
   - Busca **"Webpay Plus"** en la lista
   - Haz clic en él

3. **Busca la sección "Credenciales" o "API Keys":**
   - Ahí encontrarás:
     - **Commerce Code**: Tu código de comercio único (ejemplo: `597012345678`)
     - **API Key**: Tu clave secreta (una cadena larga de letras y números)

4. **Copia las credenciales:**
   - ⚠️ **IMPORTANTE**: Guarda el API Key en un lugar seguro
   - ⚠️ **NO lo compartas** ni lo subas a repositorios públicos
   - ⚠️ Es como una contraseña: quien lo tenga puede hacer transacciones

### Paso 3: Configurar en tu Proyecto

Una vez que tengas tus credenciales:

1. **Abre el archivo `.env`** en la carpeta `frontend`

2. **Reemplaza con tus credenciales:**
   ```env
   PUBLIC_WEBPAY_COMMERCE_CODE=TU_CODIGO_REAL
   PUBLIC_WEBPAY_API_KEY=TU_API_KEY_REAL
   PUBLIC_WEBPAY_ENVIRONMENT=production
   ```

3. **Ejemplo:**
   ```env
   PUBLIC_WEBPAY_COMMERCE_CODE=597012345678
   PUBLIC_WEBPAY_API_KEY=ABCD1234EFGH5678IJKL9012MNOP3456QRST7890UVWX1234YZAB5678CDEF
   PUBLIC_WEBPAY_ENVIRONMENT=production
   ```

---

## 🔍 ¿Dónde Está Cada Valor?

### `PUBLIC_WEBPAY_COMMERCE_CODE`
- **Integración**: `597055555532` (fijo, para todos)
- **Producción**: Lo obtienes en el Portal de Transbank → "Mis Productos" → "Webpay Plus" → "Credenciales"

### `PUBLIC_WEBPAY_API_KEY`
- **Integración**: `579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C` (fijo, para todos)
- **Producción**: Lo obtienes en el Portal de Transbank → "Mis Productos" → "Webpay Plus" → "Credenciales" → "API Key"

### `PUBLIC_WEBPAY_ENVIRONMENT`
- **Integración**: `integration` (para pruebas)
- **Producción**: `production` (para pagos reales)

---

## 📝 Resumen Visual

```
┌─────────────────────────────────────────────────────────┐
│  ¿QUÉ CREDENCIALES USAR?                                 │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  🧪 ESTOY PROBANDO / DESARROLLANDO                       │
│  ─────────────────────────────────────                  │
│  ✅ Usa las credenciales de INTEGRACIÓN                  │
│     (Las que te di arriba)                               │
│                                                           │
│  🏭 QUIERO RECIBIR PAGOS REALES                          │
│  ─────────────────────────────────────                  │
│  ⏳ 1. Contrata Webpay Plus en Transbank                  │
│  ⏳ 2. Espera aprobación (2-5 días)                       │
│  ⏳ 3. Obtén tus credenciales del Portal                  │
│  ⏳ 4. Reemplaza en .env con tus credenciales             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Empezar Ahora (Sin Esperar)

**Puedes empezar a probar INMEDIATAMENTE** con las credenciales de integración:

1. **Crea/edita el archivo `.env`** en `frontend/.env`:
   ```env
   PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
   PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
   PUBLIC_WEBPAY_ENVIRONMENT=integration
   ```

2. **Inicia el servidor:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Prueba que funciona:**
   - Ve a: `http://localhost:4321/api/webpay/test?commerceCode=597055555532&apiKey=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C&environment=integration`
   - Si ves `"success": true` → ✅ ¡Funciona!

4. **Mientras tanto, contrata Webpay Plus:**
   - Ve al Portal de Transbank
   - Solicita Webpay Plus
   - Cuando te den tus credenciales, las reemplazas en `.env`

---

## ❓ Preguntas Frecuentes

### ¿Puedo usar las credenciales de integración en producción?
❌ **NO**. Solo funcionan para pruebas. Para recibir pagos reales necesitas tus propias credenciales.

### ¿Cuánto cuesta Webpay Plus?
- Consulta los precios en el Portal de Transbank
- Generalmente hay una comisión por transacción
- Puede haber costos de mantenimiento mensual

### ¿Cuánto tarda la aprobación?
- Generalmente **2-5 días hábiles**
- Depende de la documentación que envíes
- Transbank te notificará por email

### ¿Necesito certificar la integración?
- ✅ **Sí, para producción**
- Primero desarrolla con credenciales de integración
- Luego envía evidencia de pruebas a Transbank
- Ellos te darán las credenciales de producción

### ¿Dónde está mi API Key si ya contraté Webpay Plus?
1. Portal de Transbank → Inicia sesión
2. "Mis Productos" → "Webpay Plus"
3. Busca "Credenciales" o "API Keys"
4. Ahí está tu Commerce Code y API Key

---

## 📞 Contacto con Transbank

Si tienes dudas sobre cómo obtener las credenciales:

- **Teléfono**: 600 600 60 60
- **Email**: soporte@transbank.cl
- **Portal de Ayuda**: [ayuda.transbank.cl](https://ayuda.transbank.cl)
- **Portal de Clientes**: [www.transbank.cl](https://www.transbank.cl)

---

## ✅ Checklist

- [ ] Entiendo la diferencia entre credenciales de integración y producción
- [ ] He agregado las credenciales de integración a `.env` para probar
- [ ] He iniciado el servidor y probado el endpoint
- [ ] He solicitado Webpay Plus en el Portal de Transbank (si quiero producción)
- [ ] Esperando aprobación de Transbank (si aplica)
- [ ] Cuando tenga mis credenciales, las reemplazaré en `.env`

