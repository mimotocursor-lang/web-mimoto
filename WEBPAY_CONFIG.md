# Configuración de Webpay Plus para Mimoto

## ✅ Integración Completa Implementada

Se ha implementado una **integración completa de Webpay Plus** que permite:

- ✅ Pasar el monto automáticamente desde el pedido
- ✅ Pasar los datos del cliente automáticamente
- ✅ Redirigir al proceso de pago normal de Webpay con todo prellenado
- ✅ Recibir confirmación automática del pago
- ✅ Actualizar el estado del pedido automáticamente

## Arquitectura

La integración consta de:

1. **Endpoint `/api/webpay/init`**: Inicia la transacción de Webpay Plus
2. **Endpoint `/api/webpay/confirm`**: Confirma la transacción después del pago
3. **Página `/pago`**: Muestra el resumen y botón para iniciar el pago
4. **Página `/pago/confirmar`**: Procesa la confirmación y muestra el resultado

## Configuración de Variables de Entorno

Agrega estas variables a tu archivo `.env` o configuración de entorno:

```env
# Credenciales de Webpay Plus (OBLIGATORIAS para producción)
PUBLIC_WEBPAY_COMMERCE_CODE=tu_commerce_code
PUBLIC_WEBPAY_API_KEY=tu_api_key

# Ambiente (integration para pruebas, production para producción)
PUBLIC_WEBPAY_ENVIRONMENT=integration

# URL base del sitio (para las URLs de retorno)
PUBLIC_SITE_URL=https://tu-dominio.com

# Variables de Supabase (ya deberían estar configuradas)
PUBLIC_SUPABASE_URL=tu_supabase_url
PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### Credenciales de Prueba (Integration)

Para pruebas, puedes usar estas credenciales de integración:

```env
PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
PUBLIC_WEBPAY_ENVIRONMENT=integration
```

### Credenciales de Producción

Para producción, necesitas:

1. **Contratar Webpay Plus** en el Portal de Clientes de Transbank
2. **Obtener tus credenciales** (Commerce Code y API Key)
3. **Configurar las variables** con tus credenciales reales
4. **Cambiar `PUBLIC_WEBPAY_ENVIRONMENT`** a `production`

## Cómo Funciona

1. **Checkout**: El usuario completa el checkout y se crea una orden en la base de datos
2. **Página de Pago**: Se redirige a `/pago?orderId=XXX` donde se muestra:
   - Número de pedido
   - Monto a pagar
   - Botón "Pagar ahora"
3. **Iniciar Transacción**: Al hacer clic en "Pagar ahora":
   - Se llama a `/api/webpay/init` con el `orderId`
   - El endpoint obtiene el monto y datos del cliente desde Supabase
   - Se crea la transacción en Webpay Plus usando el SDK
   - Se guarda el token de la transacción en el pedido
   - Se retorna la URL de Webpay con el token
4. **Redirección a Webpay**: El usuario es redirigido a Webpay donde:
   - El monto ya está prellenado
   - Los datos del cliente ya están prellenados
   - Solo necesita seleccionar el método de pago y completar la transacción
5. **Confirmación**: Después del pago, Webpay redirige a `/pago/confirmar?token_ws=XXX`:
   - Se llama a `/api/webpay/confirm` para confirmar la transacción
   - Se actualiza el estado del pedido en Supabase
   - Se muestra el resultado al usuario (éxito o error)

## 🔍 Cómo Verificar si Tienes Webpay Plus

Si Transbank te dio un código de comercio, sigue estos pasos para verificar si tienes Webpay Plus activo:

### Opción 1: Verificar en el Portal de Clientes

1. Ingresa al [Portal de Clientes de Transbank](https://www.transbank.cl)
2. Accede con tu RUT y contraseña
3. En el menú lateral, busca la sección **"Mis Productos"** o **"Productos Contratados"**
4. Busca **"Webpay Plus"** en la lista
5. Si aparece, significa que está contratado
6. Verifica que el estado sea **"Activo"** o **"Habilitado"**

### Opción 2: Probar las Credenciales con el Endpoint de Prueba

He creado un endpoint de prueba que verifica si tus credenciales funcionan:

**URL de prueba:**
```
http://localhost:4321/api/webpay/test?commerceCode=TU_CODIGO&apiKey=TU_API_KEY&environment=integration
```

**Ejemplo:**
```
http://localhost:4321/api/webpay/test?commerceCode=597055555532&apiKey=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C&environment=integration
```

**Qué hace:**
- Intenta crear una transacción de prueba con tus credenciales
- Si funciona → ✅ Tienes Webpay Plus activo
- Si falla → Te indica el problema específico

**Respuestas posibles:**

✅ **Éxito:**
```json
{
  "success": true,
  "message": "✅ ¡Webpay Plus está activo y funcionando!",
  "detalles": {
    "commerceCode": "597055555532",
    "environment": "integration",
    "token": "...",
    "url": "..."
  }
}
```

❌ **Error de credenciales:**
```json
{
  "success": false,
  "error": "Error al probar Webpay Plus",
  "diagnostico": "Las credenciales (Commerce Code o API Key) son incorrectas",
  "solucion": "Verifica que el Commerce Code y API Key sean correctos..."
}
```

❌ **No tienes Webpay Plus:**
```json
{
  "success": false,
  "error": "Error al probar Webpay Plus",
  "diagnostico": "No tienes permisos para usar Webpay Plus con estas credenciales",
  "solucion": "Verifica que Webpay Plus esté contratado y activo en tu cuenta de Transbank"
}
```

### Opción 3: Contactar a Transbank

Si no estás seguro, contacta a Transbank:

- **Teléfono**: 600 600 60 60
- **Email**: [soporte@transbank.cl](mailto:soporte@transbank.cl)
- **Portal de Ayuda**: [ayuda.transbank.cl](https://ayuda.transbank.cl)

Pregunta específicamente: *"¿Tengo Webpay Plus contratado con el código de comercio [TU_CODIGO]?"*

## Pasos para Activar en Producción

### 1. Contratar Webpay Plus

1. Ingresa al [Portal de Clientes de Transbank](https://www.transbank.cl)
2. Accede con tu RUT y contraseña
3. En el menú lateral, selecciona "Solicitar Productos"
4. Elige "Venta por internet" → "Webpay Plus"
5. Completa el proceso de contratación

### 2. Obtener Credenciales

Una vez contratado, recibirás:
- **Commerce Code**: Código de comercio único
- **API Key**: Clave secreta para autenticación

### 3. Configurar Variables de Entorno

Actualiza tu archivo `.env` con las credenciales de producción:

```env
PUBLIC_WEBPAY_COMMERCE_CODE=tu_commerce_code_real
PUBLIC_WEBPAY_API_KEY=tu_api_key_real
PUBLIC_WEBPAY_ENVIRONMENT=production
```

### 4. Certificación

Antes de pasar a producción, Transbank requiere certificación:

1. Realiza pruebas con transacciones reales
2. Completa el documento de evidencia de integración
3. Envía el documento a [email protected]
4. Espera la aprobación de Transbank

### 5. Documentación Oficial

- [Transbank Developers](https://www.transbankdevelopers.cl)
- [Webpay Plus - Documentación](https://www.transbankdevelopers.cl/documentacion/webpay_plus)
- [Guía de Integración](https://www.transbankdevelopers.cl/documentacion/webpay_plus/inicio)

## Pruebas

### Pruebas con Credenciales de Integración

1. **Configurar credenciales de prueba** en `.env`:
   ```env
   PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
   PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
   PUBLIC_WEBPAY_ENVIRONMENT=integration
   ```

2. **Crear un pedido de prueba**:
   - Agrega productos al carrito
   - Completa el checkout
   - Se creará una orden con estado `pending_payment`

3. **Probar el flujo de pago**:
   - Ve a `/pago?orderId=XXX`
   - Verifica que el monto se muestre correctamente
   - Haz clic en "Pagar ahora"
   - Serás redirigido a Webpay (ambiente de integración)
   - Usa las tarjetas de prueba de Transbank:
     - **VISA**: 4051885600446623
     - **CVV**: 123
     - **Fecha**: Cualquier fecha futura
     - **RUT**: 11.111.111-1
     - **Clave**: 123

4. **Verificar confirmación**:
   - Después del pago, serás redirigido a `/pago/confirmar`
   - Deberías ver el mensaje de éxito o error
   - El estado del pedido debería actualizarse en Supabase

### Tarjetas de Prueba

Transbank proporciona tarjetas de prueba para diferentes escenarios:

- **Aprobada**: 4051885600446623
- **Rechazada**: 4051885600446624
- **Sin fondos**: 4051885600446625

Más información: [Tarjetas de Prueba](https://www.transbankdevelopers.cl/documentacion/como_empezar#ambiente-de-integracion)

## Notas Importantes

- ✅ La integración está completa y lista para usar
- ✅ El monto y datos del cliente se pasan automáticamente
- ✅ El estado del pedido se actualiza automáticamente
- ⚠️ Para producción, necesitas contratar Webpay Plus y obtener credenciales reales
- ⚠️ Las credenciales de integración solo funcionan en ambiente de pruebas

