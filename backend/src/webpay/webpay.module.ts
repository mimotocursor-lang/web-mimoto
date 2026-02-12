import { Module } from '@nestjs/common';
import { WebpayController } from './webpay.controller';
import { WebpayService } from './webpay.service';
import { SupabaseModule } from '../infra/supabase/supabase.module';

/**
 * Módulo de Webpay Plus
 * 
 * Responsabilidades:
 * - Manejar inicialización de transacciones
 * - Confirmar transacciones (commit) - SOLO en backend
 * - Validar respuestas según estándar Transbank
 */
@Module({
  imports: [SupabaseModule],
  controllers: [WebpayController],
  providers: [WebpayService],
  exports: [WebpayService]
})
export class WebpayModule {}

