const USER_ABORT_MESSAGE_MARKERS = [
  'login cancelled',
  'login canceled',
  'user cancelled',
  'user canceled',
  'authentication canceled',
  'authentication cancelled',
  'dismissed',
  'user canceled the authorization',
  'user cancelled the authorization',
  'canceled the authorization',
  'cancelled the authorization',
  'access_denied',
  'org.openid.appauth.general error -3',
] as const;

function collectErrorText(error: Error): string {
  const parts = [error.message];
  let current: unknown = (error as Error & { cause?: unknown }).cause;
  let depth = 0;
  while (current instanceof Error && depth < 5) {
    parts.push(current.message);
    current = (current as Error & { cause?: unknown }).cause;
    depth += 1;
  }
  return parts.join(' ').toLowerCase();
}

export class LoginUserAbortError extends Error {
  constructor(message = 'Login cancelled') {
    super(message);
    this.name = 'LoginUserAbortError';
  }
}

export function isLoginUserAbortError(error: unknown): boolean {
  if (error instanceof LoginUserAbortError) {
    return true;
  }
  if (!(error instanceof Error)) {
    return false;
  }
  if (error.name === 'LoginUserAbortError') {
    return true;
  }
  const message = collectErrorText(error);
  return USER_ABORT_MESSAGE_MARKERS.some((marker) => message.includes(marker));
}
