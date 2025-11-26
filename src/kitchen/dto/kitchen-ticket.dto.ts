export class KitchenItemDto {
  id: number;
  name: string;
  quantity: number;
  status: string;
  note?: string;
}

export class KitchenTicketDto {
  orderId: number;
  tableName: string;
  createdAt: Date;
  items: KitchenItemDto[];
}

