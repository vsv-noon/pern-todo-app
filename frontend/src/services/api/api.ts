import { callLogoutAndRedirect } from '../../context/AuthContext/authBridge';

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

let refreshPromise: Promise<string> | null = null;

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(import.meta.env.VITE_API_URL + url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      callLogoutAndRedirect();

      throw new Error('Unauthorized');
    }

    return apiFetch<T>(url, options);
  }

  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiDelete(url: string): Promise<void> {
  const res = await fetch(import.meta.env.VITE_API_URL + url, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    method: 'DELETE',
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
}

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const res = await fetch(import.meta.env.VITE_API_URL + '/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) return null;

      const data = await res.json();

      setAccessToken(data.accessToken);
      return data.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
