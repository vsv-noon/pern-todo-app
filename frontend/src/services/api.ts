// import type { AuthResponse, StatsType, Todo, TodoCounts } from '../types/todo';

// const API_URL = '/api';
// // const API_URL = import.meta.env.VITE_API_URL;

// // ========== CORE ==========
// const getAccessToken = (): string | null => localStorage.getItem('accessToken');

// const getHeaders = (): HeadersInit => {
//   const token = getAccessToken();
//   const headers: HeadersInit = { 'Content-Type': 'application/json' };
//   if (token) {
//     (headers as Record<string, string>).Authorization = `Bearer ${token}`;
//   }
//   return headers;
// };

// const rawRequest = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
//   return fetch(`${API_URL}${endpoint}`, {
//     headers: getHeaders(),
//     credentials: 'include', // for cookies in future
//     ...options,
//   });
// };

// const tryRefreshToken = async (skipAuthHandling = false): Promise<boolean> => {
//   const refreshToken = localStorage.getItem('refreshToken');
//   if (!refreshToken || skipAuthHandling) return false;

//   try {
//     const response = await fetch(`${API_URL}/auth/refresh`, {
//       method: 'POST',
//       headers: { 'content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ refreshToken }),
//     });
//     // ========== TODOS ==========
//     if (!response.ok) return false;

//     const data = await response.json();
//     if (!data.accessToken) return false;

//     localStorage.setItem('accessToken', data.accessToken);

//     if (data.refreshToken) {
//       localStorage.setItem('refreshToken', data.refreshToken);
//     }
//     return true;
//   } catch {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     return false;
//   }
// };

// const request = async <T>(
//   endpoint: string,
//   options: RequestInit = {},
//   skipAuthHandling = false,
// ): Promise<T> => {
//   let response = await rawRequest(endpoint, options);

//   if (response.status === 401 && !skipAuthHandling) {
//     const refreshed = await tryRefreshToken(skipAuthHandling);
//     if (refreshed) {
//       response = await rawRequest(endpoint, options);
//     }
//   }

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ error: 'Unknown error' }));
//     throw new Error(error.error || `HTTP error status: ${response.status}`);
//   }

//   return response.json();
// };

// // ========== AUTH ==========
// export const login = async (
//   email: string,
//   password: string,
// ): Promise<AuthResponse & { refreshToken: string }> => {
//   const data = await request<AuthResponse & { refreshToken: string }>(
//     '/auth/login',
//     {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     },
//     true, // skip refresh logic on login
//   );

//   localStorage.setItem('accessToken', data.accessToken);
//   localStorage.setItem('refreshToken', data.refreshToken);
//   localStorage.setItem('user', JSON.stringify(data.user));

//   return data;
// };

// export const register = async (
//   email: string,
//   password: string,
// ): Promise<AuthResponse & { refreshToken: string }> => {
//   const data = await request<AuthResponse & { refreshToken: string }>(
//     '/auth/register',
//     {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     },
//     true,
//   );

//   localStorage.setItem('accessToken', data.accessToken);
//   localStorage.setItem('refreshToken', data.refreshToken);
//   localStorage.setItem('user', JSON.stringify(data.user));

//   return data;
// };

// export const refreshAccessToken = async (): Promise<boolean> => {
//   return tryRefreshToken();
// };

// export const logout = async (): Promise<void> => {
//   const refreshToken = localStorage.getItem('refreshToken');
//   if (refreshToken) {
//     await fetch(`${API_URL}/auth/logout`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ refreshToken }),
//     }).catch(() => {
//       // ignoring error logout
//     });
//   }

//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('refreshToken');
//   localStorage.removeItem('user');
// };

// // ========== TODOS ==========
// export const getTodos = async (filters?: {
//   date?: string;
//   search?: string;
//   status?: string;
// }): Promise<Todo[]> => {
//   const params = new URLSearchParams();
//   if (filters?.date) params.append('date', filters.date);
//   if (filters?.search) params.append('search', filters.search);
//   if (filters?.status && filters.status !== 'all') params.append('status', filters.status);

//   return request<Todo[]>(`/todos${params.toString() ? `?${params}` : ''}`);
// };

// export const getCalendarCounts = async (): Promise<TodoCounts> => {
//   return request<TodoCounts>('/todos/calendar-counts');
// };

// export const createTodo = async (
//   todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>,
// ): Promise<Todo> => {
//   return request('/todos', {
//     method: 'POST',
//     body: JSON.stringify(todo),
//   });
// };

// export const updateTodo = async (id: number, updates: Partial<Todo>): Promise<Todo> => {
//   return request(`/todos/${id}`, {
//     method: 'PATCH',
//     body: JSON.stringify(updates),
//   });
// };

// export const deleteTodo = async (id: number): Promise<void> => {
//   await request(`/todos/${id}`, { method: 'DELETE' });
// };

// export const bulkRestoreTodos = async (ids: number[]): Promise<{ restored: number[] }> => {
//   return request('/todos/bulk-restore', {
//     method: 'POST',
//     body: JSON.stringify({ ids }),
//   });
// };

// export const bulHardDeleteTodos = async (ids: number[]): Promise<{ deleted: number[] }> => {
//   return request('/todos/bulk-delete', {
//     method: 'POST',
//     body: JSON.stringify({ ids }),
//   });
// };

// // ========== STATS ==========
// export const getStats = async (type: StatsType, from?: string, to?: string): Promise<any> => {
//   const params = new URLSearchParams({ type });
//   if (from) params.append('from', from);
//   if (to) params.append('to', to);
//   return request(`/stats?${params}`);
// };

// // ========== UTILS ==========
// export const getCurrentUser = (): User | null => {
//   const userJson = localStorage.getItem('user');
//   return userJson ? JSON.parse(userJson) : null;
// };

// export interface User {
//   id: number;
//   email: string;
// }
