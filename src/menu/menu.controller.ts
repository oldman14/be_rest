import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { MenuResponseDto, CategoryDto, ProductDto } from './dto/menu-response.dto';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Lấy danh sách categories' })
  @ApiResponse({ status: 200, description: 'Danh sách categories', type: [CategoryDto] })
  async getCategories(): Promise<CategoryDto[]> {
    return this.menuService.getCategories();
  }

  @Get('products')
  @ApiOperation({ summary: 'Lấy danh sách products' })
  @ApiResponse({ status: 200, description: 'Danh sách products', type: [ProductDto] })
  async getProducts(): Promise<ProductDto[]> {
    return this.menuService.getProducts();
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách menu (categories + products)' })
  @ApiResponse({ status: 200, description: 'Thông tin menu', type: MenuResponseDto })
  async getMenu(): Promise<MenuResponseDto> {
    return this.menuService.getMenu();
  }
}

