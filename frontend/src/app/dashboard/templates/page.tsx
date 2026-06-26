'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import { timeAgo } from '@/lib/utils';
import { FolderOpen, Plus, Copy, Trash2, Search } from 'lucide-react';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', content: '', category: 'NDA' });
  const { addToast } = useToast();

  const load = () => {
    api.templates.list().then(setTemplates).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleCreate = async () => {
    try {
      await api.templates.create(form);
      addToast('success', 'Şablon başarıyla oluşturuldu');
      setShowCreate(false);
      setForm({ name: '', description: '', content: '', category: 'NDA' });
      load();
    } catch (err: any) {
      addToast('error', err.message || 'Şablon oluşturulamadı');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.templates.delete(id);
      addToast('info', 'Şablon silindi');
      load();
    } catch (err: any) {
      addToast('error', err.message || 'Şablon silinemedi');
    }
  };

  const categories: Record<string, string> = {
    NDA: 'Gizlilik Sözleşmesi',
    EMPLOYMENT: 'İş Sözleşmesi',
    SALES: 'Satış Sözleşmesi',
    RENTAL: 'Kira Sözleşmesi',
    OTHER: 'Diğer',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Şablonlar</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sözleşme şablonlarınızı yönetin</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> Yeni Şablon
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="font-display text-lg font-bold text-foreground">Yeni Şablon Oluştur</h2>
            <div className="mt-4 space-y-4">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Şablon adı" className="input-field" />
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Açıklama" className="input-field" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                {Object.entries(categories).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Şablon içeriği…" className="input-field min-h-[120px]" rows={5} />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground">İptal</button>
              <button onClick={handleCreate} className="btn-primary">Oluştur</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" /></div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-16 text-center">
          <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="font-display text-lg font-semibold text-foreground">Henüz şablon yok</h3>
          <p className="mt-2 text-sm text-muted-foreground">İlk sözleşme şablonunuzu oluşturun.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div key={t.id} className="surface-card p-5 hover:shadow-accent-glow">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15">
                  <FolderOpen className="h-5 w-5 text-secondary" />
                </div>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {categories[t.category] || t.category}
                </span>
              </div>
              <h3 className="mt-3 font-display text-base font-semibold text-foreground">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{t.description || 'Açıklama yok'}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t.usageCount} kullanım · {timeAgo(t.createdAt)}</span>
                <button onClick={() => handleDelete(t.id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive" aria-label="Sil">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
