import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../infra/supabase/supabase.service';

@Injectable()
export class UsedMotorcyclesService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAllActive() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('used_motorcycles')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
}

import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../infra/supabase/supabase.service';

@Injectable()
export class UsedMotorcyclesService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAllActive() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('used_motorcycles')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('used_motorcycles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}


