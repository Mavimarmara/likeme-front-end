/**
 * Altere para `true` só em desenvolvimento local: no redirect da tela `Authenticated` o app chama
 * `storageService.clearAll()` (sessão + onboarding + carrinho, etc.) e invalida o cache do token;
 * login (`validateToken`) e sync com `/api/auth/token` não gravam register/objectives/privacy enquanto
 * estiver `true`.
 * Manter `false` em commits e builds de release.
 */
export const FORCE_START_ONBOARDING_LOCALLY = true;
