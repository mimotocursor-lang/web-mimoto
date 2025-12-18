import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly client: SupabaseClient,
  ) {}

  getClient(): SupabaseClient {
    return this.client;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly client: SupabaseClient,
  ) {}

  getClient(): SupabaseClient {
    return this.client;
  }
}


