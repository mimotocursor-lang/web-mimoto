import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../infra/supabase/supabase.service';

export interface OrderItemInput {
  productId: number;
  quantity: number;
  priceSnapshot: number;
}

@Injectable()
export class OrdersService {
  constructor(private readonly supabase: SupabaseService) {}

  async createOrderFromCart(userId: string, items: OrderItemInput[]) {
    const client = this.supabase.getClient();

    const totalAmount = items.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0,
    );

    const { data: order, error: orderError } = await client
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending_payment',
      })
      .select('id,total_amount,status,created_at')
      .single();

    if (orderError) {
      throw orderError;
    }

    const orderItemsPayload = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.priceSnapshot,
      total_price: item.priceSnapshot * item.quantity,
    }));

    const { error: itemsError } = await client
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsError) {
      throw itemsError;
    }

    return order;
  }

  async findAllByUser(userId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async findByIdForUser(orderId: number, userId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data;
  }
}

import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../infra/supabase/supabase.service';

export interface OrderItemInput {
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderInput {
  user_id: string;
  items: OrderItemInput[];
  notes?: string;
}

@Injectable()
export class OrdersService {
  constructor(private readonly supabase: SupabaseService) {}

  async createOrder(input: CreateOrderInput) {
    const client = this.supabase.getClient();

    const totalAmount = input.items.reduce(
      (acc, item) => acc + item.unit_price * item.quantity,
      0,
    );

    const { data: order, error: orderError } = await client
      .from('orders')
      .insert({
        user_id: input.user_id,
        total_amount: totalAmount,
        status: 'pending',
        notes: input.notes ?? null,
      })
      .select('*')
      .single();

    if (orderError || !order) {
      throw orderError;
    }

    const orderItemsPayload = input.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    }));

    const { error: itemsError } = await client
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsError) {
      throw itemsError;
    }

    return order;
  }

  async findForUser(userId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}


