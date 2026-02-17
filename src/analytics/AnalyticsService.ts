/**
 * Serviço centralizado de analytics (GA4).
 * Usa @react-native-firebase/analytics quando disponível; caso contrário no-op.
 * Baixo acoplamento com UI: telas/hooks chamam apenas este serviço.
 */

import { GA4_EVENTS, CUSTOM_EVENTS, ANALYTICS_PARAMS } from './constants';
import type { AnalyticsEventParams } from './types';

type FirebaseAnalyticsModule = {
  (): { logEvent: (name: string, params?: Record<string, unknown>) => void };
};
let firebaseAnalytics: FirebaseAnalyticsModule | null = null;
let initialized = false;

function getFirebaseAnalytics(): FirebaseAnalyticsModule | null {
  if (initialized) {
    return firebaseAnalytics;
  }
  initialized = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- optional dependency
    const analytics = require('@react-native-firebase/analytics').default as FirebaseAnalyticsModule;
    firebaseAnalytics = analytics;
    return firebaseAnalytics;
  } catch {
    firebaseAnalytics = null;
    return null;
  }
}

/**
 * Registra visualização de tela (evento screen_view do GA4).
 * Chamar ao entrar em cada tela (via useAnalyticsScreen ou listener).
 */
export function logScreenView(screenName: string, screenClass?: string): void {
  const analytics = getFirebaseAnalytics();
  if (!analytics) return;

  const params: AnalyticsEventParams = {
    [ANALYTICS_PARAMS.SCREEN_NAME]: screenName,
    ...(screenClass && { [ANALYTICS_PARAMS.SCREEN_CLASS]: screenClass }),
  };

  try {
    analytics().logEvent(GA4_EVENTS.SCREEN_VIEW, params);
  } catch (e) {
    if (__DEV__) console.warn('[Analytics] logScreenView error:', e);
  }
}

/**
 * Registra evento customizado ou recomendado GA4.
 * Nomes em snake_case; parâmetros sem PII.
 */
export function logEvent(eventName: string, params?: AnalyticsEventParams): void {
  const analytics = getFirebaseAnalytics();
  if (!analytics) return;

  const safeParams = params ? sanitizeParams(params) : undefined;

  try {
    analytics().logEvent(eventName, safeParams);
  } catch (e) {
    if (__DEV__) console.warn('[Analytics] logEvent error:', e);
  }
}

/** Remove ou mascara valores que possam ser PII */
function sanitizeParams(params: AnalyticsEventParams): AnalyticsEventParams {
  const out: AnalyticsEventParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' && looksLikePII(key, value)) continue;
    out[key] = value;
  }
  return out;
}

function looksLikePII(key: string, value: string): boolean {
  const lower = key.toLowerCase();
  if (lower.includes('email') || lower.includes('phone') || lower.includes('cpf')) return true;
  if (value.includes('@') && value.includes('.')) return true;
  return false;
}

// ========== Helpers reutilizáveis ==========

export function logButtonClick(params: {
  screen_name: string;
  button_label: string;
  action_name?: string;
  item_id?: string;
}): void {
  logEvent('button_click', {
    [ANALYTICS_PARAMS.SCREEN_NAME]: params.screen_name,
    [ANALYTICS_PARAMS.BUTTON_LABEL]: params.button_label,
    ...(params.action_name && { [ANALYTICS_PARAMS.ACTION_NAME]: params.action_name }),
    ...(params.item_id && { [ANALYTICS_PARAMS.ITEM_ID]: params.item_id }),
  });
}

export function logNavigation(params: {
  source_screen: string;
  destination_screen: string;
  action_name?: string;
}): void {
  logEvent('navigation', {
    [ANALYTICS_PARAMS.SOURCE_SCREEN]: params.source_screen,
    [ANALYTICS_PARAMS.DESTINATION_SCREEN]: params.destination_screen,
    ...(params.action_name && { [ANALYTICS_PARAMS.ACTION_NAME]: params.action_name }),
  });
}

export function logFormSubmit(params: {
  screen_name: string;
  form_name: string;
  success: boolean;
  error_type?: string;
}): void {
  logEvent(CUSTOM_EVENTS.FORM_SUBMIT, {
    [ANALYTICS_PARAMS.SCREEN_NAME]: params.screen_name,
    [ANALYTICS_PARAMS.FORM_NAME]: params.form_name,
    [ANALYTICS_PARAMS.SUCCESS]: params.success,
    ...(params.error_type && { [ANALYTICS_PARAMS.ERROR_TYPE]: params.error_type }),
  });
}

export function logTabSelect(params: { screen_name: string; tab_id: string; item_name?: string }): void {
  logEvent('tab_select', {
    [ANALYTICS_PARAMS.SCREEN_NAME]: params.screen_name,
    [ANALYTICS_PARAMS.TAB_ID]: params.tab_id,
    ...(params.item_name && { [ANALYTICS_PARAMS.ITEM_NAME]: params.item_name }),
  });
}

export function logAddToCart(params: {
  item_id: string;
  item_name?: string;
  item_category?: string;
  value?: number;
}): void {
  logEvent(GA4_EVENTS.ADD_TO_CART, {
    [ANALYTICS_PARAMS.ITEM_ID]: params.item_id,
    ...(params.item_name && { [ANALYTICS_PARAMS.ITEM_NAME]: params.item_name }),
    ...(params.item_category && { [ANALYTICS_PARAMS.ITEM_CATEGORY]: params.item_category }),
    ...(params.value != null && { [ANALYTICS_PARAMS.VALUE]: params.value }),
  });
}

export function logSelectContent(params: {
  content_type: string;
  item_id?: string;
  item_name?: string;
  screen_name?: string;
}): void {
  logEvent(GA4_EVENTS.SELECT_CONTENT, {
    [ANALYTICS_PARAMS.CONTENT_TYPE]: params.content_type,
    ...(params.item_id && { [ANALYTICS_PARAMS.ITEM_ID]: params.item_id }),
    ...(params.item_name && { [ANALYTICS_PARAMS.ITEM_NAME]: params.item_name }),
    ...(params.screen_name && { [ANALYTICS_PARAMS.SCREEN_NAME]: params.screen_name }),
  });
}

export function logError(params: { screen_name?: string; error_type: string }): void {
  logEvent(GA4_EVENTS.APP_EXCEPTION, {
    ...(params.screen_name && { [ANALYTICS_PARAMS.SCREEN_NAME]: params.screen_name }),
    [ANALYTICS_PARAMS.ERROR_TYPE]: params.error_type,
  });
}

export function logActionSuccess(params: { screen_name: string; action_name: string; item_id?: string }): void {
  logEvent('action_success', {
    [ANALYTICS_PARAMS.SCREEN_NAME]: params.screen_name,
    [ANALYTICS_PARAMS.ACTION_NAME]: params.action_name,
    [ANALYTICS_PARAMS.SUCCESS]: true,
    ...(params.item_id && { [ANALYTICS_PARAMS.ITEM_ID]: params.item_id }),
  });
}

export function logActionFailure(params: { screen_name: string; action_name: string; error_type: string }): void {
  logEvent('action_failure', {
    [ANALYTICS_PARAMS.SCREEN_NAME]: params.screen_name,
    [ANALYTICS_PARAMS.ACTION_NAME]: params.action_name,
    [ANALYTICS_PARAMS.ERROR_TYPE]: params.error_type,
    [ANALYTICS_PARAMS.SUCCESS]: false,
  });
}

export default {
  logScreenView,
  logEvent,
  logButtonClick,
  logNavigation,
  logFormSubmit,
  logTabSelect,
  logAddToCart,
  logSelectContent,
  logError,
  logActionSuccess,
  logActionFailure,
};
