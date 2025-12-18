import { Injectable, NotFoundException, BadRequestException, Optional, Inject } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { OrderItemStatus, OrderStatus } from '@prisma/client';
import { KitchenTicketDto, KitchenDisplayDto } from './dto/kitchen-ticket.dto';
import { KitchenGateway } from './kitchen.gateway';

@Injectable()
export class KitchenService {
  constructor(
    private prisma: PrismaService,
    @Optional() @Inject(KitchenGateway) private kitchenGateway?: KitchenGateway,
  ) {}

  /**
   * Broadcast toàn bộ danh sách tickets qua socket
   * (dùng cho các case thêm món từ phía bàn để màn hình bếp tự cập nhật)
   */
  async broadcastTickets(branchId?: number) {
    if (!this.kitchenGateway) {
      return;
    }

    const tickets = await this.getTickets(branchId);
    this.kitchenGateway.server.emit('kitchen:tickets', tickets);
  }

  /**
   * Lấy danh sách tickets chia theo status (SENT và IN_PROGRESS)
   */
  async getTickets(branchId?: number): Promise<KitchenDisplayDto> {
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

    const tickets: KitchenTicketDto[] = orders.map((order) => ({
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

    // Chia tickets theo status của items
    const newTickets: KitchenTicketDto[] = [];
    const inProgressTickets: KitchenTicketDto[] = [];

    tickets.forEach((ticket) => {
      const hasSent = ticket.items.some((item) => item.status === OrderItemStatus.SENT);
      const hasInProgress = ticket.items.some(
        (item) => item.status === OrderItemStatus.IN_PROGRESS,
      );

      // Nếu có item SENT, thêm vào cột "Mới"
      if (hasSent) {
        newTickets.push({
          ...ticket,
          items: ticket.items.filter((item) => item.status === OrderItemStatus.SENT),
        });
      }

      // Nếu có item IN_PROGRESS, thêm vào cột "Đang làm"
      if (hasInProgress) {
        inProgressTickets.push({
          ...ticket,
          items: ticket.items.filter(
            (item) => item.status === OrderItemStatus.IN_PROGRESS,
          ),
        });
      }
    });

    return {
      new: newTickets,
      inProgress: inProgressTickets,
    };
  }

  /**
   * Lấy danh sách tickets dạng flat (giữ nguyên để tương thích)
   */
  async getTicketsFlat(branchId?: number): Promise<KitchenTicketDto[]> {
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

  /**
   * Bắt đầu làm món: SENT → IN_PROGRESS
   */
  async startItem(itemId: number) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id: itemId },
      include: {
        order: {
          include: {
            table: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Order item với ID ${itemId} không tồn tại`);
    }

    if (item.status !== OrderItemStatus.SENT) {
      throw new BadRequestException(
        `Chỉ có thể bắt đầu làm món có trạng thái SENT. Món hiện tại: ${item.status}`,
      );
    }

    const updatedItem = await this.prisma.orderItem.update({
      where: { id: itemId },
      data: { status: OrderItemStatus.IN_PROGRESS },
    });

    // Emit realtime event
    if (this.kitchenGateway) {
      this.kitchenGateway.emitItemStatusChanged({
        itemId: updatedItem.id,
        orderId: item.order.id,
        tableName: item.order.table.name,
        status: OrderItemStatus.IN_PROGRESS,
      });
    }

    return {
      ...updatedItem,
      order: {
        id: item.order.id,
        tableName: item.order.table.name,
      },
    };
  }

  /**
   * Hoàn thành món: IN_PROGRESS → DONE
   */
  async completeItem(itemId: number) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id: itemId },
      include: {
        order: {
          include: {
            table: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Order item với ID ${itemId} không tồn tại`);
    }

    if (item.status !== OrderItemStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `Chỉ có thể hoàn thành món có trạng thái IN_PROGRESS. Món hiện tại: ${item.status}`,
      );
    }

    // Update item status
    const updatedItem = await this.prisma.orderItem.update({
      where: { id: itemId },
      data: { status: OrderItemStatus.DONE },
    });

    // Kiểm tra xem tất cả items của order đã DONE chưa
    const allItems = await this.prisma.orderItem.findMany({
      where: {
        orderId: item.orderId,
        status: { not: OrderItemStatus.CANCELLED },
      },
    });

    const allDone = allItems.every((i) => i.status === OrderItemStatus.DONE);
    let orderCompleted = false;

    // Nếu tất cả đã DONE và order đang OPEN, set order = COMPLETED
    if (allDone && item.order.status === OrderStatus.OPEN) {
      await this.prisma.order.update({
        where: { id: item.orderId },
        data: { status: OrderStatus.COMPLETED },
      });
      orderCompleted = true;

      // Emit event khi order completed
      if (this.kitchenGateway) {
        this.kitchenGateway.emitOrderCompleted({
          orderId: item.order.id,
          tableName: item.order.table.name,
        });
      }
    }

    // Emit realtime event
    if (this.kitchenGateway) {
      this.kitchenGateway.emitItemStatusChanged({
        itemId: updatedItem.id,
        orderId: item.order.id,
        tableName: item.order.table.name,
        status: OrderItemStatus.DONE,
        allItemsDone: allDone,
        orderCompleted,
      });
    }

    return {
      ...updatedItem,
      order: {
        id: item.order.id,
        tableName: item.order.table.name,
        status: orderCompleted ? OrderStatus.COMPLETED : item.order.status,
      },
      allItemsDone: allDone,
      orderCompleted,
    };
  }

  /**
   * Update status của một item (generic method)
   */
  async updateItemStatus(itemId: number, status: OrderItemStatus) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id: itemId },
      include: {
        order: {
          include: {
            table: true,
          },
        },
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
    let orderCompleted = false;

    // Nếu tất cả đã DONE và order đang OPEN, set order = COMPLETED
    if (allDone && item.order.status === OrderStatus.OPEN) {
      await this.prisma.order.update({
        where: { id: item.orderId },
        data: { status: OrderStatus.COMPLETED },
      });
      orderCompleted = true;

      // Emit event khi order completed
      if (this.kitchenGateway) {
        this.kitchenGateway.emitOrderCompleted({
          orderId: item.order.id,
          tableName: item.order.table.name,
        });
      }
    }

    // Emit realtime event
    if (this.kitchenGateway) {
      this.kitchenGateway.emitItemStatusChanged({
        itemId: updatedItem.id,
        orderId: item.order.id,
        tableName: item.order.table.name,
        status: updatedItem.status,
        allItemsDone: allDone,
        orderCompleted,
      });
    }

    return {
      ...updatedItem,
      order: {
        id: item.order.id,
        tableName: item.order.table.name,
        status: orderCompleted ? OrderStatus.COMPLETED : item.order.status,
      },
      allItemsDone: allDone,
      orderCompleted,
    };
  }

  /**
   * Bắt đầu làm tất cả món trong một ticket (order)
   */
  async startTicket(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        table: true,
        items: {
          where: {
            status: OrderItemStatus.SENT,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order với ID ${orderId} không tồn tại`);
    }

    if (order.items.length === 0) {
      throw new BadRequestException(`Order ${orderId} không có món nào ở trạng thái SENT`);
    }

    // Update tất cả items SENT → IN_PROGRESS
    await this.prisma.orderItem.updateMany({
      where: {
        orderId: orderId,
        status: OrderItemStatus.SENT,
      },
      data: {
        status: OrderItemStatus.IN_PROGRESS,
      },
    });

    // Emit realtime event
    if (this.kitchenGateway) {
      this.kitchenGateway.emitTicketStatusChanged({
        orderId: order.id,
        tableName: order.table.name,
        updatedItemsCount: order.items.length,
      });
    }

    return {
      orderId: order.id,
      tableName: order.table.name,
      updatedItemsCount: order.items.length,
    };
  }

  /**
   * Hoàn thành tất cả món trong một ticket (order)
   */
  async completeTicket(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        table: true,
        items: {
          where: {
            status: OrderItemStatus.IN_PROGRESS,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order với ID ${orderId} không tồn tại`);
    }

    if (order.items.length === 0) {
      throw new BadRequestException(
        `Order ${orderId} không có món nào ở trạng thái IN_PROGRESS`,
      );
    }

    // Update tất cả items IN_PROGRESS → DONE
    await this.prisma.orderItem.updateMany({
      where: {
        orderId: orderId,
        status: OrderItemStatus.IN_PROGRESS,
      },
      data: {
        status: OrderItemStatus.DONE,
      },
    });

    // Kiểm tra xem tất cả items của order đã DONE chưa
    const allItems = await this.prisma.orderItem.findMany({
      where: {
        orderId: orderId,
        status: { not: OrderItemStatus.CANCELLED },
      },
    });

    const allDone = allItems.every((i) => i.status === OrderItemStatus.DONE);
    let orderCompleted = false;

    // Nếu tất cả đã DONE và order đang OPEN, set order = COMPLETED
    if (allDone && order.status === OrderStatus.OPEN) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.COMPLETED },
      });
      orderCompleted = true;

      // Emit event khi order completed
      if (this.kitchenGateway) {
        this.kitchenGateway.emitOrderCompleted({
          orderId: order.id,
          tableName: order.table.name,
        });
      }
    }

    // Emit realtime event
    if (this.kitchenGateway) {
      this.kitchenGateway.emitTicketStatusChanged({
        orderId: order.id,
        tableName: order.table.name,
        updatedItemsCount: order.items.length,
        allItemsDone: allDone,
        orderCompleted,
        orderStatus: orderCompleted ? OrderStatus.COMPLETED : order.status,
      });
    }

    return {
      orderId: order.id,
      tableName: order.table.name,
      updatedItemsCount: order.items.length,
      allItemsDone: allDone,
      orderCompleted,
      orderStatus: orderCompleted ? OrderStatus.COMPLETED : order.status,
    };
  }
}

