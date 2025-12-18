import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../infra/supabase/supabase.service';

@Injectable()
export class DashboardService {
  constructor(private readonly supabase: SupabaseService) {}

  async getKpis() {
    const client = this.supabase.getClient();

    const [ordersAgg, productsAgg, usedAgg, lowStock] = await Promise.all([
      client
        .from('orders')
        .select('total_amount,status', { count: 'exact' }),
      client
        .from('products')
        .select('status,stock'),
      client
        .from('used_motorcycles')
        .select('status'),
      client
        .from('products')
        .select('*')
        .lte('stock', 5)
        .eq('status', 'active'),
    ]);

    const orders = ordersAgg.data ?? [];
    const products = productsAgg.data ?? [];
    const used = usedAgg.data ?? [];

    const totalSales = orders
      .filter((o: any) => o.status === 'paid')
      .reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);

    const productsActive = products.filter((p: any) => p.status === 'active').length;
    const productsInactive = products.filter((p: any) => p.status === 'inactive').length;

    const usedActive = used.filter((m: any) => m.status === 'active').length;
    const usedInactive = used.filter((m: any) => m.status === 'inactive').length;

    return {
      totalSales,
      totalOrders: orders.length,
      productsActive,
      productsInactive,
      usedActive,
      usedInactive,
      lowStock: lowStock.data ?? [],
    };
  }
}

import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../infra/supabase/supabase.service';

@Injectable()
export class DashboardService {
  constructor(private readonly supabase: SupabaseService) {}

  async getKpis() {
    const client = this.supabase.getClient();

    const [{ data: salesData }, { data: productsData }, { data: usedData }, { data: ordersData }, { data: lowStockData }] =
      await Promise.all([
        client
          .from('orders')
          .select('total_amount')
          .eq('status', 'paid'),
        client
          .from('products')
          .select('status'),
        client
          .from('used_motorcycles')
          .select('status'),
        client
          .from('orders')
          .select('id'),
        client
          .from('products')
          .select('*')
          .lte('stock', 5)
          .eq('status', 'active'),
      ]);

    const totalSales = (salesData ?? []).reduce(
      (acc, row: any) => acc + Number(row.total_amount ?? 0),
      0,
    );

    const activeProducts = (productsData ?? []).filter((p: any) => p.status === 'active').length;
    const inactiveProducts = (productsData ?? []).filter((p: any) => p.status === 'inactive').length;

    const activeUsed = (usedData ?? []).filter((m: any) => m.status === 'active').length;
    const inactiveUsed = (usedData ?? []).filter((m: any) => m.status === 'inactive').length;

    const totalOrders = (ordersData ?? []).length;

    return {
      totalSales,
      products: {
        active: activeProducts,
        inactive: inactiveProducts,
      },
      usedMotorcycles: {
        active: activeUsed,
        inactive: inactiveUsed,
      },
      totalOrders,
      lowStock: lowStockData ?? [],
    };
  }
}


