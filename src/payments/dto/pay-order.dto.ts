import { IsArray, ValidateNested, IsEnum, IsInt, Min, IsOptional, IsString, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class PaymentDto {
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsInt()
  @Min(1)
  amount: number;
}

export class VatInfoDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  taxCode?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class PayOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDto)
  payments: PaymentDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => VatInfoDto)
  vatInfo?: VatInfoDto;
}

