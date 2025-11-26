import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { TablesService } from './tables.service';
import { OrdersService } from '../orders/orders.service';
import { TableResponseDto } from './dto/table-response.dto';
import { CurrentOrderResponseDto } from './dto/current-order-response.dto';
import { AddItemsDto } from '../orders/dto/add-items.dto';
import { OrderResponseDto } from '../orders/dto/order-response.dto';

@Controller('tables')
export class TablesController {
  constructor(
    private readonly tablesService: TablesService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get()
  async findAll(@Query('branchId') branchId?: string): Promise<TableResponseDto[]> {
    const branchIdNum = branchId ? parseInt(branchId, 10) : undefined;
    return this.tablesService.findAll(branchIdNum);
  }

  @Get(':tableId/current-order')
  async getCurrentOrder(@Param('tableId') tableId: string): Promise<CurrentOrderResponseDto> {
    return this.tablesService.getCurrentOrder(parseInt(tableId, 10));
  }

  @Post(':tableId/current-order/items')
  async addItemsToTable(
    @Param('tableId') tableId: string,
    @Body() addItemsDto: AddItemsDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.addItemsToTable(parseInt(tableId, 10), addItemsDto);
  }
}
