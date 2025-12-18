import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../infra/supabase/supabase.service';

@Injectable()
export class ProductsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAllActive() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
}

import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../infra/supabase/supabase.service';

export interface CreateProductDto {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  status?: 'active' | 'inactive';
  is_accessory?: boolean;
  is_spare_part?: boolean;
  category_id?: number;
  main_image_url?: string;
}

@Injectable()
export class ProductsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAllActive() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;
    return data;
  }

  async findOneBySlug(slug: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  async create(dto: CreateProductDto) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('products')
      .insert(dto)
      .single();

    if (error) throw error;
    return data;
  }
}


