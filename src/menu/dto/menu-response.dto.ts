export class CategoryDto {
  id: number;
  name: string;
  displayOrder: number;
}

export class ProductDto {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
}

export class MenuResponseDto {
  categories: CategoryDto[];
  products: ProductDto[];
}

