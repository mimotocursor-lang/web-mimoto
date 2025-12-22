import type { APIRoute } from 'astro';
import pkg from 'transbank-sdk';
const { WebpayPlus, Options, Environment } = pkg;
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { token_ws } = body;

    if (!token_ws) {
      return new Response(
        JSON.stringify({ success: false, error: 'token_ws es requerido' }),
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
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total_amount, status, payment_reference')
      .eq('payment_reference', token_ws)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ success: false, error: 'Pedido no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Configurar Webpay Plus
    const environment = import.meta.env.PUBLIC_WEBPAY_ENVIRONMENT === 'production' 
      ? Environment.Production 
      : Environment.Integration;

    const commerceCode = import.meta.env.PUBLIC_WEBPAY_COMMERCE_CODE || '597055555532';
    const apiKey = import.meta.env.PUBLIC_WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

    const options = new Options(commerceCode, apiKey, environment);
    const webpayPlus = new WebpayPlus.Transaction(options);

    // Confirmar la transacción
    const commitResponse = await webpayPlus.commit(token_ws);

    if (!commitResponse) {
      return new Response(
        JSON.stringify({ success: false, error: 'Error al confirmar la transacción' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar el estado de la transacción
    const isApproved = commitResponse.responseCode === 0;

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

