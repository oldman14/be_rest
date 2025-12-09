import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItemStatus } from '@prisma/client';

export class UpdateItemStatusDto {
  @ApiProperty({ 
    description: 'Trạng thái mới của order item',
    enum: OrderItemStatus,
    example: OrderItemStatus.IN_PROGRESS
  })
  @IsNotEmpty()
  @IsEnum(OrderItemStatus)
  status: OrderItemStatus;
}

