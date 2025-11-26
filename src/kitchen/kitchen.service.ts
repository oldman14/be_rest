import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { OrderItemStatus, OrderStatus } from '@prisma/client';
import { KitchenTicketDto } from './dto/kitchen-ticket.dto';

@Injectable()
export class KitchenService {
  constructor(private prisma: PrismaService) {}

  async getTickets(branchId?: number): Promise<KitchenTicketDto[]> {
    const where: any = {
      items: {
        some: {
          status: {
            in: [OrderItemStatus.SENT, OrderItemStatus.IN_PROGRESS],
          },
        },
      },
    };

    if (branchId) {
      where.branchId = branchId;
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        table: {
          select: {
            name: true,
          },
        },
        items: {
          where: {
            status: {
              in: [OrderItemStatus.SENT, OrderItemStatus.IN_PROGRESS],
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return orders.map((order) => ({
      orderId: order.id,
      tableName: order.table.name,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.nameSnapshot,
        quantity: item.quantity,
        status: item.status,
        note: item.note,
      })),
    }));
  }

  async updateItemStatus(itemId: number, status: OrderItemStatus) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id: itemId },
      include: {
        order: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Order item với ID ${itemId} không tồn tại`);
    }

    // Update item status
    const updatedItem = await this.prisma.orderItem.update({
      where: { id: itemId },
      data: { status },
    });

    // Kiểm tra xem tất cả items của order đã DONE chưa
    const allItems = await this.prisma.orderItem.findMany({
      where: {
        orderId: item.orderId,
        status: { not: OrderItemStatus.CANCELLED },
      },
    });

    const allDone = allItems.every((i) => i.status === OrderItemStatus.DONE);

    // Nếu tất cả đã DONE và order đang OPEN, set order = COMPLETED
    if (allDone && item.order.status === OrderStatus.OPEN) {
      await this.prisma.order.update({
        where: { id: item.orderId },
        data: { status: OrderStatus.COMPLETED },
      });
    }

    return updatedItem;
  }
}

