import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/kitchen',
})
export class KitchenGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('KitchenGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Emit event khi item status thay đổi
   */
  emitItemStatusChanged(data: {
    itemId: number;
    orderId: number;
    tableName: string;
    status: string;
    allItemsDone?: boolean;
    orderCompleted?: boolean;
  }) {
    this.server.emit('item:status-changed', data);
    this.logger.log(`Emitted item:status-changed for item ${data.itemId}`);
  }

  /**
   * Emit event khi ticket (order) status thay đổi
   */
  emitTicketStatusChanged(data: {
    orderId: number;
    tableName: string;
    updatedItemsCount: number;
    allItemsDone?: boolean;
    orderCompleted?: boolean;
    orderStatus?: string;
  }) {
    this.server.emit('ticket:status-changed', data);
    this.logger.log(`Emitted ticket:status-changed for order ${data.orderId}`);
  }

  /**
   * Emit event khi order completed (tất cả món đã xong)
   */
  emitOrderCompleted(data: {
    orderId: number;
    tableName: string;
  }) {
    this.server.emit('order:completed', data);
    this.logger.log(`Emitted order:completed for order ${data.orderId} (Table: ${data.tableName})`);
  }
}

