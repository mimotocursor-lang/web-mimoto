import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Global()
@Module({
  providers: [
    SupabaseService,
    {
      provide: 'SUPABASE_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService): SupabaseClient => {
        const url = config.get<string>('SUPABASE_URL');
        const serviceKey = config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
        if (!url || !serviceKey) {
          throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured');
        }
        return createClient(url, serviceKey);
      },
    },
  ],
  exports: ['SUPABASE_CLIENT', SupabaseService],
})
export class SupabaseModule {}

import { Global, Module } from '@nestjs/common';
import { SupabaseClientProvider } from './supabase.provider';

@Global()
@Module({
  providers: [SupabaseClientProvider],
  exports: [SupabaseClientProvider],
})
export class SupabaseModule {}

import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Global()
@Module({
  providers: [
    SupabaseService,
    {
      provide: 'SUPABASE_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService): SupabaseClient => {
        const url = configService.get<string>('SUPABASE_URL');
        const serviceRoleKey = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

        if (!url || !serviceRoleKey) {
          throw new Error('Supabase URL or service role key not configured');
        }

        return createClient(url, serviceRoleKey);
      },
    },
  ],
  exports: ['SUPABASE_CLIENT', SupabaseService],
})
export class SupabaseModule {}


