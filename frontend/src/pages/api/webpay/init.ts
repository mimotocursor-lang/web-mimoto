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

    // Obtener datos del usuario (solo si hay user_id)
    // Si no hay user_id, es un pedido de usuario no autenticado
    let userEmail = 'cliente@mimoto.cl';
    if (order.user_id) {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(order.user_id);
      if (!userError && userData?.user) {
        userEmail = userData.user.email || userEmail;
      }
    }

    // Configurar Webpay Plus
    const webpayEnvironment = import.meta.env.PUBLIC_WEBPAY_ENVIRONMENT;
    const environment = webpayEnvironment === 'production' 
      ? Environment.Production 
      : Environment.Integration;

    const commerceCode = import.meta.env.PUBLIC_WEBPAY_COMMERCE_CODE || '597055555532';
    const apiKey = import.meta.env.PUBLIC_WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

    console.log('🔧 Configuración de Webpay:', {
      PUBLIC_WEBPAY_ENVIRONMENT: webpayEnvironment || 'no configurado (usando integración)',
      resolvedEnvironment: environment === Environment.Production ? 'Production' : 'Integration',
      isProduction: environment === Environment.Production,
      commerceCode: commerceCode ? `${commerceCode.substring(0, 6)}...` : 'no configurado',
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'no configurado',
      webpayHost: environment === Environment.Production 
        ? 'https://webpay3g.transbank.cl' 
        : 'https://webpay3gint.transbank.cl'
    });

    const options = new Options(commerceCode, apiKey, environment);
    const webpayPlus = new WebpayPlus.Transaction(options);

    // Calcular monto para Webpay
    // IMPORTANTE: El SDK de Transbank espera el monto en pesos chilenos, NO en centavos
    // El SDK internamente lo convierte a centavos si es necesario
    const totalAmount = Number(order.total_amount);
    console.log('💰 Monto original (pesos):', totalAmount);
    
    // El SDK de Transbank Node.js espera el monto en pesos, no en centavos
    // Verificar documentación: https://github.com/TransbankDevelopers/transbank-sdk-nodejs
    const amount = Math.round(totalAmount);
    console.log('💰 Monto para Webpay (pesos):', amount);
    
    const buyOrder = `ORD-${order.id}-${Date.now()}`;
    const sessionId = order.user_id ? `SESSION-${order.user_id}-${Date.now()}` : `SESSION-GUEST-${order.id}-${Date.now()}`;

    // URL de retorno (donde Webpay redirigirá después del pago)
    const finalReturnUrl = returnUrl || `${import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321'}/pago/confirmar?orderId=${orderId}`;

    console.log('📋 Datos de transacción:', {
      buyOrder,
      sessionId,
      amount,
      returnUrl: finalReturnUrl
    });

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

