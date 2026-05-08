import { Platform, TurboModuleRegistry } from 'react-native';
import { isRncWebViewTurboModuleLinked, RNC_WEB_VIEW_TURBO_MODULE_NAME } from '@/utils/infrastructure/rncWebViewModule';

describe('isRncWebViewTurboModuleLinked', () => {
  const originalOs = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalOs, writable: true });
    jest.restoreAllMocks();
  });

  it('retorna false na web', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'web', writable: true });
    expect(isRncWebViewTurboModuleLinked()).toBe(false);
  });

  it('retorna true em iOS quando o TurboModule está registrado', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios', writable: true });
    jest.spyOn(TurboModuleRegistry, 'get').mockImplementation((name: string) => {
      if (name === RNC_WEB_VIEW_TURBO_MODULE_NAME) {
        return {} as never;
      }
      return null;
    });
    expect(isRncWebViewTurboModuleLinked()).toBe(true);
  });

  it('retorna false em Android quando o TurboModule não está registrado', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android', writable: true });
    jest.spyOn(TurboModuleRegistry, 'get').mockReturnValue(null);
    expect(isRncWebViewTurboModuleLinked()).toBe(false);
  });
});
