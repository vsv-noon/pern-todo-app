import { apiFetch } from './client';

export async function fetchStats(type: string, params?: Record<string, string>) {
  const qs = new URLSearchParams({ type, ...params }).toString();
  console.log(qs);
  return await apiFetch(`/stats?${qs}`);
}
