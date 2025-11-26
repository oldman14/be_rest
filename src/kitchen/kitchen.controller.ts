import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { KitchenService } from './kitchen.service';
import { KitchenTicketDto } from './dto/kitchen-ticket.dto';
import { UpdateItemStatusDto } from './dto/update-item-status.dto';

@Controller('kitchen')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get('tickets')
  async getTickets(@Query('branchId') branchId?: string): Promise<KitchenTicketDto[]> {
    const branchIdNum = branchId ? parseInt(branchId, 10) : undefined;
    return this.kitchenService.getTickets(branchIdNum);
  }

  @Patch('items/:itemId')
  async updateItemStatus(
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateItemStatusDto,
  ) {
    return this.kitchenService.updateItemStatus(parseInt(itemId, 10), updateDto.status);
  }
}

