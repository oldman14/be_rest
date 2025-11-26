import { OrderItemResponseDto } from '../../orders/dto/order-item-response.dto';
import { OrderTotalsDto } from '../../orders/dto/order-response.dto';

export class OrderSummaryDto {
  id: number;
  tableId: number;
  status: string;
  items: OrderItemResponseDto[];
  totals: OrderTotalsDto;
}

