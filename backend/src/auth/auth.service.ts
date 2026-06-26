import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Bu e-posta adresi zaten kayıtlı');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        department: dto.department,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'USER_REGISTERED',
        details: { message: 'Yeni kullanıcı kaydı oluşturuldu', email: user.email },
        userId: user.id,
      },
    });

    const { password, ...result } = user;
    const token = this.generateToken(user.id, user.email);

    return { user: result, access_token: token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }

    await this.prisma.auditLog.create({
      data: {
        action: 'USER_LOGIN',
        details: { message: 'Kullanıcı giriş yaptı' },
        userId: user.id,
      },
    });

    const { password, ...result } = user;
    const token = this.generateToken(user.id, user.email);

    return { user: result, access_token: token };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
        _count: {
          select: {
            documents: true,
            signatures: true,
            templates: true,
            notifications: { where: { read: false } },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    const { password, ...result } = user;
    return result;
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({
      sub: userId,
      email,
    });
  }
}
