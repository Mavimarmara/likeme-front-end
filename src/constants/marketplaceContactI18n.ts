/** Prefixo da chave em `i18n_bundle.translation` (objeto por id de advertiser). */
export const MARKETPLACE_ADVERTISER_WHATSAPP_PREFILL_I18N_PREFIX = 'marketplace.advertiserWhatsappPrefill.' as const;

export function marketplaceAdvertiserWhatsappPrefillI18nKey(advertiserId: string): string {
  return `${MARKETPLACE_ADVERTISER_WHATSAPP_PREFILL_I18N_PREFIX}${advertiserId}`;
}
