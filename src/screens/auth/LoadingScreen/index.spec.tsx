import { render, waitFor } from '@testing-library/react-native';
import { Animated, Image } from 'react-native';
import LoadingScreen from './index';

const mockFetchWithTimeout = jest.fn();
const mockGetToken = jest.fn();
const mockSetToken = jest.fn();
const mockRemoveToken = jest.fn();
const mockEnsureI18nHydrated = jest.fn();
const mockStartI18nHydration = jest.fn();

jest.mock('@/utils/network/fetchWithTimeout', () => ({
  fetchWithTimeout: (...args: unknown[]) => mockFetchWithTimeout(...args),
}));

jest.mock('@/i18n/hydration', () => ({
  ensureI18nHydrated: (...args: unknown[]) => mockEnsureI18nHydrated(...args),
  startI18nHydration: (...args: unknown[]) => mockStartI18nHydration(...args),
}));

jest.mock('@/assets/auth', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    PartialLogo: (props: any) => React.createElement(View, props),
    GradientSplash7: 1,
    GradientSplash8: 2,
    GradientSplash9: 3,
  };
});

jest.mock('@/analytics', () => ({
  useAnalyticsScreen: jest.fn(),
}));

jest.mock('@/services', () => ({
  storageService: {
    getToken: (...args: unknown[]) => mockGetToken(...args),
    setToken: (...args: unknown[]) => mockSetToken(...args),
    removeToken: (...args: unknown[]) => mockRemoveToken(...args),
  },
}));

jest.mock('@/config', () => ({
  getApiUrl: (path: string) => `http://localhost${path}`,
}));

describe('LoadingScreen', () => {
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
    mockGetToken.mockResolvedValue(null);
    mockEnsureI18nHydrated.mockResolvedValue(undefined);
    mockStartI18nHydration.mockResolvedValue(undefined);
    mockSetToken.mockResolvedValue(undefined);
    mockRemoveToken.mockResolvedValue(undefined);

    (Image.resolveAssetSource as any) = jest.fn().mockReturnValue({ width: 100, height: 200, uri: 'mock' });
    jest.spyOn(Animated, 'timing').mockImplementation((value: any, config: any) => {
      return {
        start: (cb?: any) => {
          if (value && typeof value.setValue === 'function' && config && typeof config.toValue === 'number') {
            value.setValue(config.toValue);
          }
          if (cb) cb({ finished: true });
        },
      } as any;
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    (Animated.timing as unknown as jest.Mock).mockRestore?.();
  });

  it('navega para Unauthenticated quando não há token', async () => {
    const replace = jest.fn();

    render(<LoadingScreen navigation={{ replace, navigate: jest.fn() }} />);

    await waitFor(
      () => {
        expect(replace).toHaveBeenCalledWith('Unauthenticated');
      },
      { timeout: 12_000 },
    );
    expect(mockRemoveToken).not.toHaveBeenCalled();
  });

  it('navega para Authenticated quando o token é validado com sucesso', async () => {
    mockGetToken.mockResolvedValue('valid-token');
    mockFetchWithTimeout.mockResolvedValue({
      ok: true,
      json: async () => ({ accessToken: 'refreshed' }),
    });

    const replace = jest.fn();
    render(<LoadingScreen navigation={{ replace, navigate: jest.fn() }} />);

    await waitFor(
      () => {
        expect(replace).toHaveBeenCalledWith('Authenticated');
      },
      { timeout: 12_000 },
    );

    expect(mockFetchWithTimeout).toHaveBeenCalledWith(
      'http://localhost/api/auth/token',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer valid-token' }),
      }),
      12_000,
    );
    expect(mockSetToken).toHaveBeenCalledWith('refreshed');
    expect(mockRemoveToken).not.toHaveBeenCalled();
  });

  it('em timeout da validação (AbortError), remove o token e segue para Unauthenticated', async () => {
    mockGetToken.mockResolvedValue('slow-network-token');
    const abortError = new DOMException('The operation was aborted.', 'AbortError');
    mockFetchWithTimeout.mockRejectedValue(abortError);

    const replace = jest.fn();
    render(<LoadingScreen navigation={{ replace, navigate: jest.fn() }} />);

    await waitFor(
      () => {
        expect(mockRemoveToken).toHaveBeenCalledTimes(1);
        expect(replace).toHaveBeenCalledWith('Unauthenticated');
      },
      { timeout: 12_000 },
    );
  });

  it('em erro de rede que não é abort, não remove o token e segue para Unauthenticated', async () => {
    mockGetToken.mockResolvedValue('some-token');
    mockFetchWithTimeout.mockRejectedValue(new Error('Network request failed'));

    const replace = jest.fn();
    render(<LoadingScreen navigation={{ replace, navigate: jest.fn() }} />);

    await waitFor(
      () => {
        expect(replace).toHaveBeenCalledWith('Unauthenticated');
      },
      { timeout: 12_000 },
    );
    expect(mockRemoveToken).not.toHaveBeenCalled();
  });

  it('quando a API responde não-OK, não remove o token e segue para Unauthenticated', async () => {
    mockGetToken.mockResolvedValue('expired-token');
    mockFetchWithTimeout.mockResolvedValue({
      ok: false,
      status: 401,
    });

    const replace = jest.fn();
    render(<LoadingScreen navigation={{ replace, navigate: jest.fn() }} />);

    await waitFor(
      () => {
        expect(replace).toHaveBeenCalledWith('Unauthenticated');
      },
      { timeout: 12_000 },
    );
    expect(mockRemoveToken).not.toHaveBeenCalled();
  });
});
