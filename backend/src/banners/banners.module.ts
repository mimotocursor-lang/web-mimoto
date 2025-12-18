import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { SupabaseModule } from '../infra/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}

import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';

@Module({
  controllers: [BannersController],
  providers: [BannersService],
  exports: [BannersService],
})
export class BannersModule {}


