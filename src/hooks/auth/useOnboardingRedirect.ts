import { useEffect } from 'react';
import { getApiUrl } from '@/config';
import { getNextOnboardingDestination } from '@/utils';
import { storageService } from '@/services';
import { logger } from '@/utils/logger';

type NavigationReplace = (screen: string, params?: object) => void;

/**
 * Sincroniza flags de onboarding com o backend quando há token (ex.: pós-login / reabrir app).
 * Se o backend retornar registerCompletedAt, etc., atualiza o storage para refletir "dados pessoais salvos".
 */
async function syncOnboardingStateFromBackend(): Promise<void> {
  const token = await storageService.getToken();
  if (!token) return;
  try {
    const response = await fetch(getApiUrl('/api/auth/token'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return;
    const data = (await response.json()) as Record<string, unknown>;
    const payload = data.data ?? data;
    if (payload && typeof payload === 'object') {
      const p = payload as Record<string, unknown>;
      if (p.registerCompletedAt != null) {
        await storageService.setRegisterCompletedAt(p.registerCompletedAt as string);
      }
      if (p.objectivesSelectedAt != null) {
        await storageService.setObjectivesSelectedAt(p.objectivesSelectedAt as string);
      }
      if (p.privacyPolicyAcceptedAt != null) {
        await storageService.setPrivacyPolicyAcceptedAt(p.privacyPolicyAcceptedAt as string);
      }
    }
  } catch {
    // Ignora erro; usamos apenas o que está no storage
  }
}

export function useOnboardingRedirect(navigationReplace: NavigationReplace): void {
  useEffect(() => {
    const redirect = async () => {
      try {
        await syncOnboardingStateFromBackend();

        const welcomeScreenAccessedAt = await storageService.getWelcomeScreenAccessedAt();
        const privacyPolicyAcceptedAt = await storageService.getPrivacyPolicyAcceptedAt();
        const registerCompletedAt = await storageService.getRegisterCompletedAt();
        const objectivesSelectedAt = await storageService.getObjectivesSelectedAt();

        const destination = getNextOnboardingDestination(
          welcomeScreenAccessedAt,
          privacyPolicyAcceptedAt,
          registerCompletedAt,
          objectivesSelectedAt,
        );
        navigationReplace(destination.screen, destination.params);
      } catch (error) {
        logger.error('Error checking onboarding status:', error);
        navigationReplace('Register');
      }
    };

    redirect();
  }, [navigationReplace]);
}
