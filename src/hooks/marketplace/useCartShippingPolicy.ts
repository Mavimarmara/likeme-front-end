import { useEffect, useMemo, useRef, useState } from 'react';
import { getShippingPolicy } from '@/services/shipping/shippingService';
import { logger } from '@/utils/logger';
import type { CartItem } from '@/types/cart';

interface CartShippingPolicyResult {
  /** undefined enquanto carrega; após carregar, fonte de verdade é o backend. */
  shippingRequired?: boolean;
  isResolving: boolean;
}

/**
 * Consulta o backend para decidir se o carrinho exige frete. O backend é fonte única da regra
 * (programas/serviços não geram frete; demais tipos exigem).
 *
 * Em caso de falha na consulta, assume o padrão conservador `shippingRequired = true` para que a
 * UI não esconda a cobrança de frete em produtos físicos por causa de erro transitório de rede.
 */
export const useCartShippingPolicy = (cartItems: ReadonlyArray<CartItem>): CartShippingPolicyResult => {
  const productIdsKey = useMemo(
    () =>
      cartItems
        .map((item) => item.id)
        .filter(Boolean)
        .sort()
        .join(','),
    [cartItems],
  );

  const [shippingRequired, setShippingRequired] = useState<boolean | undefined>(undefined);
  const [isResolving, setIsResolving] = useState(false);
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (productIdsKey === '' || lastKeyRef.current === productIdsKey) {
      return;
    }

    let cancelled = false;
    setIsResolving(true);
    lastKeyRef.current = productIdsKey;

    const productIds = productIdsKey.split(',');
    getShippingPolicy(productIds)
      .then((policy) => {
        if (!cancelled) {
          setShippingRequired(policy.requiresShipping);
        }
      })
      .catch((error) => {
        logger.error('[useCartShippingPolicy] Falha ao consultar política de frete', error);
        if (!cancelled) {
          setShippingRequired(true);
        }
      })
      .then(() => {
        if (!cancelled) {
          setIsResolving(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productIdsKey]);

  return { shippingRequired, isResolving };
};
