import { ApiProperty } from '@nestjs/swagger';
import { OrderItemResponseDto } from '../../orders/dto/order-item-response.dto';
import { OrderTotalsDto } from '../../orders/dto/order-response.dto';

export class OrderSummaryDto {
  @ApiProperty({ description: 'ID của order' })
  id: number;

  @ApiProperty({ description: 'ID của bàn' })
  tableId: number;

  @ApiProperty({ description: 'Trạng thái order', enum: ['OPEN', 'COMPLETED', 'PAID', 'CANCELLED'] })
  status: string;

  @ApiProperty({ description: 'Danh sách món', type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ description: 'Tổng tiền', type: OrderTotalsDto })
  totals: OrderTotalsDto;
}

