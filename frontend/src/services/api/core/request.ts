// import { rawRequest } from './rawRequest';
// import { tryRefreshToken } from './refresh';

// export const request = async <T>(
//   endpoint: string,
//   options: RequestInit = {},
//   skipAuthHandling = false,
// ): Promise<T> => {
//   let response = await rawRequest(endpoint, options);

//   if (!skipAuthHandling && response.status === 401) {
//     const refreshed = await tryRefreshToken();
//     if (refreshed) {
//       response = await rawRequest(endpoint, options);
//     }
//   }

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ error: 'Unknown error' }));
//     throw new Error(error.error || `HTTP ${response.status}`);
//   }

//   return response.json();
// };
