import { IsNotEmpty, IsString, IsOptional, IsDateString, IsBoolean, IsArray } from 'class-validator';

export class CreateDocumentDto {
  @IsString({ message: 'Başlık metin olmalıdır' })
  @IsNotEmpty({ message: 'Belge başlığı zorunludur' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString({ message: 'Dosya URL zorunludur' })
  @IsNotEmpty({ message: 'Dosya URL zorunludur' })
  fileUrl: string;

  @IsOptional()
  @IsString()
  fileType?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Geçerli bir tarih formatı giriniz' })
  expiresAt?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Geçerli bir tarih formatı giriniz' })
  renewalDate?: string;

  @IsOptional()
  @IsBoolean()
  renewalReminder?: boolean;

  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
