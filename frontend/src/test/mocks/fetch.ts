import { vi } from 'vitest';

export function mockFetchOnce(data: unknown, ok = true) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
    ok,
    json: async () => data,
  } as Response);
}
