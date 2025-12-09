import { IsArray, ValidateNested, IsInt, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemDto {
  @ApiProperty({ description: 'ID của product', example: 1 })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({ description: 'Số lượng', example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Ghi chú', required: false, example: 'Ít hành' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ description: 'Trạng thái', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class AddItemsDto {
  @ApiProperty({ description: 'Danh sách món cần thêm', type: [AddItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddItemDto)
  items: AddItemDto[];
}

