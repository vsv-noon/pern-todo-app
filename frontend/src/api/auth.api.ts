import { apiFetch } from './client';

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: { id: number; email: string };
};

export function login(email: string, password: string, captchaToken: string, isActivated: boolean) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, captchaToken, isActivated }),
  });
}

// export function login(email: string, password: string) {
//   return apiFetch<AuthResponse>('/auth/login', {
//     method: 'POST',
//     body: JSON.stringify({ email, password }),
//   });
// }

export function register(
  email: string,
  password: string,
  captchaToken: string,
  isActivated: boolean,
) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, captchaToken, isActivated }),
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
