import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    console.log('📥 POST /api/orders/create recibido');
    console.log('📥 Content-Type:', request.headers.get('content-type'));
    console.log('📥 Content-Length:', request.headers.get('content-length'));
    console.log('📥 Method:', request.method);
    console.log('📥 URL:', request.url);
    
    // Parsear el body de forma segura - SOLO UNA VEZ
    let body;
    let items;
    
    try {
      // En Astro, a veces request.json() falla si el body está vacío
      // Leer primero como texto para verificar que hay contenido
      const contentType = request.headers.get('content-type') || '';
      console.log('📥 Content-Type recibido:', contentType);
      console.log('📥 Content-Length:', request.headers.get('content-length'));
      
      // Leer el body como texto primero
      const bodyText = await request.text();
      console.log('📥 Body recibido como texto (length):', bodyText ? bodyText.length : 0);
      console.log('📥 Body recibido como texto (primeros 200 chars):', bodyText ? bodyText.substring(0, 200) : 'VACÍO');
      
      if (!bodyText || bodyText.trim() === '') {
        console.error('❌ Body está vacío');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'El cuerpo de la petición está vacío',
            details: 'No se recibió ningún dato en el cuerpo de la petición'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Intentar parsear el JSON
      try {
        body = JSON.parse(bodyText);
        console.log('📥 Body parseado exitosamente');
        console.log('📥 Body type:', typeof body);
        console.log('📥 Body keys:', body && typeof body === 'object' ? Object.keys(body) : 'NO HAY KEYS');
        console.log('📥 Body completo:', JSON.stringify(body, null, 2));
      } catch (jsonError: any) {
        console.error('❌ Error parseando JSON:', jsonError);
        console.error('❌ Body text que falló:', bodyText.substring(0, 500));
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Error al parsear el JSON: ' + (jsonError.message || 'Formato inválido'),
            details: 'El cuerpo de la petición no es un JSON válido'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        console.error('❌ Body no es un objeto válido:', body);
        console.error('❌ Body type:', typeof body);
        console.error('❌ Body isArray:', Array.isArray(body));
        return new Response(
          JSON.stringify({ success: false, error: 'El cuerpo de la petición no es un objeto válido' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      items = body.items;
      const orderEmail = body.email || null; // Email para notificaciones
      console.log('📥 Items extraídos:', items ? `Array con ${items.length} items` : 'NO HAY ITEMS');
      console.log('📥 Email extraído:', orderEmail || 'NO HAY EMAIL');
      
      if (!items) {
        console.error('❌ Body no tiene propiedad "items"');
        console.error('❌ Body completo:', JSON.stringify(body, null, 2));
        return new Response(
          JSON.stringify({ success: false, error: 'El cuerpo de la petición no tiene la propiedad "items"' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (parseError: any) {
      console.error('❌ Error inesperado leyendo el request:', parseError);
      console.error('❌ Error message:', parseError.message);
      console.error('❌ Error name:', parseError.name);
      console.error('❌ Error stack:', parseError.stack);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Error al leer la petición: ' + (parseError.message || 'Error desconocido'),
          details: 'No se pudo procesar el cuerpo de la petición'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No hay items en el carrito' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Configurar Supabase
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://prizpqahcluomioxnmex.supabase.co';
    const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('🔧 Variables de entorno:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      supabaseUrlLength: supabaseUrl ? supabaseUrl.length : 0,
      serviceKeyLength: supabaseServiceKey ? supabaseServiceKey.length : 0
    });
    
    if (!supabaseUrl) {
      console.error('❌ PUBLIC_SUPABASE_URL no está configurada');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'PUBLIC_SUPABASE_URL no está configurada. Por favor, configura esta variable de entorno en Vercel.' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!supabaseServiceKey) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY no está configurada');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'SUPABASE_SERVICE_ROLE_KEY no está configurada. Por favor, configura esta variable de entorno en Vercel (Settings → Environment Variables). Esta es una variable privada que solo está disponible en el servidor.' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Obtener el usuario desde el token de sesión
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (!userError && user) {
        userId = user.id;
      }
    }

    // Si no hay usuario autenticado, crear pedido sin usuario (para usuarios no autenticados)
    if (!userId) {
      // Calcular total
      const totalAmount = items.reduce((sum: number, item: any) => 
        sum + (item.priceSnapshot || item.price || 0) * (item.quantity || 1), 0
      );

      // Crear pedido temporal (sin usuario) - user_id puede ser NULL según el schema
      // Intentar con 'pending_payment' primero, si falla usar 'pending' o dejar que use el default
      let orderData: any = {
        user_id: null, // Permitir NULL para usuarios no autenticados
        total_amount: totalAmount,
        email: orderEmail, // Email para notificaciones
      };
      
      // Intentar insertar con status, si falla intentar sin status (usar default)
      let { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          status: 'pending_payment',
        })
        .select('id, total_amount, status')
        .single();
      
      // Si falla con 'pending_payment', intentar con 'pending'
      if (orderError && orderError.message?.includes('invalid input value for enum')) {
        console.log('⚠️ pending_payment no es válido, intentando con pending...');
        const result = await supabase
          .from('orders')
          .insert({
            ...orderData,
            status: 'pending',
          })
          .select('id, total_amount, status')
          .single();
        order = result.data;
        orderError = result.error;
      }
      
      // Si aún falla, intentar sin especificar status (usar default de la BD)
      if (orderError && orderError.message?.includes('invalid input value for enum')) {
        console.log('⚠️ pending tampoco es válido, usando default de la BD...');
        const result = await supabase
          .from('orders')
          .insert(orderData)
          .select('id, total_amount, status')
          .single();
        order = result.data;
        orderError = result.error;
      }

      if (orderError) {
        console.error('Error creando pedido:', orderError);
        return new Response(
          JSON.stringify({ success: false, error: 'Error al crear el pedido: ' + orderError.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Crear items del pedido
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity || 1,
        unit_price: item.priceSnapshot || item.price || 0,
        total_price: (item.priceSnapshot || item.price || 0) * (item.quantity || 1),
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creando items del pedido:', itemsError);
        // No fallar, el pedido ya se creó
      }

      return new Response(
        JSON.stringify({
          success: true,
          order: {
            id: order.id,
            total_amount: order.total_amount,
            status: order.status,
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Si hay usuario autenticado, crear pedido con usuario
    const totalAmount = items.reduce((sum: number, item: any) => 
      sum + (item.priceSnapshot || item.price || 0) * (item.quantity || 1), 0
    );

    // Obtener email del usuario si no se proporcionó uno en el body
    let finalEmail = orderEmail;
    if (!finalEmail && userId) {
      try {
        const { data: userData } = await supabase.auth.getUser(authHeader!.substring(7));
        if (userData?.user?.email) {
          finalEmail = userData.user.email;
        }
      } catch (e) {
        console.log('⚠️ No se pudo obtener email del usuario');
      }
    }

    // Intentar insertar con status, si falla intentar sin status (usar default)
    let orderData: any = {
      user_id: userId,
      total_amount: totalAmount,
      email: finalEmail, // Email para notificaciones
    };
    
    let { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        status: 'pending_payment',
      })
      .select('id, total_amount, status')
      .single();
    
    // Si falla con 'pending_payment', intentar con 'pending'
    if (orderError && orderError.message?.includes('invalid input value for enum')) {
      console.log('⚠️ pending_payment no es válido, intentando con pending...');
      const result = await supabase
        .from('orders')
        .insert({
          ...orderData,
          status: 'pending',
        })
        .select('id, total_amount, status')
        .single();
      order = result.data;
      orderError = result.error;
    }
    
    // Si aún falla, intentar sin especificar status (usar default de la BD)
    if (orderError && orderError.message?.includes('invalid input value for enum')) {
      console.log('⚠️ pending tampoco es válido, usando default de la BD...');
      const result = await supabase
        .from('orders')
        .insert(orderData)
        .select('id, total_amount, status')
        .single();
      order = result.data;
      orderError = result.error;
    }

    if (orderError) {
      console.error('Error creando pedido:', orderError);
      return new Response(
        JSON.stringify({ success: false, error: 'Error al crear el pedido: ' + orderError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Crear items del pedido
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity || 1,
      unit_price: item.priceSnapshot || item.price || 0,
      total_price: (item.priceSnapshot || item.price || 0) * (item.quantity || 1),
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creando items del pedido:', itemsError);
      // No fallar, el pedido ya se creó
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          total_amount: order.total_amount,
          status: order.status,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Error inesperado en /api/orders/create:', error);
    console.error('❌ Stack:', error.stack);
    
    // Asegurar que siempre devolvemos JSON válido
    let errorMessage = 'Error al crear el pedido';
    if (error && typeof error === 'object') {
      if (error.message) {
        errorMessage = error.message;
      } else if (error.toString) {
        errorMessage = error.toString();
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
};

