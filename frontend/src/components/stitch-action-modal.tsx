'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StitchActionId } from '@/lib/stitch-interactions';

export type StitchModalType = 'create-item' | 'schedule' | 'upgrade' | 'invite-member' | null;

interface StitchActionModalProps {
  modal: StitchModalType;
  onClose: () => void;
  onSubmit: (type: StitchModalType, data: Record<string, string>) => Promise<void>;
}

export function StitchActionModal({ modal, onClose, onSubmit }: StitchActionModalProps) {
  const [title, setTitle] = React.useState('');
  const [scheduledAt, setScheduledAt] = React.useState('');
  const [platform, setPlatform] = React.useState('instagram');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (modal) {
      setTitle('');
      setScheduledAt('');
      setPlatform('instagram');
      setSubmitting(false);
    }
  }, [modal]);

  if (!modal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(modal, { title, scheduledAt, platform });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const titles: Record<Exclude<StitchModalType, null>, string> = {
    'create-item': 'Yeni Kayıt Oluştur',
    schedule: 'Zamanla',
    upgrade: 'Pro Planına Yükselt',
    'invite-member': 'Ekip Üyesi Davet Et',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-label="Kapat"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-white/20 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-primary">{titles[modal]}</h2>
          <button type="button" onClick={onClose} aria-label="Kapat" className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {modal === 'upgrade' ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pro plan ile sınırsız kanal, AI engagement tahmini ve cascade radarına erişin.
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Sınırsız zamanlanmış gönderi</li>
              <li>• Adaptation Inbox otomasyonu</li>
              <li>• KVKK uyumlu denetim izi</li>
            </ul>
            <Button className="w-full" onClick={() => { onSubmit('upgrade', {}); onClose(); }}>
              Pro&apos;ya Geç — ₺549/ay
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {(modal === 'create-item' || modal === 'schedule' || modal === 'invite-member') && (
              <div className="space-y-2">
                <Label htmlFor="stitch-modal-title">
                  {modal === 'invite-member' ? 'E-posta adresi' : 'Başlık / Caption'}
                </Label>
                <Input
                  id="stitch-modal-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={modal === 'invite-member' ? 'ornek@ajans.com' : 'Q3 kampanya lansmanı…'}
                  required
                />
              </div>
            )}
            {modal === 'create-item' && (
              <div className="space-y-2">
                <Label htmlFor="stitch-modal-platform">Platform</Label>
                <select
                  id="stitch-modal-platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="x">X</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
            )}
            {modal === 'schedule' && (
              <div className="space-y-2">
                <Label htmlFor="stitch-modal-datetime">Yayın zamanı</Label>
                <Input
                  id="stitch-modal-datetime"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                İptal
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? 'Kaydediliyor…' : modal === 'schedule' ? 'Zamanla' : 'Oluştur'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function actionOpensModal(action: StitchActionId): StitchModalType {
  if (action === 'schedule' || action === 'schedule-picker') return 'schedule';
  if (action === 'create-item') return 'create-item';
  if (action === 'upgrade') return 'upgrade';
  if (action === 'invite-member') return 'invite-member';
  return null;
}
