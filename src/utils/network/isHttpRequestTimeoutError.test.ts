import { isHttpRequestTimeoutError } from './isHttpRequestTimeoutError';

describe('isHttpRequestTimeoutError', () => {
  it('detects AbortError', () => {
    const error = new Error('The operation was aborted');
    error.name = 'AbortError';
    expect(isHttpRequestTimeoutError(error)).toBe(true);
  });

  it('detects aborted message', () => {
    expect(isHttpRequestTimeoutError(new Error('Request aborted'))).toBe(true);
  });

  it('returns false for other errors', () => {
    expect(isHttpRequestTimeoutError(new Error('Network request failed'))).toBe(false);
    expect(isHttpRequestTimeoutError(null)).toBe(false);
  });
});
