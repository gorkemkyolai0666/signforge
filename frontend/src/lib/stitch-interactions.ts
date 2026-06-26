'use client';

/** Sidebar / header icon → Next.js route (Material Symbols icon mapping). */
export const STITCH_ROUTE_BY_ICON: Record<string, string> = {
  dashboard: '/dashboard',
  workspaces: '/dashboard',
  work: '/dashboard',
  description: '/dashboard',
  edit_document: '/dashboard',
  draw: '/dashboard',
  analytics: '/dashboard/analytics',
  insights: '/dashboard/analytics',
  bar_chart: '/dashboard/analytics',
  trending_up: '/dashboard/analytics',
  settings: '/dashboard/settings',
  manage_accounts: '/dashboard/settings',
  tune: '/dashboard/settings',
  visibility: '/',
  home: '/',
  inbox: '/dashboard/inbox',
  all_inbox: '/dashboard/inbox',
  mail: '/dashboard/inbox',
  send: '/dashboard/inbox',
  mark_email_read: '/dashboard/inbox',
  group: '/dashboard/settings',
  groups: '/dashboard/settings',
  people: '/dashboard/settings',
  person: '/dashboard/settings',
  account_circle: '/dashboard/settings',
  folder: '/dashboard/templates',
  folder_open: '/dashboard/templates',
  note_add: '/dashboard/templates',
  calendar_month: '/dashboard/calendar',
  event: '/dashboard/calendar',
  date_range: '/dashboard/calendar',
  schedule: '/dashboard/calendar',
  shield: '/dashboard/audit',
  security: '/dashboard/audit',
  verified_user: '/dashboard/audit',
  gavel: '/dashboard/audit',
  help: '/dashboard/settings',
  contact_support: '/dashboard/settings',
  play_circle: '/login',
  arrow_forward: '/register',
  login: '/login',
  person_add: '/register',
};

/** Link / button label → route (normalized lowercase). */
export const STITCH_ROUTE_BY_TEXT: Record<string, string> = {
  workspace: '/dashboard',
  dashboard: '/dashboard',
  'ana sayfa': '/dashboard',
  belgelerim: '/dashboard',
  belgeler: '/dashboard',
  documents: '/dashboard',
  'my documents': '/dashboard',
  analytics: '/dashboard/analytics',
  analiz: '/dashboard/analytics',
  metrics: '/dashboard/analytics',
  rapor: '/dashboard/analytics',
  raporlar: '/dashboard/analytics',
  reports: '/dashboard/analytics',
  'renewal radar': '/dashboard/analytics',
  'yenileme radarı': '/dashboard/analytics',
  settings: '/dashboard/settings',
  ayarlar: '/dashboard/settings',
  'team settings': '/dashboard/settings',
  'ekip ayarları': '/dashboard/settings',
  ekip: '/dashboard/settings',
  team: '/dashboard/settings',
  members: '/dashboard/settings',
  üyeler: '/dashboard/settings',
  inbox: '/dashboard/inbox',
  'gelen kutusu': '/dashboard/inbox',
  imzalar: '/dashboard/inbox',
  signatures: '/dashboard/inbox',
  'imza bekleyen': '/dashboard/inbox',
  templates: '/dashboard/templates',
  şablonlar: '/dashboard/templates',
  'template library': '/dashboard/templates',
  takvim: '/dashboard/calendar',
  calendar: '/dashboard/calendar',
  'sözleşme takvimi': '/dashboard/calendar',
  'contract calendar': '/dashboard/calendar',
  denetim: '/dashboard/audit',
  audit: '/dashboard/audit',
  'denetim kasası': '/dashboard/audit',
  'audit vault': '/dashboard/audit',
  kvkk: '/dashboard/audit',
  'kvkk raporu': '/dashboard/audit',
  profil: '/dashboard/settings',
  profile: '/dashboard/settings',
  'giriş yap': '/login',
  login: '/login',
  'sign in': '/login',
  kayıt: '/register',
  register: '/register',
  'sign up': '/register',
  'ücretsiz başla': '/register',
  'get started': '/register',
  fiyatlandırma: '/pricing',
  pricing: '/pricing',
};

/** Action text → action ID for modals and handlers. */
export const STITCH_ACTION_BY_TEXT: Record<string, string> = {
  'yeni belge': 'create-document',
  'new document': 'create-document',
  'belge oluştur': 'create-document',
  'create document': 'create-document',
  'belge yükle': 'upload-document',
  upload: 'upload-document',
  yükle: 'upload-document',
  'yeni şablon': 'create-template',
  'new template': 'create-template',
  'şablon oluştur': 'create-template',
  'imza gönder': 'send-signature',
  'send for signing': 'send-signature',
  imzala: 'sign-document',
  sign: 'sign-document',
  reddet: 'reject-signature',
  reject: 'reject-signature',
  'risk analizi': 'analyze-risk',
  'risk analysis': 'analyze-risk',
  'kvkk raporu': 'kvkk-report',
  'kvkk report': 'kvkk-report',
  'dışa aktar': 'export-audit',
  export: 'export-audit',
  'üye davet et': 'invite-member',
  'invite member': 'invite-member',
  'plan yükselt': 'upgrade-plan',
  upgrade: 'upgrade-plan',
};

export function wireStitchDom(container: HTMLElement | null): void {
  if (!container) return;

  const allClickables = container.querySelectorAll<HTMLElement>(
    'a, button, [role="button"], [role="link"], [onclick]'
  );

  allClickables.forEach((el) => {
    const iconEl = el.querySelector('.material-symbols-outlined, .material-icons');
    const iconText = iconEl?.textContent?.trim().toLowerCase() ?? '';

    const labelText = (el.textContent ?? '').trim().toLowerCase();
    const href = el.getAttribute('href') ?? '';

    if (iconText && STITCH_ROUTE_BY_ICON[iconText]) {
      el.setAttribute('data-stitch-route', STITCH_ROUTE_BY_ICON[iconText]);
      return;
    }

    for (const [text, route] of Object.entries(STITCH_ROUTE_BY_TEXT)) {
      if (labelText.includes(text)) {
        el.setAttribute('data-stitch-route', route);
        return;
      }
    }

    for (const [text, actionId] of Object.entries(STITCH_ACTION_BY_TEXT)) {
      if (labelText.includes(text)) {
        el.setAttribute('data-stitch-action', actionId);
        return;
      }
    }

    if (href === '#' || href.startsWith('#')) {
      const section = href.slice(1);
      if (section) {
        const sectionRoute = STITCH_ROUTE_BY_TEXT[section.toLowerCase()];
        if (sectionRoute) {
          el.setAttribute('data-stitch-route', sectionRoute);
        }
      }
    }
  });
}

export type StitchActionId = string;

export interface StitchClickTarget {
  type: 'route' | 'action' | 'hash';
  value: string;
}

export function findStitchClickTarget(el: HTMLElement): StitchClickTarget | null {
  let current: HTMLElement | null = el;
  while (current) {
    const route = current.getAttribute('data-stitch-route');
    if (route) return { type: 'route', value: route };
    const action = current.getAttribute('data-stitch-action');
    if (action) return { type: 'action', value: action };
    const href = current.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      return { type: 'hash', value: href };
    }
    if (href && href !== '#' && !href.startsWith('javascript:')) {
      return { type: 'route', value: href };
    }
    current = current.parentElement;
  }
  return null;
}

export function applyStitchNavActiveState(
  container: HTMLElement | null,
  currentPath: string
): void {
  if (!container) return;

  container.querySelectorAll<HTMLElement>('[data-stitch-route]').forEach((el) => {
    const route = el.getAttribute('data-stitch-route') ?? '';
    const isActive =
      currentPath === route ||
      (route !== '/dashboard' && currentPath.startsWith(route));

    el.classList.toggle('bg-primary/15', isActive);
    el.classList.toggle('text-primary', isActive);
    el.classList.toggle('font-semibold', isActive);
  });
}
