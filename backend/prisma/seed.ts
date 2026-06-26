import { PrismaClient, UserRole, PlanType, DocumentStatus, SignatureStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Veritabanı seed işlemi başlıyor...');

  const hashedAdmin = await bcrypt.hash('SignForge2026!', 10);
  const hashedUser = await bcrypt.hash('Kullanici2026!', 10);

  const org = await prisma.organization.upsert({
    where: { id: 'org-signforge-demo' },
    update: {},
    create: {
      id: 'org-signforge-demo',
      name: 'SignForge Demo A.Ş.',
      kvkkConsent: true,
      plan: PlanType.ENTERPRISE,
      maxUsers: 50,
      maxDocuments: 1000,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@signforge.com.tr' },
    update: {},
    create: {
      email: 'admin@signforge.com.tr',
      password: hashedAdmin,
      name: 'Sistem Yöneticisi',
      role: UserRole.ADMIN,
      department: 'Bilgi Teknolojileri',
      organizationId: org.id,
    },
  });

  const ayse = await prisma.user.upsert({
    where: { email: 'ayse.yilmaz@signforge.com.tr' },
    update: {},
    create: {
      email: 'ayse.yilmaz@signforge.com.tr',
      password: hashedUser,
      name: 'Ayşe Yılmaz',
      role: UserRole.MANAGER,
      department: 'Hukuk',
      organizationId: org.id,
    },
  });

  const mehmet = await prisma.user.upsert({
    where: { email: 'mehmet.demir@signforge.com.tr' },
    update: {},
    create: {
      email: 'mehmet.demir@signforge.com.tr',
      password: hashedUser,
      name: 'Mehmet Demir',
      role: UserRole.SIGNER,
      department: 'Satış',
      organizationId: org.id,
    },
  });

  const fatma = await prisma.user.upsert({
    where: { email: 'fatma.kaya@signforge.com.tr' },
    update: {},
    create: {
      email: 'fatma.kaya@signforge.com.tr',
      password: hashedUser,
      name: 'Fatma Kaya',
      role: UserRole.USER,
      department: 'İnsan Kaynakları',
      organizationId: org.id,
    },
  });

  const ali = await prisma.user.upsert({
    where: { email: 'ali.ozturk@signforge.com.tr' },
    update: {},
    create: {
      email: 'ali.ozturk@signforge.com.tr',
      password: hashedUser,
      name: 'Ali Öztürk',
      role: UserRole.VIEWER,
      department: 'Finans',
      organizationId: org.id,
    },
  });

  const doc1 = await prisma.document.upsert({
    where: { id: 'doc-demo-001' },
    update: {},
    create: {
      id: 'doc-demo-001',
      title: 'Hizmet Sözleşmesi - 2026',
      description: 'Yıllık danışmanlık hizmet sözleşmesi',
      fileUrl: '/uploads/hizmet-sozlesmesi-2026.pdf',
      fileType: 'pdf',
      status: DocumentStatus.PENDING,
      expiresAt: new Date('2026-12-31'),
      renewalDate: new Date('2026-11-30'),
      riskScore: 35.5,
      riskAnalysis: {
        overallRisk: 'DÜŞÜK',
        factors: [
          { name: 'Süre riski', score: 20, detail: 'Sözleşme süresi makul' },
          { name: 'Mali risk', score: 45, detail: 'Ceza maddesi yüksek' },
          { name: 'Yasal uyum', score: 15, detail: 'KVKK uyumlu' },
        ],
      },
      metadata: { department: 'Hukuk', priority: 'yüksek' },
      ownerId: ayse.id,
      organizationId: org.id,
    },
  });

  const doc2 = await prisma.document.upsert({
    where: { id: 'doc-demo-002' },
    update: {},
    create: {
      id: 'doc-demo-002',
      title: 'Gizlilik Sözleşmesi (NDA)',
      description: 'İş ortağı gizlilik anlaşması',
      fileUrl: '/uploads/gizlilik-sozlesmesi.pdf',
      fileType: 'pdf',
      status: DocumentStatus.COMPLETED,
      riskScore: 15.0,
      riskAnalysis: {
        overallRisk: 'ÇOK DÜŞÜK',
        factors: [
          { name: 'Standart şablon', score: 10, detail: 'Onaylı şablon kullanılmış' },
          { name: 'Yasal uyum', score: 20, detail: 'Tam uyumlu' },
        ],
      },
      ownerId: admin.id,
      organizationId: org.id,
    },
  });

  const doc3 = await prisma.document.upsert({
    where: { id: 'doc-demo-003' },
    update: {},
    create: {
      id: 'doc-demo-003',
      title: 'İş Sözleşmesi - Mehmet Demir',
      description: 'Belirsiz süreli iş sözleşmesi',
      fileUrl: '/uploads/is-sozlesmesi-mehmet.pdf',
      fileType: 'pdf',
      status: DocumentStatus.DRAFT,
      riskScore: 25.0,
      metadata: { department: 'İnsan Kaynakları', type: 'İş Sözleşmesi' },
      ownerId: fatma.id,
      organizationId: org.id,
    },
  });

  await prisma.document.upsert({
    where: { id: 'doc-demo-004' },
    update: {},
    create: {
      id: 'doc-demo-004',
      title: 'Tedarikçi Çerçeve Anlaşması',
      description: 'Yıllık tedarik çerçeve sözleşmesi',
      fileUrl: '/uploads/tedarikci-cerceve.pdf',
      fileType: 'pdf',
      status: DocumentStatus.PARTIALLY_SIGNED,
      expiresAt: new Date('2027-06-30'),
      renewalDate: new Date('2027-05-01'),
      riskScore: 55.0,
      riskAnalysis: {
        overallRisk: 'ORTA',
        factors: [
          { name: 'Finansal risk', score: 60, detail: 'Yüksek tutarlı sözleşme' },
          { name: 'Operasyonel risk', score: 50, detail: 'Teslimat gecikme riski' },
        ],
      },
      ownerId: mehmet.id,
      organizationId: org.id,
    },
  });

  await prisma.signatureField.upsert({
    where: { id: 'sf-demo-001' },
    update: {},
    create: {
      id: 'sf-demo-001',
      documentId: doc1.id,
      signerEmail: 'mehmet.demir@signforge.com.tr',
      signerName: 'Mehmet Demir',
      positionX: 100,
      positionY: 650,
      width: 200,
      height: 60,
      pageNumber: 3,
      fieldType: 'signature',
      required: true,
      order: 1,
    },
  });

  await prisma.signatureField.upsert({
    where: { id: 'sf-demo-002' },
    update: {},
    create: {
      id: 'sf-demo-002',
      documentId: doc1.id,
      signerEmail: 'ayse.yilmaz@signforge.com.tr',
      signerName: 'Ayşe Yılmaz',
      positionX: 350,
      positionY: 650,
      width: 200,
      height: 60,
      pageNumber: 3,
      fieldType: 'signature',
      required: true,
      order: 2,
    },
  });

  await prisma.signature.upsert({
    where: { id: 'sig-demo-001' },
    update: {},
    create: {
      id: 'sig-demo-001',
      documentId: doc1.id,
      signerId: mehmet.id,
      signerEmail: 'mehmet.demir@signforge.com.tr',
      signerName: 'Mehmet Demir',
      status: SignatureStatus.PENDING,
      kvkkConsent: true,
    },
  });

  await prisma.signature.upsert({
    where: { id: 'sig-demo-002' },
    update: {},
    create: {
      id: 'sig-demo-002',
      documentId: doc2.id,
      signerId: admin.id,
      signerEmail: 'admin@signforge.com.tr',
      signerName: 'Sistem Yöneticisi',
      status: SignatureStatus.SIGNED,
      signedAt: new Date('2026-05-15T10:30:00Z'),
      ipAddress: '192.168.1.100',
      kvkkConsent: true,
      signatureData: 'data:image/png;base64,DEMO_SIGNATURE_DATA',
    },
  });

  await prisma.template.upsert({
    where: { id: 'tpl-demo-001' },
    update: {},
    create: {
      id: 'tpl-demo-001',
      name: 'Standart Hizmet Sözleşmesi',
      description: 'Genel amaçlı hizmet sözleşmesi şablonu',
      content: 'HİZMET SÖZLEŞMESİ\n\nMadde 1 - Taraflar\n{{taraf1_adi}} ile {{taraf2_adi}} arasında aşağıdaki koşullarda iş bu sözleşme imzalanmıştır.\n\nMadde 2 - Konu\n{{sozlesme_konusu}}\n\nMadde 3 - Süre\nBu sözleşme {{baslangic_tarihi}} tarihinden itibaren {{bitis_tarihi}} tarihine kadar geçerlidir.\n\nMadde 4 - Ücret\n{{ucret_tutari}} TL olarak belirlenmiştir.',
      variables: {
        taraf1_adi: 'Birinci taraf adı',
        taraf2_adi: 'İkinci taraf adı',
        sozlesme_konusu: 'Sözleşme konusu',
        baslangic_tarihi: 'Başlangıç tarihi',
        bitis_tarihi: 'Bitiş tarihi',
        ucret_tutari: 'Ücret tutarı',
      },
      category: 'Hizmet',
      isPublic: true,
      usageCount: 45,
      ownerId: admin.id,
      organizationId: org.id,
    },
  });

  await prisma.template.upsert({
    where: { id: 'tpl-demo-002' },
    update: {},
    create: {
      id: 'tpl-demo-002',
      name: 'Gizlilik Anlaşması (NDA)',
      description: 'Karşılıklı gizlilik anlaşması şablonu',
      content: 'GİZLİLİK ANLAŞMASI\n\nTaraflar:\n{{ifsa_eden}} (İfşa Eden)\n{{alici}} (Alıcı)\n\nGizli bilgi tanımı ve korunması hakkında karşılıklı yükümlülükleri düzenler.\n\nSüre: {{sure}} ay\nCeza: {{ceza_tutari}} TL',
      variables: {
        ifsa_eden: 'İfşa eden taraf',
        alici: 'Alıcı taraf',
        sure: 'Süre (ay)',
        ceza_tutari: 'Ceza tutarı',
      },
      category: 'Gizlilik',
      isPublic: true,
      usageCount: 78,
      ownerId: ayse.id,
      organizationId: org.id,
    },
  });

  await prisma.template.upsert({
    where: { id: 'tpl-demo-003' },
    update: {},
    create: {
      id: 'tpl-demo-003',
      name: 'İş Sözleşmesi Şablonu',
      description: 'Belirsiz süreli iş sözleşmesi şablonu',
      content: 'İŞ SÖZLEŞMESİ\n\nİşveren: {{isveren_adi}}\nÇalışan: {{calisan_adi}}\nGörev: {{gorev_tanimi}}\nMaaş: {{maas}} TL\nBaşlangıç: {{baslangic_tarihi}}\n\nDeneme süresi {{deneme_suresi}} aydır.',
      variables: {
        isveren_adi: 'İşveren adı',
        calisan_adi: 'Çalışan adı',
        gorev_tanimi: 'Görev tanımı',
        maas: 'Aylık maaş',
        baslangic_tarihi: 'İşe başlama tarihi',
        deneme_suresi: 'Deneme süresi (ay)',
      },
      category: 'İnsan Kaynakları',
      isPublic: false,
      usageCount: 23,
      ownerId: fatma.id,
      organizationId: org.id,
    },
  });

  await prisma.documentTag.upsert({
    where: { id: 'tag-demo-001' },
    update: {},
    create: { id: 'tag-demo-001', name: 'acil', documentId: doc1.id },
  });

  await prisma.documentTag.upsert({
    where: { id: 'tag-demo-002' },
    update: {},
    create: { id: 'tag-demo-002', name: 'hukuk', documentId: doc1.id },
  });

  await prisma.documentTag.upsert({
    where: { id: 'tag-demo-003' },
    update: {},
    create: { id: 'tag-demo-003', name: 'gizlilik', documentId: doc2.id },
  });

  await prisma.documentTag.upsert({
    where: { id: 'tag-demo-004' },
    update: {},
    create: { id: 'tag-demo-004', name: 'ik', documentId: doc3.id },
  });

  const auditActions = [
    { id: 'audit-001', action: 'DOCUMENT_CREATED', userId: ayse.id, documentId: doc1.id, details: { message: 'Hizmet sözleşmesi oluşturuldu' } },
    { id: 'audit-002', action: 'DOCUMENT_SENT', userId: ayse.id, documentId: doc1.id, details: { message: 'Belge imza için gönderildi', recipients: ['mehmet.demir@signforge.com.tr'] } },
    { id: 'audit-003', action: 'SIGNATURE_COMPLETED', userId: admin.id, documentId: doc2.id, signatureId: 'sig-demo-002', details: { message: 'Belge imzalandı' } },
    { id: 'audit-004', action: 'DOCUMENT_CREATED', userId: fatma.id, documentId: doc3.id, details: { message: 'İş sözleşmesi taslağı oluşturuldu' } },
    { id: 'audit-005', action: 'USER_LOGIN', userId: admin.id, details: { message: 'Sisteme giriş yapıldı', ipAddress: '192.168.1.1' } },
    { id: 'audit-006', action: 'TEMPLATE_CREATED', userId: admin.id, details: { message: 'Yeni şablon oluşturuldu', templateName: 'Standart Hizmet Sözleşmesi' } },
  ];

  for (const log of auditActions) {
    await prisma.auditLog.upsert({
      where: { id: log.id },
      update: {},
      create: {
        id: log.id,
        action: log.action,
        details: log.details,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 SignForge/1.0',
        kvkkConsent: true,
        userId: log.userId,
        documentId: log.documentId || null,
        signatureId: log.signatureId || null,
      },
    });
  }

  const notifications = [
    { id: 'notif-001', userId: mehmet.id, type: 'SIGNATURE_REQUEST', title: 'İmza Talebi', message: 'Hizmet Sözleşmesi - 2026 belgesi için imza talebiniz var.', data: { documentId: doc1.id } },
    { id: 'notif-002', userId: ayse.id, type: 'DOCUMENT_SIGNED', title: 'Belge İmzalandı', message: 'Gizlilik Sözleşmesi (NDA) belgesi imzalandı.', data: { documentId: doc2.id } },
    { id: 'notif-003', userId: admin.id, type: 'SYSTEM', title: 'Hoş Geldiniz', message: 'SignForge platformuna hoş geldiniz! Yönetim panelinden sistemi yapılandırabilirsiniz.', read: true },
    { id: 'notif-004', userId: fatma.id, type: 'RENEWAL_REMINDER', title: 'Yenileme Hatırlatması', message: 'İş sözleşmesi yenileme tarihi yaklaşıyor.', data: { documentId: doc3.id } },
  ];

  for (const notif of notifications) {
    await prisma.notification.upsert({
      where: { id: notif.id },
      update: {},
      create: {
        id: notif.id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        read: notif.read || false,
        data: notif.data || null,
        userId: notif.userId,
      },
    });
  }

  console.log('Seed işlemi başarıyla tamamlandı.');
  console.log('  - 1 organizasyon oluşturuldu');
  console.log('  - 5 kullanıcı oluşturuldu');
  console.log('  - 4 belge oluşturuldu');
  console.log('  - 3 şablon oluşturuldu');
  console.log('  - 2 imza kaydı oluşturuldu');
  console.log('  - 6 denetim logu oluşturuldu');
  console.log('  - 4 bildirim oluşturuldu');
}

main()
  .catch((error) => {
    console.error('Seed hatası:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
