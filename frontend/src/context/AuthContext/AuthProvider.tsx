import { useEffect, useState } from 'react';
import * as authApi from '../../services/api/auth.api';
import { AuthContext } from './AuthContext';
import type { User } from '../../types/todo';
import type { AuthFormType } from './types';
import { setLogoutAndRedirect } from './authBridge';
import { refreshAccessToken, setAccessToken } from '../../services/api/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const data = await refreshAccessToken();
        setAccessToken(data);
      } catch {
        setUser(null);
        logout();
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  async function login(data: AuthFormType) {
    const res = await authApi.login(data);

    if (res.user.isActivated) {
      saveAuth(res);
    }
  }

  async function register(data: AuthFormType) {
    await authApi.register(data);
  }

  async function logout() {
    await authApi.logout();
    localStorage.clear();
    setUser(null);
  }

  async function logoutAndRedirect() {
    await authApi.logout().finally(() => {
      setUser(null);
      localStorage.clear();
      window.location.href = '/login';
    });
  }

  useEffect(() => {
    setLogoutAndRedirect(logoutAndRedirect);
  });

  function saveAuth(res: authApi.AuthResponse) {
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
