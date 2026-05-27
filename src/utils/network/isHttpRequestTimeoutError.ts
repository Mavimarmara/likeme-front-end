export function isHttpRequestTimeoutError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  if (error.name === 'AbortError') {
    return true;
  }
  const message = error.message.toLowerCase();
  return message.includes('aborted') || message.includes('abort');
}
