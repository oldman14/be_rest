export class OrderItemResponseDto {
  id: number;
  menuItemId: number;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  status: string;
  note?: string;
  createdAt: Date;
}

