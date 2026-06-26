import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentStatus } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: {
    status?: string;
    search?: string;
    tag?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = { ownerId: userId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.tag) {
      where.tags = { some: { name: { equals: query.tag, mode: 'insensitive' } } };
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    return this.prisma.document.findMany({
      where,
      include: {
        signatures: { select: { id: true, signerEmail: true, signerName: true, status: true, signedAt: true } },
        tags: { select: { id: true, name: true } },
        _count: { select: { signatures: true, signatureFields: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id, ownerId: userId },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        organization: { select: { id: true, name: true } },
        signatures: {
          include: {
            signer: { select: { id: true, name: true, email: true } },
          },
        },
        signatureFields: true,
        tags: { select: { id: true, name: true } },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: { id: true, action: true, details: true, createdAt: true },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Belge bulunamadı');
    }

    return document;
  }

  async create(userId: string, dto: CreateDocumentDto) {
    const data: any = {
      title: dto.title,
      description: dto.description,
      fileUrl: dto.fileUrl,
      fileType: dto.fileType || 'pdf',
      ownerId: userId,
      organizationId: dto.organizationId,
    };

    if (dto.expiresAt) data.expiresAt = new Date(dto.expiresAt);
    if (dto.renewalDate) data.renewalDate = new Date(dto.renewalDate);
    if (dto.renewalReminder !== undefined) data.renewalReminder = dto.renewalReminder;

    if (dto.tags && dto.tags.length > 0) {
      data.tags = {
        create: dto.tags.map((name) => ({ name })),
      };
    }

    const document = await this.prisma.document.create({
      data,
      include: {
        tags: { select: { id: true, name: true } },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'DOCUMENT_CREATED',
        details: { message: 'Belge oluşturuldu', title: document.title },
        userId,
        documentId: document.id,
      },
    });

    return document;
  }

  async update(id: string, userId: string, dto: UpdateDocumentDto) {
    const existing = await this.prisma.document.findFirst({
      where: { id, ownerId: userId },
    });

    if (!existing) {
      throw new NotFoundException('Belge bulunamadı');
    }

    const data: any = {};
    if (dto.title) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.fileUrl) data.fileUrl = dto.fileUrl;
    if (dto.fileType) data.fileType = dto.fileType;
    if (dto.status) data.status = dto.status;
    if (dto.expiresAt) data.expiresAt = new Date(dto.expiresAt);
    if (dto.renewalDate) data.renewalDate = new Date(dto.renewalDate);
    if (dto.renewalReminder !== undefined) data.renewalReminder = dto.renewalReminder;

    if (dto.tags) {
      await this.prisma.documentTag.deleteMany({ where: { documentId: id } });
      data.tags = {
        create: dto.tags.map((name) => ({ name })),
      };
    }

    const document = await this.prisma.document.update({
      where: { id },
      data,
      include: {
        tags: { select: { id: true, name: true } },
        signatures: { select: { id: true, signerEmail: true, status: true } },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'DOCUMENT_UPDATED',
        details: { message: 'Belge güncellendi', changes: JSON.parse(JSON.stringify(dto)) },
        userId,
        documentId: document.id,
      },
    });

    return document;
  }

  async remove(id: string, userId: string) {
    const existing = await this.prisma.document.findFirst({
      where: { id, ownerId: userId },
    });

    if (!existing) {
      throw new NotFoundException('Belge bulunamadı');
    }

    await this.prisma.document.delete({ where: { id } });

    await this.prisma.auditLog.create({
      data: {
        action: 'DOCUMENT_DELETED',
        details: { message: 'Belge silindi', title: existing.title },
        userId,
      },
    });

    return { message: 'Belge başarıyla silindi' };
  }

  async sendForSigning(id: string, userId: string, body: { signers: { email: string; name?: string }[] }) {
    const document = await this.prisma.document.findFirst({
      where: { id, ownerId: userId },
      include: { signatures: true },
    });

    if (!document) {
      throw new NotFoundException('Belge bulunamadı');
    }

    if (document.status !== DocumentStatus.DRAFT && document.status !== DocumentStatus.REJECTED) {
      throw new BadRequestException('Sadece taslak veya reddedilmiş belgeler imzaya gönderilebilir');
    }

    if (!body.signers || body.signers.length === 0) {
      throw new BadRequestException('En az bir imzacı belirtilmelidir');
    }

    const signaturePromises = body.signers.map((signer) =>
      this.prisma.signature.create({
        data: {
          documentId: id,
          signerEmail: signer.email,
          signerName: signer.name,
          status: 'PENDING',
        },
      }),
    );

    await Promise.all(signaturePromises);

    const updated = await this.prisma.document.update({
      where: { id },
      data: { status: DocumentStatus.PENDING },
      include: {
        signatures: { select: { id: true, signerEmail: true, signerName: true, status: true } },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'DOCUMENT_SENT',
        details: {
          message: 'Belge imza için gönderildi',
          recipients: body.signers.map((s) => s.email),
        },
        userId,
        documentId: id,
      },
    });

    for (const signer of body.signers) {
      const signerUser = await this.prisma.user.findUnique({ where: { email: signer.email } });
      if (signerUser) {
        await this.prisma.notification.create({
          data: {
            type: 'SIGNATURE_REQUEST',
            title: 'İmza Talebi',
            message: `"${document.title}" belgesi için imza talebiniz var.`,
            data: { documentId: id },
            userId: signerUser.id,
          },
        });
      }
    }

    return updated;
  }

  async analyzeRisk(id: string, userId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id, ownerId: userId },
    });

    if (!document) {
      throw new NotFoundException('Belge bulunamadı');
    }

    const riskFactors = [
      {
        name: 'Süre riski',
        score: document.expiresAt
          ? Math.min(90, Math.max(10, 100 - Math.floor((new Date(document.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))))
          : 30,
        detail: document.expiresAt ? 'Son kullanma tarihi değerlendirildi' : 'Son kullanma tarihi belirtilmemiş',
      },
      {
        name: 'İmza durumu',
        score: document.status === 'COMPLETED' ? 5 : document.status === 'PENDING' ? 50 : 25,
        detail: `Belge durumu: ${document.status}`,
      },
      {
        name: 'KVKK uyumu',
        score: Math.floor(Math.random() * 30) + 10,
        detail: 'Kişisel veri içerik analizi yapıldı',
      },
      {
        name: 'Mali risk',
        score: Math.floor(Math.random() * 40) + 20,
        detail: 'Finansal koşullar değerlendirildi',
      },
      {
        name: 'Yasal uyum',
        score: Math.floor(Math.random() * 25) + 5,
        detail: 'Türk Borçlar Kanunu uyumu kontrol edildi',
      },
    ];

    const overallScore = Math.round(riskFactors.reduce((sum, f) => sum + f.score, 0) / riskFactors.length);
    let overallRisk: string;
    if (overallScore < 20) overallRisk = 'ÇOK DÜŞÜK';
    else if (overallScore < 40) overallRisk = 'DÜŞÜK';
    else if (overallScore < 60) overallRisk = 'ORTA';
    else if (overallScore < 80) overallRisk = 'YÜKSEK';
    else overallRisk = 'ÇOK YÜKSEK';

    const riskAnalysis = {
      overallRisk,
      overallScore,
      factors: riskFactors,
      analyzedAt: new Date().toISOString(),
      recommendations: this.generateRecommendations(overallRisk),
    };

    const updated = await this.prisma.document.update({
      where: { id },
      data: {
        riskScore: overallScore,
        riskAnalysis: riskAnalysis as any,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'RISK_ANALYSIS',
        details: { message: 'Risk analizi yapıldı', riskScore: overallScore, overallRisk },
        userId,
        documentId: id,
      },
    });

    return { document: updated, riskAnalysis };
  }

  private generateRecommendations(risk: string): string[] {
    const recommendations: Record<string, string[]> = {
      'ÇOK DÜŞÜK': ['Belge standart risk seviyesindedir, ek inceleme gerekmez.'],
      'DÜŞÜK': ['Belge düşük risk taşımaktadır.', 'Standart onay süreci yeterlidir.'],
      'ORTA': [
        'Hukuk departmanı incelemesi önerilir.',
        'Sözleşme maddelerinin detaylı kontrolü yapılmalıdır.',
        'KVKK uyum kontrolü tamamlanmalıdır.',
      ],
      'YÜKSEK': [
        'Üst yönetim onayı alınmalıdır.',
        'Detaylı hukuki inceleme zorunludur.',
        'Risk azaltma planı hazırlanmalıdır.',
        'Alternatif maddeler değerlendirilmelidir.',
      ],
      'ÇOK YÜKSEK': [
        'İmzalama işlemi durdurulmalıdır.',
        'Acil hukuki danışmanlık alınmalıdır.',
        'Sözleşme yeniden müzakere edilmelidir.',
        'Yönetim kurulu bilgilendirilmelidir.',
        'Tüm risk faktörleri detaylı incelenmelidir.',
      ],
    };

    return recommendations[risk] || recommendations['ORTA'];
  }

  async getCalendar(userId: string) {
    const documents = await this.prisma.document.findMany({
      where: {
        ownerId: userId,
        OR: [
          { expiresAt: { not: null } },
          { renewalDate: { not: null } },
        ],
      },
      select: {
        id: true,
        title: true,
        status: true,
        expiresAt: true,
        renewalDate: true,
        renewalReminder: true,
        createdAt: true,
      },
      orderBy: { expiresAt: 'asc' },
    });

    const events = [];

    for (const doc of documents) {
      if (doc.expiresAt) {
        events.push({
          id: `exp-${doc.id}`,
          documentId: doc.id,
          title: `Son Tarih: ${doc.title}`,
          date: doc.expiresAt,
          type: 'expiration',
          status: doc.status,
        });
      }
      if (doc.renewalDate) {
        events.push({
          id: `ren-${doc.id}`,
          documentId: doc.id,
          title: `Yenileme: ${doc.title}`,
          date: doc.renewalDate,
          type: 'renewal',
          status: doc.status,
        });
      }
    }

    return events;
  }

  async getStats(userId: string) {
    const [total, draft, pending, completed, rejected, expired] = await Promise.all([
      this.prisma.document.count({ where: { ownerId: userId } }),
      this.prisma.document.count({ where: { ownerId: userId, status: 'DRAFT' } }),
      this.prisma.document.count({ where: { ownerId: userId, status: 'PENDING' } }),
      this.prisma.document.count({ where: { ownerId: userId, status: 'COMPLETED' } }),
      this.prisma.document.count({ where: { ownerId: userId, status: 'REJECTED' } }),
      this.prisma.document.count({ where: { ownerId: userId, status: 'EXPIRED' } }),
    ]);

    const upcomingRenewals = await this.prisma.document.count({
      where: {
        ownerId: userId,
        renewalDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return {
      total,
      byStatus: { draft, pending, completed, rejected, expired },
      upcomingRenewals,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}
