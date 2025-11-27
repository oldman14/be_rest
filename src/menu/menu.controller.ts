import { Controller, Get } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuResponseDto, CategoryDto, ProductDto } from './dto/menu-response.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('categories')
  async getCategories(): Promise<CategoryDto[]> {
    return this.menuService.getCategories();
  }

  @Get('products')
  async getProducts(): Promise<ProductDto[]> {
    return this.menuService.getProducts();
  }

  @Get()
  async getMenu(): Promise<MenuResponseDto> {
    return this.menuService.getMenu();
  }
}

