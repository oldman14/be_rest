import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderTotalsDto {
  subtotal: number;
  vat: number;
  total: number;
}

export class OrderResponseDto {
  id: number;
  tableId: number;
  status: string;
  note?: string;
  createdAt: Date;
  items: OrderItemResponseDto[];
  totals: OrderTotalsDto;
}

