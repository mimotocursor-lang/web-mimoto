# 📧 Configuración de Envío de Emails

Esta guía te ayudará a configurar el envío de emails automáticos cuando cambias el estado de una orden.

## 🎯 Servicios Disponibles

El sistema soporta dos servicios de email:

1. **Resend** (Recomendado - Gratis hasta 3,000 emails/mes)
2. **SendGrid** (Gratis hasta 100 emails/día)

## 📋 Opción 1: Resend (Recomendado)

### Paso 1: Crear cuenta en Resend

1. Ve a [https://resend.com](https://resend.com)
2. Crea una cuenta gratuita
3. Verifica tu email

### Paso 2: Obtener API Key

1. Ve a **API Keys** en el dashboard
2. Haz clic en **Create API Key**
3. Dale un nombre (ej: "MIMOTO Production")
4. Copia la API Key (solo se muestra una vez)

### Paso 3: Configurar dominio (Opcional pero recomendado)

1. Ve a **Domains** en el dashboard
2. Agrega tu dominio (ej: `mimoto.cl`)
3. Configura los registros DNS que Resend te proporciona
4. Espera a que se verifique (puede tomar hasta 24 horas)

**Nota:** Si no configuras un dominio, puedes usar el dominio de prueba de Resend, pero los emails pueden ir a spam.

### Paso 4: Configurar variables de entorno

En **Vercel**:

1. Ve a tu proyecto → **Settings** → **Environment Variables**
2. Agrega las siguientes variables:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=noreply@mimoto.cl (o usa el dominio de prueba de Resend)
FROM_NAME=MIMOTO
EMAIL_SERVICE=resend
```

**Para desarrollo local**, agrega estas variables a tu archivo `.env`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=noreply@mimoto.cl
FROM_NAME=MIMOTO
EMAIL_SERVICE=resend
```

## 📋 Opción 2: SendGrid

### Paso 1: Crear cuenta en SendGrid

1. Ve a [https://sendgrid.com](https://sendgrid.com)
2. Crea una cuenta gratuita
3. Verifica tu email

### Paso 2: Obtener API Key

1. Ve a **Settings** → **API Keys**
2. Haz clic en **Create API Key**
3. Dale un nombre y permisos "Full Access"
4. Copia la API Key (solo se muestra una vez)

### Paso 3: Verificar remitente

1. Ve a **Settings** → **Sender Authentication**
2. Verifica un remitente (Single Sender Verification)
3. Ingresa tu email y verifica el código que recibes

### Paso 4: Configurar variables de entorno

En **Vercel**:

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
FROM_EMAIL=tu-email-verificado@mimoto.cl
FROM_NAME=MIMOTO
EMAIL_SERVICE=sendgrid
```

## ✅ Verificación

Una vez configurado:

1. Ve a `/admin/ordenes`
2. Abre los detalles de una orden
3. Cambia el estado (ej: de "Pagado" a "Pedido Recibido")
4. El cliente debería recibir un email automáticamente

## 🔍 Debugging

Si los emails no se envían:

1. **Revisa los logs de Vercel:**
   - Ve a tu proyecto en Vercel
   - Abre **Functions** → Busca `/api/orders/update-status`
   - Revisa los logs cuando cambias un estado

2. **Verifica las variables de entorno:**
   - Asegúrate de que estén configuradas en Vercel
   - Verifica que los nombres sean exactos (case-sensitive)

3. **Revisa la consola del navegador:**
   - Abre la consola (F12)
   - Busca mensajes que empiecen con `📧`

## 📝 Mensajes de Email

Los emails se envían automáticamente cuando cambias el estado a:

- **Pedido Recibido** (`order_received`)
- **Pedido Confirmado** (`order_confirmed`)
- **Pedido Entregado** (`order_delivered`)

## ⚠️ Notas Importantes

1. **Límites gratuitos:**
   - Resend: 3,000 emails/mes
   - SendGrid: 100 emails/día

2. **Spam:**
   - Configura SPF y DKIM en tu dominio para evitar spam
   - Resend y SendGrid te proporcionan las instrucciones

3. **Desarrollo:**
   - En desarrollo local, los emails se loguean en la consola si no hay API key configurada
   - Esto no afecta la funcionalidad, solo no se envían emails reales

## 🆘 Problemas Comunes

### "Email no se envía"
- Verifica que las variables de entorno estén configuradas
- Revisa los logs de Vercel para ver errores específicos
- Verifica que el email del cliente esté en la base de datos

### "Emails van a spam"
- Configura SPF y DKIM en tu dominio
- Usa un dominio verificado (no el dominio de prueba)
- Evita palabras spam en el contenido

### "Error 401/403"
- Verifica que la API Key sea correcta
- Asegúrate de que la API Key tenga los permisos necesarios
- En SendGrid, verifica que el remitente esté verificado

## 📚 Recursos

- [Resend Documentation](https://resend.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

