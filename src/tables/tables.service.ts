import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TableStatus, OrderStatus } from '@prisma/client';
import { CurrentOrderResponseDto } from './dto/current-order-response.dto';
import { TableResponseDto } from './dto/table-response.dto';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId?: number): Promise<TableResponseDto[]> {
    const where = branchId ? { branchId } : {};
    const tables = await this.prisma.table.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    return tables;
  }

  async getCurrentOrder(tableId: number): Promise<CurrentOrderResponseDto> {
    // Kiểm tra bàn có tồn tại không
    const table = await this.prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      throw new NotFoundException(`Bàn với ID ${tableId} không tồn tại`);
    }

    // Tìm order đang OPEN
    let order = await this.prisma.order.findFirst({
      where: {
        tableId,
        status: OrderStatus.OPEN,
      },
      include: {
        items: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    // Nếu chưa có order OPEN, tạo mới
    if (!order) {
      order = await this.prisma.order.create({
        data: {
          tableId,
          branchId: table.branchId,
          status: OrderStatus.OPEN,
        },
        include: {
          items: true,
        },
      });

      // Set table status = SERVING
      await this.prisma.table.update({
        where: { id: tableId },
        data: { status: TableStatus.SERVING },
      });
    }

    return {
      id: order.id,
      tableId: order.tableId,
      branchId: order.branchId,
      status: order.status,
      note: order.note,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        nameSnapshot: item.nameSnapshot,
        priceSnapshot: item.priceSnapshot,
        quantity: item.quantity,
        status: item.status,
        note: item.note,
        createdAt: item.createdAt,
      })),
    };
  }
}

