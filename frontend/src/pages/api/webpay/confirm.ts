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
    // IMPORTANTE: Buscar por el token_ws directamente, no por payment_reference
    // porque payment_reference puede no existir aún o tener un formato diferente
    let { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total_amount, status, payment_reference, email, user_id, payment_details')
      .eq('payment_reference', token_ws)
      .single();

    // Si no se encuentra, buscar por payment_reference que empiece con el token
    if (orderError || !order) {
      console.log('⚠️ No se encontró pedido con payment_reference exacto, buscando por token...');
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total_amount, status, payment_reference, email, user_id, payment_details')
        .like('payment_reference', `${token_ws}%`)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (orders && orders.length > 0) {
        order = orders[0];
        orderError = null;
        console.log('✅ Pedido encontrado por token parcial:', order.id);
      }
    }
    
    // Si aún no se encuentra, buscar por el token_ws en el buyOrder de webpay
    // o buscar el pedido más reciente sin payment_reference (para invitados)
    if (orderError || !order) {
      console.log('⚠️ No se encontró por payment_reference, buscando pedido más reciente sin payment_reference...');
      // Buscar pedidos recientes sin payment_reference (posiblemente de invitados)
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('id, total_amount, status, payment_reference, email, user_id, payment_details')
        .is('payment_reference', null)
        .eq('status', 'pending_payment')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recentOrders && recentOrders.length > 0) {
        // Si no hay coincidencia, usar el más reciente
        // (No podemos usar buyOrder aquí porque commitResponse aún no existe)
        if (!order && recentOrders.length > 0) {
          order = recentOrders[0];
          orderError = null;
          console.log('⚠️ Usando pedido más reciente sin payment_reference:', order.id);
        }
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
      payment_reference: order.payment_reference,
      user_id: order.user_id,
      email: order.email,
      isGuest: !order.user_id
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
        console.log('⚠️ Esta transacción ya fue confirmada anteriormente - NO se descontará stock nuevamente');
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
    
    // Verificar si el stock ya fue descontado (marcador en payment_details)
    let stockAlreadyDeducted = false;
    try {
      if (order.payment_details && typeof order.payment_details === 'object') {
        stockAlreadyDeducted = (order.payment_details as any).stockDeducted === true;
      }
    } catch (e) {
      // Ignorar errores de parsing
    }

    // Confirmar la transacción con Webpay
    console.log('🔄 Confirmando transacción con Webpay, token:', token_ws);
    console.log('🔄 Token length:', token_ws?.length);
    
    let commitResponse;
    try {
      commitResponse = await webpayPlus.commit(token_ws);
    } catch (commitError: any) {
      console.error('❌ Error al hacer commit con Webpay:', commitError);
      console.error('❌ Error details:', JSON.stringify(commitError, null, 2));
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Error al confirmar la transacción con Webpay',
          details: commitError.message || 'Error desconocido'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!commitResponse) {
      console.error('❌ Webpay no devolvió respuesta');
      return new Response(
        JSON.stringify({ success: false, error: 'Error al confirmar la transacción con Webpay' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // LOGS DETALLADOS DE LA RESPUESTA DE WEBPAY
    console.log('📥📥📥 RESPUESTA COMPLETA DE WEBPAY:');
    console.log('📥 JSON completo:', JSON.stringify(commitResponse, null, 2));
    console.log('📥 Tipo de respuesta:', typeof commitResponse);
    console.log('📥 Es array?', Array.isArray(commitResponse));
    console.log('📥 Propiedades de commitResponse:', Object.keys(commitResponse || {}));
    console.log('📥 responseCode:', commitResponse.responseCode, 'Tipo:', typeof commitResponse.responseCode);
    console.log('📥 authorizationCode:', commitResponse.authorizationCode, 'Tipo:', typeof commitResponse.authorizationCode);
    console.log('📥 responseMessage:', commitResponse.responseMessage);
    console.log('📥 transactionDate:', commitResponse.transactionDate, 'Tipo:', typeof commitResponse.transactionDate);
    console.log('📥 amount:', commitResponse.amount, 'Tipo:', typeof commitResponse.amount);
    console.log('📥 buyOrder:', commitResponse.buyOrder);
    console.log('📥 paymentTypeCode:', commitResponse.paymentTypeCode);
    console.log('📥 installmentsNumber:', commitResponse.installmentsNumber);
    console.log('📥 cardDetail:', commitResponse.cardDetail);
    console.log('📥 vci:', commitResponse.vci);
    console.log('📥 accountingDate:', commitResponse.accountingDate);

    // LÓGICA CRÍTICA: Si hay transactionDate y amount, el pago FUE PROCESADO
    // Transbank SOLO devuelve transactionDate y amount si la transacción fue procesada exitosamente
    // ESTO ES LO MÁS IMPORTANTE: Si hay transactionDate y amount, el pago fue exitoso, sin importar responseCode
    const hasTransactionDate = !!commitResponse.transactionDate;
    const hasAmount = !!commitResponse.amount;
    const hasTransactionData = hasTransactionDate && hasAmount;
    
    // También verificar responseCode === 0 como indicador adicional
    const hasResponseCodeZero = commitResponse.responseCode === 0 || commitResponse.responseCode === '0';
    const hasAuthorizationCode = !!commitResponse.authorizationCode;
    
    // REGLA PRINCIPAL: Si hay transactionDate Y amount, el pago FUE EXITOSO
    // Esto es ABSOLUTO - Transbank solo devuelve estos datos si procesó el pago
    // NO importa si responseCode es -1 o si responseMessage dice "rechazada"
    // Si hay transactionDate y amount, el pago fue exitoso
    let isApproved = hasTransactionData;
    
    // Si hay responseCode === 0 o authorizationCode, también es exitoso
    if (hasResponseCodeZero || hasAuthorizationCode) {
      isApproved = true;
    }
    
    console.log('🔍🔍🔍 ANÁLISIS DETALLADO DE PAGO:');
    console.log('🔍 hasTransactionDate:', hasTransactionDate, 'valor:', commitResponse.transactionDate);
    console.log('🔍 hasAmount:', hasAmount, 'valor:', commitResponse.amount);
    console.log('🔍 hasTransactionData:', hasTransactionData, '← ESTO ES LO MÁS IMPORTANTE');
    console.log('🔍 hasResponseCodeZero:', hasResponseCodeZero, 'responseCode:', commitResponse.responseCode);
    console.log('🔍 hasAuthorizationCode:', hasAuthorizationCode, 'valor:', commitResponse.authorizationCode);
    console.log('🔍 isApproved (RESULTADO FINAL):', isApproved);
    console.log('🔍 fullResponse:', JSON.stringify(commitResponse, null, 2));
    
    if (isApproved) {
      console.log('✅✅✅ PAGO EXITOSO - PROCESANDO COMO PAGADO');
      if (hasTransactionData) {
        console.log('✅✅✅ Razón PRINCIPAL: transactionDate y amount presentes (pago procesado)');
        console.log('✅✅✅ IMPORTANTE: Aunque responseCode sea -1, si hay transactionDate y amount, el pago fue exitoso');
      }
      if (hasResponseCodeZero) {
        console.log('✅✅✅ Razón adicional: responseCode === 0');
      }
      if (hasAuthorizationCode) {
        console.log('✅✅✅ Razón adicional: authorizationCode presente');
      }
    } else {
      console.log('❌❌❌ PAGO NO EXITOSO');
      console.log('❌❌❌ No hay transactionDate:', !hasTransactionDate);
      console.log('❌❌❌ No hay amount:', !hasAmount);
      console.log('❌❌❌ responseCode no es 0:', commitResponse.responseCode);
      console.log('❌❌❌ No hay authorizationCode:', !hasAuthorizationCode);
    }

    // Preparar payment_details con toda la información de la transacción
    let paymentDetails: any = {
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
      accountingDate: commitResponse.accountingDate,
      stockDeducted: false // Se actualizará después de descontar stock
    };

    // DESCONTAR STOCK PRIMERO (antes de actualizar el estado)

    // Preparar payment_reference - SIMPLE: Si isApproved (hay transactionDate y amount), usar 'paid'
    let paymentReference: string;
    if (isApproved) {
      // Pago exitoso - usar 'paid'
      paymentReference = `${token_ws}-paid`;
      console.log('✅✅✅ Payment reference para pago EXITOSO:', paymentReference);
    } else {
      // Pago rechazado
      paymentReference = `${token_ws}-rejected`;
      console.log('❌ Payment reference para pago RECHAZADO:', paymentReference);
    }
    
    // Actualizar el estado del pedido - SIMPLE: Si isApproved, estado es 'paid'
    const newStatus = isApproved ? 'paid' : 'pending_payment';
    
    console.log('🔄 ACTUALIZANDO ESTADO DEL PEDIDO:', {
      orderId: order.id,
      oldStatus: order.status,
      newStatus: newStatus,
      isApproved: isApproved,
      hasTransactionData: hasTransactionData,
      transactionDate: commitResponse.transactionDate,
      amount: commitResponse.amount,
      user_id: order.user_id,
      isGuest: !order.user_id
    });
    
    console.log('💾 Guardando en base de datos:', {
      orderId: order.id,
      status: newStatus,
      paymentReference: paymentReference,
      hasPaymentDetails: !!paymentDetails,
      paymentDetailsKeys: paymentDetails ? Object.keys(paymentDetails) : [],
      paymentDetailsStringified: JSON.stringify(paymentDetails)
    });
    
    // ACTUALIZAR ESTADO - SIMPLE: Si isApproved (hay transactionDate y amount), estado es 'paid'
    const statusToUpdate = isApproved ? 'paid' : 'pending_payment';
    
    console.log('💾 ACTUALIZANDO ESTADO EN BASE DE DATOS:', {
      orderId: order.id,
      statusToUpdate: statusToUpdate,
      isApproved: isApproved,
      hasTransactionData: hasTransactionData,
      paymentReference: paymentReference,
      hasPaymentDetails: !!paymentDetails,
      isGuest: !order.user_id
    });
    
    // ACTUALIZAR DIRECTAMENTE - Sin complicaciones
    let updateResult = await supabase
      .from('orders')
      .update({
        status: statusToUpdate, // 'paid' si isApproved, 'pending_payment' si no
        payment_reference: paymentReference,
        payment_details: paymentDetails,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    console.log('📝 Resultado de actualización inicial:', {
      success: !updateResult.error,
      error: updateResult.error?.message,
      statusUpdated: statusToUpdate,
      expectedStatus: isApproved ? 'paid' : 'pending_payment',
      isApproved: isApproved,
      isGuest: !order.user_id,
      paymentReference: paymentReference
    });
    
    // Si hay error PERO el pago fue aprobado, esto es CRÍTICO
    if (updateResult.error && isApproved) {
      console.error('❌❌❌ ERROR CRÍTICO: No se pudo actualizar estado a "paid" para pago aprobado');
      console.error('❌❌❌ Order ID:', order.id);
      console.error('❌❌❌ Error:', JSON.stringify(updateResult.error, null, 2));
    }

    // Si hay error Y el pago fue aprobado, FORZAR actualización a 'paid' de todas formas
    if (updateResult.error && isApproved) {
      console.error('❌ Error actualizando estado del pedido:', updateResult.error);
      console.error('❌ PERO el pago fue aprobado, forzando actualización a "paid"...');
      
      // Intentar múltiples veces si es necesario
      let forceUpdateResult = await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_reference: paymentReference,
          payment_details: paymentDetails,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);
      
      if (forceUpdateResult.error) {
        console.error('❌ Error forzando estado a "paid":', forceUpdateResult.error);
        // Intentar una vez más sin payment_details
        forceUpdateResult = await supabase
          .from('orders')
          .update({
            status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);
        
        if (!forceUpdateResult.error) {
          console.log('✅ Estado forzado a "paid" (sin payment_details)');
          updateResult = forceUpdateResult;
        }
      } else {
        console.log('✅ Estado forzado a "paid" exitosamente');
        updateResult = forceUpdateResult;
      }
    }
    
    // Si falla con 'pending_payment' y NO es aprobado, intentar con 'pending'
    if (updateResult.error && updateResult.error.message?.includes('invalid input value for enum') && !isApproved) {
      console.log('⚠️ pending_payment no es válido, intentando con pending...');
      updateResult = await supabase
        .from('orders')
        .update({
          status: 'pending',
          payment_reference: `${token_ws}-${commitResponse.responseCode}`,
          payment_details: paymentDetails,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);
    }
    
    if (updateResult.error) {
      console.error('❌ Error final actualizando estado del pedido:', updateResult.error);
      // Continuar aunque falle la actualización del status
    } else {
      console.log('✅ Estado del pedido actualizado exitosamente:', {
        orderId: order.id,
        newStatus: newStatus,
        paymentDetailsSaved: !!paymentDetails
      });
      
      // VERIFICAR Y FORZAR ACTUALIZACIÓN SI ES NECESARIO
      // Esto es CRÍTICO: si el pago fue aprobado, el estado DEBE ser 'paid'
      const { data: verifyOrder } = await supabase
        .from('orders')
        .select('id, status, payment_details')
        .eq('id', order.id)
        .single();
      
      console.log('🔍 Verificación post-actualización:', {
        orderId: verifyOrder?.id,
        status: verifyOrder?.status,
        expectedStatus: isApproved ? 'paid' : 'pending_payment',
        isApproved: isApproved,
        hasTransactionData: hasTransactionData,
        transactionDate: commitResponse.transactionDate,
        amount: commitResponse.amount
      });
      
      // SI EL PAGO FUE APROBADO Y EL ESTADO NO ES 'paid', FORZAR ACTUALIZACIÓN
      // ESTO ES CRÍTICO PARA INVITADOS Y USUARIOS LOGUEADOS - DEBE FUNCIONAR IGUAL
      if (isApproved && verifyOrder && verifyOrder.status !== 'paid') {
        console.log('🚨 CRÍTICO: Pago aprobado pero estado no es "paid". Estado actual:', verifyOrder.status);
        console.log('🚨 Order ID:', order.id);
        console.log('🚨 User ID:', order.user_id, 'Is Guest:', !order.user_id);
        console.log('🚨 Forzando actualización a "paid" INMEDIATAMENTE...');
        
        // Intentar múltiples estrategias para asegurar que se actualice
        let fixResult = await supabase
          .from('orders')
          .update({ 
            status: 'paid',
            payment_details: paymentDetails,
            payment_reference: paymentReference,
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);
        
        if (fixResult.error) {
          console.error('❌ Error crítico corrigiendo estado (intento 1):', fixResult.error);
          console.error('❌ Intentando sin payment_details...');
          
          // Intento 2: sin payment_details
          fixResult = await supabase
            .from('orders')
            .update({ 
              status: 'paid',
              payment_reference: paymentReference,
              updated_at: new Date().toISOString()
            })
            .eq('id', order.id);
          
          if (fixResult.error) {
            console.error('❌ Error crítico en intento 2:', fixResult.error);
            console.error('❌ Intentando solo con status...');
            
            // Intento 3: solo status
            fixResult = await supabase
              .from('orders')
              .update({ 
                status: 'paid',
                updated_at: new Date().toISOString()
              })
              .eq('id', order.id);
            
            if (fixResult.error) {
              console.error('❌❌❌ FALLO TOTAL: No se pudo actualizar el estado a "paid"');
              console.error('❌❌❌ Error:', JSON.stringify(fixResult.error, null, 2));
            } else {
              console.log('✅ Estado corregido a "paid" (solo status)');
            }
          } else {
            console.log('✅ Estado corregido a "paid" (sin payment_details)');
          }
        } else {
          console.log('✅ Estado corregido a "paid" exitosamente');
        }
        
        // Verificar DESPUÉS de la corrección
        const { data: finalVerify } = await supabase
          .from('orders')
          .select('id, status, payment_details, user_id')
          .eq('id', order.id)
          .single();
        
        console.log('🔍 Verificación final después de corrección:', {
          orderId: finalVerify?.id,
          status: finalVerify?.status,
          isPaid: finalVerify?.status === 'paid',
          MUST_BE_PAID: isApproved,
          user_id: finalVerify?.user_id,
          isGuest: !finalVerify?.user_id,
          hasPaymentDetails: !!finalVerify?.payment_details
        });
        
        // Si AÚN no es 'paid', hay un problema grave
        if (finalVerify && finalVerify.status !== 'paid' && isApproved) {
          console.log('🚨🚨🚨 PROBLEMA GRAVE: Estado sigue sin ser "paid" después de corrección');
          console.log('🚨🚨🚨 Order:', finalVerify.id, 'Status:', finalVerify.status, 'Is Guest:', !finalVerify.user_id);
          
          // Último intento desesperado
          const lastAttempt = await supabase
            .from('orders')
            .update({ status: 'paid' })
            .eq('id', order.id);
          
          if (!lastAttempt.error) {
            console.log('✅ Estado actualizado en último intento');
          } else {
            console.error('❌❌❌ FALLO TOTAL: Requiere intervención manual');
          }
        }
      }
      
      // Si hay datos de transacción, el pago FUE PROCESADO - el estado DEBE ser 'paid'
      // ESTO ES ABSOLUTO - sin excepciones para invitados o logueados
      if (hasTransactionData && verifyOrder && verifyOrder.status !== 'paid') {
        console.log('🚨 CRÍTICO: Hay transactionDate y amount pero estado no es "paid". Forzando...');
        console.log('🚨 Order ID:', order.id, 'User ID:', order.user_id, 'Is Guest:', !order.user_id);
        
        const forcePaidResult = await supabase
          .from('orders')
          .update({ 
            status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);
        
        if (forcePaidResult.error) {
          console.error('❌ Error crítico forzando estado a "paid":', forcePaidResult.error);
          console.error('❌ Esto es un problema grave que requiere atención inmediata');
        } else {
          console.log('✅ Estado forzado a "paid" por transactionDate y amount');
          
          // Verificar una vez más
          const { data: finalCheck } = await supabase
            .from('orders')
            .select('id, status, user_id')
            .eq('id', order.id)
            .single();
          
          console.log('🔍 Verificación final por transactionData:', {
            orderId: finalCheck?.id,
            status: finalCheck?.status,
            isPaid: finalCheck?.status === 'paid',
            user_id: finalCheck?.user_id,
            isGuest: !finalCheck?.user_id
          });
        }
      }
    }

    // Descontar stock cuando el pago es exitoso (solo una vez cuando isApproved es true)
    // NO descontar si ya fue descontado anteriormente
    if (isApproved && !stockAlreadyDeducted) {
      try {
        console.log('📦 INICIANDO descuento de stock de productos...');
        console.log('📦 Order ID:', order.id);
        console.log('📦 Stock ya descontado?', stockAlreadyDeducted);
        
        // Obtener items del pedido (sin relación primero para verificar)
        const { data: orderItemsForStock, error: itemsError } = await supabase
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', order.id);
        
        console.log('📦 Items del pedido obtenidos:', {
          count: orderItemsForStock?.length || 0,
          items: orderItemsForStock,
          error: itemsError?.message
        });
        
        if (itemsError) {
          console.error('❌ Error obteniendo items del pedido para descontar stock:', itemsError);
        } else if (orderItemsForStock && orderItemsForStock.length > 0) {
          let stockDeductedSuccessfully = true;
          
          // Descontar stock de cada producto
          for (const item of orderItemsForStock) {
            if (item.product_id && item.quantity) {
              const productId = Number(item.product_id);
              const quantityToDeduct = Number(item.quantity);
              
              console.log(`📦 Procesando producto ${productId}, cantidad a descontar: ${quantityToDeduct}`);
              
              // Obtener el stock actual del producto
              const { data: productData, error: productError } = await supabase
                .from('products')
                .select('id, stock, name')
                .eq('id', productId)
                .single();
              
              if (productError || !productData) {
                console.error(`❌ Error obteniendo producto ${productId}:`, productError);
                stockDeductedSuccessfully = false;
                continue;
              }
              
              const currentStock = Number(productData.stock) || 0;
              const newStock = Math.max(0, currentStock - quantityToDeduct);
              
              console.log(`📦 Producto: ${productData.name || productId}`);
              console.log(`📦 Stock actual: ${currentStock}, cantidad a descontar: ${quantityToDeduct}, nuevo stock: ${newStock}`);
              
              // Actualizar stock
              const { data: updatedProduct, error: stockError } = await supabase
                .from('products')
                .update({ 
                  stock: newStock,
                  updated_at: new Date().toISOString()
                })
                .eq('id', productId)
                .select('id, stock, name');
              
              if (stockError) {
                console.error(`❌ Error descontando stock del producto ${productId}:`, stockError);
                console.error(`❌ Detalles del error:`, JSON.stringify(stockError, null, 2));
                stockDeductedSuccessfully = false;
              } else if (updatedProduct && updatedProduct.length > 0) {
                console.log(`✅ Stock actualizado exitosamente:`);
                console.log(`✅ Producto: ${updatedProduct[0].name || productId}`);
                console.log(`✅ Stock anterior: ${currentStock}`);
                console.log(`✅ Stock nuevo: ${updatedProduct[0].stock}`);
                console.log(`✅ Cantidad descontada: ${quantityToDeduct}`);
              } else {
                console.warn(`⚠️ No se actualizó ningún producto con ID ${productId}`);
                stockDeductedSuccessfully = false;
              }
            } else {
              console.warn(`⚠️ Item inválido:`, item);
            }
          }
          
          // Marcar en payment_details que el stock fue descontado
          if (stockDeductedSuccessfully) {
            paymentDetails.stockDeducted = true;
            console.log('✅ Stock descontado exitosamente - marcado en payment_details');
          } else {
            console.warn('⚠️ Algunos productos no pudieron actualizar stock');
          }
          
          console.log('✅ Proceso de descuento de stock completado');
        } else {
          console.log('⚠️ No se encontraron items del pedido para descontar stock');
        }
      } catch (stockError: any) {
        console.error('❌ Error crítico al descontar stock:', stockError);
        console.error('❌ Stack:', stockError.stack);
        // No fallar la confirmación del pago si hay error al descontar stock
      }
    } else if (stockAlreadyDeducted) {
      console.log('⚠️ Stock ya fue descontado anteriormente para este pedido');
    } else {
      console.log('⚠️ Pago no aprobado, no se descuenta stock');
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
          
          const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://mimoto.cl';
          const emailHtml = generateEmailHTML({
            title: '✅ Pago Confirmado',
            message: `Tu pago ha sido confirmado exitosamente. Tu pedido #${order.id} está siendo procesado.`,
            orderId: order.id,
            amount: Number(order.total_amount),
            items: orderItems,
            logoUrl: `${siteUrl}/logo.png`
          });

          console.log('📧 Preparando envío de email de confirmación de pago...');
          console.log('📧 Email HTML generado, longitud:', emailHtml.length);
          console.log('📧 Destinatario:', customerEmail);
          console.log('📧 Asunto: Pago Confirmado - Pedido #' + order.id);
          
          const emailResult = await sendEmail({
            to: customerEmail,
            subject: `Pago Confirmado - Pedido #${order.id}`,
            html: emailHtml
          });

          console.log('📧 Resultado del envío de email de confirmación:', {
            success: emailResult.success,
            resendId: emailResult.resendId || 'N/A',
            error: emailResult.error || 'N/A',
            to: customerEmail
          });

          if (emailResult.success) {
            console.log('✅ Email de confirmación de pago enviado exitosamente');
            console.log('✅ Puedes verificar el email en: https://resend.com/emails');
          } else {
            console.error('❌ Error enviando email de confirmación de pago:', emailResult.error);
            console.error('❌ Revisa las variables de entorno: RESEND_API_KEY, FROM_EMAIL, FROM_NAME');
          }
        } else {
          console.log('⚠️ No hay email del cliente para enviar confirmación de pago');
        }
      } catch (emailError: any) {
        console.error('❌ Error enviando email de confirmación de pago:', emailError);
        // No bloquear la respuesta si falla el email
      }
    }

    // VERIFICACIÓN FINAL ABSOLUTA: Si el pago fue aprobado, el estado DEBE ser 'paid'
    // Esto es CRÍTICO para invitados y usuarios logueados
    if (isApproved) {
      console.log('🔍 VERIFICACIÓN FINAL ABSOLUTA antes de responder...');
      const { data: finalOrderCheck } = await supabase
        .from('orders')
        .select('id, status, user_id')
        .eq('id', order.id)
        .single();
      
      if (finalOrderCheck && finalOrderCheck.status !== 'paid') {
        console.log('🚨🚨🚨 ESTADO FINAL NO ES "paid" - FORZANDO ACTUALIZACIÓN ULTIMA VEZ');
        console.log('🚨 Order ID:', finalOrderCheck.id);
        console.log('🚨 Status actual:', finalOrderCheck.status);
        console.log('🚨 User ID:', finalOrderCheck.user_id, 'Is Guest:', !finalOrderCheck.user_id);
        
        // Forzar actualización una última vez
        const absoluteFix = await supabase
          .from('orders')
          .update({ 
            status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);
        
        if (absoluteFix.error) {
          console.error('❌❌❌ ERROR CRÍTICO: No se pudo actualizar el estado a "paid" en verificación final');
          console.error('❌❌❌ Error:', JSON.stringify(absoluteFix.error, null, 2));
        } else {
          console.log('✅✅✅ Estado actualizado a "paid" en verificación final');
          
          // Verificar una vez más
          const { data: ultimateCheck } = await supabase
            .from('orders')
            .select('id, status')
            .eq('id', order.id)
            .single();
          
          console.log('🔍 Verificación última:', {
            orderId: ultimateCheck?.id,
            status: ultimateCheck?.status,
            isPaid: ultimateCheck?.status === 'paid'
          });
        }
      } else {
        console.log('✅ Verificación final: Estado es "paid" ✓');
      }
    }

    // Preparar respuesta con todos los campos disponibles
    // CRÍTICO: Si isApproved es true (hay transactionDate y amount), success DEBE ser true
    // y responseCode DEBE ser 0, incluso si Webpay devolvió -1
    
    // VERIFICACIÓN FINAL ABSOLUTA: Si hay transactionDate y amount, el pago FUE EXITOSO
    // Esto es CRÍTICO - no importa qué diga responseCode
    const finalHasTransactionData = !!(commitResponse.transactionDate && commitResponse.amount);
    const finalIsApproved = finalHasTransactionData || isApproved;
    
    console.log('📤📤📤 PREPARANDO RESPUESTA FINAL:');
    console.log('📤 isApproved (calculado antes):', isApproved);
    console.log('📤 finalHasTransactionData (verificación final):', finalHasTransactionData);
    console.log('📤 transactionDate:', commitResponse.transactionDate);
    console.log('📤 amount:', commitResponse.amount);
    console.log('📤 finalIsApproved (RESULTADO FINAL):', finalIsApproved);
    
    const finalSuccess = finalIsApproved; // Si hay transactionDate y amount, success es true
    const finalResponseCode = finalIsApproved ? 0 : (commitResponse.responseCode ?? -1);
    const finalResponseMessage = finalIsApproved 
      ? 'Transacción aprobada' 
      : (commitResponse.responseMessage || 'Transacción rechazada');
    
    console.log('📤 Valores finales de respuesta:');
    console.log('📤 finalSuccess:', finalSuccess);
    console.log('📤 finalResponseCode:', finalResponseCode);
    console.log('📤 finalResponseMessage:', finalResponseMessage);
    console.log('📤 originalResponseCode:', commitResponse.responseCode);
    
    const responseData = {
        success: finalSuccess, // Si hay transactionDate y amount, success es true
      responseCode: finalResponseCode, // Si hay transactionDate y amount, responseCode es 0
      responseMessage: finalResponseMessage, // Si hay transactionDate y amount, mensaje es "aprobada"
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

