import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../infra/supabase/supabase.service';

@Injectable()
export class BannersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findActive() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('banners')
      .select('*')
      .eq('active', true)
      .order('position', { ascending: true });
    if (error) throw error;
    return data;
  }
}

import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../infra/supabase/supabase.service';

@Injectable()
export class BannersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findActive() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('banners')
      .select('*')
      .eq('active', true)
      .order('position', { ascending: true });

    if (error) throw error;
    return data;
  }
}


