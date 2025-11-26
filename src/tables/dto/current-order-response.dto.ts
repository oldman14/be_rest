import { OrderItemResponseDto } from '../../orders/dto/order-item-response.dto';

export class CurrentOrderResponseDto {
  id: number;
  tableId: number;
  branchId: number;
  status: string;
  note?: string;
  createdAt: Date;
  items: OrderItemResponseDto[];
}

