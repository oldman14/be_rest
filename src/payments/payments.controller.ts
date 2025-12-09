import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { OrderSummaryDto } from './dto/order-summary.dto';
import { PayOrderDto } from './dto/pay-order.dto';

@ApiTags('Payments')
@Controller('orders')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':orderId/summary')
  @ApiOperation({ summary: 'Lấy thông tin tổng tiền trước khi thanh toán' })
  @ApiParam({ name: 'orderId', type: String, description: 'ID của order' })
  @ApiResponse({ status: 200, description: 'Thông tin tổng tiền', type: OrderSummaryDto })
  async getOrderSummary(@Param('orderId') orderId: string): Promise<OrderSummaryDto> {
    return this.paymentsService.getOrderSummary(parseInt(orderId, 10));
  }

  @Post(':orderId/pay')
  @ApiOperation({ summary: 'Thanh toán order' })
  @ApiParam({ name: 'orderId', type: String, description: 'ID của order' })
  @ApiResponse({ status: 200, description: 'Thanh toán thành công' })
  async payOrder(@Param('orderId') orderId: string, @Body() payOrderDto: PayOrderDto) {
    return this.paymentsService.payOrder(parseInt(orderId, 10), payOrderDto);
  }
}

