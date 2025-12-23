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

    // Obtener la orden actual (incluir email para notificaciones)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, user_id, total_amount, payment_reference, email')
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
    
    sendNotifications(supabase, orderId, status, customerEmail, customerPhone, customerName, order.total_amount)
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
  supabase: any,
  orderId: number,
  status: string,
  email: string | null,
  phone: string | null,
  name: string | null,
  amount: number
) {
  const statusMessages = {
    'paid': {
      title: 'Pago Confirmado',
      message: `Tu pago ha sido confirmado exitosamente. Tu pedido #${orderId} está siendo procesado.`,
      whatsapp: `¡Hola${name ? ' ' + name.split(' ')[0] : ''}! ✅\n\nTu pago por $${Number(amount).toLocaleString('es-CL')} ha sido confirmado exitosamente.\n\nTu pedido #${orderId} está siendo procesado. Te notificaremos cuando sea confirmado.`
    },
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
    console.log('⚠️ No hay notificación configurada para el estado:', status);
    console.log('⚠️ Estados con notificación configurada:', Object.keys(statusMessages));
    return;
  }
  
  console.log('📨 Enviando notificación para estado:', status);
  console.log('📨 Título:', notification.title);
  console.log('📨 Mensaje:', notification.message);

  // Enviar email (si está configurado)
  if (email) {
    try {
      console.log('📧 Intentando enviar email:', {
        to: email,
        orderId: orderId,
        status: status,
        hasSupabase: !!supabase
      });

      // Obtener items del pedido para el email
      let orderItems = [];
      try {
        if (!supabase) {
          console.error('❌ Supabase no está disponible en sendNotifications');
        } else {
          console.log('📦 Obteniendo items del pedido para el email...');
          const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              quantity,
              unit_price,
              products:product_id(name)
            `)
            .eq('order_id', orderId);
          
          if (itemsError) {
            console.error('❌ Error obteniendo items del pedido:', itemsError);
          } else if (items) {
            orderItems = items.map(item => ({
              name: item.products?.name || 'Producto',
              quantity: item.quantity,
              price: item.unit_price
            }));
            console.log('📦 Items del pedido obtenidos:', orderItems.length, 'items');
          } else {
            console.log('⚠️ No se encontraron items para el pedido');
          }
        }
      } catch (e: any) {
        console.error('❌ Error en try-catch obteniendo items del pedido:', {
          message: e.message,
          stack: e.stack
        });
      }

      // Importar función de envío de email
      const { sendEmail, generateEmailHTML } = await import('../../../lib/email/send-email');
      
      // Generar HTML del email con logo y diseño mejorado
      const emailHtml = generateEmailHTML({
        title: notification.title,
        message: `Hola${name ? ' ' + name.split(' ')[0] : ''},<br><br>${notification.message}`,
        orderId: orderId,
        amount: amount,
        items: orderItems,
        logoUrl: 'https://mimoto.cl/logo.jpg'
      });

      console.log('📧 Preparando envío de email con Resend...');
      console.log('📧 Email HTML generado, longitud:', emailHtml.length);
      console.log('📧 Destinatario:', email);
      console.log('📧 Asunto:', `${notification.title} - Pedido #${orderId}`);
      
      // Usar la función compartida de envío de email
      const emailResult = await sendEmail({
        to: email,
        subject: `${notification.title} - Pedido #${orderId}`,
        html: emailHtml
      });

      console.log('📧 Resultado del envío de email:', {
        success: emailResult.success,
        resendId: emailResult.resendId || 'N/A',
        error: emailResult.error || 'N/A',
        to: email
      });

      if (emailResult.success) {
        console.log('✅ Email enviado exitosamente:', {
          resendId: emailResult.resendId,
          to: email
        });
        console.log('✅ Puedes verificar el email en: https://resend.com/emails');
      } else {
        console.error('❌ Error enviando email:', emailResult.error);
        console.error('❌ Revisa las variables de entorno: RESEND_API_KEY, FROM_EMAIL, FROM_NAME');
        // No lanzar error para que no bloquee la actualización del estado
      }
    } catch (error: any) {
      console.error('❌ Error enviando email:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
      });
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

