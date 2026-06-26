import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        _count: {
          select: { users: true, documents: true, templates: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true, name: true, email: true, role: true, department: true, createdAt: true },
        },
        _count: {
          select: { users: true, documents: true, templates: true },
        },
      },
    });

    if (!org) {
      throw new NotFoundException('Organizasyon bulunamadı');
    }

    return org;
  }

  async create(data: {
    name: string;
    kvkkConsent?: boolean;
    plan?: string;
    maxUsers?: number;
    maxDocuments?: number;
  }) {
    return this.prisma.organization.create({
      data: {
        name: data.name,
        kvkkConsent: data.kvkkConsent || false,
        plan: (data.plan as any) || 'FREE',
        maxUsers: data.maxUsers || 1,
        maxDocuments: data.maxDocuments || 5,
      },
    });
  }

  async update(id: string, data: {
    name?: string;
    kvkkConsent?: boolean;
    plan?: string;
    maxUsers?: number;
    maxDocuments?: number;
  }) {
    const existing = await this.prisma.organization.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Organizasyon bulunamadı');
    }

    return this.prisma.organization.update({
      where: { id },
      data: {
        name: data.name,
        kvkkConsent: data.kvkkConsent,
        plan: data.plan as any,
        maxUsers: data.maxUsers,
        maxDocuments: data.maxDocuments,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.organization.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });

    if (!existing) {
      throw new NotFoundException('Organizasyon bulunamadı');
    }

    if (existing._count.users > 0) {
      throw new BadRequestException('Kullanıcısı olan organizasyon silinemez. Önce kullanıcıları kaldırın.');
    }

    await this.prisma.organization.delete({ where: { id } });

    return { message: 'Organizasyon başarıyla silindi' };
  }

  async addMember(orgId: string, userId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      include: { _count: { select: { users: true } } },
    });

    if (!org) {
      throw new NotFoundException('Organizasyon bulunamadı');
    }

    if (org._count.users >= org.maxUsers) {
      throw new BadRequestException(`Organizasyon kullanıcı limiti doldu (${org.maxUsers})`);
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (user.organizationId === orgId) {
      throw new BadRequestException('Kullanıcı zaten bu organizasyonda');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { organizationId: orgId },
      select: { id: true, name: true, email: true, role: true, organizationId: true },
    });
  }

  async removeMember(orgId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, organizationId: orgId },
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bu organizasyonda bulunamadı');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { organizationId: null },
      select: { id: true, name: true, email: true, role: true, organizationId: true },
    });
  }
}
