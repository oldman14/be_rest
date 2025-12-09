import { ApiProperty } from '@nestjs/swagger';

export class TableResponseDto {
  @ApiProperty({ description: 'ID của bàn' })
  id: number;

  @ApiProperty({ description: 'Tên bàn' })
  name: string;

  @ApiProperty({ description: 'Số chỗ ngồi' })
  seats: number;

  @ApiProperty({ description: 'Trạng thái bàn', enum: ['EMPTY', 'SERVING', 'WAITING_PAYMENT'] })
  status: string;

  @ApiProperty({ description: 'ID của chi nhánh' })
  branchId: number;

  @ApiProperty({ description: 'Thời gian tạo' })
  createdAt: Date;
}

