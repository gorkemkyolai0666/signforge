# SignForge — Ürün Gereksinim Belgesi (PRD)

## Ürün Vizyonu

SignForge, DocuSign'ın küresel e-imza ve sözleşme yönetim platformunun evrimsel bir varyantıdır. Türk KOBİ'leri ve kurumsal şirketleri için tasarlanmış, KVKK uyumlu, yapay zekâ destekli sözleşme yaşam döngüsü yönetim platformudur.

## Problem Tanımı

Türkiye'deki işletmeler sözleşme süreçlerinde ciddi sorunlar yaşamaktadır:
- Islak imza bağımlılığı nedeniyle sözleşme tamamlama süresi ortalama 5-7 gün
- Sözleşme yenileme ve bitiş tarihlerinin takipsizliğinden kaynaklanan gelir kayıpları
- KVKK uyumlu belge saklama ve denetim izi eksikliği
- Sözleşmelerdeki riskli maddelerin gözden kaçırılması

## Hedef Kitle

1. **Birincil**: 10-500 çalışanlı Türk KOBİ'ler (satış, İK, hukuk departmanları)
2. **İkincil**: Hukuk büroları ve serbest avukatlar
3. **Üçüncül**: Enterprise kurumlar (banka, sigorta, telekomünikasyon)

## Temel Özellikler

### 1. Belge Yönetimi & E-İmza
- Sürükle-bırak belge yükleme (PDF, DOCX, görüntü)
- İmza alanı yerleştirme editörü
- Çoklu imzacı iş akışları (sıralı ve paralel)
- Mobil uyumlu imza deneyimi
- İmza durumu takibi (bekliyor, tamamlandı, reddedildi, süresi doldu)

### 2. Sözleşme Şablon Motoru
- Hazır sözleşme şablonları (NDA, iş sözleşmesi, satış, kira)
- Değişken alan tanımlama ({şirket_adı}, {tarih}, {tutar})
- Şablon versiyon kontrolü
- Şablon paylaşım ve marketplace

### 3. AI Sözleşme Risk Radarı (Mutasyon 1)
- Yüklenen sözleşmenin otomatik madde analizi
- Risk skorlama: düşük/orta/yüksek/kritik
- Riskli madde vurgulama ve açıklama
- Alternatif madde önerisi

### 4. Sözleşme Yaşam Döngüsü Takvimi (Mutasyon 2)
- Tüm sözleşmelerin görsel takvim gösterimi
- Otomatik yenileme hatırlatmaları
- Deadline bazlı bildirim zinciri
- Mali etki analizi (kaçırılan deadline maliyeti)

### 5. KVKK Denetim Kasası (Mutasyon 3)
- Değiştirilemez imza denetim izi
- IP, zaman damgası, cihaz bilgisi kaydı
- KVKK onay ve açık rıza kaydı
- Yasal uyumluluk raporu dışa aktarma

### 6. Ekip & Organizasyon Yönetimi
- Rol bazlı erişim kontrolü (Admin, Yönetici, İmzacı, İzleyici)
- Departman bazlı belge organizasyonu
- Aktivite günlüğü ve denetim raporu
- API anahtarı yönetimi

## Teknik Yığın

- **Backend**: NestJS, Prisma ORM, PostgreSQL
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Altyapı**: Railway (backend + PostgreSQL), Vercel (frontend)

## Tasarım Kimliği

- **Renk Paleti**: Deep Burgundy Wine (#5C1A1B) ana zemin, Warm Parchment (#F5F0E8) yüzey, Royal Gold (#C8A961) aksam, Forest Green (#2D5016) ikincil
- **Tema**: Açık mod birincil — zarif, premium, hukuki güven hissi
- **Tipografi**: DM Sans (başlık), Inter (gövde), JetBrains Mono (kod/tarih)
- **Benzersiz DNA**: Önceki projelerin koyu (zinc/slate/navy) tonlarından tam ayrım — sıcak, otantik parchment/wine estetik

## Başarı Metrikleri

- İlk 90 gün: 200+ kayıtlı kullanıcı
- 6. ay: 50+ ücretli abonelik
- İlk yıl: ₺150.000+ MRR
