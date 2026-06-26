import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  @IsNotEmpty({ message: 'E-posta adresi zorunludur' })
  email: string;

  @IsString({ message: 'Şifre metin olmalıdır' })
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  @IsNotEmpty({ message: 'Şifre zorunludur' })
  password: string;

  @IsString({ message: 'İsim metin olmalıdır' })
  @IsNotEmpty({ message: 'İsim zorunludur' })
  name: string;

  @IsOptional()
  @IsString()
  department?: string;
}
