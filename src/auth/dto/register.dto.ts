import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class RegisterDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    password: string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    name?: string;
}