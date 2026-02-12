import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { WebpayService } from './webpay.service';

/**
 * Controller para endpoints de Webpay Plus
 * 
 * Endpoints:
 * - POST /api/webpay/init - Inicializar transacción
 * - POST /api/webpay/confirm - Confirmar transacción (commit) - SOLO backend
 */
@Controller('webpay')
export class WebpayController {
  constructor(private readonly webpayService: WebpayService) {}

  /**
   * Inicializa una transacción en Webpay Plus
   * 
   * @param body { orderId: number, returnUrl: string }
   * @returns Token y URL de Webpay para redirigir al usuario
   */
  @Post('init')
  async init(@Body() body: { orderId: number; returnUrl?: string }) {
    const { orderId, returnUrl } = body;

    if (!orderId) {
      throw new Error('orderId es requerido');
    }

    // Si no se proporciona returnUrl, usar una por defecto
    const finalReturnUrl = returnUrl || `${process.env.PUBLIC_SITE_URL || 'http://localhost:4321'}/pago/confirmar?orderId=${orderId}`;

    return this.webpayService.initTransaction(orderId, finalReturnUrl);
  }

  /**
   * Confirma una transacción de Webpay Plus
   * 
   * IMPORTANTE: Este endpoint SOLO debe ser llamado desde el backend.
   * El frontend NO debe hacer commit directamente.
   * 
   * Maneja dos casos:
   * 1. TBK_TOKEN (cancelación) - NO hace commit, solo retorna cancelación
   * 2. token_ws (pago normal) - Hace commit y procesa el pago
   * 
   * Transbank puede enviar datos como form-urlencoded o JSON
   * El frontend también puede enviar JSON
   * 
   * @param req Request de Express (para acceder a formData si es necesario)
   * @param body { token_ws?: string, TBK_TOKEN?: string }
   * @returns Resultado de la confirmación con status claro
   */
  @Post('confirm')
  async confirm(
    @Req() req: Request,
    @Body() body: { token_ws?: string; TBK_TOKEN?: string }
  ) {
    // Extraer token_ws o TBK_TOKEN del body (puede venir como JSON o form-urlencoded)
    let token_ws = body.token_ws;
    let TBK_TOKEN = body.TBK_TOKEN;

    // Si no vienen en el body, intentar desde formData (Transbank puede enviar así)
    if (!token_ws && !TBK_TOKEN && req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      const formData = (req as any).body;
      token_ws = formData?.token_ws || null;
      TBK_TOKEN = formData?.TBK_TOKEN || null;
    }

    /**
     * 1️⃣ CANCELACIÓN - TBK_TOKEN presente
     * NO hacer commit, solo retornar cancelación
     */
    if (TBK_TOKEN) {
      console.log('🚫 Pago cancelado por el usuario - TBK_TOKEN:', TBK_TOKEN);
      return {
        status: 'cancelled',
        message: 'Pago cancelado por el usuario'
      };
    }

    /**
     * 2️⃣ CONFIRMACIÓN REAL - token_ws presente
     * Hacer commit y procesar según response_code
     */
    if (!token_ws) {
      throw new Error('token_ws o TBK_TOKEN es requerido');
    }

    // Confirmar la transacción (COMMIT - SOLO EN BACKEND)
    const result = await this.webpayService.confirmTransaction(token_ws);

    /**
     * 3️⃣ SOLO response_code === 0 ES ÉXITO
     * Retornar respuesta simplificada con status claro
     * El frontend solo debe verificar result.status
     */
    if (result.responseCode === 0) {
      return {
        status: 'approved',
        response: result
      };
    }

    /**
     * 4️⃣ RECHAZADO
     */
    return {
      status: 'rejected',
      response: result
    };
  }
}

