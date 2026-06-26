'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatDate, label, cn } from '@/lib/utils';
import { Calendar, AlertTriangle, Clock, CheckCircle, FileText } from 'lucide-react';

export default function CalendarPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.documents.calendar().then(setDocuments).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const urgencyColor = (date: string) => {
    const days = Math.floor((new Date(date).getTime() - Date.now()) / 86400000);
    if (days < 0) return 'border-destructive/60 bg-destructive/5';
    if (days <= 7) return 'border-red-500/60 bg-red-50 dark:bg-red-950/20';
    if (days <= 30) return 'border-yellow-500/60 bg-yellow-50 dark:bg-yellow-950/20';
    if (days <= 90) return 'border-secondary/60 bg-secondary/5';
    return 'border-border bg-card/40';
  };

  const urgencyBadge = (date: string) => {
    const days = Math.floor((new Date(date).getTime() - Date.now()) / 86400000);
    if (days < 0) return { text: 'Süresi Doldu', color: 'bg-destructive text-white' };
    if (days <= 7) return { text: `${days} gün kaldı`, color: 'bg-red-600 text-white' };
    if (days <= 30) return { text: `${days} gün kaldı`, color: 'bg-yellow-600 text-white' };
    if (days <= 90) return { text: `${days} gün kaldı`, color: 'bg-secondary text-white' };
    return { text: `${days} gün`, color: 'bg-muted text-muted-foreground' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Sözleşme Takvimi</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sözleşme bitiş ve yenileme tarihlerini takip edin</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Bu Hafta', count: documents.filter((d) => { const days = Math.floor((new Date(d.expiresAt || d.renewalDate).getTime() - Date.now()) / 86400000); return days >= 0 && days <= 7; }).length, icon: AlertTriangle, color: 'text-red-500' },
          { label: 'Bu Ay', count: documents.filter((d) => { const days = Math.floor((new Date(d.expiresAt || d.renewalDate).getTime() - Date.now()) / 86400000); return days > 7 && days <= 30; }).length, icon: Clock, color: 'text-yellow-500' },
          { label: '3 Ay İçinde', count: documents.filter((d) => { const days = Math.floor((new Date(d.expiresAt || d.renewalDate).getTime() - Date.now()) / 86400000); return days > 30 && days <= 90; }).length, icon: Calendar, color: 'text-secondary' },
          { label: 'Toplam', count: documents.length, icon: FileText, color: 'text-primary' },
        ].map((stat) => (
          <div key={stat.label} className="surface-card p-5">
            <div className="flex items-center gap-3">
              <stat.icon className={cn('h-5 w-5', stat.color)} />
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">{stat.count}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" /></div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-16 text-center">
          <Calendar className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="font-display text-lg font-semibold text-foreground">Takvim boş</h3>
          <p className="mt-2 text-sm text-muted-foreground">Bitiş veya yenileme tarihi olan belge bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents
            .sort((a, b) => new Date(a.expiresAt || a.renewalDate).getTime() - new Date(b.expiresAt || b.renewalDate).getTime())
            .map((doc) => {
              const date = doc.expiresAt || doc.renewalDate;
              const badge = urgencyBadge(date);
              return (
                <div key={doc.id} className={cn('rounded-xl border p-5 transition-all duration-200', urgencyColor(date))}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.expiresAt ? 'Bitiş' : 'Yenileme'}: {formatDate(date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn('rounded-lg px-3 py-1 text-xs font-medium', badge.color)}>
                        {badge.text}
                      </span>
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {label('documentStatus', doc.status)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
