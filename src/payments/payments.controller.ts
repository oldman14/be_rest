import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrderSummaryDto } from './dto/order-summary.dto';
import { PayOrderDto } from './dto/pay-order.dto';

@Controller('orders')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':orderId/summary')
  async getOrderSummary(@Param('orderId') orderId: string): Promise<OrderSummaryDto> {
    return this.paymentsService.getOrderSummary(parseInt(orderId, 10));
  }

  @Post(':orderId/pay')
  async payOrder(@Param('orderId') orderId: string, @Body() payOrderDto: PayOrderDto) {
    return this.paymentsService.payOrder(parseInt(orderId, 10), payOrderDto);
  }
}

