import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { OrdersService } from '../orders/orders.service';
import { TableResponseDto } from './dto/table-response.dto';
import { CurrentOrderResponseDto } from './dto/current-order-response.dto';
import { AddItemsDto } from '../orders/dto/add-items.dto';
import { OrderResponseDto } from '../orders/dto/order-response.dto';

@ApiTags('Tables')
@Controller('tables')
export class TablesController {
  constructor(
    private readonly tablesService: TablesService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bàn' })
  @ApiQuery({ name: 'branchId', required: false, type: String, description: 'ID của chi nhánh' })
  @ApiResponse({ status: 200, description: 'Danh sách bàn', type: [TableResponseDto] })
  async findAll(@Query('branchId') branchId?: string): Promise<TableResponseDto[]> {
    const branchIdNum = branchId ? parseInt(branchId, 10) : undefined;
    return this.tablesService.findAll(branchIdNum);
  }

  @Get(':tableId/current-order')
  @ApiOperation({ summary: 'Lấy hoặc tạo order hiện tại của bàn' })
  @ApiParam({ name: 'tableId', type: String, description: 'ID của bàn' })
  @ApiResponse({ status: 200, description: 'Thông tin order hiện tại', type: CurrentOrderResponseDto })
  async getCurrentOrder(@Param('tableId') tableId: string): Promise<CurrentOrderResponseDto> {
    return this.tablesService.getCurrentOrder(parseInt(tableId, 10));
  }

  @Post(':tableId/current-order/items')
  @ApiOperation({ summary: 'Thêm món vào order của bàn' })
  @ApiParam({ name: 'tableId', type: String, description: 'ID của bàn' })
  @ApiResponse({ status: 200, description: 'Thêm món thành công', type: OrderResponseDto })
  async addItemsToTable(
    @Param('tableId') tableId: string,
    @Body() addItemsDto: AddItemsDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.addItemsToTable(parseInt(tableId, 10), addItemsDto);
  }
}
