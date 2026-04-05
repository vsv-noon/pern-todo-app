import { useEffect, useState } from 'react';
import * as authApi from '../../services/api/auth.api';
import { AuthContext } from './AuthContext';
import type { User } from '../../types/todo';
import type { AuthFormType } from './types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const [user, setUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        // const u = localStorage.getItem('user');
        // if (u) {
        //   const parsed = JSON.parse(u);
        //   setUser(parsed);
        // }
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
    // saveAuth(res);
  }

  async function logout() {
    await authApi.logout();
    localStorage.clear();
    setUser(null);
  }

  function saveAuth(res: authApi.AuthResponse) {
    localStorage.setItem('accessToken', res.accessToken);
    // localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
