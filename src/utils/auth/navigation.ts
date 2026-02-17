import {
  AUTH_ONBOARDING_SCREENS_ORDER,
  type AuthOnboardingScreenName,
} from '@/constants/authOnboarding';

const DEFAULT_USER_NAME = 'Usuário';

/**
 * Retorna a próxima tela na ordem de onboarding.
 * Se a tela atual for a última, retorna 'Home'.
 */
export function getNextOnboardingScreen(
  current: AuthOnboardingScreenName,
): AuthOnboardingScreenName | 'Home' {
  const idx = AUTH_ONBOARDING_SCREENS_ORDER.indexOf(current);
  if (idx < 0 || idx === AUTH_ONBOARDING_SCREENS_ORDER.length - 1) {
    return 'Home';
  }
  return AUTH_ONBOARDING_SCREENS_ORDER[idx + 1];
}

export type OnboardingRedirectDestination =
  | { screen: AuthOnboardingScreenName; params?: object }
  | { screen: 'Home'; params?: undefined };

/**
 * Define a próxima tela de onboarding com base nos flags de storage (usado pelo redirect pós-login).
 */
export function getNextOnboardingDestination(
  welcomeScreenAccessedAt: string | null,
  registerCompletedAt: string | null,
  objectivesSelectedAt: string | null,
): OnboardingRedirectDestination {
  const order = AUTH_ONBOARDING_SCREENS_ORDER;

  if (!welcomeScreenAccessedAt) {
    return { screen: order[0] };
  }
  if (!registerCompletedAt) {
    const welcomeIdx = order.indexOf('Welcome');
    return { screen: order[welcomeIdx + 1], params: { userName: DEFAULT_USER_NAME } };
  }
  if (!objectivesSelectedAt) {
    const registerIdx = order.indexOf('Register');
    return { screen: order[registerIdx + 1], params: { userName: DEFAULT_USER_NAME } };
  }
  return { screen: 'Home' };
}
