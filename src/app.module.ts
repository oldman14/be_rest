import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TablesModule } from './tables/tables.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { KitchenModule } from './kitchen/kitchen.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    DatabaseModule,
    TablesModule,
    MenuModule,
    OrdersModule,
    KitchenModule,
    PaymentsModule,
  ],
})
export class AppModule {}

