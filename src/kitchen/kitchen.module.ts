import { Module } from '@nestjs/common';
import { KitchenController } from './kitchen.controller';
import { KitchenService } from './kitchen.service';
import { KitchenGateway } from './kitchen.gateway';

@Module({
  controllers: [KitchenController],
  providers: [KitchenService, KitchenGateway],
<<<<<<< HEAD
  exports: [KitchenService, KitchenGateway],
=======
  exports: [KitchenGateway],
>>>>>>> 067f482 (Enhance kitchen module with WebSocket support and Swagger documentation. Added new endpoints for managing item and ticket statuses, including real-time updates via Socket.IO. Updated package dependencies and improved DTOs for better API documentation.)
})
export class KitchenModule {}

