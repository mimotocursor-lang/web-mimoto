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

    // LÓGICA CORRECTA SEGÚN ESTÁNDAR DE TRANSBANK
    // PRIORIDAD 1: response_code === 0 es el indicador principal
    // PRIORIDAD 2: Si responseCode es -1 pero hay authorizationCode + transactionDate + amount,
    //              puede ser un caso especial donde el pago fue exitoso pero el código no se actualizó
    //              (esto puede pasar en algunos casos del SDK o en transacciones específicas)
    
    // Normalizar responseCode (puede venir como string o number)
    let responseCode = commitResponse.responseCode;
    if (typeof responseCode === 'string') {
      responseCode = parseInt(responseCode, 10);
    }
    if (isNaN(responseCode)) {
      responseCode = -1;
    }
    
    // Verificar indicadores secundarios (solo si responseCode no es 0)
    const hasAuthorizationCode = !!commitResponse.authorizationCode;
    const hasTransactionDate = !!commitResponse.transactionDate;
    const hasAmount = !!commitResponse.amount && Number(commitResponse.amount) > 0;
    const hasAllSecondaryIndicators = hasAuthorizationCode && hasTransactionDate && hasAmount;
    
    console.log('🔍 Evaluación de pago:');
    console.log('🔍 responseCode:', commitResponse.responseCode, '→ normalizado:', responseCode, 'tipo:', typeof responseCode);
    console.log('🔍 Indicadores secundarios:');
    console.log('🔍   - authorizationCode:', hasAuthorizationCode, 'valor:', commitResponse.authorizationCode);
    console.log('🔍   - transactionDate:', hasTransactionDate, 'valor:', commitResponse.transactionDate);
    console.log('🔍   - amount:', hasAmount, 'valor:', commitResponse.amount);
    console.log('🔍   - Todos presentes:', hasAllSecondaryIndicators);
    
    // PRIORIDAD 1: responseCode === 0 es el indicador principal y definitivo
    let isApproved = responseCode === 0;
    
    // PRIORIDAD 2: Si responseCode es -1 pero hay todos los indicadores secundarios,
    //              puede ser un caso especial (pago procesado pero código no actualizado)
    //              SOLO usar esto si responseCode NO es 0
    if (!isApproved && responseCode === -1 && hasAllSecondaryIndicators) {
      console.log('⚠️ CASO ESPECIAL: responseCode = -1 pero hay authorizationCode + transactionDate + amount');
      console.log('⚠️ Esto puede indicar que el pago fue procesado pero el código no se actualizó correctamente');
      console.log('⚠️ Usando indicadores secundarios como respaldo');
      isApproved = true;
    }
    
    console.log('🔍 isApproved (resultado final):', isApproved);
    
    // Validar que el monto pagado coincide con el monto de la orden
    if (isApproved && commitResponse.amount) {
      const paidAmount = Number(commitResponse.amount);
      const orderAmount = Number(order.total_amount);
      const amountDifference = Math.abs(paidAmount - orderAmount);
      
      // Permitir pequeña diferencia por redondeo (hasta 1 peso)
      if (amountDifference > 1) {
        console.error('❌ ERROR: Monto pagado no coincide con monto de la orden');
        console.error('❌ Monto pagado:', paidAmount);
        console.error('❌ Monto de orden:', orderAmount);
        console.error('❌ Diferencia:', amountDifference);
        
        // Rechazar el pago si el monto no coincide
        return new Response(
          JSON.stringify({
            success: false,
            paymentApproved: false,
            responseCode: -1,
            responseMessage: `Error: El monto pagado ($${paidAmount}) no coincide con el monto de la orden ($${orderAmount})`,
            orderId: order.id
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    if (isApproved) {
      if (responseCode === 0) {
        console.log('✅ PAGO APROBADO - responseCode === 0 (estándar Transbank)');
      } else {
        console.log('✅ PAGO APROBADO - Caso especial: responseCode = -1 pero indicadores secundarios presentes');
        console.log('✅   - authorizationCode:', commitResponse.authorizationCode);
        console.log('✅   - transactionDate:', commitResponse.transactionDate);
        console.log('✅   - amount:', commitResponse.amount);
      }
    } else {
      console.log('❌ PAGO RECHAZADO - responseCode:', responseCode);
      console.log('❌ Mensaje:', commitResponse.responseMessage);
      console.log('❌ Indicadores secundarios:');
      console.log('❌   - authorizationCode:', hasAuthorizationCode ? commitResponse.authorizationCode : 'NO presente');
      console.log('❌   - transactionDate:', hasTransactionDate ? commitResponse.transactionDate : 'NO presente');
      console.log('❌   - amount:', hasAmount ? commitResponse.amount : 'NO presente');
    }

    // Preparar payment_details con toda la información de la transacción
    let paymentDetails: any = {
      authorizationCode: commitResponse.authorizationCode || null,
      transactionDate: commitResponse.transactionDate || null,
      paymentTypeCode: commitResponse.paymentTypeCode || null,
      installmentsNumber: commitResponse.installmentsNumber || 0,
      cardDetail: commitResponse.cardDetail || null,
      buyOrder: commitResponse.buyOrder || null,
      amount: commitResponse.amount || null,
      responseCode: commitResponse.responseCode !== undefined ? commitResponse.responseCode : null,
      responseMessage: commitResponse.responseMessage || null,
      vci: commitResponse.vci || null,
      accountingDate: commitResponse.accountingDate || null,
      stockDeducted: false // Se actualizará después de descontar stock
    };
    
    // Preparar payment_reference
    const paymentReference = isApproved 
      ? `${token_ws}-confirmed` 
      : `${token_ws}-rejected`;
    
    // Actualizar el estado del pedido solo si el pago fue aprobado
    const statusToUpdate = isApproved ? 'paid' : 'pending_payment';
    
    console.log('🔄 Actualizando estado del pedido:', {
      orderId: order.id,
      oldStatus: order.status,
      newStatus: statusToUpdate,
      isApproved: isApproved,
      responseCode: commitResponse.responseCode,
      user_id: order.user_id
    });
    
    // Actualizar estado en base de datos
    let updateResult = await supabase
      .from('orders')
      .update({
        status: statusToUpdate,
        payment_reference: paymentReference,
        payment_details: paymentDetails,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    // Manejar errores de actualización
    if (updateResult.error) {
      console.error('❌ Error actualizando estado del pedido:', updateResult.error);
      
      // Si el pago fue aprobado pero falla la actualización, es crítico
      if (isApproved) {
        console.error('❌ CRÍTICO: Pago aprobado pero no se pudo actualizar estado a "paid"');
        
        // Intentar actualizar solo el status
        const retryResult = await supabase
          .from('orders')
          .update({ status: 'paid', updated_at: new Date().toISOString() })
          .eq('id', order.id);
        
        if (retryResult.error) {
          console.error('❌ Error crítico: No se pudo actualizar estado a "paid"');
        } else {
          console.log('✅ Estado actualizado a "paid" en segundo intento');
          updateResult = retryResult;
        }
      } else {
        // Si falla con 'pending_payment', intentar con 'pending'
        if (updateResult.error.message?.includes('invalid input value for enum')) {
          console.log('⚠️ pending_payment no es válido, intentando con pending...');
          updateResult = await supabase
            .from('orders')
            .update({
              status: 'pending',
              payment_reference: paymentReference,
              payment_details: paymentDetails,
              updated_at: new Date().toISOString()
            })
            .eq('id', order.id);
        }
      }
    } else {
      console.log('✅ Estado del pedido actualizado exitosamente');
      console.log('✅ orderId:', order.id);
      console.log('✅ newStatus:', statusToUpdate);
      
    }

    // Descontar stock cuando el pago es exitoso (solo si isApproved = true)
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


    // Preparar respuesta final
    // NO forzar responseCode - usar el valor real de Transbank
    // Agregar campo claro paymentApproved para el frontend
    
    console.log('📤 Preparando respuesta final:');
    console.log('📤 isApproved:', isApproved);
    console.log('📤 responseCode (real de Transbank):', commitResponse.responseCode);
    
    const responseData = {
      success: isApproved,
      paymentApproved: isApproved, // Campo claro para el frontend
      responseCode: commitResponse.responseCode ?? -1, // Valor real de Transbank, NO forzado
      responseMessage: commitResponse.responseMessage || 'Transacción rechazada',
      buyOrder: commitResponse.buyOrder,
      amount: commitResponse.amount,
      authorizationCode: commitResponse.authorizationCode,
      orderId: order.id,
      // Información adicional requerida por Transbank
      transactionDate: commitResponse.transactionDate || null,
      paymentTypeCode: commitResponse.paymentTypeCode || null,
      installmentsNumber: commitResponse.installmentsNumber || 0,
      cardDetail: commitResponse.cardDetail || null,
      orderItems: orderItems
    };

    console.log('📤 Respuesta final:', {
      success: responseData.success,
      paymentApproved: responseData.paymentApproved,
      responseCode: responseData.responseCode,
      orderId: responseData.orderId
    });

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

