'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLoadingScreen } from '@/components/states';
import { useAuth } from '@/lib/auth-context';
import { StitchAppShell } from '@/components/stitch-app-shell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading, router]);
  if (loading || !user) return <AuthLoadingScreen />;
  return <StitchAppShell>{children}</StitchAppShell>;
}
