import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SupabaseModule } from '../infra/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}


