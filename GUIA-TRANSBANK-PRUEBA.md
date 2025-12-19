# Guía: Cómo Hacer una Transacción de Prueba con Transbank

## 📚 ¿Qué son los Ambientes?

### Ambiente de Integración (Pruebas)
- **URL**: `https://webpay3gint.transbank.cl`
- **Propósito**: Probar tu integración antes de ir a producción
- **Tarjetas**: Usa tarjetas de prueba (no son reales)
- **Código de Comercio**: Ya está pre-configurado para pruebas
- **No se cobra dinero real**

### Ambiente de Producción (Real)
- **URL**: `https://webpay3g.transbank.cl`
- **Propósito**: Transacciones reales con tarjetas reales
- **Tarjetas**: Tarjetas de crédito/débito reales
- **Código de Comercio**: El que te da Transbank cuando contratas
- **SÍ se cobra dinero real**

## 🎯 Paso 1: Configurar Variables de Entorno

Crea o edita el archivo `frontend/.env.local`:

```env
# Ambiente de Integración (PRUEBAS)
PUBLIC_WEBPAY_ENVIRONMENT=integration
PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C

# URL de tu sitio (para las redirecciones)
PUBLIC_SITE_URL=http://localhost:4321
```

**Nota**: Estos valores son para el ambiente de integración y ya están configurados en el código.

## 🧪 Paso 2: Probar la Conexión

### Opción A: Usar el Endpoint de Prueba

1. Inicia tu servidor de desarrollo:
   ```bash
   cd frontend
   npm run dev
   ```

2. Abre en tu navegador:
   ```
   http://localhost:4321/api/webpay/test
   ```

3. Deberías ver una respuesta JSON indicando que Webpay está funcionando.

### Opción B: Hacer una Transacción Completa de Prueba

1. Agrega productos al carrito en tu sitio
2. Ve a `/checkout`
3. Completa el checkout
4. Serás redirigido a `/pago?orderId=TU_ORDER_ID`
5. Haz clic en "Pagar ahora"
6. Serás redirigido a Webpay

## 💳 Paso 3: Usar Tarjetas de Prueba

Cuando llegues a la página de Webpay, usa estas tarjetas:

### ✅ Tarjetas que APROBAN la transacción:

**VISA**
- Número: `4051 8856 0044 6623`
- CVV: `123`
- Fecha: Cualquier fecha futura (ej: 12/25)

**AMEX**
- Número: `3700 0000 0002 032`
- CVV: `1234`
- Fecha: Cualquier fecha futura

**Redcompra (Débito)**
- Número: `4051 8842 3993 7763`
- O: `4511 3466 6003 7060`

**Prepago VISA**
- Número: `4051 8860 0005 6590`
- CVV: `123`
- Fecha: Cualquier fecha futura

### ❌ Tarjetas que RECHAZAN la transacción:

**MASTERCARD**
- Número: `5186 0595 5959 0568`
- CVV: `123`
- Fecha: Cualquier fecha futura

**Redcompra (Rechazada)**
- Número: `5186 0085 4123 3829`

**Prepago MASTERCARD**
- Número: `5186 1741 1062 9480`
- CVV: `123`
- Fecha: Cualquier fecha futura

### 🔐 Autenticación con RUT

Si aparece un formulario pidiendo RUT y clave:
- **RUT**: `11.111.111-1`
- **Clave**: `123`

## 🔄 Flujo Completo de Prueba

1. **Agregar productos al carrito** → `/tienda`
2. **Ir al checkout** → `/checkout`
3. **Confirmar pedido** → Se crea un pedido en la base de datos
4. **Ir a pago** → `/pago?orderId=TU_ORDER_ID`
5. **Clic en "Pagar ahora"** → Se inicia la transacción con Webpay
6. **Redirección a Webpay** → Ingresas datos de tarjeta de prueba
7. **Confirmar pago** → Webpay procesa la transacción
8. **Redirección de vuelta** → `/pago/confirmar?orderId=TU_ORDER_ID&token_ws=TOKEN`
9. **Confirmación** → Tu servidor confirma el pago con Transbank
10. **Resultado** → Se muestra si fue aprobado o rechazado

## 🐛 Solución de Problemas

### Error: "Variables de entorno no configuradas"
- Verifica que `frontend/.env.local` exista
- Reinicia el servidor después de cambiar `.env.local`

### Error: "Pedido no encontrado"
- Asegúrate de que el `orderId` sea válido
- Verifica que el pedido exista en la tabla `orders` de Supabase

### Error: "Error al crear la transacción"
- Verifica que estés usando el ambiente correcto (`integration`)
- Asegúrate de que el código de comercio sea el de integración
- Revisa los logs del servidor para más detalles

### La página de Webpay no carga
- Verifica tu conexión a internet
- Asegúrate de que la URL de retorno sea accesible
- Revisa la consola del navegador para errores

## 📝 Notas Importantes

1. **En integración NO se cobra dinero real** - Puedes probar todas las veces que quieras
2. **Las tarjetas de prueba solo funcionan en integración** - No funcionan en producción
3. **El código de comercio de integración es público** - Cualquiera puede usarlo para pruebas
4. **Para producción necesitas**:
   - Contratar Webpay Plus con Transbank
   - Obtener tu código de comercio real
   - Obtener tu API Key real
   - Cambiar `PUBLIC_WEBPAY_ENVIRONMENT=production`

## 🚀 Siguiente Paso: Ir a Producción

Cuando estés listo para producción:

1. Contrata Webpay Plus en el Portal de Clientes de Transbank
2. Obtén tu código de comercio y API Key de producción
3. Actualiza las variables de entorno:
   ```env
   PUBLIC_WEBPAY_ENVIRONMENT=production
   PUBLIC_WEBPAY_COMMERCE_CODE=TU_CODIGO_REAL
   PUBLIC_WEBPAY_API_KEY=TU_API_KEY_REAL
   ```
4. Prueba con una transacción pequeña primero
5. Monitorea las transacciones en el Portal de Clientes

