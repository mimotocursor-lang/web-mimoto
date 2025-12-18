import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  // Endpoints de ejemplo, la auth real se maneja principalmente desde Supabase

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}






