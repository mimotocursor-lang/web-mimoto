import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './infra/supabase/supabase.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UsedMotorcyclesModule } from './used-motorcycles/used-motorcycles.module';
import { OrdersModule } from './orders/orders.module';
import { BannersModule } from './banners/banners.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    UsedMotorcyclesModule,
    OrdersModule,
    BannersModule,
    DashboardModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './infra/supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { UsedMotorcyclesModule } from './used-motorcycles/used-motorcycles.module';
import { OrdersModule } from './orders/orders.module';
import { BannersModule } from './banners/banners.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    UsedMotorcyclesModule,
    OrdersModule,
    BannersModule,
    DashboardModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './infra/supabase/supabase.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UsedMotorcyclesModule } from './used-motorcycles/used-motorcycles.module';
import { OrdersModule } from './orders/orders.module';
import { BannersModule } from './banners/banners.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    UsedMotorcyclesModule,
    OrdersModule,
    BannersModule,
    DashboardModule,
  ],
})
export class AppModule {}


