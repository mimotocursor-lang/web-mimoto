import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

// Placeholder simple guard: en producción valida el JWT de Supabase
@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }
    // Aquí deberías validar el JWT de Supabase y adjuntar el usuario a req.user
    // Para el esqueleto, simplemente permitimos el acceso.
    (req as any).user = { id: null, role: 'buyer' };
    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../infra/supabase/supabase.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string | undefined;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.substring('Bearer '.length);
    const client = this.supabase.getClient();

    const { data, error } = await client.auth.getUser(token);

    if (error || !data?.user) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = {
      id: data.user.id,
      email: data.user.email ?? undefined,
    };

    return true;
  }
}


