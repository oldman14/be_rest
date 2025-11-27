import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { OrderStatus, TableStatus, OrderItemStatus } from '@prisma/client';
import { PayOrderDto } from './dto/pay-order.dto';
import { OrderSummaryDto } from './dto/order-summary.dto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {}

  async getOrderSummary(orderId: number): Promise<OrderSummaryDto> {
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

    const totals = this.ordersService.calculateTotals(order.items);

    return {
      id: order.id,
      tableId: order.tableId,
      status: order.status,
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

  async payOrder(orderId: number, payOrderDto: PayOrderDto) {
    // Load order + items
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        table: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order với ID ${orderId} không tồn tại`);
    }

    // Validate: Order chưa PAID
    if (order.status === OrderStatus.PAID) {
      throw new BadRequestException('Order đã được thanh toán');
    }

    // Validate: Không còn item ở trạng thái SENT hoặc IN_PROGRESS (phải DONE hoặc CANCELLED)
    const pendingItems = order.items.filter(
      (item) => item.status === OrderItemStatus.SENT || item.status === OrderItemStatus.IN_PROGRESS,
    );

    if (pendingItems.length > 0) {
      throw new BadRequestException(
        `Còn ${pendingItems.length} món chưa hoàn thành. Vui lòng đợi bếp hoàn thành tất cả món.`,
      );
    }

    // Tính tổng tiền phải thu
    const totals = this.ordersService.calculateTotals(order.items);
    const totalAmount = totals.total;

    // Validate: Tổng amount payments = tổng tiền phải thu
    const paymentsTotal = payOrderDto.payments.reduce((sum, p) => sum + p.amount, 0);

    if (paymentsTotal !== totalAmount) {
      throw new BadRequestException(
        `Tổng tiền thanh toán (${paymentsTotal}) không khớp với tổng tiền order (${totalAmount})`,
      );
    }

    // Transaction: Tạo Payment, Receipt, update Order và Table
    return await this.prisma.$transaction(async (tx) => {
      // Tạo Payments
      const payments = await Promise.all(
        payOrderDto.payments.map((payment) =>
          tx.payment.create({
            data: {
              orderId: orderId,
              method: payment.method,
              amount: payment.amount,
            },
          }),
        ),
      );

      // Tạo Receipt
      const receipt = await tx.receipt.create({
        data: {
          orderId: orderId,
          total: totalAmount,
          vatAmount: totals.vat,
          companyName: payOrderDto.vatInfo?.companyName,
          taxCode: payOrderDto.vatInfo?.taxCode,
          email: payOrderDto.vatInfo?.email,
        },
      });

      // Update Order
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PAID,
          closedAt: new Date(),
        },
      });

      // Update Table status = EMPTY
      await tx.table.update({
        where: { id: order.tableId },
        data: { status: TableStatus.EMPTY },
      });

      return {
        success: true,
        orderId: updatedOrder.id,
        receiptId: receipt.id,
        payments: payments.map((p) => ({
          id: p.id,
          method: p.method,
          amount: p.amount,
        })),
        total: totalAmount,
      };
    });
  }
}

