import type { APIRoute } from 'astro';
import pkg from 'transbank-sdk';
const { WebpayPlus, Options, Environment } = pkg;
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { orderId, returnUrl } = body;

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: 'orderId es requerido' }),
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

    // Obtener datos del pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total_amount, user_id, status')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ success: false, error: 'Pedido no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener datos del usuario
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(order.user_id);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuario no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Configurar Webpay Plus
    // IMPORTANTE: Cambiar a Environment.Production cuando tengas las credenciales de producción
    const environment = import.meta.env.PUBLIC_WEBPAY_ENVIRONMENT === 'production' 
      ? Environment.Production 
      : Environment.Integration;

    const commerceCode = import.meta.env.PUBLIC_WEBPAY_COMMERCE_CODE || '597055555532';
    const apiKey = import.meta.env.PUBLIC_WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

    const options = new Options(commerceCode, apiKey, environment);
    const webpayPlus = new WebpayPlus.Transaction(options);

    // Calcular monto en centavos (Webpay espera el monto en centavos)
    const amount = Math.round(Number(order.total_amount) * 100);
    const buyOrder = `ORD-${order.id}-${Date.now()}`;
    const sessionId = `SESSION-${order.user_id}-${Date.now()}`;

    // URL de retorno (donde Webpay redirigirá después del pago)
    const finalReturnUrl = returnUrl || `${import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321'}/pago/confirmar?orderId=${orderId}`;

    // Crear la transacción
    const createResponse = await webpayPlus.create(
      buyOrder,
      sessionId,
      amount,
      finalReturnUrl
    );

    if (!createResponse || !createResponse.token || !createResponse.url) {
      return new Response(
        JSON.stringify({ success: false, error: 'Error al crear la transacción en Webpay' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Guardar el token de la transacción en el pedido
    await supabase
      .from('orders')
      .update({ 
        payment_reference: createResponse.token,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return new Response(
      JSON.stringify({
        success: true,
        token: createResponse.token,
        url: createResponse.url,
        buyOrder,
        amount
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error en init de Webpay:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Error al inicializar el pago' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

