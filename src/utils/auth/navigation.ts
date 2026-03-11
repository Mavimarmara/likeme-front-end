import { AUTH_ONBOARDING_SCREENS_ORDER, type AuthOnboardingScreenName } from '@/constants/authOnboarding';

const DEFAULT_USER_NAME = 'Usuário';

/**
 * Retorna a próxima tela na ordem de onboarding.
 * Se a tela atual for a última, retorna 'Home'.
 * TODO: redirect para Plans desabilitado temporariamente; reativar quando necessário.
 */
export function getNextOnboardingScreen(current: AuthOnboardingScreenName): AuthOnboardingScreenName | 'Home' {
  const idx = AUTH_ONBOARDING_SCREENS_ORDER.indexOf(current);
  if (idx < 0 || idx === AUTH_ONBOARDING_SCREENS_ORDER.length - 1) {
    return 'Home';
  }
  const next = AUTH_ONBOARDING_SCREENS_ORDER[idx + 1];
  // Pula Plans temporariamente; Register → PersonalObjectives
  if (next === 'Plans') {
    return AUTH_ONBOARDING_SCREENS_ORDER[idx + 2] ?? 'Home';
  }
  return next;
}

export type OnboardingRedirectDestination =
  | { screen: AuthOnboardingScreenName; params?: object }
  | { screen: 'Home'; params?: undefined };

/**
 * Define a próxima tela de onboarding com base nos flags de storage (usado pelo redirect pós-login).
 * Se o usuário ainda não tem dados pessoais salvos (registerCompletedAt), redireciona para Register.
 * Considera também o aceite da política de privacidade antes do registro.
 * TODO: redirect para Plans desabilitado temporariamente; reativar quando necessário.
 */
export function getNextOnboardingDestination(
  welcomeScreenAccessedAt: string | null,
  privacyPolicyAcceptedAt: string | null,
  registerCompletedAt: string | null,
  objectivesSelectedAt: string | null,
): OnboardingRedirectDestination {
  const order = AUTH_ONBOARDING_SCREENS_ORDER;

  if (!welcomeScreenAccessedAt) {
    return { screen: order[0] };
  }
  if (!privacyPolicyAcceptedAt) {
    return { screen: 'PrivacyPolicies', params: { userName: DEFAULT_USER_NAME } };
  }
  // Sem dados pessoais salvos (registro não concluído) → sempre para Register
  if (!registerCompletedAt) {
    return { screen: 'Register', params: { userName: DEFAULT_USER_NAME } };
  }
  if (!objectivesSelectedAt) {
    const registerIdx = order.indexOf('Register');
    const nextScreen = order[registerIdx + 1];
    const screen = nextScreen === 'Plans' ? 'PersonalObjectives' : nextScreen;
    return { screen, params: { userName: DEFAULT_USER_NAME } };
  }
  return { screen: 'Home' };
}
