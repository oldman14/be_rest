# Restaurant Order Backend API

Backend API cho hệ thống quản lý order món trong nhà hàng, được xây dựng với NestJS, PostgreSQL và Prisma.

## Công nghệ sử dụng

- **Node.js** + **NestJS** (TypeScript)
- **PostgreSQL** (Database)
- **Prisma** (ORM)
- **RESTful API** (JSON)

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình database

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật `DATABASE_URL` trong file `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_order?schema=public"
```

### 3. Chạy migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Tạo database và chạy migrations
npm run prisma:migrate
```

### 4. Chạy ứng dụng

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

Server sẽ chạy tại `http://localhost:3000`

## API Endpoints

### Tables

- `GET /tables?branchId=:branchId` - Lấy danh sách bàn
- `GET /tables/:tableId/current-order` - Lấy hoặc tạo order hiện tại của bàn
- `POST /tables/:tableId/current-order/items` - Thêm món vào order

### Menu

- `GET /menu` - Lấy danh sách menu (categories + items)

### Orders

- `GET /orders/:orderId` - Lấy thông tin order chi tiết
- `PATCH /orders/:orderId/items/:itemId` - Cập nhật order item

### Kitchen

- `GET /kitchen/tickets?branchId=:branchId` - Lấy danh sách món cần làm
- `PATCH /kitchen/items/:itemId` - Cập nhật trạng thái món (SENT → IN_PROGRESS → DONE)

### Payments

- `GET /orders/:orderId/summary` - Lấy thông tin tổng tiền trước khi thanh toán
- `POST /orders/:orderId/pay` - Thanh toán order

## Database Schema

Xem file `prisma/schema.prisma` để biết chi tiết về cấu trúc database.

## Scripts

- `npm run start:dev` - Chạy development server
- `npm run build` - Build project
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Chạy database migrations
- `npm run prisma:studio` - Mở Prisma Studio để xem database

