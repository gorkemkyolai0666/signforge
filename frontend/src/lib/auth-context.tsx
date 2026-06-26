'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('signforge_token');
    if (!token) { setLoading(false); return; }
    try {
      const profile = await api.auth.profile();
      setUser(profile);
    } catch {
      localStorage.removeItem('signforge_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email: string, password: string) => {
    const { access_token } = await api.auth.login({ email, password });
    localStorage.setItem('signforge_token', access_token);
    await loadUser();
  };

  const register = async (email: string, password: string, name: string) => {
    const { access_token } = await api.auth.register({ email, password, name });
    localStorage.setItem('signforge_token', access_token);
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem('signforge_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
