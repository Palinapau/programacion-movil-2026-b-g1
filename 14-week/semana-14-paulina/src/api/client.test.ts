import { describe, expect, it, vi } from 'vitest';
import { createApiClient, describeError, NetworkError, UnauthorizedError, type TokenStore } from './client';

const store = (t: string | null): TokenStore => {
  let v = t;
  return { get: () => v, set: (x) => (v = x), clear: () => (v = null) };
};

describe('API client', () => {
  it('401 on a protected request logs the user out', async () => {
    const s = store('old');
    const out = vi.fn();
    const api = createApiClient({
      baseUrl: 'http://x/api', tokenStore: s, onUnauthorized: out,
      fetchImpl: vi.fn().mockResolvedValue(new Response('{}', { status: 401 })),
    });
    await expect(api.getReviews()).rejects.toBeInstanceOf(UnauthorizedError);
    expect(s.get()).toBeNull();
    expect(out).toHaveBeenCalled();
  });

  it('offline produces a friendly message', async () => {
    const api = createApiClient({
      baseUrl: 'http://x/api', tokenStore: store('t'),
      fetchImpl: vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    });
    const err = await api.getReviews().catch((e) => e);
    expect(err).toBeInstanceOf(NetworkError);
    expect(describeError(err)).toMatch(/Sin conexión/);
  });
});
