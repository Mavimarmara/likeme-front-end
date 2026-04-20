/** HTTP no fluxo de auth (token, sync de onboarding, perfil): evita espera infinita e tela vazia. */
export const AUTH_BOOTSTRAP_HTTP_TIMEOUT_MS = 12_000;

/** Se `useFonts` nunca resolver (quebra nativa rara), ainda assim remove o splash para o app não ficar preso. */
export const ROOT_SPLASH_FONT_LOAD_FALLBACK_MS = 8_000;
