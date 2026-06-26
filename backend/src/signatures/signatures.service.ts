import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignatureStatus, DocumentStatus } from '@prisma/client';

@Injectable()
export class SignaturesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: { status?: string; documentId?: string }) {
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.documentId) {
      where.documentId = query.documentId;
    }

    where.OR = [
      { signerId: userId },
      { document: { ownerId: userId } },
    ];

    return this.prisma.signature.findMany({
      where,
      include: {
        document: { select: { id: true, title: true, status: true, fileUrl: true } },
        signer: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const signature = await this.prisma.signature.findUnique({
      where: { id },
      include: {
        document: {
          select: { id: true, title: true, status: true, fileUrl: true, ownerId: true },
        },
        signer: { select: { id: true, name: true, email: true } },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          select: { id: true, action: true, details: true, createdAt: true },
        },
      },
    });

    if (!signature) {
      throw new NotFoundException('İmza kaydı bulunamadı');
    }

    return signature;
  }

  async create(userId: string, body: {
    documentId: string;
    signerEmail: string;
    signerName?: string;
  }) {
    const document = await this.prisma.document.findFirst({
      where: { id: body.documentId, ownerId: userId },
    });

    if (!document) {
      throw new NotFoundException('Belge bulunamadı');
    }

    const existingSignature = await this.prisma.signature.findFirst({
      where: {
        documentId: body.documentId,
        signerEmail: body.signerEmail,
        status: { in: ['PENDING', 'SIGNED'] },
      },
    });

    if (existingSignature) {
      throw new BadRequestException('Bu imzacı için zaten aktif bir imza talebi mevcut');
    }

    const signerUser = await this.prisma.user.findUnique({
      where: { email: body.signerEmail },
    });

    const signature = await this.prisma.signature.create({
      data: {
        documentId: body.documentId,
        signerEmail: body.signerEmail,
        signerName: body.signerName,
        signerId: signerUser?.id,
        status: SignatureStatus.PENDING,
      },
      include: {
        document: { select: { id: true, title: true } },
      },
    });

    if (signerUser) {
      await this.prisma.notification.create({
        data: {
          type: 'SIGNATURE_REQUEST',
          title: 'Yeni İmza Talebi',
          message: `"${document.title}" belgesi için imza talebiniz oluşturuldu.`,
          data: { documentId: document.id, signatureId: signature.id },
          userId: signerUser.id,
        },
      });
    }

    await this.prisma.auditLog.create({
      data: {
        action: 'SIGNATURE_REQUESTED',
        details: { message: 'İmza talebi oluşturuldu', signerEmail: body.signerEmail },
        userId,
        documentId: body.documentId,
        signatureId: signature.id,
      },
    });

    return signature;
  }

  async sign(id: string, userId: string, body: {
    signatureData?: string;
    kvkkConsent?: boolean;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const signature = await this.prisma.signature.findUnique({
      where: { id },
      include: { document: true },
    });

    if (!signature) {
      throw new NotFoundException('İmza kaydı bulunamadı');
    }

    if (signature.status !== SignatureStatus.PENDING) {
      throw new BadRequestException('Bu imza talebi zaten işlenmiş');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user && user.email !== signature.signerEmail && signature.signerId !== userId) {
      throw new BadRequestException('Bu imza talebi size ait değil');
    }

    const updated = await this.prisma.signature.update({
      where: { id },
      data: {
        status: SignatureStatus.SIGNED,
        signedAt: new Date(),
        signatureData: body.signatureData,
        kvkkConsent: body.kvkkConsent || false,
        ipAddress: body.ipAddress,
        userAgent: body.userAgent,
        signerId: userId,
      },
      include: {
        document: { select: { id: true, title: true } },
      },
    });

    await this.updateDocumentStatus(signature.documentId);

    await this.prisma.auditLog.create({
      data: {
        action: 'SIGNATURE_COMPLETED',
        details: { message: 'Belge imzalandı' },
        userId,
        documentId: signature.documentId,
        signatureId: id,
        ipAddress: body.ipAddress,
        userAgent: body.userAgent,
        kvkkConsent: body.kvkkConsent || false,
      },
    });

    const docOwner = await this.prisma.document.findUnique({
      where: { id: signature.documentId },
      select: { ownerId: true, title: true },
    });

    if (docOwner) {
      await this.prisma.notification.create({
        data: {
          type: 'DOCUMENT_SIGNED',
          title: 'Belge İmzalandı',
          message: `"${docOwner.title}" belgesi ${user?.name || signature.signerEmail} tarafından imzalandı.`,
          data: { documentId: signature.documentId, signatureId: id },
          userId: docOwner.ownerId,
        },
      });
    }

    return updated;
  }

  async reject(id: string, userId: string, body: { reason?: string }) {
    const signature = await this.prisma.signature.findUnique({
      where: { id },
      include: { document: true },
    });

    if (!signature) {
      throw new NotFoundException('İmza kaydı bulunamadı');
    }

    if (signature.status !== SignatureStatus.PENDING) {
      throw new BadRequestException('Bu imza talebi zaten işlenmiş');
    }

    const updated = await this.prisma.signature.update({
      where: { id },
      data: { status: SignatureStatus.REJECTED },
      include: {
        document: { select: { id: true, title: true } },
      },
    });

    await this.prisma.document.update({
      where: { id: signature.documentId },
      data: { status: DocumentStatus.REJECTED },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'SIGNATURE_REJECTED',
        details: { message: 'İmza reddedildi', reason: body.reason },
        userId,
        documentId: signature.documentId,
        signatureId: id,
      },
    });

    const docOwner = await this.prisma.document.findUnique({
      where: { id: signature.documentId },
      select: { ownerId: true, title: true },
    });

    if (docOwner) {
      await this.prisma.notification.create({
        data: {
          type: 'SIGNATURE_REJECTED',
          title: 'İmza Reddedildi',
          message: `"${docOwner.title}" belgesi için imza reddedildi. Sebep: ${body.reason || 'Belirtilmedi'}`,
          data: { documentId: signature.documentId, signatureId: id },
          userId: docOwner.ownerId,
        },
      });
    }

    return updated;
  }

  private async updateDocumentStatus(documentId: string) {
    const signatures = await this.prisma.signature.findMany({
      where: { documentId },
    });

    const allSigned = signatures.every((s) => s.status === SignatureStatus.SIGNED);
    const someSigned = signatures.some((s) => s.status === SignatureStatus.SIGNED);
    const anyRejected = signatures.some((s) => s.status === SignatureStatus.REJECTED);

    let newStatus: DocumentStatus;
    if (anyRejected) {
      newStatus = DocumentStatus.REJECTED;
    } else if (allSigned) {
      newStatus = DocumentStatus.COMPLETED;
    } else if (someSigned) {
      newStatus = DocumentStatus.PARTIALLY_SIGNED;
    } else {
      newStatus = DocumentStatus.PENDING;
    }

    await this.prisma.document.update({
      where: { id: documentId },
      data: { status: newStatus },
    });
  }
}
