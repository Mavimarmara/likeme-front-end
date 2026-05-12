import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { storageService } from '@/services';

/**
 * `true` quando existe token de sessão no storage. Revalida ao focar a tela (ex.: volta do login).
 * Evita chamadas autenticadas antes do token existir (401 "Token de acesso necessário" no console).
 */
export function useSessionTokenReady(): boolean {
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    void (async () => {
      const token = await storageService.getToken();
      setReady(Boolean(token?.trim()));
    })();
  }, []);

  useFocusEffect(refresh);

  return ready;
}
