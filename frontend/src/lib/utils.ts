import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LABELS: Record<string, Record<string, string>> = {
  userRole: {
    ADMIN: 'Yönetici',
    MANAGER: 'Müdür',
    SIGNER: 'İmzacı',
    VIEWER: 'İzleyici',
    USER: 'Kullanıcı',
  },
  documentStatus: {
    DRAFT: 'Taslak',
    PENDING: 'İmza Bekliyor',
    PARTIALLY_SIGNED: 'Kısmen İmzalı',
    COMPLETED: 'Tamamlandı',
    REJECTED: 'Reddedildi',
    EXPIRED: 'Süresi Doldu',
    CANCELLED: 'İptal Edildi',
  },
  signatureStatus: {
    PENDING: 'Bekliyor',
    SIGNED: 'İmzalandı',
    REJECTED: 'Reddedildi',
    EXPIRED: 'Süresi Doldu',
  },
  planType: {
    FREE: 'Başlangıç',
    PROFESSIONAL: 'Profesyonel',
    ENTERPRISE: 'İşletme',
  },
};

export function label(category: string, key: string): string {
  return LABELS[category]?.[key] ?? key;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Az önce';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} dk önce`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} saat önce`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} gün önce`;
  return formatDate(date);
}
