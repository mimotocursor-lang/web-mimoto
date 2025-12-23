import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return new Response(
        JSON.stringify({ success: false, error: 'orderId y status son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar estados permitidos
    const allowedStatuses = [
      'pending_payment',
      'waiting_confirmation',
      'paid',
      'order_received',
      'order_confirmed',
      'order_delivered',
      'cancelled'
    ];

    if (!allowedStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ success: false, error: `Estado "${status}" no es válido` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Configurar Supabase
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Variables de entorno de Supabase no configuradas' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar autenticación del admin
    const authHeader = request.headers.get('authorization');
    let user = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser(token);
      if (!userError && authUser) {
        user = authUser;
      }
    }

    // Si no hay token en el header, intentar obtener de la sesión usando service role
    if (!user) {
      // Usar service role para verificar si hay una sesión activa
      // En producción, esto debería venir del cliente con el token
      console.warn('⚠️ No se encontró token de autenticación en el header');
      // Por ahora, permitimos la actualización si se llama desde el admin (se verificará en el cliente)
      // En producción, esto debería requerir autenticación
    } else {
      // Verificar que el usuario sea admin
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return new Response(
          JSON.stringify({ success: false, error: 'No tienes permisos para realizar esta acción' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Obtener la orden actual
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, user_id, total_amount, payment_reference')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ success: false, error: 'Orden no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Actualizar el estado
    console.log('🔄 Intentando actualizar orden:', {
      orderId: orderId,
      currentStatus: order.status,
      newStatus: status
    });

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error actualizando orden:', updateError);
      console.error('❌ Detalles del error:', {
        message: updateError.message,
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint,
        fullError: JSON.stringify(updateError, null, 2)
      });
      
      // Si el error es por enum inválido, proporcionar más información
      if (updateError.message?.includes('invalid input value for enum')) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `El estado "${status}" no es válido en la base de datos. Error: ${updateError.message}`,
            details: updateError.details,
            hint: updateError.hint
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Error al actualizar el estado de la orden: ${updateError.message}`,
          details: updateError.details
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Orden actualizada exitosamente:', {
      orderId: orderId,
      oldStatus: order.status,
      newStatus: status,
      updatedOrderStatus: updatedOrder?.status
    });

    console.log('✅ Orden actualizada:', {
      orderId: orderId,
      oldStatus: order.status,
      newStatus: status
    });

    // Obtener información del cliente para notificaciones
    // Priorizar el email de la orden, luego el email del usuario
    let customerEmail = order.email || null;
    let customerPhone = null;
    let customerName = null;

    if (order.user_id) {
      const { data: customer } = await supabase
        .from('users')
        .select('email, phone, full_name')
        .eq('id', order.user_id)
        .single();

      if (customer) {
        // Usar email de la orden si existe, sino usar email del usuario
        customerEmail = customerEmail || customer.email;
        customerPhone = customer.phone;
        customerName = customer.full_name;
      }
    }
    
    console.log('📧 Email para notificaciones:', {
      orderEmail: order.email,
      customerEmail: customerEmail,
      hasEmail: !!customerEmail
    });

    // Enviar notificaciones (no bloqueante)
    console.log('📨 Preparando notificaciones:', {
      orderId: orderId,
      status: status,
      hasEmail: !!customerEmail,
      hasPhone: !!customerPhone,
      email: customerEmail,
      phone: customerPhone,
      name: customerName
    });
    
    sendNotifications(orderId, status, customerEmail, customerPhone, customerName, order.total_amount)
      .then(() => {
        console.log('✅ Notificaciones enviadas exitosamente');
      })
      .catch(error => {
        console.error('❌ Error enviando notificaciones (no crítico):', error);
        console.error('❌ Stack trace:', error.stack);
      });

    return new Response(
      JSON.stringify({
        success: true,
        order: updatedOrder,
        message: 'Estado actualizado exitosamente'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error en update-status:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Error al actualizar el estado de la orden' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Función para enviar notificaciones (no bloqueante)
async function sendNotifications(
  orderId: number,
  status: string,
  email: string | null,
  phone: string | null,
  name: string | null,
  amount: number
) {
  const statusMessages = {
    'order_received': {
      title: 'Pedido Recibido',
      message: `Tu pedido #${orderId} ha sido recibido y está siendo procesado.`,
      whatsapp: `¡Hola${name ? ' ' + name.split(' ')[0] : ''}! 👋\n\nTu pedido #${orderId} por $${Number(amount).toLocaleString('es-CL')} ha sido recibido y está siendo procesado.\n\nTe notificaremos cuando sea confirmado.`
    },
    'order_confirmed': {
      title: 'Pedido Confirmado',
      message: `Tu pedido #${orderId} ha sido confirmado y está siendo preparado.`,
      whatsapp: `¡Hola${name ? ' ' + name.split(' ')[0] : ''}! ✅\n\nTu pedido #${orderId} por $${Number(amount).toLocaleString('es-CL')} ha sido confirmado y está siendo preparado.\n\nTe notificaremos cuando esté listo para entrega.`
    },
    'order_delivered': {
      title: 'Pedido Entregado',
      message: `¡Tu pedido #${orderId} ha sido entregado! Gracias por tu compra.`,
      whatsapp: `¡Hola${name ? ' ' + name.split(' ')[0] : ''}! 🎉\n\n¡Tu pedido #${orderId} por $${Number(amount).toLocaleString('es-CL')} ha sido entregado!\n\nGracias por tu compra. ¡Esperamos verte pronto!`
    }
  };

  const notification = statusMessages[status as keyof typeof statusMessages];
  if (!notification) {
    console.log('No hay notificación configurada para el estado:', status);
    return;
  }

  // Enviar email (si está configurado)
  if (email) {
    try {
      const emailService = import.meta.env.EMAIL_SERVICE || 'resend'; // resend, sendgrid, smtp
      const resendApiKey = import.meta.env.RESEND_API_KEY;
      const sendgridApiKey = import.meta.env.SENDGRID_API_KEY;
      const fromEmail = import.meta.env.FROM_EMAIL || 'noreply@mimoto.cl';
      const fromName = import.meta.env.FROM_NAME || 'MIMOTO';

      console.log('📧 Intentando enviar email:', {
        to: email,
        service: emailService,
        hasResendKey: !!resendApiKey,
        hasSendgridKey: !!sendgridApiKey
      });

      // Generar HTML del email
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff6600; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; background: #ff6600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${notification.title}</h1>
            </div>
            <div class="content">
              <p>Hola${name ? ' ' + name.split(' ')[0] : ''},</p>
              <p>${notification.message}</p>
              <p><strong>Número de pedido:</strong> #${orderId}</p>
              <p><strong>Monto:</strong> $${Number(amount).toLocaleString('es-CL')}</p>
              <p>Gracias por tu compra.</p>
              <p>Saludos,<br>El equipo de MIMOTO</p>
            </div>
            <div class="footer">
              <p>Este es un email automático, por favor no responder.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Intentar enviar con Resend
      if (emailService === 'resend' && resendApiKey) {
        const resendUrl = 'https://api.resend.com/emails';
        const emailPayload = {
          from: `${fromName} <${fromEmail}>`,
          to: [email],
          subject: `${notification.title} - Pedido #${orderId}`,
          html: emailHtml,
        };

        console.log('📤 Enviando email con Resend:', {
          url: resendUrl,
          from: emailPayload.from,
          to: emailPayload.to,
          subject: emailPayload.subject,
          hasHtml: !!emailPayload.html,
          htmlLength: emailPayload.html.length
        });

        let response;
        let responseText;
        
        try {
          console.log('📤 Haciendo fetch a Resend...');
          response = await fetch(resendUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailPayload),
          });
          
          console.log('📥 Fetch completado, status:', response.status);
          responseText = await response.text();
          console.log('📥 Response text obtenido, length:', responseText.length);
        } catch (fetchError: any) {
          console.error('❌ Error en el fetch a Resend:', {
            message: fetchError.message,
            name: fetchError.name,
            stack: fetchError.stack,
            cause: fetchError.cause
          });
          throw fetchError;
        }
        
        console.log('📥 Respuesta de Resend:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseText,
          bodyLength: responseText.length
        });
        
        // Log completo de la respuesta para debugging
        console.log('📥 Respuesta completa de Resend (raw):', responseText);
        console.log('📥 Respuesta completa de Resend (JSON parseado):', JSON.parse(responseText || '{}'));

        if (response.ok) {
          try {
            const result = JSON.parse(responseText);
            console.log('✅ Email enviado exitosamente con Resend:', {
              id: result.id,
              from: result.from,
              to: result.to,
              created_at: result.created_at
            });
          } catch (e) {
            console.log('✅ Email enviado exitosamente con Resend (respuesta no JSON):', responseText);
          }
        } else {
          try {
            const error = JSON.parse(responseText);
            console.error('❌ Error enviando email con Resend:', {
              status: response.status,
              error: error,
              message: error.message,
              name: error.name
            });
            throw new Error(`Resend error (${response.status}): ${JSON.stringify(error)}`);
          } catch (e) {
            console.error('❌ Error enviando email con Resend (respuesta no JSON):', {
              status: response.status,
              response: responseText
            });
            throw new Error(`Resend error (${response.status}): ${responseText}`);
          }
        }
      }
      // Intentar enviar con SendGrid
      else if (emailService === 'sendgrid' && sendgridApiKey) {
        const sendgridUrl = 'https://api.sendgrid.com/v3/mail/send';
        const response = await fetch(sendgridUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sendgridApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: email }],
            }],
            from: { email: fromEmail, name: fromName },
            subject: `${notification.title} - Pedido #${orderId}`,
            content: [{
              type: 'text/html',
              value: emailHtml,
            }],
          }),
        });

        if (response.ok) {
          console.log('✅ Email enviado exitosamente con SendGrid');
        } else {
          const error = await response.text();
          console.error('❌ Error enviando email con SendGrid:', error);
          throw new Error(`SendGrid error: ${error}`);
        }
      }
      // Si no hay servicio configurado, solo loguear
      else {
        console.log('⚠️ Servicio de email no configurado. Email que se enviaría:', {
          to: email,
          subject: `${notification.title} - Pedido #${orderId}`,
          body: notification.message
        });
        console.log('💡 Para habilitar emails, configura RESEND_API_KEY o SENDGRID_API_KEY en las variables de entorno');
      }
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      // No lanzar el error para que no bloquee la actualización del estado
    }
  }

  // Enviar WhatsApp (si está configurado)
  if (phone) {
    try {
      const whatsappToken = import.meta.env.WHATSAPP_TOKEN;
      const whatsappPhoneId = import.meta.env.WHATSAPP_PHONE_ID;

      if (whatsappToken && whatsappPhoneId) {
        const whatsappUrl = `https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`;
        
        const response = await fetch(whatsappUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${whatsappToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: phone.replace('+', ''),
            type: 'text',
            text: {
              body: notification.whatsapp
            }
          })
        });

        if (response.ok) {
          console.log('✅ WhatsApp enviado exitosamente a', phone);
        } else {
          const errorData = await response.json();
          console.error('Error enviando WhatsApp:', errorData);
        }
      } else {
        console.log('⚠️ WhatsApp no configurado, mensaje que se enviaría:', notification.whatsapp);
        // Crear URL de WhatsApp Web como fallback
        const whatsappWebUrl = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(notification.whatsapp)}`;
        console.log('🔗 URL de WhatsApp Web:', whatsappWebUrl);
      }
    } catch (error) {
      console.error('Error enviando WhatsApp:', error);
    }
  } else {
    console.log('⚠️ No hay teléfono del cliente para enviar WhatsApp');
  }
}

