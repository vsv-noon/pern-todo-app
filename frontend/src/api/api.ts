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

export async function fetchDeletedTodos() {
  return await apiFetch<Todo[]>('/todos/deleted');
}

export async function restoreTodo(id: number) {
  return await apiFetch<Todo>(`/todos/${id}/restore`, { method: 'PATCH' });
}

export async function hardDeleteTodo(id: number) {
  return await apiDelete(`/todos/${id}/hard`);
}

// export const fetchDeletedTodos = () =>
//   apiFetch<Todo[]>("/todos/deleted");

// export const restoreTodo = (id: number) =>
//   apiFetch<Todo>(`/todos/${id}/restore`, { method: "PATCH" });

// export const hardDeleteTodo = (id: number) =>
//   apiDelete(`/todos/${id}/hard`);
