import type { APIRoute } from 'astro';
import pkg from 'transbank-sdk';
const { WebpayPlus, Options, Environment } = pkg;
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Transbank puede enviar datos como form-urlencoded o JSON
    // Intentar obtener datos del body
    let body: any = {};
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      // Parsear form-urlencoded
      const formData = await request.formData();
      body = {
        token_ws: formData.get('token_ws')?.toString() || null,
        TBK_TOKEN: formData.get('TBK_TOKEN')?.toString() || null,
        TBK_ID_SESION: formData.get('TBK_ID_SESION')?.toString() || null,
        TBK_ORDEN_COMPRA: formData.get('TBK_ORDEN_COMPRA')?.toString() || null,
      };
    } else {
      // Intentar como JSON
      try {
        body = await request.json();
      } catch (e) {
        // Si falla, intentar parsear como texto y luego como form data
        const text = await request.text();
        const params = new URLSearchParams(text);
        body = {
          token_ws: params.get('token_ws') || null,
          TBK_TOKEN: params.get('TBK_TOKEN') || null,
          TBK_ID_SESION: params.get('TBK_ID_SESION') || null,
          TBK_ORDEN_COMPRA: params.get('TBK_ORDEN_COMPRA') || null,
        };
      }
    }

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
    const environment = import.meta.env.PUBLIC_WEBPAY_ENVIRONMENT === 'production' 
      ? Environment.Production 
      : Environment.Integration;

    const commerceCode = import.meta.env.PUBLIC_WEBPAY_COMMERCE_CODE || '597055555532';
    const apiKey = import.meta.env.PUBLIC_WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

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

    console.log('📥 Respuesta de Webpay:', {
      responseCode: commitResponse.responseCode,
      responseMessage: commitResponse.responseMessage,
      amount: commitResponse.amount,
      authorizationCode: commitResponse.authorizationCode
    });

    // Verificar el estado de la transacción
    const isApproved = commitResponse.responseCode === 0;
    console.log('✅ Transacción aprobada:', isApproved);

    // Actualizar el estado del pedido
    // Actualizar estado del pedido con fallback si el enum no acepta 'pending_payment'
    const newStatus = isApproved ? 'paid' : 'pending_payment';
    let updateResult = await supabase
      .from('orders')
      .update({
        status: newStatus,
        payment_reference: `${token_ws}-${commitResponse.responseCode}`,
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
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);
    }
    
    if (updateResult.error) {
      console.error('Error actualizando estado del pedido:', updateResult.error);
      // Continuar aunque falle la actualización del status
    }

    return new Response(
      JSON.stringify({
        success: isApproved,
        responseCode: commitResponse.responseCode,
        responseMessage: commitResponse.responseMessage,
        buyOrder: commitResponse.buyOrder,
        amount: commitResponse.amount,
        authorizationCode: commitResponse.authorizationCode,
        orderId: order.id
      }),
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

