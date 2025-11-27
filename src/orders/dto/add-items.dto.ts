import { IsArray, ValidateNested, IsInt, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AddItemDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class AddItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddItemDto)
  items: AddItemDto[];
}

