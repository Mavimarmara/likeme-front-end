import { Platform, TurboModuleRegistry } from 'react-native';

export const RNC_WEB_VIEW_TURBO_MODULE_NAME = 'RNCWebViewModule' as const;

export function isRncWebViewTurboModuleLinked(): boolean {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return false;
  }
  try {
    return TurboModuleRegistry.get(RNC_WEB_VIEW_TURBO_MODULE_NAME) != null;
  } catch {
    return false;
  }
}
