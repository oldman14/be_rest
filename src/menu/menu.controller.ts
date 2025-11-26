import { Controller, Get } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuResponseDto } from './dto/menu-response.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenu(): Promise<MenuResponseDto> {
    return this.menuService.getMenu();
  }
}

