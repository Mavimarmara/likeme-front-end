import type { Contact } from '@/types/contact';

const ensureHttpUrl = (value: string): string => (/^https?:\/\//i.test(value) ? value : `https://${value}`);

export const resolveAdvertiserContactUrl = (contact: Contact): string | null => {
  const value = contact.value?.trim();
  if (!value) return null;

  switch (contact.type) {
    case 'email':
      return `mailto:${value}`;
    case 'whatsapp': {
      const phone = value.replace(/\D/g, '');
      return phone ? `https://wa.me/${phone}` : ensureHttpUrl(value);
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
