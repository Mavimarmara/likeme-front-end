import { fetchWithTimeout } from './fetchWithTimeout';

describe('fetchWithTimeout', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
  });

  it('resolve quando o fetch completa antes do timeout', async () => {
    global.fetch = jest.fn().mockResolvedValue(new Response(null, { status: 200, statusText: 'OK' }));

    const response = await fetchWithTimeout('https://example.com/api', { method: 'GET' }, 5000);

    expect(response.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/api',
      expect.objectContaining({ method: 'GET', signal: expect.any(AbortSignal) }),
    );
  });

  it('rejeita com AbortError quando o fetch não completa dentro do prazo', async () => {
    jest.useFakeTimers();
    global.fetch = jest.fn().mockImplementation((_url: string, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal;
        if (!signal) {
          reject(new Error('expected AbortSignal'));
          return;
        }
        if (signal.aborted) {
          reject(new DOMException('The operation was aborted.', 'AbortError'));
          return;
        }
        signal.addEventListener('abort', () => {
          reject(new DOMException('The operation was aborted.', 'AbortError'));
        });
      });
    });

    const promise = fetchWithTimeout('https://example.com/slow', { method: 'GET' }, 1000);

    jest.advanceTimersByTime(1000);

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });
});
