import { ApiProperty } from '@nestjs/swagger';

export class KitchenItemDto {
  @ApiProperty({ description: 'ID của order item' })
  id: number;

  @ApiProperty({ description: 'Tên món' })
  name: string;

  @ApiProperty({ description: 'Số lượng' })
  quantity: number;

  @ApiProperty({ description: 'Trạng thái (SENT, IN_PROGRESS, DONE)', enum: ['SENT', 'IN_PROGRESS', 'DONE', 'CANCELLED'] })
  status: string;

  @ApiProperty({ description: 'Ghi chú', required: false })
  note?: string;
}

export class KitchenTicketDto {
  @ApiProperty({ description: 'ID của order' })
  orderId: number;

  @ApiProperty({ description: 'Tên bàn (ví dụ: Bàn 5)' })
  tableName: string;

  @ApiProperty({ description: 'Thời gian tạo order' })
  createdAt: Date;

  @ApiProperty({ description: 'Danh sách món', type: [KitchenItemDto] })
  items: KitchenItemDto[];
}

// DTO để trả về danh sách tickets chia theo status
export class KitchenDisplayDto {
  @ApiProperty({ description: 'Danh sách tickets mới (SENT)', type: [KitchenTicketDto] })
  new: KitchenTicketDto[]; // SENT

  @ApiProperty({ description: 'Danh sách tickets đang làm (IN_PROGRESS)', type: [KitchenTicketDto] })
  inProgress: KitchenTicketDto[]; // IN_PROGRESS
}

