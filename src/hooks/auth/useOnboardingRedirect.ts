import { useEffect } from 'react';
import { getApiUrl } from '@/config';
import { getNextOnboardingDestination } from '@/utils';
import { storageService, userService } from '@/services';
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

/**
 * Obtém o nome do usuário logado para exibir nas telas de onboarding (storage primeiro, depois perfil da API).
 */
async function getLoggedInUserDisplayName(): Promise<string | null> {
  const token = await storageService.getToken();
  if (!token) return null;
  const stored = await storageService.getUser();
  const fromStorage = stored?.name?.trim() || stored?.nickname?.trim();
  if (fromStorage) return fromStorage;
  try {
    const response = await userService.getProfile();
    if (response.success && response.data) {
      const person = response.data.person;
      if (person?.firstName) {
        const full = [person.firstName, person.lastName, person.surname].filter(Boolean).join(' ').trim();
        return full || response.data.name?.trim() || null;
      }
      return response.data.name?.trim() || null;
    }
  } catch {
    // Ignora; fallback "Usuário" será usado
  }
  return null;
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
        const userDisplayName = await getLoggedInUserDisplayName();

        const destination = getNextOnboardingDestination(
          welcomeScreenAccessedAt,
          privacyPolicyAcceptedAt,
          registerCompletedAt,
          objectivesSelectedAt,
          userDisplayName,
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
