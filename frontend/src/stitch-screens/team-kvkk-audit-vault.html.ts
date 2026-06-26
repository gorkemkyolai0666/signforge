/** Auto-generated from Stitch htmlCode — do not edit. */
export const html = `<div class="stitch-page-content p-8 min-h-full w-full overflow-y-auto"><div class="max-w-7xl mx-auto space-y-section-gap">
<!-- Page Header -->
<div>
<h2 class="font-headline-lg text-headline-lg text-secondary mb-2">Gelişmiş Ekip Yönetimi</h2>
<p class="font-body-md text-body-md text-on-surface-variant">Sistem erişim rollerini, API entegrasyonlarını ve güvenlik denetim kayıtlarını buradan yönetin.</p>
</div>
<!-- Bento Grid Layout -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
<!-- User Management Table (Span 8) -->
<div class="col-span-1 md:col-span-8 glass-panel rounded-xl border border-secondary/10 p-6 flex flex-col">
<div class="flex justify-between items-center mb-6">
<h3 class="font-headline-sm text-headline-sm text-on-surface">Aktif Kullanıcılar &amp; Roller</h3>
<button class="text-secondary hover:text-on-secondary-container font-body-sm text-body-sm font-semibold flex items-center gap-1 transition-colors duration-200">
<span class="material-symbols-outlined text-sm">person_add</span> Kullanıcı Ekle </button>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="border-b border-secondary/10">
<th class="pb-3 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Kullanıcı</th>
<th class="pb-3 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Departman</th>
<th class="pb-3 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Rol</th>
<th class="pb-3 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">İşlem</th>
</tr>
</thead>
<tbody class="font-body-sm text-body-sm divide-y divide-secondary/5">
<tr class="hover:bg-surface-container-low/50 transition-colors duration-200">
<td class="py-4 flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-bold text-xs">AE</div>
<span class="font-semibold text-on-surface">Av. Ahmet Erdem</span>
</td>
<td class="py-4 text-on-surface-variant">Hukuk Müşavirliği</td>
<td class="py-4"><span class="inline-block px-2 py-1 rounded bg-secondary- text-on-secondary- font-code-sm text-code-sm">Admin</span></td>
<td class="py-4 text-right">
<button class="text-on-surface-variant hover:text-secondary transition-colors"><span class="material-symbols-outlined text-sm">more_vert</span></button>
</td>
</tr>
<tr class="hover:bg-surface-container-low/50 transition-colors duration-200">
<td class="py-4 flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs">BK</div>
<span class="font-semibold text-on-surface">Banu Kaya</span>
</td>
<td class="py-4 text-on-surface-variant">İnsan Kaynakları</td>
<td class="py-4"><span class="inline-block px-2 py-1 rounded bg-surface-container-high text-on-surface font-code-sm text-code-sm">Yonetici</span></td>
<td class="py-4 text-right">
<button class="text-on-surface-variant hover:text-secondary transition-colors"><span class="material-symbols-outlined text-sm">more_vert</span></button>
</td>
</tr>
<tr class="hover:bg-surface-container-low/50 transition-colors duration-200">
<td class="py-4 flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs">CY</div>
<span class="font-semibold text-on-surface">Can Yılmaz</span>
</td>
<td class="py-4 text-on-surface-variant">Satış</td>
<td class="py-4"><span class="inline-block px-2 py-1 rounded border border-tertiary--dim text-tertiary font-code-sm text-code-sm bg-tertiary-container/30">Imzaci</span></td>
<td class="py-4 text-right">
<button class="text-on-surface-variant hover:text-secondary transition-colors"><span class="material-symbols-outlined text-sm">more_vert</span></button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<!-- KVKK Audit Vault (Span 4) -->
<div class="col-span-1 md:col-span-4 glass-panel rounded-xl border border-secondary/10 p-6 flex flex-col relative overflow-hidden">
<!-- Decorative subtle gradient -->
<div class="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
<div class="flex items-center gap-2 mb-6">
<span class="material-symbols-outlined text-secondary">security</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface">KVKK Denetim Kasası</h3>
</div>
<div class="space-y-4 flex-1">
<!-- Audit Item 1 -->
<div class="p-4 rounded-lg border border-secondary/5 bg-surface-container-lowest/50 hover:border-secondary/20 transition-all duration-200">
<div class="flex justify-between items-start mb-2">
<span class="font-code-sm text-code-sm text-on-surface-variant">IP: 192.168.1.45</span>
<span class="inline-flex items-center px-2 py-0.5 rounded font-label-caps text-label-caps" style="background-color: #2D5016; color: white;">UYUMLU</span>
</div>
<div class="font-code-sm text-code-sm text-secondary mb-1">2023-10-27T14:32:01Z</div>
<div class="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">location_on</span> İstanbul, TR </div>
</div>
<!-- Audit Item 2 -->
<div class="p-4 rounded-lg border border-secondary/5 bg-surface-container-lowest/50 hover:border-secondary/20 transition-all duration-200">
<div class="flex justify-between items-start mb-2">
<span class="font-code-sm text-code-sm text-on-surface-variant">IP: 88.240.12.99</span>
<span class="inline-flex items-center px-2 py-0.5 rounded font-label-caps text-label-caps" style="background-color: #2D5016; color: white;">UYUMLU</span>
</div>
<div class="font-code-sm text-code-sm text-secondary mb-1">2023-10-27T09:15:44Z</div>
<div class="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">location_on</span> Ankara, TR </div>
</div>
</div>
<button class="mt-4 w-full py-2 border border-secondary text-secondary rounded-lg font-body-sm text-body-sm hover:bg-secondary/5 transition-colors duration-200"> Tüm Kayıtları İndir (PDF) </button>
</div>
<!-- Settings: API & SSO (Span 12) -->
<div class="col-span-1 md:col-span-12 glass-panel rounded-xl border border-secondary/10 p-6">
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-6">Entegrasyon &amp; Güvenlik</h3>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
<!-- API Keys -->
<div>
<h4 class="font-body-md text-body-md font-semibold text-on-surface mb-4 border-b border-secondary/10 pb-2">API Anahtarları</h4>
<div class="space-y-3">
<div class="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-secondary/5">
<div>
<div class="font-body-sm text-body-sm font-semibold text-on-surface">Üretim Ortamı (Production)</div>
<div class="font-code-sm text-code-sm text-on-surface-variant mt-1">sk_live_51Nx...<span class="blur-sm select-none">89aB2</span></div>
</div>
<button class="text-on-surface-variant hover:text-secondary transition-colors" title="Kopyala">
<span class="material-symbols-outlined text-sm">content_copy</span>
</button>
</div>
<button class="text-secondary font-body-sm text-body-sm hover:underline underline-offset-2 flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">add_circle</span> Yeni Anahtar Üret </button>
</div>
</div>
<!-- SSO Config -->
<div>
<h4 class="font-body-md text-body-md font-semibold text-on-surface mb-4 border-b border-secondary/10 pb-2">SSO (Tek Oturum Açma)</h4>
<div class="space-y-4">
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded border border-secondary/20 flex items-center justify-center bg-surface-container-lowest">
<span class="material-symbols-outlined text-tertiary">domain</span>
</div>
<div>
<div class="font-body-sm text-body-sm font-semibold text-on-surface">SAML 2.0 / Azure AD</div>
<div class="font-label-caps text-label-caps text-on-surface-variant mt-0.5">Yapılandırılmadı</div>
</div>
</div>
<button class="px-3 py-1.5 border border-secondary/20 text-on-surface rounded font-body-sm text-body-sm hover:bg-surface-container-high transition-colors"> Ayarla </button>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-3 rounded-lg border-l-2 border-tertiary--dim"> Kurumsal SSO entegrasyonu, şirket politikalarınız doğrultusunda güvenli erişim sağlar. Detaylar için IT yöneticinizle iletişime geçin. </p>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- Minimal Footer inside content area to maintain canvas priority -->
<footer class="mt-section-gap py-6 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center text-on-surface-variant font-body-sm text-body-sm max-w-7xl mx-auto">
<div>© 2024 SignForge Legal-Tech. Tüm Hakları Saklıdır. KVKK Uyumlu.</div>
<div class="flex gap-4 mt-2 md:mt-0">
<a class="hover:text-secondary transition-colors" href="#">Gizlilik Politikası</a>
<a class="hover:text-secondary transition-colors" href="#">Kullanım Koşulları</a>
</div>
</footer></div>`;
