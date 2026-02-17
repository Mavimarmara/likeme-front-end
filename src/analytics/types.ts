/**
 * Tipos para a camada de analytics GA4.
 * Parâmetros: apenas valores não sensíveis (evitar PII).
 */

import type { AnalyticsEventName } from './constants';

/** Parâmetros de evento: chave = AnalyticsParamName ou string, valor = string | number | boolean */
export type AnalyticsEventParams = Record<string, string | number | boolean>;

/** Payload para screen_view */
export interface ScreenViewParams {
  screen_name: string;
  screen_class?: string;
}

/** Opções para log de evento genérico */
export interface LogEventOptions {
  eventName: AnalyticsEventName | string;
  params?: AnalyticsEventParams;
}

/** Interface do provedor de analytics (Firebase ou no-op) */
export interface AnalyticsProvider {
  logScreenView(screenName: string, screenClass?: string): void | Promise<void>;
  logEvent(eventName: string, params?: AnalyticsEventParams): void | Promise<void>;
}
