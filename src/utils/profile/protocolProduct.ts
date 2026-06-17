import { subscriptionService, type UserSubscriptionListItem } from '@/services/payment/subscriptionService';
import { isProgramCatalogType, resolveCartItemCatalogType } from '@/types/product';

/**
 * Produto assinável como protocolo — mesmo critério de Meus Protocolos (aba Protocolos)
 * e do backend (`PRODUCT_CATALOG_TYPE.PROGRAM`, `splitCartItemsByCatalogType`,
 * `subscriptionAccessService.assertProductIsSubscribableProgram`).
 */
export { isProgramCatalogType as isProtocolProductCatalogType } from '@/types/product';

export function isProtocolCartItem(item: { type?: string | null; tags?: unknown }): boolean {
  return isProgramCatalogType(resolveCartItemCatalogType(item) ?? item.type);
}

/** productIds da seção Protocolos em Meus Protocolos (`listUserSubscriptions` → subscriptions). */
export function protocolProductIdsFromSubscriptions(
  subscriptions: ReadonlyArray<UserSubscriptionListItem>,
): ReadonlySet<string> {
  return new Set(subscriptions.map((row) => row.productId));
}

export function userOwnsProtocolFromSubscriptions(
  subscriptions: ReadonlyArray<UserSubscriptionListItem>,
  productId: string,
): boolean {
  return protocolProductIdsFromSubscriptions(subscriptions).has(productId);
}

/**
 * Assinatura ACTIVE do protocolo — mesma regra exibida em Meus Protocolos
 * (`getProtocolAccess` → `userHasActiveProtocolAccess` no backend).
 */
export async function userHasActiveProtocolProduct(productId: string): Promise<boolean> {
  const response = await subscriptionService.getProtocolAccess(productId);
  const isSuccess = response.success === true || (response as { status?: string }).status === 'success';
  return isSuccess && response.data?.hasAccess === true;
}
