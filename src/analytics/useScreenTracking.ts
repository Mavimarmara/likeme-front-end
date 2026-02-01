/**
 * Hook para disparar screen_view ao entrar na tela.
 * Usar uma vez no topo de cada screen (ou no componente que representa a tela).
 * Garante screen_name e screen_class corretos, inclusive em stacks aninhados.
 */

import { useEffect, useRef } from 'react';
import { logScreenView } from './AnalyticsService';
import { getScreenName } from './constants';

interface UseAnalyticsScreenOptions {
  /** Nome da rota (ex: "Welcome", "ProductDetails") */
  screenName: string;
  /** Nome da classe/componente (ex: "WelcomeScreen"). Opcional. */
  screenClass?: string;
}

/**
 * Dispara screen_view ao montar a tela.
 * Evita duplicatas usando ref (apenas primeiro mount).
 */
export function useAnalyticsScreen(options: UseAnalyticsScreenOptions): void {
  const { screenName, screenClass } = options;
  const gaScreenName = getScreenName(screenName);
  const logged = useRef(false);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    logScreenView(gaScreenName, screenClass);
  }, [gaScreenName, screenClass]);
}
