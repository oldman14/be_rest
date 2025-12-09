import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { OrderResponseDto } from './dto/order-response.dto';
import { AddItemsDto } from './dto/add-items.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':orderId')
  @ApiOperation({ summary: 'Lấy thông tin order chi tiết' })
  @ApiParam({ name: 'orderId', type: String, description: 'ID của order' })
  @ApiResponse({ status: 200, description: 'Thông tin order', type: OrderResponseDto })
  async findOne(@Param('orderId') orderId: string): Promise<OrderResponseDto> {
    return this.ordersService.findOne(parseInt(orderId, 10));
  }

  @Patch(':orderId/items/:itemId')
  @ApiOperation({ summary: 'Cập nhật order item (quantity, note)' })
  @ApiParam({ name: 'orderId', type: String, description: 'ID của order' })
  @ApiParam({ name: 'itemId', type: String, description: 'ID của order item' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  async updateOrderItem(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body() data: { quantity?: number; note?: string },
  ) {
    return this.ordersService.updateOrderItem(parseInt(orderId, 10), parseInt(itemId, 10), data);
  }
}

