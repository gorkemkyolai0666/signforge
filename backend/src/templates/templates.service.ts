import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: { category?: string; search?: string }) {
    const where: any = { ownerId: userId };

    if (query.category) {
      where.category = { equals: query.category, mode: 'insensitive' };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.template.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findPublic(query: { category?: string; search?: string }) {
    const where: any = { isPublic: true };

    if (query.category) {
      where.category = { equals: query.category, mode: 'insensitive' };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.template.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true } },
      },
      orderBy: { usageCount: 'desc' },
    });
  }

  async findOne(id: string) {
    const template = await this.prisma.template.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        organization: { select: { id: true, name: true } },
      },
    });

    if (!template) {
      throw new NotFoundException('Şablon bulunamadı');
    }

    return template;
  }

  async create(userId: string, data: {
    name: string;
    description?: string;
    content: string;
    variables?: any;
    category?: string;
    isPublic?: boolean;
    organizationId?: string;
  }) {
    const template = await this.prisma.template.create({
      data: {
        name: data.name,
        description: data.description,
        content: data.content,
        variables: data.variables,
        category: data.category,
        isPublic: data.isPublic || false,
        ownerId: userId,
        organizationId: data.organizationId,
      },
      include: {
        owner: { select: { id: true, name: true } },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'TEMPLATE_CREATED',
        details: { message: 'Yeni şablon oluşturuldu', templateName: template.name },
        userId,
      },
    });

    return template;
  }

  async update(id: string, userId: string, data: {
    name?: string;
    description?: string;
    content?: string;
    variables?: any;
    category?: string;
    isPublic?: boolean;
  }) {
    const existing = await this.prisma.template.findFirst({
      where: { id, ownerId: userId },
    });

    if (!existing) {
      throw new NotFoundException('Şablon bulunamadı veya erişim yetkiniz yok');
    }

    return this.prisma.template.update({
      where: { id },
      data,
      include: {
        owner: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: string, userId: string) {
    const existing = await this.prisma.template.findFirst({
      where: { id, ownerId: userId },
    });

    if (!existing) {
      throw new NotFoundException('Şablon bulunamadı veya erişim yetkiniz yok');
    }

    await this.prisma.template.delete({ where: { id } });

    return { message: 'Şablon başarıyla silindi' };
  }

  async incrementUsage(id: string) {
    await this.prisma.template.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });
  }
}
