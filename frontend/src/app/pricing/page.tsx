import Link from 'next/link';
import { FileSignature, Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Başlangıç',
    price: 'Ücretsiz',
    period: '',
    highlight: false,
    items: ['Aylık 5 belge', '1 kullanıcı', 'Temel e-imza', 'E-posta desteği'],
  },
  {
    name: 'Profesyonel',
    price: '₺399',
    period: '/ay',
    highlight: true,
    items: ['Sınırsız belge', '5 kullanıcı', 'AI Risk Radarı', 'Yaşam Döngüsü Takvimi', 'Şablon motoru', 'Öncelikli destek'],
  },
  {
    name: 'İşletme',
    price: '₺999',
    period: '/ay',
    highlight: false,
    items: ['Sınırsız kullanıcı', 'KVKK Denetim Kasası', 'API erişimi', 'SSO entegrasyonu', 'Özel SLA', 'Organizasyon yönetimi'],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-brand-glow">
              <FileSignature className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">SignForge</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Giriş</Link>
            <Link href="/register" className="btn-primary">Ücretsiz Başla <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </header>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-8">
          <h1 className="text-center font-display text-4xl font-bold text-foreground">Basit, şeffaf fiyatlandırma</h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground">
            Her ölçekteki işletme için uygun plan. Kredi kartı gerektirmez.
          </p>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className={`surface-card p-8 ${p.highlight ? 'border-primary/40 ring-2 ring-primary/20' : ''}`}>
                {p.highlight && (
                  <span className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    En Popüler
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-foreground">{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-foreground">{p.price}</span>
                  <span className="text-muted-foreground">{p.period}</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 ${
                    p.highlight
                      ? 'bg-primary text-primary-foreground shadow-brand-glow hover:opacity-90'
                      : 'border border-primary/40 text-primary hover:border-primary/60'
                  }`}
                >
                  Başla
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card/40 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 SignForge — SignForge Teknoloji A.Ş. · demo@signforge.com.tr</p>
      </footer>
    </div>
  );
}
