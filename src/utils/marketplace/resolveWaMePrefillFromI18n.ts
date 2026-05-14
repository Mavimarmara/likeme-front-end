import i18n from '@/i18n';
import { MARKETPLACE_ADVERTISER_WHATSAPP_PREFILL_I18N_KEY } from '@/constants/marketplaceContactI18n';

export function resolveWaMePrefillFromI18n(advertiserId: string | undefined): string {
  const id = advertiserId?.trim();
  if (!id) return '';
  const raw = i18n.t(MARKETPLACE_ADVERTISER_WHATSAPP_PREFILL_I18N_KEY);
  if (typeof raw !== 'string' || raw === MARKETPLACE_ADVERTISER_WHATSAPP_PREFILL_I18N_KEY || !raw.trim()) {
    return '';
  }
  return raw.trim();
}
