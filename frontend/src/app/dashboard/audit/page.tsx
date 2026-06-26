'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatDateTime, cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import { Shield, Download, FileText, Search, ChevronDown, ChevronUp } from 'lucide-react';

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    api.audit.list().then(setLogs).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleExport = async (format: string) => {
    try {
      const data = await api.audit.export(format);
      addToast('success', `Denetim kaydı ${format.toUpperCase()} olarak dışa aktarıldı`);
    } catch (err: any) {
      addToast('error', err.message || 'Dışa aktarma başarısız');
    }
  };

  const handleKvkkReport = async () => {
    try {
      const report = await api.audit.kvkkReport();
      addToast('success', `KVKK raporu oluşturuldu — ${report.totalEvents || 0} olay`);
    } catch (err: any) {
      addToast('error', err.message || 'KVKK raporu oluşturulamadı');
    }
  };

  const actionLabels: Record<string, string> = {
    DOCUMENT_CREATED: 'Belge Oluşturuldu',
    DOCUMENT_SENT: 'Belge Gönderildi',
    DOCUMENT_SIGNED: 'Belge İmzalandı',
    DOCUMENT_REJECTED: 'İmza Reddedildi',
    DOCUMENT_VIEWED: 'Belge Görüntülendi',
    USER_LOGIN: 'Kullanıcı Girişi',
    USER_REGISTER: 'Kullanıcı Kaydı',
    TEMPLATE_CREATED: 'Şablon Oluşturuldu',
    RISK_ANALYSIS: 'Risk Analizi',
    SIGNATURE_REQUESTED: 'İmza Talep Edildi',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">KVKK Denetim Kasası</h1>
          <p className="mt-1 text-sm text-muted-foreground">Değiştirilemez imza ve işlem denetim izi</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('json')} className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
            <Download className="h-4 w-4" /> JSON
          </button>
          <button onClick={handleKvkkReport} className="btn-primary">
            <Shield className="h-4 w-4" /> KVKK Raporu
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" /></div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-16 text-center">
          <Shield className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="font-display text-lg font-semibold text-foreground">Denetim kaydı boş</h3>
          <p className="mt-2 text-sm text-muted-foreground">Henüz kayıtlı işlem bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="surface-card overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{actionLabels[log.action] || log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.user?.name || 'Sistem'} · {formatDateTime(log.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {log.kvkkConsent && (
                    <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      KVKK Onaylı
                    </span>
                  )}
                  {expandedId === log.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>
              {expandedId === log.id && (
                <div className="border-t border-border bg-muted/30 p-4">
                  <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <span className="text-xs font-medium uppercase text-muted-foreground">IP Adresi</span>
                      <p className="mt-0.5 font-mono text-foreground">{log.ipAddress || '—'}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase text-muted-foreground">Kullanıcı Ajanı</span>
                      <p className="mt-0.5 truncate text-foreground">{log.userAgent || '—'}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase text-muted-foreground">Konum</span>
                      <p className="mt-0.5 text-foreground">{log.geoLocation || '—'}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase text-muted-foreground">Belge</span>
                      <p className="mt-0.5 text-foreground">{log.document?.title || '—'}</p>
                    </div>
                  </div>
                  {log.details && (
                    <div className="mt-3">
                      <span className="text-xs font-medium uppercase text-muted-foreground">Detaylar</span>
                      <pre className="mt-1 overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs text-muted-foreground">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
