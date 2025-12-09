import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({ description: 'ID của order item' })
  id: number;

  @ApiProperty({ description: 'ID của product' })
  productId: number;

  @ApiProperty({ description: 'Tên món (snapshot khi order)' })
  nameSnapshot: string;

  @ApiProperty({ description: 'Giá món (snapshot khi order, VNĐ)' })
  priceSnapshot: number;

  @ApiProperty({ description: 'Số lượng' })
  quantity: number;

  @ApiProperty({ description: 'Trạng thái', enum: ['SENT', 'IN_PROGRESS', 'DONE', 'CANCELLED'] })
  status: string;

  @ApiProperty({ description: 'Ghi chú', required: false })
  note?: string;

  @ApiProperty({ description: 'Thời gian tạo' })
  createdAt: Date;
}

