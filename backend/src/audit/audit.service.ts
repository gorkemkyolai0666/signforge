import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    action?: string;
    userId?: string;
    documentId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};

    if (query.action) {
      where.action = query.action;
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.documentId) {
      where.documentId = query.documentId;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          document: { select: { id: true, title: true } },
          signature: { select: { id: true, signerEmail: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async export(query: {
    format?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = {};

    if (query.action) {
      where.action = query.action;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const logs = await this.prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        document: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (query.format === 'csv') {
      const header = 'ID,Tarih,İşlem,Kullanıcı,E-posta,Belge,IP Adresi,KVKK Onayı';
      const rows = logs.map((log) =>
        [
          log.id,
          log.createdAt.toISOString(),
          log.action,
          log.user?.name || '-',
          log.user?.email || '-',
          log.document?.title || '-',
          log.ipAddress || '-',
          log.kvkkConsent ? 'Evet' : 'Hayır',
        ].join(','),
      );
      return { format: 'csv', content: [header, ...rows].join('\n'), count: logs.length };
    }

    return { format: 'json', data: logs, count: logs.length };
  }

  async getKvkkReport(query: { startDate?: string; endDate?: string }) {
    const where: any = {};

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const [totalLogs, kvkkConsentLogs, signatureLogs, userDataLogs] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.count({ where: { ...where, kvkkConsent: true } }),
      this.prisma.auditLog.count({
        where: { ...where, action: { in: ['SIGNATURE_COMPLETED', 'SIGNATURE_REJECTED'] } },
      }),
      this.prisma.auditLog.count({
        where: { ...where, action: { in: ['USER_REGISTERED', 'USER_LOGIN', 'USER_UPDATED'] } },
      }),
    ]);

    const recentActivities = await this.prisma.auditLog.findMany({
      where: { ...where, kvkkConsent: true },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const signaturesWithConsent = await this.prisma.signature.count({
      where: { kvkkConsent: true },
    });

    const signaturesWithoutConsent = await this.prisma.signature.count({
      where: { kvkkConsent: false, status: 'SIGNED' },
    });

    return {
      reportTitle: 'KVKK Uyum Raporu',
      generatedAt: new Date().toISOString(),
      summary: {
        totalAuditLogs: totalLogs,
        kvkkConsentProvided: kvkkConsentLogs,
        consentRate: totalLogs > 0 ? Math.round((kvkkConsentLogs / totalLogs) * 100) : 0,
        signatureActivities: signatureLogs,
        userDataActivities: userDataLogs,
      },
      signatureConsent: {
        withConsent: signaturesWithConsent,
        withoutConsent: signaturesWithoutConsent,
        complianceRate:
          signaturesWithConsent + signaturesWithoutConsent > 0
            ? Math.round(
                (signaturesWithConsent / (signaturesWithConsent + signaturesWithoutConsent)) * 100,
              )
            : 100,
      },
      recentKvkkActivities: recentActivities,
      recommendations: [
        'Tüm imza işlemlerinde KVKK onayı alınmalıdır.',
        'Kişisel veri işleme kayıtları düzenli olarak gözden geçirilmelidir.',
        'Veri saklama süreleri kontrol edilmelidir.',
        'Kullanıcı erişim logları periyodik olarak denetlenmelidir.',
      ],
    };
  }
}
