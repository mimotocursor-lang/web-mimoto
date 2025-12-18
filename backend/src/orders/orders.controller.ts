import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService, OrderItemInput } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

interface CreateOrderFromCartDto {
  items: OrderItemInput[];
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myOrders(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      return [];
    }
    return this.ordersService.findAllByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('from-cart')
  async createFromCart(@Req() req: any, @Body() body: CreateOrderFromCartDto) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('Missing user id');
    }
    return this.ordersService.createOrderFromCart(userId, body.items);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('Missing user id');
    }
    const orderId = Number(id);
    return this.ordersService.findByIdForUser(orderId, userId);
  }
}


import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService, CreateOrderInput } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: Omit<CreateOrderInput, 'user_id'>,
  ) {
    return this.ordersService.createOrder({
      ...body,
      user_id: user.id,
    });
  }

  @Get('me')
  async myOrders(@CurrentUser() user: CurrentUserPayload) {
    return this.ordersService.findForUser(user.id);
  }
}


