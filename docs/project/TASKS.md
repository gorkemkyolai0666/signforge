# SignForge — Görev Listesi

## Tamamlanan Görevler

### Backend
- [x] NestJS proje yapısı kurulumu
- [x] Prisma şeması (10 model: User, Organization, Document, SignatureField, Signature, Template, AuditLog, DocumentTag, Notification, ApiKey)
- [x] JWT kimlik doğrulama (register/login/profile)
- [x] Belge CRUD + durum geçişleri
- [x] İmza oluşturma/imzalama/reddetme iş akışı
- [x] Şablon CRUD + herkese açık marketplace
- [x] Denetim kaydı (liste/dışa aktarma/KVKK raporu)
- [x] Bildirim sistemi
- [x] Organizasyon yönetimi
- [x] Analitik dashboard istatistikleri
- [x] Sağlık kontrolü endpoint'i
- [x] CORS wildcard yapılandırması
- [x] Idempotent seed verisi (Türkçe içerikli)
- [x] Railway deploy yapılandırması (Procfile, nixpacks.toml)

### Frontend
- [x] Next.js 14 App Router yapısı
- [x] Stitch API ile design system üretimi
- [x] Stitch HTML ekranlarının indirilip sayfalara yerleştirilmesi
- [x] Stitch shell (sidebar + header) ayrıştırma
- [x] Landing page (Stitch HTML)
- [x] Dashboard sayfaları (Stitch HTML + React)
- [x] Login/Register sayfaları
- [x] Fiyatlandırma sayfası
- [x] Gelen Kutusu (imza listesi, imzala/reddet)
- [x] Şablon yönetimi (CRUD + modal)
- [x] Sözleşme takvimi (urgency renklendirme)
- [x] KVKK denetim kasası (genişletilebilir satırlar)
- [x] Toast bildirim sistemi
- [x] Tema bağlamı (light/dark)
- [x] Auth bağlamı
- [x] API istemci katmanı
- [x] Stitch etkileşim katmanı (route/action mapping)
- [x] Tailwind CSS + Stitch token entegrasyonu

### Altyapı
- [x] CI/CD pipeline (GitHub Actions)
- [x] Entegrasyon testleri
- [x] Proje kuyruk dosyası (signforge.json)
- [x] Ortam değişkenleri yapılandırması

## Bekleyen Görevler
- [ ] OpenAI/Gemini risk analizi entegrasyonu
- [ ] Gerçek dijital imza canvas'ı
- [ ] E-posta bildirim sistemi
- [ ] Ödeme entegrasyonu (Stripe/iyzico)
- [ ] Railway + Vercel deployment
