import { callLogoutAndRedirect } from '../auth/authBridge';

let refreshPromise: Promise<string> | null = null;

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const accessToken = localStorage.getItem('accessToken');

  const res = await fetch(import.meta.env.VITE_API_URL + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();

    // if (!newToken) throw new Error('Unauthorized');
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
  const accessToken = localStorage.getItem('accessToken');
  const res = await fetch(import.meta.env.VITE_API_URL + url, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    method: 'DELETE',
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return null;

      const res = await fetch(import.meta.env.VITE_API_URL + '/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      console.log(res);
      if (!res.ok) return null;

      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
