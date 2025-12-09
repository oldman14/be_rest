import { ApiProperty } from '@nestjs/swagger';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderTotalsDto {
  @ApiProperty({ description: 'Tổng tiền chưa VAT (VNĐ)' })
  subtotal: number;

  @ApiProperty({ description: 'Tiền VAT (VNĐ)' })
  vat: number;

  @ApiProperty({ description: 'Tổng tiền sau VAT (VNĐ)' })
  total: number;
}

export class OrderResponseDto {
  @ApiProperty({ description: 'ID của order' })
  id: number;

  @ApiProperty({ description: 'ID của bàn' })
  tableId: number;

  @ApiProperty({ description: 'Trạng thái order', enum: ['OPEN', 'COMPLETED', 'PAID', 'CANCELLED'] })
  status: string;

  @ApiProperty({ description: 'Ghi chú', required: false })
  note?: string;

  @ApiProperty({ description: 'Thời gian tạo' })
  createdAt: Date;

  @ApiProperty({ description: 'Danh sách món', type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ description: 'Tổng tiền', type: OrderTotalsDto })
  totals: OrderTotalsDto;
}

