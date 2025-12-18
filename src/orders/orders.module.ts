import { Module, forwardRef } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TablesModule } from '../tables/tables.module';
import { KitchenModule } from '../kitchen/kitchen.module';

@Module({
  imports: [forwardRef(() => TablesModule), KitchenModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

