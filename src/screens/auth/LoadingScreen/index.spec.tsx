import { act, render, waitFor } from '@testing-library/react-native';
import { Animated, Image } from 'react-native';
import LoadingScreen from './index';

const mockFetchWithTimeout = jest.fn();
const mockGetToken = jest.fn();
const mockSetToken = jest.fn();
const mockRemoveToken = jest.fn();
const mockAuthLogin = jest.fn();
const mockAuthValidateToken = jest.fn();
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
  AuthService: {
    login: (...args: unknown[]) => mockAuthLogin(...args),
    validateToken: (...args: unknown[]) => mockAuthValidateToken(...args),
  },
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
  let consoleWarnSpy: jest.SpiedFunction<typeof console.warn>;

  beforeEach(() => {
    jest.useFakeTimers();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.clearAllMocks();
    mockGetToken.mockResolvedValue(null);
    mockEnsureI18nHydrated.mockResolvedValue(undefined);
    mockStartI18nHydration.mockResolvedValue(undefined);
    mockSetToken.mockResolvedValue(undefined);
    mockRemoveToken.mockResolvedValue(undefined);
    mockAuthLogin.mockResolvedValue({ accessToken: 'fresh-login-token' });
    mockAuthValidateToken.mockResolvedValue(undefined);

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
    consoleWarnSpy.mockRestore();
    (Animated.timing as unknown as jest.Mock).mockRestore?.();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('navega para Authenticated quando não há token e o login automático funciona', async () => {
    const replace = jest.fn();

    render(<LoadingScreen navigation={{ replace, navigate: jest.fn() }} />);
    await act(async () => {
      await jest.runAllTimersAsync();
    });

    await waitFor(
      () => {
        expect(replace).toHaveBeenCalledWith('Authenticated');
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
    await act(async () => {
      await jest.runAllTimersAsync();
    });

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

  it('em timeout da validação (AbortError), remove token e autentica por login automático', async () => {
    mockGetToken.mockResolvedValue('slow-network-token');
    const abortError = new DOMException('The operation was aborted.', 'AbortError');
    mockFetchWithTimeout.mockRejectedValue(abortError);

    const replace = jest.fn();
    render(<LoadingScreen navigation={{ replace, navigate: jest.fn() }} />);
    await act(async () => {
      await jest.runAllTimersAsync();
    });

    await waitFor(
      () => {
        expect(mockRemoveToken).toHaveBeenCalledTimes(1);
        expect(replace).toHaveBeenCalledWith('Authenticated');
      },
      { timeout: 12_000 },
    );
  });

  it('em erro de rede não-abort, tenta login automático e navega para Authenticated', async () => {
    mockGetToken.mockResolvedValue('some-token');
    mockFetchWithTimeout.mockRejectedValue(new Error('Network request failed'));

    const replace = jest.fn();
    render(<LoadingScreen navigation={{ replace, navigate: jest.fn() }} />);
    await act(async () => {
      await jest.runAllTimersAsync();
    });

    await waitFor(
      () => {
        expect(replace).toHaveBeenCalledWith('Authenticated');
      },
      { timeout: 12_000 },
    );
    expect(mockRemoveToken).not.toHaveBeenCalled();
  });

  it('quando a API responde não-OK, tenta login automático e navega para Authenticated', async () => {
    mockGetToken.mockResolvedValue('expired-token');
    mockFetchWithTimeout.mockResolvedValue({
      ok: false,
      status: 401,
    });

    const replace = jest.fn();
    render(<LoadingScreen navigation={{ replace, navigate: jest.fn() }} />);
    await act(async () => {
      await jest.runAllTimersAsync();
    });

    await waitFor(
      () => {
        expect(replace).toHaveBeenCalledWith('Authenticated');
      },
      { timeout: 12_000 },
    );
    expect(mockRemoveToken).not.toHaveBeenCalled();
  });

  it('quando login automático falha, navega para Error', async () => {
    mockGetToken.mockResolvedValue(null);
    mockAuthLogin.mockRejectedValue(new Error('Login failed'));

    const replace = jest.fn();
    render(<LoadingScreen navigation={{ replace, navigate: jest.fn() }} />);
    await act(async () => {
      await jest.runAllTimersAsync();
    });

    await waitFor(
      () => {
        expect(replace).toHaveBeenCalledWith('Error', {
          errorMessage: 'Nao foi possivel autenticar automaticamente. Tente novamente.',
        });
      },
      { timeout: 12_000 },
    );
  });

  it('aguarda retentativas do watchdog antes de exibir erro de internet', async () => {
    mockGetToken.mockImplementation(() => new Promise(() => {}));
    const replace = jest.fn();

    render(<LoadingScreen navigation={{ replace, navigate: jest.fn() }} />);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(23_999);
    });

    expect(replace).not.toHaveBeenCalled();

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1);
    });

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('Error', {
        errorMessage: 'Conexao com a internet necessaria para continuar.',
      });
    });
  });
});
