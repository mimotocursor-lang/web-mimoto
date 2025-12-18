import { Module } from '@nestjs/common';
import { UsedMotorcyclesService } from './used-motorcycles.service';
import { UsedMotorcyclesController } from './used-motorcycles.controller';
import { SupabaseModule } from '../infra/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [UsedMotorcyclesController],
  providers: [UsedMotorcyclesService],
})
export class UsedMotorcyclesModule {}

import { Module } from '@nestjs/common';
import { UsedMotorcyclesService } from './used-motorcycles.service';
import { UsedMotorcyclesController } from './used-motorcycles.controller';

@Module({
  controllers: [UsedMotorcyclesController],
  providers: [UsedMotorcyclesService],
})
export class UsedMotorcyclesModule {}


