import type { Contact } from '@/types/contact';

const ensureHttpUrl = (value: string): string => (/^https?:\/\//i.test(value) ? value : `https://${value}`);

export type ResolveAdvertiserContactUrlOptions = {
  whatsappPrefillMessage?: string | null;
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
    case 'whatsapp': {
      const phone = value.replace(/\D/g, '');
      if (!phone) return ensureHttpUrl(value);
      const prefill = options?.whatsappPrefillMessage?.trim();
      if (!prefill) return `https://wa.me/${phone}`;
      return `https://wa.me/${phone}?text=${encodeURIComponent(prefill)}`;
    }
    case 'instagram':
      return value.startsWith('http') ? value : `https://instagram.com/${value.replace(/^@/, '')}`;
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
