import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderResponseDto } from './dto/order-response.dto';
import { AddItemsDto } from './dto/add-items.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':orderId')
  async findOne(@Param('orderId') orderId: string): Promise<OrderResponseDto> {
    return this.ordersService.findOne(parseInt(orderId, 10));
  }

  @Patch(':orderId/items/:itemId')
  async updateOrderItem(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body() data: { quantity?: number; note?: string },
  ) {
    return this.ordersService.updateOrderItem(parseInt(orderId, 10), parseInt(itemId, 10), data);
  }
}

