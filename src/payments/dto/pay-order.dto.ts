import { IsArray, ValidateNested, IsEnum, IsInt, Min, IsOptional, IsString, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class PaymentDto {
  @ApiProperty({ description: 'Phương thức thanh toán', enum: PaymentMethod, example: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ description: 'Số tiền (VNĐ)', example: 100000 })
  @IsInt()
  @Min(1)
  amount: number;
}

export class VatInfoDto {
  @ApiProperty({ description: 'Tên công ty', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ description: 'Mã số thuế', required: false })
  @IsOptional()
  @IsString()
  taxCode?: string;

  @ApiProperty({ description: 'Email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class PayOrderDto {
  @ApiProperty({ description: 'Danh sách thanh toán', type: [PaymentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDto)
  payments: PaymentDto[];

  @ApiProperty({ description: 'Thông tin VAT', type: VatInfoDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => VatInfoDto)
  vatInfo?: VatInfoDto;
}

