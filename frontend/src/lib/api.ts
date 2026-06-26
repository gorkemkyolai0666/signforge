export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4020/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('signforge_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `API error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; name: string }) =>
      request<{ access_token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<{ access_token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    profile: () => request<{ id: string; email: string; name: string; role: string }>('/auth/profile'),
  },
  documents: {
    list: (params?: string) => request<any[]>(`/documents${params ? `?${params}` : ''}`),
    get: (id: string) => request<any>(`/documents/${id}`),
    create: (data: any) => request<any>('/documents', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/documents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/documents/${id}`, { method: 'DELETE' }),
    send: (id: string, signers: string[]) =>
      request<any>(`/documents/${id}/send`, { method: 'POST', body: JSON.stringify({ signerEmails: signers }) }),
    analyzeRisk: (id: string) => request<any>(`/documents/${id}/analyze-risk`, { method: 'POST' }),
    calendar: () => request<any[]>('/documents/calendar'),
    stats: () => request<any>('/documents/stats'),
  },
  signatures: {
    list: () => request<any[]>('/signatures'),
    get: (id: string) => request<any>(`/signatures/${id}`),
    sign: (id: string, data?: any) =>
      request<any>(`/signatures/${id}/sign`, { method: 'POST', body: JSON.stringify(data || {}) }),
    reject: (id: string, reason?: string) =>
      request<any>(`/signatures/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  },
  templates: {
    list: () => request<any[]>('/templates'),
    public: () => request<any[]>('/templates/public'),
    get: (id: string) => request<any>(`/templates/${id}`),
    create: (data: any) => request<any>('/templates', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/templates/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/templates/${id}`, { method: 'DELETE' }),
  },
  audit: {
    list: (params?: string) => request<any[]>(`/audit${params ? `?${params}` : ''}`),
    export: (format?: string) => request<any>(`/audit/export${format ? `?format=${format}` : ''}`),
    kvkkReport: () => request<any>('/audit/kvkk-report'),
  },
  notifications: {
    list: () => request<any[]>('/notifications'),
    markRead: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => request<any>('/notifications/read-all', { method: 'POST' }),
  },
  analytics: {
    overview: () => request<any>('/analytics/overview'),
    signingRate: () => request<any>('/analytics/signing-rate'),
    timeline: () => request<any[]>('/analytics/timeline'),
    department: () => request<any[]>('/analytics/department'),
  },
  organizations: {
    get: () => request<any>('/organizations'),
    update: (data: any) => request<any>('/organizations', { method: 'PATCH', body: JSON.stringify(data) }),
  },
  users: {
    list: () => request<any[]>('/users'),
    get: (id: string) => request<any>(`/users/${id}`),
    update: (id: string, data: any) => request<any>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
};
