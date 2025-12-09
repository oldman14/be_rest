import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({ description: 'ID của category' })
  id: number;

  @ApiProperty({ description: 'Tên category' })
  name: string;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  displayOrder: number;
}

export class ProductDto {
  @ApiProperty({ description: 'ID của product' })
  id: number;

  @ApiProperty({ description: 'ID của category' })
  categoryId: number;

  @ApiProperty({ description: 'Tên món' })
  name: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  description?: string;

  @ApiProperty({ description: 'Giá (VNĐ)' })
  price: number;

  @ApiProperty({ description: 'URL ảnh', required: false })
  imageUrl?: string;

  @ApiProperty({ description: 'Trạng thái active' })
  isActive: boolean;
}

export class MenuResponseDto {
  @ApiProperty({ description: 'Danh sách categories', type: [CategoryDto] })
  categories: CategoryDto[];

  @ApiProperty({ description: 'Danh sách products', type: [ProductDto] })
  products: ProductDto[];
}

