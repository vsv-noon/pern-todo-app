import type { AuthFormType } from '../auth/types';
import { apiFetch } from './client';

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: { id: number; email: string; isActivated: boolean };
};

// export function login(email: string, password: string, captchaToken: string, isActivated: boolean) {
//   return apiFetch<AuthResponse>('/auth/login', {
//     method: 'POST',
//     body: JSON.stringify({ email, password, captchaToken, isActivated }),
//   });
// }

// export function register(
//   email: string,
//   password: string,
//   captchaToken: string,
//   isActivated: boolean,
// ) {
//   return apiFetch<AuthResponse>('/auth/register', {
//     method: 'POST',
//     body: JSON.stringify({ email, password, captchaToken, isActivated }),
//   });
// }

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
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return;

  await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
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
