import { useState, useCallback, useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import storageService from '@/services/auth/storageService';
import { logger } from '@/utils/logger';

function totalUnitsInCart(items: Array<{ quantity?: unknown }>): number {
  return items.reduce((sum, item) => {
    const q = Math.floor(Number(item.quantity) || 1);
    return sum + Math.max(0, q);
  }, 0);
}

export function useCartItemCount(): number {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const items = await storageService.getCartItems();
      setCount(totalUnitsInCart(items));
    } catch (error) {
      logger.error('[useCartItemCount] Falha ao ler itens do carrinho', error);
      setCount(0);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'active') {
        void refresh();
      }
    });
    return () => sub.remove();
  }, [refresh]);

  return count;
}
