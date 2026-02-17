import { useEffect } from 'react';
import { storageService } from '@/services';
import { logger } from '@/utils/logger';

type NavigationReplace = (screen: string, params?: object) => void;

type OnboardingDestination =
  | { screen: 'Welcome'; params?: undefined }
  | { screen: 'Register'; params?: undefined }
  | { screen: 'PersonalObjectives'; params: { userName: string } }
  | { screen: 'Home'; params?: undefined };

function getNextOnboardingDestination(
  welcomeScreenAccessedAt: string | null,
  registerCompletedAt: string | null,
  objectivesSelectedAt: string | null,
): OnboardingDestination {
  if (!welcomeScreenAccessedAt) {
    return { screen: 'Welcome' };
  }
  if (!registerCompletedAt) {
    return { screen: 'Register' };
  }
  if (!objectivesSelectedAt) {
    return { screen: 'PersonalObjectives', params: { userName: 'Usuário' } };
  }
  return { screen: 'Home' };
}

export function useOnboardingRedirect(navigationReplace: NavigationReplace): void {
  useEffect(() => {
    const redirect = async () => {
      try {
        const welcomeScreenAccessedAt = await storageService.getWelcomeScreenAccessedAt();
        const registerCompletedAt = await storageService.getRegisterCompletedAt();
        const objectivesSelectedAt = await storageService.getObjectivesSelectedAt();

        const destination = getNextOnboardingDestination(
          welcomeScreenAccessedAt,
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
