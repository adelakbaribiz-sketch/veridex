import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsString, MinLength } from 'class-validator';

export enum DocumentTypeDto {
  INSURANCE_CERT = 'INSURANCE_CERT',
  SOC2_REPORT = 'SOC2_REPORT',
  ISO27001 = 'ISO27001',
  CONTRACT = 'CONTRACT',
  OTHER = 'OTHER',
}

export class CreateDocumentDto {
  @ApiProperty({ enum: DocumentTypeDto })
  @IsEnum(DocumentTypeDto)
  type!: DocumentTypeDto;

  @ApiProperty({ example: 'certificate-of-insurance-2026.pdf' })
  @IsString()
  @MinLength(3)
  fileName!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  @IsDateString()
  issuedAt!: string;

  @ApiProperty({ example: '2027-01-01T00:00:00.000Z' })
  @IsDateString()
  expiresAt!: string;
}
