# 📦 Guía de Gestión de Órdenes - Panel Admin

## 🎯 Funcionalidades Implementadas

### 1. **Panel de Administración de Órdenes**
- **Ruta**: `/admin/ordenes`
- **Acceso**: Solo usuarios con rol `admin`
- **Funcionalidades**:
  - Ver todas las órdenes con filtros por estado
  - Ver detalles completos de cada orden
  - Ver comprobante de pago exitoso
  - Cambiar estado de las órdenes
  - Ver información del cliente

### 2. **Estados de Pedido Disponibles**

Los estados disponibles son:
- `pending_payment` - Pendiente de Pago
- `waiting_confirmation` - Esperando Confirmación
- `paid` - Pagado
- `order_received` - **Pedido Recibido** (nuevo)
- `order_confirmed` - **Pedido Confirmado** (nuevo)
- `order_delivered` - **Pedido Entregado** (nuevo)
- `cancelled` - Cancelado

### 3. **Flujo de Estados**

```
paid → order_received → order_confirmed → order_delivered
```

- **Pagado** → Puede cambiar a **Pedido Recibido**
- **Pedido Recibido** → Puede cambiar a **Pedido Confirmado**
- **Pedido Confirmado** → Puede cambiar a **Pedido Entregado**

### 4. **Notificaciones Automáticas**

Cuando cambias el estado de un pedido, el cliente recibe automáticamente:

#### **Pedido Recibido**
- **Email**: "Tu pedido #X ha sido recibido y está siendo procesado."
- **WhatsApp**: Mensaje personalizado con el número de pedido y monto

#### **Pedido Confirmado**
- **Email**: "Tu pedido #X ha sido confirmado y está siendo preparado."
- **WhatsApp**: Mensaje personalizado con el número de pedido y monto

#### **Pedido Entregado**
- **Email**: "¡Tu pedido #X ha sido entregado! Gracias por tu compra."
- **WhatsApp**: Mensaje personalizado con el número de pedido y monto

## 🔧 Configuración Inicial

### Paso 1: Actualizar Base de Datos

Ejecuta estos scripts en el **Supabase SQL Editor**:

1. **Agregar nuevos estados al enum:**
   ```sql
   -- Ejecutar: supabase/add-order-statuses.sql
   ```

2. **Agregar columna payment_details (si no existe):**
   ```sql
   -- Ejecutar: supabase/add-payment-details-column.sql
   ```

### Paso 2: Configurar Notificaciones

#### WhatsApp (Opcional pero Recomendado)

1. Ve a **Vercel → Settings → Environment Variables**
2. Agrega:
   - `WHATSAPP_TOKEN` = Tu token de WhatsApp Cloud API
   - `WHATSAPP_PHONE_ID` = Tu Phone Number ID de WhatsApp

**Nota**: Si no configuras WhatsApp, el sistema generará URLs de WhatsApp Web que puedes copiar y enviar manualmente.

#### Email (Opcional)

Para enviar emails, necesitas integrar un servicio como:
- **Resend** (recomendado)
- **SendGrid**
- **Mailgun**

El código está preparado para integrar estos servicios. Por ahora, los emails se loguean en la consola.

## 📋 Cómo Usar el Panel

### Ver Todas las Órdenes

1. Ve a `/admin/ordenes`
2. Usa el filtro para ver órdenes por estado
3. Haz clic en "Ver Detalles" para ver información completa

### Ver Detalles de una Orden

Al hacer clic en "Ver Detalles", verás:

- **Información del Pedido**:
  - Número de orden
  - Estado actual
  - Monto total
  - Fechas de creación y actualización
  - Referencia de pago

- **Información del Cliente**:
  - Nombre completo
  - Email
  - Teléfono (si está disponible)

- **Comprobante de Pago** (si el pago fue exitoso):
  - Código de autorización
  - Fecha de transacción
  - Tipo de pago
  - Últimos 4 dígitos de la tarjeta
  - Información de cuotas (si aplica)

- **Productos del Pedido**:
  - Lista de productos con cantidades y precios

### Cambiar Estado de un Pedido

1. Abre los detalles de la orden
2. En la sección "Cambiar Estado del Pedido", verás botones según el estado actual:
   - Si está **Pagado**: Botón "📦 Marcar como Pedido Recibido"
   - Si está **Pedido Recibido**: Botón "✅ Marcar como Pedido Confirmado"
   - Si está **Pedido Confirmado**: Botón "🚚 Marcar como Pedido Entregado"
3. Haz clic en el botón correspondiente
4. Confirma el cambio
5. El cliente recibirá una notificación automática

## 🔍 Ver Comprobante de Pago

El comprobante de pago se muestra automáticamente en los detalles de la orden si:
- El pago fue exitoso (`responseCode === 0`)
- Se guardaron los detalles en `payment_details`

El comprobante incluye:
- Código de autorización
- Fecha y hora de la transacción
- Tipo de pago (Débito, Crédito, Cuotas)
- Últimos 4 dígitos de la tarjeta
- Información de cuotas (si aplica)

## 📱 Configuración de Notificaciones

### WhatsApp

El sistema intenta enviar WhatsApp automáticamente si:
- `WHATSAPP_TOKEN` está configurado
- `WHATSAPP_PHONE_ID` está configurado
- El cliente tiene un teléfono registrado

Si WhatsApp no está configurado, verás en los logs:
- El mensaje que se enviaría
- Una URL de WhatsApp Web que puedes copiar y usar manualmente

### Email

Actualmente, los emails se loguean en la consola. Para habilitar envío real:

1. Integra un servicio de email (Resend, SendGrid, etc.)
2. Actualiza la función `sendNotifications` en `/api/orders/update-status.ts`
3. Agrega las variables de entorno necesarias

## 🐛 Solución de Problemas

### Error: "Estado no es válido"
- Verifica que ejecutaste el script `add-order-statuses.sql`
- Verifica que el estado que intentas usar existe en el enum

### Error: "No tienes permisos"
- Verifica que tu usuario tenga `role = 'admin'` en la tabla `users`
- Verifica que estés autenticado correctamente

### Las notificaciones no se envían
- Verifica que `WHATSAPP_TOKEN` y `WHATSAPP_PHONE_ID` estén configurados (para WhatsApp)
- Verifica que el cliente tenga email/teléfono registrado
- Revisa los logs del servidor para ver errores específicos

### No se muestra el comprobante de pago
- Verifica que el pago fue exitoso (`responseCode === 0`)
- Verifica que la columna `payment_details` existe en la tabla `orders`
- Verifica que se guardaron los detalles en `payment_details`

## 📝 Checklist de Configuración

- [ ] Ejecutado `add-order-statuses.sql` en Supabase
- [ ] Ejecutado `add-payment-details-column.sql` en Supabase (si no existe)
- [ ] Variables de entorno configuradas en Vercel:
  - [ ] `WHATSAPP_TOKEN` (opcional)
  - [ ] `WHATSAPP_PHONE_ID` (opcional)
- [ ] Usuario tiene rol `admin` en la tabla `users`
- [ ] Probado el flujo completo:
  - [ ] Ver órdenes
  - [ ] Ver detalles de orden
  - [ ] Ver comprobante de pago
  - [ ] Cambiar estado de pedido
  - [ ] Verificar notificación al cliente

## 🎉 ¡Listo!

Una vez configurado, podrás:
- ✅ Ver todas las órdenes exitosas en el dashboard
- ✅ Ver el comprobante de pago de cada orden
- ✅ Cambiar el estado de los pedidos
- ✅ Notificar automáticamente a los clientes

---

**Nota**: Las notificaciones son no bloqueantes, por lo que si fallan, no afectarán la actualización del estado del pedido.

