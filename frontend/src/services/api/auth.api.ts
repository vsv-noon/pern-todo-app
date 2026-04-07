import type { AuthFormType } from '../../context/AuthContext/types';
import { apiFetch } from './api';

export type AuthResponse = {
  accessToken: string;
  user: { id: number; email: string; isActivated: boolean };
};

export function login(data: AuthFormType) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      captchaToken: data.captchaToken,
      isActivated: data.isActivated,
    }),
  });
}

export function register(data: AuthFormType) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      captchaToken: data.captchaToken,
      isActivated: data.isActivated,
    }),
  });
}

export const logout = async (): Promise<void> => {
  await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
};

export async function forgotPassword(email: string) {
  return await apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return await apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}
