import type { Contact } from '@/types/contact';
import { buildWhatsAppWaMeUrl } from '@/utils/messaging/buildWhatsAppWaMeUrl';

const ensureHttpUrl = (value: string): string => (/^https?:\/\//i.test(value) ? value : `https://${value}`);
const URL_WITH_SCHEME_REGEX = /^https?:\/\//i;
const INSTAGRAM_HOSTS = new Set(['instagram.com', 'www.instagram.com']);
const WHATSAPP_HOSTS = new Set(['wa.me', 'api.whatsapp.com', 'whatsapp.com', 'www.whatsapp.com']);

const isAllowedHttpUrl = (value: string, allowedHosts: Set<string>): boolean => {
  if (!URL_WITH_SCHEME_REGEX.test(value)) return false;

  try {
    const { hostname, protocol } = new URL(value);
    return (protocol === 'https:' || protocol === 'http:') && allowedHosts.has(hostname.toLowerCase());
  } catch {
    return false;
  }
};

const resolveInstagramUrl = (value: string): string | null => {
  if (URL_WITH_SCHEME_REGEX.test(value)) {
    return isAllowedHttpUrl(value, INSTAGRAM_HOSTS) ? value : null;
  }

  const handle = value.replace(/^@/, '').replace(/^\/+|\/+$/g, '').trim();
  return handle ? `https://instagram.com/${encodeURIComponent(handle)}` : null;
};

const resolveWhatsAppUrl = (value: string, prefillText?: string | null): string | null => {
  const phone = value.replace(/\D/g, '');
  if (phone) {
    return buildWhatsAppWaMeUrl({ phone, prefillText });
  }

  const url = ensureHttpUrl(value);
  return isAllowedHttpUrl(url, WHATSAPP_HOSTS) ? url : null;
};

export type ResolveAdvertiserContactUrlOptions = {
  waMePrefillText?: string | null;
};

export const resolveAdvertiserContactUrl = (
  contact: Contact,
  options?: ResolveAdvertiserContactUrlOptions,
): string | null => {
  const value = contact.value?.trim();
  if (!value) return null;

  switch (contact.type) {
    case 'email':
      return `mailto:${value}`;
    case 'whatsapp':
      return resolveWhatsAppUrl(value, options?.waMePrefillText);
    case 'instagram':
      return resolveInstagramUrl(value);
    case 'website':
      return ensureHttpUrl(value);
    case 'address':
    case 'billing_address':
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
    case 'phone':
      return `tel:${value}`;
    default:
      return null;
  }
};
