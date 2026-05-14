import i18n from '@/i18n';
import { marketplaceAdvertiserWhatsappPrefillI18nKey } from '@/constants/marketplaceContactI18n';

export function resolveWaMePrefillFromI18n(advertiserId: string | undefined): string {
  const id = advertiserId?.trim();
  if (!id) return '';
  const key = marketplaceAdvertiserWhatsappPrefillI18nKey(id);
  const raw = i18n.t(key);
  if (typeof raw !== 'string' || raw === key || !raw.trim()) return '';
  return raw.trim();
}
