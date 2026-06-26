'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { cn, label, timeAgo } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import { Inbox, Check, X, Clock, FileText, Search } from 'lucide-react';

export default function InboxPage() {
  const [signatures, setSignatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const { addToast } = useToast();

  useEffect(() => {
    api.signatures.list().then(setSignatures).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSign = async (id: string) => {
    try {
      await api.signatures.sign(id, { kvkkConsent: true });
      addToast('success', 'Belge başarıyla imzalandı');
      const updated = await api.signatures.list();
      setSignatures(updated);
    } catch (err: any) {
      addToast('error', err.message || 'İmzalama başarısız');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.signatures.reject(id, 'İmzacı tarafından reddedildi');
      addToast('info', 'İmza talebi reddedildi');
      const updated = await api.signatures.list();
      setSignatures(updated);
    } catch (err: any) {
      addToast('error', err.message || 'İşlem başarısız');
    }
  };

  const filtered = filter === 'ALL' ? signatures : signatures.filter((s) => s.status === filter);
  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    SIGNED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    EXPIRED: 'bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Gelen Kutusu</h1>
          <p className="mt-1 text-sm text-muted-foreground">İmza bekleyen ve tamamlanan belgeleriniz</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {['ALL', 'PENDING', 'SIGNED', 'REJECTED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
              filter === s ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-primary/5'
            )}
          >
            {s === 'ALL' ? 'Tümü' : label('signatureStatus', s)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-16 text-center">
          <Inbox className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="font-display text-lg font-semibold text-foreground">Gelen kutunuz boş</h3>
          <p className="mt-2 text-sm text-muted-foreground">Henüz imza bekleyen belgeniz bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sig) => (
            <div key={sig.id} className="surface-card flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{sig.document?.title || 'Belge'}</p>
                  <p className="text-sm text-muted-foreground">
                    {sig.signerEmail} · {timeAgo(sig.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn('rounded-lg px-3 py-1 text-xs font-medium', statusColors[sig.status])}>
                  {label('signatureStatus', sig.status)}
                </span>
                {sig.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSign(sig.id)}
                      className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700"
                    >
                      <Check className="h-3.5 w-3.5" /> İmzala
                    </button>
                    <button
                      onClick={() => handleReject(sig.id)}
                      className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" /> Reddet
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
