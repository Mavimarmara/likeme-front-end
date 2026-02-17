import { useEffect } from 'react';
import { getNextOnboardingDestination } from '@/utils';
import { storageService } from '@/services';
import { logger } from '@/utils/logger';

type NavigationReplace = (screen: string, params?: object) => void;

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
