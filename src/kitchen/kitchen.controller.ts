import { Controller, Get, Patch, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { KitchenService } from './kitchen.service';
import { KitchenTicketDto, KitchenDisplayDto } from './dto/kitchen-ticket.dto';
import { UpdateItemStatusDto } from './dto/update-item-status.dto';

@ApiTags('Kitchen')
@Controller('kitchen')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get('tickets')
  @ApiOperation({ summary: 'Lấy danh sách tickets chia theo cột (Mới và Đang làm)' })
  @ApiQuery({ name: 'branchId', required: false, type: String, description: 'ID của chi nhánh' })
  @ApiResponse({ status: 200, description: 'Danh sách tickets', type: KitchenDisplayDto })
  async getTickets(@Query('branchId') branchId?: string): Promise<KitchenDisplayDto> {
    const branchIdNum = branchId ? parseInt(branchId, 10) : undefined;
    return this.kitchenService.getTickets(branchIdNum);
  }

  @Get('tickets/flat')
  @ApiOperation({ summary: 'Lấy danh sách tickets dạng flat (tương thích với API cũ)' })
  @ApiQuery({ name: 'branchId', required: false, type: String, description: 'ID của chi nhánh' })
  @ApiResponse({ status: 200, description: 'Danh sách tickets', type: [KitchenTicketDto] })
  async getTicketsFlat(@Query('branchId') branchId?: string): Promise<KitchenTicketDto[]> {
    const branchIdNum = branchId ? parseInt(branchId, 10) : undefined;
    return this.kitchenService.getTicketsFlat(branchIdNum);
  }

  @Post('items/:itemId/start')
  @ApiOperation({ summary: 'Bắt đầu làm món (SENT → IN_PROGRESS)' })
  @ApiParam({ name: 'itemId', type: String, description: 'ID của order item' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  async startItem(@Param('itemId') itemId: string) {
    return this.kitchenService.startItem(parseInt(itemId, 10));
  }

  @Post('items/:itemId/complete')
  @ApiOperation({ summary: 'Hoàn thành món (IN_PROGRESS → DONE)' })
  @ApiParam({ name: 'itemId', type: String, description: 'ID của order item' })
  @ApiResponse({ status: 200, description: 'Hoàn thành thành công' })
  async completeItem(@Param('itemId') itemId: string) {
    return this.kitchenService.completeItem(parseInt(itemId, 10));
  }

  @Post('tickets/:orderId/start')
  @ApiOperation({ summary: 'Bắt đầu làm tất cả món trong ticket (SENT → IN_PROGRESS)' })
  @ApiParam({ name: 'orderId', type: String, description: 'ID của order' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  async startTicket(@Param('orderId') orderId: string) {
    return this.kitchenService.startTicket(parseInt(orderId, 10));
  }

  @Post('tickets/:orderId/complete')
  @ApiOperation({ summary: 'Hoàn thành tất cả món trong ticket (IN_PROGRESS → DONE)' })
  @ApiParam({ name: 'orderId', type: String, description: 'ID của order' })
  @ApiResponse({ status: 200, description: 'Hoàn thành thành công' })
  async completeTicket(@Param('orderId') orderId: string) {
    return this.kitchenService.completeTicket(parseInt(orderId, 10));
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Cập nhật trạng thái món (generic method)' })
  @ApiParam({ name: 'itemId', type: String, description: 'ID của order item' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  async updateItemStatus(
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateItemStatusDto,
  ) {
    return this.kitchenService.updateItemStatus(parseInt(itemId, 10), updateDto.status);
  }
}

