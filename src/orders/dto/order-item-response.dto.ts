export class OrderItemResponseDto {
  id: number;
  productId: number;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  status: string;
  note?: string;
  createdAt: Date;
}

