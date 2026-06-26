import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [
      totalUsers,
      totalDocuments,
      totalSignatures,
      totalTemplates,
      pendingSignatures,
      completedDocuments,
      activeOrganizations,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.document.count(),
      this.prisma.signature.count(),
      this.prisma.template.count(),
      this.prisma.signature.count({ where: { status: 'PENDING' } }),
      this.prisma.document.count({ where: { status: 'COMPLETED' } }),
      this.prisma.organization.count(),
    ]);

    const recentDocuments = await this.prisma.document.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, status: true, createdAt: true },
    });

    const recentSignatures = await this.prisma.signature.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        signerEmail: true,
        status: true,
        createdAt: true,
        document: { select: { title: true } },
      },
    });

    return {
      stats: {
        totalUsers,
        totalDocuments,
        totalSignatures,
        totalTemplates,
        pendingSignatures,
        completedDocuments,
        activeOrganizations,
        completionRate: totalDocuments > 0 ? Math.round((completedDocuments / totalDocuments) * 100) : 0,
      },
      recentDocuments,
      recentSignatures,
    };
  }

  async getSigningRate(query: { period?: string }) {
    const period = query.period || '30d';
    let daysBack = 30;
    if (period === '7d') daysBack = 7;
    else if (period === '90d') daysBack = 90;
    else if (period === '365d') daysBack = 365;

    const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    const [totalSent, signed, rejected, expired] = await Promise.all([
      this.prisma.signature.count({ where: { createdAt: { gte: startDate } } }),
      this.prisma.signature.count({ where: { createdAt: { gte: startDate }, status: 'SIGNED' } }),
      this.prisma.signature.count({ where: { createdAt: { gte: startDate }, status: 'REJECTED' } }),
      this.prisma.signature.count({ where: { createdAt: { gte: startDate }, status: 'EXPIRED' } }),
    ]);

    const pending = totalSent - signed - rejected - expired;

    const dailyData = [];
    for (let i = Math.min(daysBack, 30) - 1; i >= 0; i--) {
      const dayStart = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const [daySent, daySigned] = await Promise.all([
        this.prisma.signature.count({
          where: { createdAt: { gte: dayStart, lte: dayEnd } },
        }),
        this.prisma.signature.count({
          where: { signedAt: { gte: dayStart, lte: dayEnd } },
        }),
      ]);

      dailyData.push({
        date: dayStart.toISOString().split('T')[0],
        sent: daySent,
        signed: daySigned,
      });
    }

    return {
      period,
      summary: {
        totalSent,
        signed,
        rejected,
        expired,
        pending,
        signingRate: totalSent > 0 ? Math.round((signed / totalSent) * 100) : 0,
        rejectionRate: totalSent > 0 ? Math.round((rejected / totalSent) * 100) : 0,
      },
      dailyData,
    };
  }

  async getTimeline(query: { months?: number }) {
    const months = query.months || 12;
    const timeline = [];

    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i, 1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      const [created, completed, expired] = await Promise.all([
        this.prisma.document.count({
          where: { createdAt: { gte: monthStart, lte: monthEnd } },
        }),
        this.prisma.document.count({
          where: { status: 'COMPLETED', updatedAt: { gte: monthStart, lte: monthEnd } },
        }),
        this.prisma.document.count({
          where: { status: 'EXPIRED', updatedAt: { gte: monthStart, lte: monthEnd } },
        }),
      ]);

      const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
      ];

      timeline.push({
        month: `${monthNames[monthStart.getMonth()]} ${monthStart.getFullYear()}`,
        created,
        completed,
        expired,
      });
    }

    return { timeline };
  }

  async getDepartmentBreakdown() {
    const users = await this.prisma.user.findMany({
      where: { department: { not: null } },
      select: {
        department: true,
        _count: {
          select: {
            documents: true,
            signatures: true,
          },
        },
      },
    });

    const departmentMap = new Map<string, { documents: number; signatures: number; users: number }>();

    for (const user of users) {
      const dept = user.department!;
      const existing = departmentMap.get(dept) || { documents: 0, signatures: 0, users: 0 };
      existing.documents += user._count.documents;
      existing.signatures += user._count.signatures;
      existing.users += 1;
      departmentMap.set(dept, existing);
    }

    const departments = Array.from(departmentMap.entries()).map(([name, data]) => ({
      department: name,
      ...data,
    }));

    departments.sort((a, b) => b.documents - a.documents);

    return { departments };
  }
}
