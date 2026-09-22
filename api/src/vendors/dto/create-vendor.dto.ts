import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export enum VendorStatusDto {
  ACTIVE = 'ACTIVE',
  AT_RISK = 'AT_RISK',
  OFFBOARDED = 'OFFBOARDED',
}

export class CreateVendorDto {
  @ApiProperty({ example: 'Northwind Logistics' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'Logistics' })
  @IsString()
  @MinLength(2)
  category!: string;

  @ApiProperty({ example: 'vendor-contact@northwind.com' })
  @IsEmail()
  contactEmail!: string;

  @ApiProperty({ example: 20, required: false, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  riskScore?: number;

  @ApiProperty({ enum: VendorStatusDto, required: false })
  @IsOptional()
  @IsEnum(VendorStatusDto)
  status?: VendorStatusDto;
}
