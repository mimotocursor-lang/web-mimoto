import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../infra/supabase/supabase.service';
import { WebpayPlus, Options, Environment } from 'transbank-sdk';

/**
 * Servicio para manejar transacciones de Webpay Plus
 * 
 * Responsabilidades:
 * - Crear transacciones en Webpay (init)
 * - Confirmar transacciones (commit) - SOLO en backend
 * - Validar respuestas según estándar Transbank
 * - Actualizar estado de órdenes en base de datos
 */
@Injectable()
export class WebpayService {
  private webpayPlus: WebpayPlus.Transaction;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly configService: ConfigService,
  ) {
    // Configurar Webpay Plus según variables de entorno
    const environment = this.configService.get<string>('WEBPAY_ENVIRONMENT') === 'production'
      ? Environment.Production
      : Environment.Integration;

    const commerceCode = this.configService.get<string>('WEBPAY_COMMERCE_CODE') || '597055555532';
    const apiKey = this.configService.get<string>('WEBPAY_API_KEY') || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

    const options = new Options(commerceCode, apiKey, environment);
    this.webpayPlus = new WebpayPlus.Transaction(options);
  }

  /**
   * Inicializa una transacción en Webpay Plus
   * 
   * @param orderId ID de la orden
   * @param returnUrl URL donde Webpay redirigirá después del pago
   * @returns Token y URL de Webpay para redirigir al usuario
   */
  async initTransaction(orderId: number, returnUrl: string) {
    const client = this.supabase.getClient();

    // Obtener datos del pedido
    const { data: order, error: orderError } = await client
      .from('orders')
      .select('id, total_amount, user_id, status')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Pedido no encontrado');
    }

    // Calcular monto (en pesos chilenos)
    const amount = Math.round(Number(order.total_amount));
    const buyOrder = `ORD-${order.id}-${Date.now()}`;
    const sessionId = order.user_id 
      ? `SESSION-${order.user_id}-${Date.now()}` 
      : `SESSION-GUEST-${order.id}-${Date.now()}`;

    // Crear la transacción en Webpay
    const createResponse = await this.webpayPlus.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    if (!createResponse || !createResponse.token || !createResponse.url) {
      throw new Error('Error al crear la transacción en Webpay: respuesta inválida');
    }

    // Guardar el token de la transacción en el pedido
    await client
      .from('orders')
      .update({
        payment_reference: createResponse.token,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return {
      token: createResponse.token,
      url: createResponse.url,
      buyOrder,
      amount
    };
  }

  /**
   * Confirma una transacción de Webpay Plus
   * 
   * IMPORTANTE: Este método SOLO debe llamarse desde el backend.
   * El frontend NO debe hacer commit directamente.
   * 
   * @param token_ws Token de la transacción recibido de Webpay
   * @returns Resultado de la confirmación con todos los datos de la transacción
   */
  async confirmTransaction(token_ws: string) {
    const client = this.supabase.getClient();

    // Buscar el pedido por el token
    let { data: order, error: orderError } = await client
      .from('orders')
      .select('id, total_amount, status, payment_reference, email, user_id, payment_details')
      .eq('payment_reference', token_ws)
      .single();

    // Si no se encuentra, buscar por payment_reference que empiece con el token
    if (orderError || !order) {
      const { data: orders } = await client
        .from('orders')
        .select('id, total_amount, status, payment_reference, email, user_id, payment_details')
        .like('payment_reference', `${token_ws}%`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (orders && orders.length > 0) {
        order = orders[0];
        orderError = null;
      }
    }

    // Si aún no se encuentra, buscar pedido más reciente sin payment_reference
    if (orderError || !order) {
      const { data: recentOrders } = await client
        .from('orders')
        .select('id, total_amount, status, payment_reference, email, user_id, payment_details')
        .is('payment_reference', null)
        .eq('status', 'pending_payment')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentOrders && recentOrders.length > 0) {
        order = recentOrders[0];
        orderError = null;
      }
    }

    if (orderError || !order) {
      throw new Error('Pedido no encontrado');
    }

    // Verificar si el pedido ya fue procesado
    if (order.status === 'paid') {
      // Si ya está pagado, retornar información sin volver a confirmar
      return {
        success: true,
        paymentApproved: true,
        responseCode: 0,
        responseMessage: 'Transacción ya confirmada anteriormente',
        orderId: order.id,
        alreadyConfirmed: true
      };
    }

    // Verificar si el stock ya fue descontado
    let stockAlreadyDeducted = false;
    try {
      if (order.payment_details && typeof order.payment_details === 'object') {
        stockAlreadyDeducted = (order.payment_details as any).stockDeducted === true;
      }
    } catch (e) {
      // Ignorar errores de parsing
    }

    // Confirmar la transacción con Webpay (COMMIT - SOLO EN BACKEND)
    let commitResponse;
    try {
      commitResponse = await this.webpayPlus.commit(token_ws);
    } catch (commitError: any) {
      console.error('❌ Error al hacer commit con Webpay:', commitError);
      throw new Error(`Error al confirmar la transacción con Webpay: ${commitError.message || 'Error desconocido'}`);
    }

    if (!commitResponse) {
      throw new Error('Webpay no devolvió respuesta');
    }

    // LÓGICA CORRECTA SEGÚN ESTÁNDAR DE TRANSBANK
    // PRIORIDAD 1: response_code === 0 es el indicador principal
    // PRIORIDAD 2: Si responseCode es -1 pero hay authorizationCode + transactionDate + amount,
    //              puede ser un caso especial donde el pago fue exitoso pero el código no se actualizó

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

    /**
     * SOLO response_code === 0 ES ÉXITO (estándar Transbank)
     * NO usar authorizationCode, transactionDate o amount como criterios
     * Estos campos pueden estar presentes incluso en transacciones rechazadas
     */
    const isApproved = responseCode === 0;

    // Log para debugging
    if (!isApproved && hasAllSecondaryIndicators) {
      console.log('⚠️ ADVERTENCIA: responseCode !== 0 pero hay indicadores secundarios');
      console.log('⚠️ responseCode:', responseCode);
      console.log('⚠️ authorizationCode:', commitResponse.authorizationCode);
      console.log('⚠️ transactionDate:', commitResponse.transactionDate);
      console.log('⚠️ amount:', commitResponse.amount);
      console.log('⚠️ El pago será RECHAZADO según estándar Transbank (solo response_code === 0 aprueba)');
    }

    // Validar que el monto pagado coincide con el monto de la orden
    if (isApproved && commitResponse.amount) {
      const paidAmount = Number(commitResponse.amount);
      const orderAmount = Number(order.total_amount);
      const amountDifference = Math.abs(paidAmount - orderAmount);

      // Permitir pequeña diferencia por redondeo (hasta 1 peso)
      if (amountDifference > 1) {
        console.error('❌ ERROR: Monto pagado no coincide con monto de la orden');
        return {
          success: false,
          paymentApproved: false,
          responseCode: -1,
          responseMessage: `Error: El monto pagado ($${paidAmount}) no coincide con el monto de la orden ($${orderAmount})`,
          orderId: order.id
        };
      }
    }

    // Preparar payment_details con toda la información de la transacción
    const paymentDetails: any = {
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
      stockDeducted: false
    };

    // Preparar payment_reference
    const paymentReference = isApproved 
      ? `${token_ws}-confirmed` 
      : `${token_ws}-rejected`;

    // Actualizar el estado del pedido solo si el pago fue aprobado
    const statusToUpdate = isApproved ? 'paid' : 'pending_payment';

    // Actualizar estado en base de datos
    let updateResult = await client
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
        const retryResult = await client
          .from('orders')
          .update({ status: 'paid', updated_at: new Date().toISOString() })
          .eq('id', order.id);

        if (retryResult.error) {
          console.error('❌ Error crítico: No se pudo actualizar estado a "paid"');
        } else {
          updateResult = retryResult;
        }
      } else {
        // Si falla con 'pending_payment', intentar con 'pending'
        if (updateResult.error.message?.includes('invalid input value for enum')) {
          updateResult = await client
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
    }

    // Descontar stock cuando el pago es exitoso (solo si isApproved = true y no fue descontado antes)
    if (isApproved && !stockAlreadyDeducted) {
      try {
        const { data: orderItemsForStock } = await client
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', order.id);

        if (orderItemsForStock && orderItemsForStock.length > 0) {
          let stockDeductedSuccessfully = true;

          for (const item of orderItemsForStock) {
            if (item.product_id && item.quantity) {
              const productId = Number(item.product_id);
              const quantityToDeduct = Number(item.quantity);

              // Obtener el stock actual del producto
              const { data: productData } = await client
                .from('products')
                .select('id, stock, name')
                .eq('id', productId)
                .single();

              if (productData) {
                const currentStock = Number(productData.stock) || 0;
                const newStock = Math.max(0, currentStock - quantityToDeduct);

                // Actualizar stock
                const { error: stockError } = await client
                  .from('products')
                  .update({
                    stock: newStock,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', productId);

                if (stockError) {
                  console.error(`❌ Error descontando stock del producto ${productId}:`, stockError);
                  stockDeductedSuccessfully = false;
                }
              }
            }
          }

          // Marcar en payment_details que el stock fue descontado
          if (stockDeductedSuccessfully) {
            paymentDetails.stockDeducted = true;
          }
        }
      } catch (stockError: any) {
        console.error('❌ Error crítico al descontar stock:', stockError);
        // No fallar la confirmación del pago si hay error al descontar stock
      }
    }

    // Obtener items del pedido para la respuesta
    let orderItems = [];
    try {
      const { data: items } = await client
        .from('order_items')
        .select(`
          quantity,
          unit_price,
          total_price,
          products:product_id(name)
        `)
        .eq('order_id', order.id);

      if (items) {
        orderItems = items.map(item => ({
          name: item.products?.name || 'Producto',
          quantity: item.quantity,
          price: item.unit_price
        }));
      }
    } catch (e) {
      console.log('⚠️ No se pudo obtener items del pedido:', e);
    }

    // Preparar respuesta final
    return {
      success: isApproved,
      paymentApproved: isApproved, // Campo claro para el frontend
      responseCode: commitResponse.responseCode ?? -1, // Valor real de Transbank, NO forzado
      responseMessage: commitResponse.responseMessage || 'Transacción rechazada',
      buyOrder: commitResponse.buyOrder,
      amount: commitResponse.amount,
      authorizationCode: commitResponse.authorizationCode,
      orderId: order.id,
      transactionDate: commitResponse.transactionDate || null,
      paymentTypeCode: commitResponse.paymentTypeCode || null,
      installmentsNumber: commitResponse.installmentsNumber || 0,
      cardDetail: commitResponse.cardDetail || null,
      orderItems: orderItems
    };
  }
}

