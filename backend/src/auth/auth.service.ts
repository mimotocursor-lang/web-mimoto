import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../infra/supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  // Aquí podrías implementar helpers para gestionar sesiones con Supabase
}






