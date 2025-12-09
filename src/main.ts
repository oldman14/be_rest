import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global logging interceptor để log mọi request
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Enable CORS (nếu cần)
  app.enableCors();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Restaurant Order API')
    .setDescription('API cho hệ thống quản lý order món trong nhà hàng')
    .setVersion('1.0')
    .addTag('Tables', 'Quản lý bàn')
    .addTag('Menu', 'Quản lý menu')
    .addTag('Orders', 'Quản lý đơn hàng')
    .addTag('Kitchen', 'Màn hình bếp')
    .addTag('Payments', 'Thanh toán')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Restaurant Order API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();

