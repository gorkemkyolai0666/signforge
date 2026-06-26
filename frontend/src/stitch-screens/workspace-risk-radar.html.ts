/** Auto-generated from Stitch htmlCode — do not edit. */
export const html = `<div class="stitch-page-content p-8 min-h-full w-full overflow-y-auto"><div class="max-w-7xl mx-auto">
<!-- Bento Grid Layout -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-6">
<!-- Left Column (Upload + List) -->
<div class="md:col-span-8 space-y-6 flex flex-col">
<!-- Upload Zone -->
<section class="glass-card rounded-xl p-6 flex-shrink-0">
<div class="flex justify-between items-center mb-4">
<h2 class="font-headline-sm text-headline-sm text-on-surface font-semibold">Yeni Belge Yükle</h2>
<button class="btn-ghost px-3 py-1.5 rounded-md font-body-sm text-body-sm flex items-center hover:bg-secondary/5 transition-colors">
<span class="material-symbols-outlined mr-1 text-[18px]" data-icon="upload_file">upload_file</span> Dosya Seç </button>
</div>
<div class="drag-zone rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer">
<span class="material-symbols-outlined text-[48px] text-secondary/60 mb-4" data-icon="cloud_upload">cloud_upload</span>
<h3 class="font-headline-sm text-headline-sm font-medium text-on-surface mb-2">Sürükle ve Bırak</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant max-w-sm"> PDF, DOCX veya JPG formatındaki hukuki belgelerinizi buraya sürükleyin. Maksimum dosya boyutu 50MB. </p>
</div>
</section>
<!-- Active Documents Table -->
<section class="glass-card rounded-xl p-6 flex-1">
<div class="flex justify-between items-center mb-6">
<h2 class="font-headline-sm text-headline-sm text-on-surface font-semibold">Aktif Belgeler</h2>
<button class="text-secondary font-body-sm text-body-sm font-medium hover:underline">Tümünü Gör</button>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="border-b border-secondary/10">
<th class="font-body-sm text-body-sm font-medium text-on-surface-variant pb-3 pr-4">Belge Adı</th>
<th class="font-body-sm text-body-sm font-medium text-on-surface-variant pb-3 px-4">Durum</th>
<th class="font-body-sm text-body-sm font-medium text-on-surface-variant pb-3 pl-4 text-right">Oluşturulma Tarihi</th>
</tr>
</thead>
<tbody class="font-body-sm text-body-sm text-on-surface">
<tr class="border-b border-secondary/5 hover:bg-surface-container/30 transition-colors group">
<td class="py-4 pr-4">
<div class="flex items-center">
<span class="material-symbols-outlined text-secondary mr-3" data-icon="contract">contract</span>
<span class="font-medium group-hover:text-secondary transition-colors">Gizlilik Sözleşmesi_v2.pdf</span>
</div>
</td>
<td class="py-4 px-4">
<span class="inline-flex items-center px-2.5 py-1 rounded-full font-label-caps text-label-caps status-chip-bekliyor"> Bekliyor </span>
</td>
<td class="py-4 pl-4 text-right font-code-sm text-code-sm text-on-surface-variant"> 24.10.2023 </td>
</tr>
<tr class="border-b border-secondary/5 hover:bg-surface-container/30 transition-colors group">
<td class="py-4 pr-4">
<div class="flex items-center">
<span class="material-symbols-outlined text-secondary mr-3" data-icon="corporate_fare">corporate_fare</span>
<span class="font-medium group-hover:text-secondary transition-colors">Hizmet Alım Sözleşmesi_TechCorp.docx</span>
</div>
</td>
<td class="py-4 px-4">
<span class="inline-flex items-center px-2.5 py-1 rounded-full font-label-caps text-label-caps status-chip-imzalandi"> Imzalandi </span>
</td>
<td class="py-4 pl-4 text-right font-code-sm text-code-sm text-on-surface-variant"> 22.10.2023 </td>
</tr>
<tr class="border-b border-secondary/5 hover:bg-surface-container/30 transition-colors group">
<td class="py-4 pr-4">
<div class="flex items-center">
<span class="material-symbols-outlined text-secondary mr-3" data-icon="warning">warning</span>
<span class="font-medium group-hover:text-secondary transition-colors">Kira Kontratı_MerkezOfis.pdf</span>
</div>
</td>
<td class="py-4 px-4">
<span class="inline-flex items-center px-2.5 py-1 rounded-full font-label-caps text-label-caps status-chip-reddedildi"> Reddedildi </span>
</td>
<td class="py-4 pl-4 text-right font-code-sm text-code-sm text-on-surface-variant"> 20.10.2023 </td>
</tr>
</tbody>
</table>
</div>
</section>
</div>
<!-- Right Column (AI Risk Radar) -->
<div class="md:col-span-4 h-full">
<section class="glass-card rounded-xl p-6 h-full flex flex-col border-l-2 border-l-gold relative overflow-hidden">
<!-- Decorative gradient background -->
<div class="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
<div class="flex items-center justify-between mb-6 relative z-10">
<div class="flex items-center">
<span class="material-symbols-outlined text-gold mr-2 text-[28px]" data-icon="radar">radar</span>
<h2 class="font-headline-sm text-headline-sm text-on-surface font-semibold">AI Risk Radarı</h2>
</div>
<span class="bg-forest text-on-primary px-2 py-1 rounded-md font-label-caps text-label-caps flex items-center">
<span class="material-symbols-outlined text-[14px] mr-1" data-icon="verified_user">verified_user</span> Aktif </span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-6 relative z-10"> Son yüklenen "Gizlilik Sözleşmesi_v2.pdf" belgesindeki maddeler analiz ediliyor. </p>
<!-- Risk Clauses -->
<div class="space-y-4 flex-1 overflow-y-auto relative z-10 pr-2">
<!-- High Risk Card -->
<div class="p-4 rounded-lg bg-surface/50 border border-burgundy shadow-sm relative">
<div class="absolute top-4 right-4 font-code-sm text-code-sm text-burgundy font-bold">94%</div>
<div class="flex items-center mb-2">
<span class="w-2 h-2 rounded-full bg-burgundy mr-2"></span>
<h4 class="font-body-sm text-body-sm font-semibold text-on-surface">Madde 4.2 - Fesih Şartları</h4>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-3 line-clamp-3"> "Taraflardan herhangi biri, hiçbir sebep göstermeksizin sözleşmeyi tek taraflı olarak derhal feshedebilir." </p>
<button class="btn-secondary w-full py-2 rounded-md font-body-sm text-body-sm font-medium hover:opacity-90 transition-opacity"> Alternatif Madde Önerileri </button>
</div>
<!-- Medium Risk Card -->
<div class="p-4 rounded-lg bg-surface/50 border border-gold shadow-sm relative">
<div class="absolute top-4 right-4 font-code-sm text-code-sm text-gold font-bold">68%</div>
<div class="flex items-center mb-2">
<span class="w-2 h-2 rounded-full bg-gold mr-2"></span>
<h4 class="font-body-sm text-body-sm font-semibold text-on-surface">Madde 7.1 - Cezai Şart</h4>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2"> Gecikme halinde uygulanacak cezai şart oranı piyasa standartlarının üzerindedir. Müzakere edilmesi önerilir. </p>
</div>
<!-- Low Risk Card -->
<div class="p-4 rounded-lg bg-surface/50 border border-forest/30 shadow-sm relative">
<div class="absolute top-4 right-4 font-code-sm text-code-sm text-forest font-bold">12%</div>
<div class="flex items-center mb-2">
<span class="w-2 h-2 rounded-full bg-forest mr-2"></span>
<h4 class="font-body-sm text-body-sm font-semibold text-on-surface">Madde 1.1 - Taraflar</h4>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant"> Standart taraf tanımlamaları tespit edildi. Risk bulunmuyor. </p>
</div>
</div>
</section>
</div>
</div>
</div></div>`;
