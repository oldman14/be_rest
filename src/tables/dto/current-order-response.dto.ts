import { ApiProperty } from '@nestjs/swagger';
import { OrderItemResponseDto } from '../../orders/dto/order-item-response.dto';

export class CurrentOrderResponseDto {
  @ApiProperty({ description: 'ID của order' })
  id: number;

  @ApiProperty({ description: 'ID của bàn' })
  tableId: number;

  @ApiProperty({ description: 'ID của chi nhánh' })
  branchId: number;

  @ApiProperty({ description: 'Trạng thái order', enum: ['OPEN', 'COMPLETED', 'PAID', 'CANCELLED'] })
  status: string;

  @ApiProperty({ description: 'Ghi chú', required: false })
  note?: string;

  @ApiProperty({ description: 'Thời gian tạo' })
  createdAt: Date;

  @ApiProperty({ description: 'Danh sách món', type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];
}

