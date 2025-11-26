import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MenuResponseDto, MenuCategoryDto, MenuItemDto } from './dto/menu-response.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getMenu(): Promise<MenuResponseDto> {
    const [categories, items] = await Promise.all([
      this.prisma.menuCategory.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      this.prisma.menuItem.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        displayOrder: cat.displayOrder,
      })),
      items: items.map((item) => ({
        id: item.id,
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        price: item.price,
        isActive: item.isActive,
      })),
    };
  }
}

