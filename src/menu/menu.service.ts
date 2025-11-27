import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MenuResponseDto, CategoryDto, ProductDto } from './dto/menu-response.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getCategories(): Promise<CategoryDto[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      displayOrder: cat.displayOrder,
    }));
  }

  async getProducts(): Promise<ProductDto[]> {
    const products = await this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return products.map((product) => ({
      id: product.id,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
    }));
  }

  async getMenu(): Promise<MenuResponseDto> {
    return {
      categories: await this.getCategories(),
      products: await this.getProducts(),
    };
  }
}

