import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderItemStatus } from '@prisma/client';

export class UpdateItemStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderItemStatus)
  status: OrderItemStatus;
}

