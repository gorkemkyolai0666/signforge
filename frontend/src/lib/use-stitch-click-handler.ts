'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StitchActionModal, actionOpensModal, type StitchModalType } from '@/components/stitch-action-modal';
import {
  findStitchClickTarget,
  type StitchActionId,
  type StitchClickTarget,
} from '@/lib/stitch-interactions';
import { useToast } from '@/lib/toast-context';
import { api } from '@/lib/api';

export function useStitchClickHandler(
  containerRef: React.RefObject<HTMLElement | null>,
  domReady = false,
) {
  const router = useRouter();
  const { addToast } = useToast();
  const [modal, setModal] = React.useState<StitchModalType>(null);

  const runAction = React.useCallback(
    async (action: StitchActionId) => {
      const modalType = actionOpensModal(action);
      if (modalType) {
        setModal(modalType);
        return;
      }

      switch (action) {
        case 'create-document':
          addToast('info', 'Yeni belge oluşturuluyor…');
          router.push('/dashboard');
          break;
        case 'upload-document':
          addToast('info', 'Belge yükleme penceresi açıldı');
          break;
        case 'send-signature':
          addToast('info', 'İmza gönderme paneli açıldı');
          break;
        case 'sign-document':
          addToast('success', 'Belge imzalandı');
          break;
        case 'reject-signature':
          addToast('warning', 'İmza reddedildi');
          break;
        case 'analyze-risk':
          addToast('info', 'Risk analizi başlatıldı…');
          break;
        case 'create-template':
          addToast('info', 'Yeni şablon oluşturuluyor…');
          router.push('/dashboard/templates');
          break;
        case 'kvkk-report':
          addToast('success', 'KVKK raporu oluşturuldu');
          break;
        case 'export-audit':
          addToast('info', 'Denetim kaydı dışa aktarılıyor…');
          break;
        case 'invite-member':
          addToast('info', 'Üye davet penceresi açıldı');
          break;
        case 'upgrade-plan':
          addToast('success', 'Plan yükseltme talebi alındı');
          break;
        case 'notifications':
          addToast('info', 'Yeni bildirimleriniz var');
          break;
        case 'search-focus': {
          const input = containerRef.current?.querySelector('input[type="text"]');
          if (input instanceof HTMLInputElement) input.focus();
          break;
        }
        case 'profile':
          router.push('/dashboard/settings');
          break;
        default:
          addToast('success', 'İşlem kaydedildi');
          break;
      }
    },
    [containerRef, router, addToast],
  );

  const handleModalSubmit = React.useCallback(
    async (type: StitchModalType, data: Record<string, string>) => {
      if (type === 'upgrade') {
        addToast('success', 'Plan yükseltme talebi alındı — ekibimiz iletişime geçecek');
        return;
      }
      try {
        if (type === 'create-item') {
          await api.documents.create({
            title: data.title || 'Yeni Belge',
            fileUrl: '/placeholder.pdf',
            fileType: 'pdf',
          });
          addToast('success', 'Belge oluşturuldu');
        } else if (type === 'invite-member') {
          addToast('success', `${data.email || 'Kullanıcı'} davet edildi`);
        } else {
          addToast('success', 'İşlem tamamlandı');
        }
      } catch {
        addToast('success', 'İşlem tamamlandı (demo)');
      }
    },
    [addToast],
  );

  const handleTarget = React.useCallback(
    (target: StitchClickTarget) => {
      if (target.type === 'route') {
        router.push(target.value);
        return;
      }
      if (target.type === 'action') {
        void runAction(target.value);
        return;
      }
      if (target.type === 'hash') {
        const sectionId = target.value.slice(1);
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [router, runAction],
  );

  React.useEffect(() => {
    if (!domReady) return;

    const root = containerRef.current;
    if (!root) return;

    const onClick = (event: MouseEvent) => {
      const clickTarget = findStitchClickTarget(event.target as HTMLElement);
      if (!clickTarget) return;
      event.preventDefault();
      handleTarget(clickTarget);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const clickTarget = findStitchClickTarget(event.target as HTMLElement);
      if (!clickTarget) return;
      event.preventDefault();
      handleTarget(clickTarget);
    };

    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKeyDown);
    return () => {
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKeyDown);
    };
  }, [containerRef, domReady, handleTarget]);

  return { modal, setModal, handleModalSubmit };
}
