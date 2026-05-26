import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { subscriptionService, type UserSubscriptionListItem } from '@/services/payment/subscriptionService';
import { productService } from '@/services';
import orderService from '@/services/order/orderService';
import { serviceSubscriptionsFromOrders, filterSubscriptionItems } from '@/utils/profile/subscriptionListMapper';
import { buildMarketplaceCategoryBadgeLabels } from '@/utils/marketplace/buildMarketplaceCategoryBadgeLabels';
import { useCategories } from '@/hooks/category/useCategories';
import type { SubscriptionListItem } from '@/types/subscription/subscription';
import type { Product as ApiProduct } from '@/types/product';
import { catalogTypeTranslatedBadgeLabels } from '@/types/product';
import { useTranslation } from '@/hooks/i18n';
import { logger } from '@/utils/logger';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';

async function fetchProductDetails(productIds: string[]): Promise<Map<string, ApiProduct>> {
  const uniqueIds = [...new Set(productIds)];
  const results = await Promise.allSettled(uniqueIds.map((id) => productService.getProductById(id)));

  const map = new Map<string, ApiProduct>();
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.success && result.value.data) {
      map.set(uniqueIds[index], result.value.data);
    }
  });
  return map;
}

export function useSubscriptionList() {
  const { t } = useTranslation();
  const tRef = useRef(t);
  tRef.current = t;

  const { categories } = useCategories();
  const categoriesRef = useRef(categories);
  categoriesRef.current = categories;

  const [subscriptions, setSubscriptions] = useState<UserSubscriptionListItem[]>([]);
  const [productMap, setProductMap] = useState<Map<string, ApiProduct>>(new Map());
  const [services, setServices] = useState<SubscriptionListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const load = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      setLoading(true);
      setError(null);

      const [subscriptionsResponse, ordersResponse] = await Promise.all([
        subscriptionService.listUserSubscriptions(),
        orderService.listOrders({ limit: 100 }),
      ]);

      if (!subscriptionsResponse.success) {
        throw new Error('Falha ao carregar protocolos');
      }

      const subs = subscriptionsResponse.data?.subscriptions ?? [];
      setSubscriptions(subs);

      const productIds = subs.map((s) => s.productId);
      if (productIds.length > 0) {
        const products = await fetchProductDetails(productIds);
        setProductMap(products);
      }

      if (ordersResponse.success && ordersResponse.data?.orders) {
        setServices(serviceSubscriptionsFromOrders(ordersResponse.data.orders));
      } else {
        setServices([]);
      }
    } catch (loadError) {
      logger.error('[useSubscriptionList] Erro ao carregar assinaturas', loadError);
      setError(tRef.current('profile.subscriptionList.loadError'));
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const protocols = useMemo((): SubscriptionListItem[] => {
    return subscriptions.map((sub) => {
      const fullProduct = productMap.get(sub.productId);
      const categoryBadges = fullProduct ? buildMarketplaceCategoryBadgeLabels(fullProduct, categoriesRef.current) : [];
      const typeBadges = catalogTypeTranslatedBadgeLabels(fullProduct?.type ?? sub.product.type, tRef.current);
      const badges = [...categoryBadges, ...typeBadges].filter(Boolean);

      return {
        id: sub.id,
        kind: 'protocol' as const,
        productId: sub.productId,
        title: fullProduct?.name ?? sub.product.name,
        image: fullProduct?.image || sub.product.image?.trim() || DEFAULT_IMAGE,
        badges,
        acquiredAt: sub.createdAt,
        subscriptionId: sub.id,
      };
    });
  }, [subscriptions, productMap, categories]);

  const filteredProtocols = useMemo(() => filterSubscriptionItems(protocols, searchQuery), [protocols, searchQuery]);
  const filteredServices = useMemo(() => filterSubscriptionItems(services, searchQuery), [services, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    loading,
    error,
    protocols: filteredProtocols,
    services: filteredServices,
    reload: load,
  };
}
