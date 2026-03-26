import { useEffect, useState } from 'react';
import * as authApi from '../api/auth.api';
import { AuthContext } from './AuthContext';
import type { User } from '../types/todo';
import { setLogoutAndRedirect } from './authBridge';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const u = localStorage.getItem('user');

      if (u) {
        try {
          const parsed = JSON.parse(u);
          setUser(parsed);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }

    init();
  }, []);

  async function login(email: string, password: string, token: string) {
    const res = await authApi.login(email, password, token);
    // console.log(res);
    saveAuth(res);
  }

  // async function login(email: string, password: string) {
  //   const res = await authApi.login(email, password);
  //   console.log(res);
  //   saveAuth(res);
  // }

  async function register(email: string, password: string, token: string) {
    const res = await authApi.register(email, password, token);
    saveAuth(res);
  }

  async function logout() {
    await authApi.logout();
    localStorage.clear();
    setUser(null);
  }

  async function logoutAndRedirect() {
    await authApi.logout().finally(() => {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
  }

  useEffect(() => {
    setLogoutAndRedirect(logoutAndRedirect);
  });

  function saveAuth(res: authApi.AuthResponse) {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
