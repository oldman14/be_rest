export class MenuCategoryDto {
  id: number;
  name: string;
  displayOrder: number;
}

export class MenuItemDto {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
}

export class MenuResponseDto {
  categories: MenuCategoryDto[];
  items: MenuItemDto[];
}

