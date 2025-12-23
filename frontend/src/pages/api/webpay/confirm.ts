import type { APIRoute } from 'astro';
import pkg from 'transbank-sdk';
const { WebpayPlus, Options, Environment } = pkg;
import { createClient } from '@supabase/supabase-js';

// Función auxiliar para parsear el body según el content-type
async function parseBody(request: Request): Promise<any> {
  const contentType = request.headers.get('content-type') || '';
  
  if (contentType.includes('application/x-www-form-urlencoded')) {
    // Parsear form-urlencoded (Transbank envía así)
    const formData = await request.formData();
    return {
      token_ws: formData.get('token_ws')?.toString() || null,
      TBK_TOKEN: formData.get('TBK_TOKEN')?.toString() || null,
      TBK_ID_SESION: formData.get('TBK_ID_SESION')?.toString() || null,
      TBK_ORDEN_COMPRA: formData.get('TBK_ORDEN_COMPRA')?.toString() || null,
    };
  } else if (contentType.includes('application/json')) {
    // Parsear JSON
    return await request.json();
  } else {
    // Intentar parsear como texto y luego como form data
    const text = await request.text();
    if (text) {
      try {
        // Intentar como JSON primero
        return JSON.parse(text);
      } catch (e) {
        // Si no es JSON, intentar como form-urlencoded
        const params = new URLSearchParams(text);
        return {
          token_ws: params.get('token_ws') || null,
          TBK_TOKEN: params.get('TBK_TOKEN') || null,
          TBK_ID_SESION: params.get('TBK_ID_SESION') || null,
          TBK_ORDEN_COMPRA: params.get('TBK_ORDEN_COMPRA') || null,
        };
      }
    }
  }
  return {};
}

export const GET: APIRoute = async ({ url }) => {
  // Soporte GET solo para debug (Transbank normalmente usa POST)
  const token_ws = url.searchParams.get('token_ws');
  const TBK_TOKEN = url.searchParams.get('TBK_TOKEN');
  const TBK_ID_SESION = url.searchParams.get('TBK_ID_SESION');
  const TBK_ORDEN_COMPRA = url.searchParams.get('TBK_ORDEN_COMPRA');

  // CASO 1: Pago cancelado por el usuario (TBK_TOKEN presente)
  if (TBK_TOKEN) {
    console.log('🚫 Pago cancelado por el usuario (GET)');
    console.log('📋 Parámetros de cancelación:', {
      TBK_TOKEN,
      TBK_ID_SESION,
      TBK_ORDEN_COMPRA
    });

    return new Response(
      JSON.stringify({
        success: false,
        cancelled: true,
        message: 'Pago cancelado por el usuario',
        TBK_TOKEN,
        TBK_ID_SESION,
        TBK_ORDEN_COMPRA
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // CASO 2: Pago normal (token_ws presente) - redirigir a POST
  if (!token_ws) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'token_ws o TBK_TOKEN es requerido',
        note: 'Este endpoint soporta GET solo para debug. Transbank usa POST.'
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Para GET con token_ws, devolver mensaje informativo
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: 'Este endpoint requiere POST. Use POST con token_ws en el body.',
      received_token: token_ws
    }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Transbank puede enviar datos como form-urlencoded o JSON
    const body = await parseBody(request);

    const { token_ws, TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA } = body;

    // CASO 1: Pago cancelado por el usuario (TBK_TOKEN presente)
    if (TBK_TOKEN) {
      console.log('🚫 Pago cancelado por el usuario');
      console.log('📋 Parámetros de cancelación:', {
        TBK_TOKEN,
        TBK_ID_SESION,
        TBK_ORDEN_COMPRA
      });

      // NO hacer commit, NO confirmar compra, solo registrar y devolver respuesta
      return new Response(
        JSON.stringify({
          success: false,
          cancelled: true,
          message: 'Pago cancelado por el usuario',
          TBK_TOKEN,
          TBK_ID_SESION,
          TBK_ORDEN_COMPRA
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // CASO 2: Pago normal (token_ws presente)
    if (!token_ws) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'token_ws o TBK_TOKEN es requerido',
          received: { token_ws: !!token_ws, TBK_TOKEN: !!TBK_TOKEN }
        }),
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

    // Buscar el pedido por el token
    // Primero intentar buscar por payment_reference que contiene el token exacto
    let { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total_amount, status, payment_reference')
      .eq('payment_reference', token_ws)
      .single();

    // Si no se encuentra, intentar buscar por payment_reference que empiece con el token
    // (porque puede haber sido actualizado con el responseCode)
    if (orderError || !order) {
      console.log('⚠️ No se encontró pedido con payment_reference exacto, buscando por token...');
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total_amount, status, payment_reference')
        .like('payment_reference', `${token_ws}%`)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (orders && orders.length > 0) {
        order = orders[0];
        orderError = null;
        console.log('✅ Pedido encontrado por token parcial:', order.id);
      }
    }

    if (orderError || !order) {
      console.error('❌ Error buscando pedido:', orderError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Pedido no encontrado',
          details: 'No se encontró un pedido asociado a este token. Puede que el token ya haya sido procesado o sea inválido.'
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('📋 Pedido encontrado:', {
      id: order.id,
      status: order.status,
      payment_reference: order.payment_reference
    });

    // Configurar Webpay Plus
    const webpayEnvironment = import.meta.env.PUBLIC_WEBPAY_ENVIRONMENT;
    const environment = webpayEnvironment === 'production' 
      ? Environment.Production 
      : Environment.Integration;

    const commerceCode = import.meta.env.PUBLIC_WEBPAY_COMMERCE_CODE || '597055555532';
    const apiKey = import.meta.env.PUBLIC_WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

    console.log('🔧 Configuración de Webpay (confirm):', {
      PUBLIC_WEBPAY_ENVIRONMENT: webpayEnvironment || 'no configurado (usando integración)',
      resolvedEnvironment: environment === Environment.Production ? 'Production' : 'Integration',
      isProduction: environment === Environment.Production,
      webpayHost: environment === Environment.Production 
        ? 'https://webpay3g.transbank.cl' 
        : 'https://webpay3gint.transbank.cl'
    });

    const options = new Options(commerceCode, apiKey, environment);
    const webpayPlus = new WebpayPlus.Transaction(options);

    // Verificar si el pedido ya fue procesado
    if (order.status === 'paid') {
      console.log('⚠️ Este pedido ya fue marcado como pagado anteriormente');
      console.log('⚠️ payment_reference actual:', order.payment_reference);
      // Si el payment_reference ya contiene el responseCode, significa que ya fue confirmado
      if (order.payment_reference && order.payment_reference.includes('-') && order.payment_reference !== token_ws) {
        console.log('⚠️ Esta transacción ya fue confirmada anteriormente');
        // Devolver el estado actual sin volver a confirmar
        return new Response(
          JSON.stringify({
            success: true,
            responseCode: 0,
            responseMessage: 'Transacción ya confirmada anteriormente',
            buyOrder: order.payment_reference.split('-')[0] || 'N/A',
            amount: order.total_amount,
            authorizationCode: 'YA_CONFIRMADO',
            orderId: order.id,
            alreadyConfirmed: true
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Confirmar la transacción con Webpay
    console.log('🔄 Confirmando transacción con Webpay, token:', token_ws);
    const commitResponse = await webpayPlus.commit(token_ws);

    if (!commitResponse) {
      console.error('❌ Webpay no devolvió respuesta');
      return new Response(
        JSON.stringify({ success: false, error: 'Error al confirmar la transacción con Webpay' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('📥 Respuesta completa de Webpay:', JSON.stringify(commitResponse, null, 2));
    console.log('📥 Tipo de respuesta:', typeof commitResponse);
    console.log('📥 Propiedades de commitResponse:', Object.keys(commitResponse || {}));
    console.log('📥 responseCode:', commitResponse.responseCode, 'Tipo:', typeof commitResponse.responseCode);
    console.log('📥 authorizationCode:', commitResponse.authorizationCode);
    console.log('📥 responseMessage:', commitResponse.responseMessage);

    // Verificar el estado de la transacción
    // El pago es exitoso si:
    // 1. responseCode === 0 (estándar de Transbank)
    // 2. O si existe authorizationCode (indica que fue autorizado)
    // 3. O si no hay errores y hay datos de transacción
    const hasResponseCodeZero = commitResponse.responseCode === 0 || commitResponse.responseCode === '0';
    const hasAuthorizationCode = !!commitResponse.authorizationCode;
    const hasNoErrors = !commitResponse.responseMessage || 
                        !commitResponse.responseMessage.toLowerCase().includes('error') &&
                        !commitResponse.responseMessage.toLowerCase().includes('rechazado');
    
    // Si hay authorizationCode, generalmente significa que fue aprobado
    // Incluso si responseCode no está presente o es undefined
    const isApproved = hasResponseCodeZero || (hasAuthorizationCode && hasNoErrors);
    
    console.log('✅ Análisis de aprobación:', {
      hasResponseCodeZero,
      hasAuthorizationCode,
      hasNoErrors,
      isApproved,
      responseCode: commitResponse.responseCode,
      authorizationCode: commitResponse.authorizationCode,
      responseMessage: commitResponse.responseMessage
    });

    // Preparar payment_details con toda la información de la transacción
    const paymentDetails = {
      authorizationCode: commitResponse.authorizationCode,
      transactionDate: commitResponse.transactionDate || new Date().toISOString(),
      paymentTypeCode: commitResponse.paymentTypeCode,
      installmentsNumber: commitResponse.installmentsNumber || 0,
      cardDetail: commitResponse.cardDetail || null,
      buyOrder: commitResponse.buyOrder,
      amount: commitResponse.amount,
      responseCode: commitResponse.responseCode,
      responseMessage: commitResponse.responseMessage,
      vci: commitResponse.vci,
      accountingDate: commitResponse.accountingDate
    };

    // Actualizar el estado del pedido
    // Actualizar estado del pedido con fallback si el enum no acepta 'pending_payment'
    const newStatus = isApproved ? 'paid' : 'pending_payment';
    
    console.log('🔄 Actualizando estado del pedido:', {
      orderId: order.id,
      oldStatus: order.status,
      newStatus: newStatus,
      isApproved: isApproved,
      responseCode: commitResponse.responseCode
    });
    
    // Preparar payment_reference
    const paymentReference = commitResponse.responseCode !== undefined 
      ? `${token_ws}-${commitResponse.responseCode}` 
      : `${token_ws}-${isApproved ? 'approved' : 'pending'}`;
    
    console.log('💾 Guardando en base de datos:', {
      orderId: order.id,
      status: newStatus,
      paymentReference: paymentReference,
      hasPaymentDetails: !!paymentDetails,
      paymentDetailsKeys: paymentDetails ? Object.keys(paymentDetails) : [],
      paymentDetailsStringified: JSON.stringify(paymentDetails)
    });
    
    let updateResult = await supabase
      .from('orders')
      .update({
        status: newStatus,
        payment_reference: paymentReference,
        payment_details: paymentDetails, // Guardar detalles completos del pago
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    // Si falla con 'pending_payment', intentar con 'pending'
    if (updateResult.error && updateResult.error.message?.includes('invalid input value for enum') && !isApproved) {
      console.log('⚠️ pending_payment no es válido, intentando con pending...');
      updateResult = await supabase
        .from('orders')
        .update({
          status: 'pending',
          payment_reference: `${token_ws}-${commitResponse.responseCode}`,
          payment_details: paymentDetails, // Guardar detalles completos del pago
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);
    }
    
    if (updateResult.error) {
      console.error('❌ Error actualizando estado del pedido:', updateResult.error);
      console.error('❌ Detalles del error:', {
        message: updateResult.error.message,
        code: updateResult.error.code,
        details: updateResult.error.details,
        hint: updateResult.error.hint,
        fullError: JSON.stringify(updateResult.error, null, 2)
      });
      
      // Si el error es por enum inválido, intentar con 'paid' directamente
      if (updateResult.error.message?.includes('invalid input value for enum')) {
        console.log('⚠️ Intentando actualizar con estado "paid" directamente...');
        const retryResult = await supabase
          .from('orders')
          .update({
            status: 'paid',
            payment_reference: `${token_ws}-${commitResponse.responseCode || 'approved'}`,
            payment_details: paymentDetails,
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);
        
        if (retryResult.error) {
          console.error('❌ Error en segundo intento:', retryResult.error);
        } else {
          console.log('✅ Estado actualizado en segundo intento');
        }
      }
      // Continuar aunque falle la actualización del status
    } else {
      console.log('✅ Estado del pedido actualizado exitosamente:', {
        orderId: order.id,
        newStatus: newStatus,
        paymentDetailsSaved: !!paymentDetails
      });
      
      // Verificar que se actualizó correctamente
      const { data: verifyOrder } = await supabase
        .from('orders')
        .select('id, status, payment_details')
        .eq('id', order.id)
        .single();
      
      console.log('🔍 Verificación post-actualización:', {
        orderId: verifyOrder?.id,
        status: verifyOrder?.status,
        hasPaymentDetails: !!verifyOrder?.payment_details,
        expectedStatus: newStatus,
        statusMatches: verifyOrder?.status === newStatus
      });
      
      // Si el estado no coincide, intentar corregirlo
      if (verifyOrder && verifyOrder.status !== newStatus && isApproved) {
        console.log('⚠️ El estado no coincide, intentando corregir...');
        const fixResult = await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', order.id);
        
        if (fixResult.error) {
          console.error('❌ Error corrigiendo estado:', fixResult.error);
        } else {
          console.log('✅ Estado corregido a "paid"');
        }
      }
    }

    // Obtener información adicional del pedido para mostrar en el comprobante
    // Obtener items del pedido con información del producto
    let orderItems = [];
    try {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          quantity,
          unit_price,
          total_price,
          products:product_id(name)
        `)
        .eq('order_id', order.id);
      
      if (!itemsError && items) {
        orderItems = items.map(item => ({
          name: item.products?.name || 'Producto',
          quantity: item.quantity,
          price: item.unit_price
        }));
      }
    } catch (e) {
      console.log('⚠️ No se pudo obtener items del pedido:', e);
    }

    // Enviar email de confirmación de pago exitoso
    if (isApproved) {
      try {
        // Obtener email del cliente (de la orden o del usuario)
        let customerEmail = order.email || null;
        let customerName = null;

        if (!customerEmail && order.user_id) {
          const { data: userData } = await supabase
            .from('users')
            .select('email, full_name')
            .eq('id', order.user_id)
            .single();
          
          if (userData) {
            customerEmail = userData.email || customerEmail;
            customerName = userData.full_name;
          }
        }

        if (customerEmail) {
          console.log('📧 Enviando email de confirmación de pago a:', customerEmail);
          
          // Importar función de envío de email
          const { sendEmail, generateEmailHTML } = await import('../../../lib/email/send-email');
          
          const emailHtml = generateEmailHTML({
            title: '✅ Pago Confirmado',
            message: `Tu pago ha sido confirmado exitosamente. Tu pedido #${order.id} está siendo procesado.`,
            orderId: order.id,
            amount: Number(order.total_amount),
            items: orderItems,
            logoUrl: 'https://mimoto.cl/logo.jpg'
          });

          const emailResult = await sendEmail({
            to: customerEmail,
            subject: `Pago Confirmado - Pedido #${order.id}`,
            html: emailHtml
          });

          if (emailResult.success) {
            console.log('✅ Email de confirmación de pago enviado exitosamente');
          } else {
            console.error('❌ Error enviando email de confirmación de pago:', emailResult.error);
          }
        } else {
          console.log('⚠️ No hay email del cliente para enviar confirmación de pago');
        }
      } catch (emailError: any) {
        console.error('❌ Error enviando email de confirmación de pago:', emailError);
        // No bloquear la respuesta si falla el email
      }
    }

    // Preparar respuesta con todos los campos disponibles
    const responseData = {
        success: isApproved,
      responseCode: commitResponse.responseCode ?? (isApproved ? 0 : -1), // Si no hay responseCode pero está aprobado, usar 0
      responseMessage: commitResponse.responseMessage || (isApproved ? 'Transacción aprobada' : 'Transacción rechazada'),
        buyOrder: commitResponse.buyOrder,
        amount: commitResponse.amount,
        authorizationCode: commitResponse.authorizationCode,
      orderId: order.id,
      // Información adicional requerida por Transbank
      transactionDate: commitResponse.transactionDate || new Date().toISOString(),
      paymentTypeCode: commitResponse.paymentTypeCode || 'VD', // VD = Venta Débito, VN = Venta Normal, VC = Venta en cuotas
      installmentsNumber: commitResponse.installmentsNumber || 0,
      cardDetail: commitResponse.cardDetail || null, // Últimos 4 dígitos de la tarjeta
      orderItems: orderItems, // Items del pedido para mostrar en el comprobante
      // Campos adicionales para debugging
      _debug: {
        hasResponseCode: commitResponse.responseCode !== undefined,
        hasAuthorizationCode: !!commitResponse.authorizationCode,
        rawResponseCode: commitResponse.responseCode,
        rawResponseMessage: commitResponse.responseMessage
      }
    };

    console.log('📤 Enviando respuesta al cliente:', JSON.stringify(responseData, null, 2));

    return new Response(
      JSON.stringify(responseData),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error en confirm de Webpay:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Error al confirmar el pago' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

