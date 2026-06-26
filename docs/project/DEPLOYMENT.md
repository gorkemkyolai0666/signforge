# SignForge — Deployment Belgesi

## Altyapı Bileşenleri

| Bileşen | Platform | URL Deseni |
|---------|----------|------------|
| Backend API | Railway | https://signforge-backend-production.up.railway.app |
| PostgreSQL | Railway (eklenti) | Internal connection |
| Frontend | Vercel | https://signforge.vercel.app |

## Ortam Değişkenleri

### Backend (Railway)
| Değişken | Açıklama | Kaynak |
|----------|----------|--------|
| DATABASE_URL | PostgreSQL bağlantı dizesi | Railway Postgres eklentisi |
| JWT_SECRET | JWT token imza anahtarı | GitHub Secret |
| PORT | Sunucu portu | 8080 (Railway default) |
| FRONTEND_URL | Frontend domain | https://signforge.vercel.app |

### Frontend (Vercel)
| Değişken | Açıklama | Kaynak |
|----------|----------|--------|
| NEXT_PUBLIC_API_URL | Backend API adresi | Provision script |

## Deployment Adımları

### 1. Otomatik (CI/CD)
```bash
git push origin main
```
GitHub Actions CI tetiklenir:
1. Backend: migrate → seed → build → test
2. Frontend: install → build
3. Provision: Railway + Vercel otomatik kurulum

### 2. Manuel Backend Deploy (Railway)
```bash
cd backend
npm install --legacy-peer-deps
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run build
npm run start:prod
```

### 3. Manuel Frontend Deploy (Vercel)
```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=https://signforge-backend-production.up.railway.app/api npm run build
npm run start
```

## Gerekli Secrets (GitHub Actions)

| Secret | Açıklama |
|--------|----------|
| GH_PAT | GitHub Personal Access Token |
| RAILWAY_API_TOKEN | Railway API erişim token'ı |
| VERCEL_TOKEN | Vercel erişim token'ı |
| JWT_SECRET | JWT imza anahtarı |
| STITCH_API_KEY | Google Stitch API anahtarı |

## Sağlık Kontrolü

```bash
curl https://signforge-backend-production.up.railway.app/api/health
# Beklenen: { "status": "ok", "timestamp": "..." }
```

## Harici Entegrasyon Noktaları (Opsiyonel)

Tam production aktivasyonu için aşağıdaki credential'lar gereklidir:

| Servis | Değişken | Amaç |
|--------|----------|------|
| OpenAI | OPENAI_API_KEY | AI risk radarı (sözleşme analizi) |
| Stripe/iyzico | STRIPE_SECRET_KEY | Ödeme işleme |
| SMTP | SMTP_HOST, SMTP_USER, SMTP_PASS | E-posta bildirimleri |
| SMS Gateway | SMS_GATE_API_KEY | SMS bildirimleri |
