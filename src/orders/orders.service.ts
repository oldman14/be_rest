import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { OrderStatus, OrderItemStatus, TableStatus } from '@prisma/client';
import { OrderResponseDto, OrderTotalsDto } from './dto/order-response.dto';
import { AddItemsDto } from './dto/add-items.dto';
import { TablesService } from '../tables/tables.service';
import { KitchenService } from '../kitchen/kitchen.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private tablesService: TablesService,
    private kitchenService: KitchenService,
  ) {}

  async findOne(orderId: number): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order với ID ${orderId} không tồn tại`);
    }

    const totals = this.calculateTotals(order.items);

    return {
      id: order.id,
      tableId: order.tableId,
      status: order.status,
      note: order.note,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        nameSnapshot: item.nameSnapshot,
        priceSnapshot: item.priceSnapshot,
        quantity: item.quantity,
        status: item.status,
        note: item.note,
        createdAt: item.createdAt,
      })),
      totals,
    };
  }

  async addItemsToTable(tableId: number, addItemsDto: AddItemsDto) {
    // Lấy hoặc tạo order OPEN cho bàn
    const currentOrder = await this.tablesService.getCurrentOrder(tableId);

    // Load thông tin products
    const productIds = addItemsDto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('Một hoặc nhiều món không tồn tại hoặc đã bị vô hiệu hóa');
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    // Tạo order items
    const orderItems = await Promise.all(
      addItemsDto.items.map((item) =>
        this.prisma.orderItem.create({
          data: {
            orderId: currentOrder.id,
            productId: item.productId,
            nameSnapshot: productMap.get(item.productId)!.name,
            priceSnapshot: productMap.get(item.productId)!.price,
            quantity: item.quantity,
            status: OrderItemStatus.SENT,
            note: item.note,
          },
        }),
      ),
    );

    // Sau khi thêm món, broadcast lại danh sách tickets cho bếp
    await this.kitchenService.broadcastTickets(currentOrder.branchId);

    // Lấy lại order với items mới
    return this.findOne(currentOrder.id);
  }

  async updateOrderItem(orderId: number, itemId: number, data: { quantity?: number; note?: string }) {
    // Kiểm tra order tồn tại và thuộc về orderId
    const orderItem = await this.prisma.orderItem.findFirst({
      where: {
        id: itemId,
        orderId: orderId,
      },
    });

    if (!orderItem) {
      throw new NotFoundException(`Order item với ID ${itemId} không tồn tại trong order ${orderId}`);
    }

    const updated = await this.prisma.orderItem.update({
      where: { id: itemId },
      data: {
        quantity: data.quantity ?? orderItem.quantity,
        note: data.note ?? orderItem.note,
      },
    });

    return updated;
  }

  calculateTotals(items: Array<{ priceSnapshot: number; quantity: number }>): OrderTotalsDto {
    const subtotal = items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);
    const vat = 0; // Có thể tính VAT nếu cần
    const total = subtotal + vat;

    return {
      subtotal,
      vat,
      total,
    };
  }
}

