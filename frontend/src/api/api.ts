import type { Todo } from '../types/todo';

const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE_URL + url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function apiDelete(url: string): Promise<void> {
  const res = await fetch(BASE_URL + url, { method: 'DELETE' });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
}

export async function fetchTitleSuggestions(query: string) {
  return await apiFetch<string[]>(`/todos/suggestions?query=${encodeURIComponent(query)}`);
}

export async function fetchDeletedTodos(q = '') {
  return apiFetch<Todo[]>(`/todos/deleted?q=${encodeURIComponent(q)}`);
}
export async function restoreTodo(id: number) {
  return await apiFetch<Todo>(`/todos/${id}/restore`, { method: 'PATCH' });
}

export async function hardDeleteTodo(id: number) {
  return await apiDelete(`/todos/${id}/hard`);
}

export async function bulkRestore(ids: number[]) {
  return await apiFetch(`/todos/restore/bulk`, {
    method: 'PATCH',
    body: JSON.stringify({ ids }),
  });
}

export async function bulkHardDelete(ids: number[]) {
  return await apiFetch(`/todos/hard/bulk`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  });
}

export async function fetchStats(type: string, params?: Record<string, string>) {
  const qs = new URLSearchParams({ type, ...params }).toString();
  return await apiFetch(`/stats?${qs}`);
}
