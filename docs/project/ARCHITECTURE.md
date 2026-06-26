# SignForge — Mimari Belge

## Genel Bakış

SignForge, DocuSign/HelloSign'ın evrimsel bir varyantı olarak tasarlanmış, KVKK uyumlu e-imza ve sözleşme yaşam döngüsü yönetim platformudur. Üç katmanlı bir mimari kullanır: PostgreSQL veritabanı, NestJS API backend ve Next.js frontend.

## Teknoloji Yığını

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| Veritabanı | PostgreSQL | 16 |
| ORM | Prisma | 5.x |
| Backend | NestJS | 10.x |
| Frontend | Next.js (App Router) | 14.x |
| Stil | Tailwind CSS + Stitch Design System | 3.4 |
| Auth | JWT + Passport | - |
| Deployment | Railway (backend) + Vercel (frontend) | - |

## Veritabanı İlişkileri

```
Organization (1) ──┬── (N) User
                   └── (N) Document
                   └── (N) Template

User (1) ──────────┬── (N) Document (owner)
                   ├── (N) Signature (signer)
                   ├── (N) AuditLog
                   ├── (N) Template
                   ├── (N) Notification
                   └── (N) ApiKey

Document (1) ──────┬── (N) Signature
                   ├── (N) SignatureField
                   ├── (N) AuditLog
                   └── (N) DocumentTag

Signature (1) ─────└── (N) AuditLog
```

## Backend Modül Yapısı

```
backend/src/
├── app.module.ts           → Root module (tüm modülleri import eder)
├── main.ts                 → Bootstrap (CORS, prefix, validation)
├── prisma/
│   ├── prisma.module.ts    → Global PrismaService sağlayıcı
│   └── prisma.service.ts   → Prisma Client lifecycle yönetimi
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts  → POST /auth/register, POST /auth/login, GET /auth/profile
│   ├── auth.service.ts     → bcrypt hashing, JWT token üretimi
│   ├── jwt.strategy.ts     → Passport JWT doğrulama
│   ├── jwt-auth.guard.ts   → Route koruma
│   ├── login.dto.ts
│   └── register.dto.ts
├── users/                  → CRUD kullanıcı yönetimi
├── documents/              → Belge CRUD + imza gönderme + risk analizi + takvim + istatistik
├── signatures/             → İmza oluşturma / imzalama / reddetme
├── templates/              → Şablon CRUD + public marketplace
├── audit/                  → Denetim kaydı listeleme / dışa aktarma / KVKK raporu
├── notifications/          → Bildirim listeleme / okundu işaretleme
├── organizations/          → Organizasyon CRUD + üye yönetimi
├── analytics/              → Dashboard istatistikleri
└── health/                 → GET /health sağlık kontrolü
```

## API Endpoint Haritası

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | /api/auth/register | Yeni kullanıcı kaydı | ✗ |
| POST | /api/auth/login | Kullanıcı girişi (@HttpCode 200) | ✗ |
| GET | /api/auth/profile | Profil bilgileri | ✓ |
| GET | /api/health | Sağlık kontrolü | ✗ |
| GET | /api/documents | Belge listesi (filtrelenebilir) | ✓ |
| POST | /api/documents | Yeni belge oluştur | ✓ |
| GET | /api/documents/:id | Belge detayı | ✓ |
| PATCH | /api/documents/:id | Belge güncelle | ✓ |
| DELETE | /api/documents/:id | Belge sil | ✓ |
| POST | /api/documents/:id/send | İmza için gönder | ✓ |
| POST | /api/documents/:id/analyze-risk | AI risk analizi | ✓ |
| GET | /api/documents/calendar | Yaşam döngüsü takvim verisi | ✓ |
| GET | /api/documents/stats | Belge istatistikleri | ✓ |
| GET | /api/signatures | İmza listesi | ✓ |
| POST | /api/signatures | İmza talebi oluştur | ✓ |
| POST | /api/signatures/:id/sign | Belgeyi imzala | ✓ |
| POST | /api/signatures/:id/reject | İmzayı reddet | ✓ |
| GET | /api/templates | Şablon listesi | ✓ |
| POST | /api/templates | Şablon oluştur | ✓ |
| GET | /api/templates/public | Herkese açık şablonlar | ✓ |
| GET | /api/audit | Denetim kayıtları | ✓ |
| GET | /api/audit/export | Dışa aktarma (JSON/CSV) | ✓ |
| GET | /api/audit/kvkk-report | KVKK uyumluluk raporu | ✓ |
| GET | /api/notifications | Bildirimler | ✓ |
| PATCH | /api/notifications/:id/read | Okundu işaretle | ✓ |
| POST | /api/notifications/read-all | Tümünü okundu işaretle | ✓ |
| GET | /api/analytics/overview | Genel istatistikler | ✓ |
| GET | /api/analytics/signing-rate | İmza tamamlama oranları | ✓ |
| GET | /api/analytics/timeline | Zaman çizelgesi verisi | ✓ |
| GET | /api/analytics/department | Departman analizi | ✓ |

## Frontend Sayfa Yapısı

```
frontend/src/app/
├── layout.tsx              → Root layout (DM Sans font, ThemeProvider, AuthProvider)
├── globals.css             → Stitch design tokens + CSS variables
├── page.tsx                → Landing page (Stitch HTML)
├── login/page.tsx          → Giriş sayfası
├── register/page.tsx       → Kayıt sayfası
├── pricing/page.tsx        → Fiyatlandırma sayfası
└── dashboard/
    ├── layout.tsx          → StitchAppShell wrapper (sidebar + header)
    ├── page.tsx            → Ana belgelerim görünümü (Stitch HTML)
    ├── inbox/page.tsx      → İmza gelen kutusu
    ├── templates/page.tsx  → Şablon yönetimi
    ├── calendar/page.tsx   → Sözleşme yaşam döngüsü takvimi
    ├── audit/page.tsx      → KVKK denetim kasası
    ├── analytics/page.tsx  → Analiz dashboard (Stitch HTML)
    └── settings/page.tsx   → Ekip & ayarlar (Stitch HTML)
```

## Stitch Design System Entegrasyonu

Frontend, Google Stitch API üzerinden canlı olarak üretilen tasarım sistemiyle oluşturulmuştur:

1. `stitch-signforge.py` → Stitch API'ye proje oluşturma ve ekran üretme istekleri gönderir
2. `STITCH_DESIGN_SYSTEM.json` → Renk tokenları, font, tema bilgileri
3. `stitch_frontend.py` → Token bazlı layout, theme context, globals.css üretir
4. `stitch_apply_html.py` → Stitch HTML ekranlarını indirir, shell'i ayıklar, sayfalara yazar
5. `stitch-interactions.ts` → DOM olaylarını Next.js route'larına bağlar

### Renk Tokenları

| Token | Değer | Kullanım |
|-------|-------|----------|
| Background | #F5F0E8 | Ana zemin (Warm Parchment) |
| Surface | #FFFFFF | Kart/panel yüzeyi |
| Primary | #5C1A1B | Ana aksam (Deep Burgundy Wine) |
| Secondary | #C8A961 | İkincil aksam (Royal Gold) |
| Success | #2D5016 | Başarı durumu (Forest Green) |

## Güvenlik

- JWT token bazlı kimlik doğrulama (Bearer)
- bcrypt ile şifre hash'leme
- CORS wildcard (*) — production'da daraltılmalı
- class-validator ile DTO doğrulama
- KVKK uyumlu denetim izi (değiştirilemez AuditLog)

## Deployment Akışı

1. `git push` → GitHub Actions CI tetiklenir
2. Backend: PostgreSQL service, migrate, seed, build, test
3. Frontend: npm install, build
4. Main branch push → Provision job tetiklenir
5. Railway: PostgreSQL + NestJS backend otomatik deploy
6. Vercel: Next.js frontend otomatik deploy
