import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../infra/supabase/supabase.service';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'buyer';
}

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findCurrentUser(userId: string): Promise<UserProfile | null> {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('users')
      .select('id,email,full_name,role')
      .eq('id', userId)
      .single();
    if (error) {
      return null;
    }
    return data as UserProfile;
  }
}

import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../infra/supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findMe(userId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async updateRole(userId: string, role: 'admin' | 'buyer') {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('users')
      .update({ role })
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}


