import { renderHook, waitFor } from '@testing-library/react-native';
import { useOnboardingRedirect } from './useOnboardingRedirect';
import { setOnboardingStep } from '@/services/auth/setOnboardingStep';

const mockGetToken = jest.fn();
const mockGetWelcomeScreenAccessedAt = jest.fn();
const mockGetPrivacyPolicyAcceptedAt = jest.fn();
const mockGetRegisterCompletedAt = jest.fn();
const mockGetObjectivesSelectedAt = jest.fn();
const mockGetUser = jest.fn();
const mockRefreshBackendSession = jest.fn();

jest.mock('@/constants', () => ({
  AUTH_BOOTSTRAP_HTTP_TIMEOUT_MS: 100,
  FORCE_START_ONBOARDING_LOCALLY: false,
}));

jest.mock('@/utils', () => ({
  getNextOnboardingDestination: jest.requireActual('@/utils/auth/navigation').getNextOnboardingDestination,
}));

jest.mock('@/services/auth/setOnboardingStep', () => ({
  setOnboardingStep: jest.fn(),
}));

jest.mock('@/services/infrastructure/apiClient', () => ({
  invalidateApiClientAuthTokenMemoryCache: jest.fn(),
}));

jest.mock('@/services', () => ({
  storageService: {
    getToken: (...args: unknown[]) => mockGetToken(...args),
    getWelcomeScreenAccessedAt: (...args: unknown[]) => mockGetWelcomeScreenAccessedAt(...args),
    getPrivacyPolicyAcceptedAt: (...args: unknown[]) => mockGetPrivacyPolicyAcceptedAt(...args),
    getRegisterCompletedAt: (...args: unknown[]) => mockGetRegisterCompletedAt(...args),
    getObjectivesSelectedAt: (...args: unknown[]) => mockGetObjectivesSelectedAt(...args),
    getUser: (...args: unknown[]) => mockGetUser(...args),
    clearAll: jest.fn(),
  },
  AuthService: {
    refreshBackendSessionFromStoredCredentials: (...args: unknown[]) => mockRefreshBackendSession(...args),
  },
  userService: {
    getProfile: jest.fn(),
  },
}));

const mockSetOnboardingStep = setOnboardingStep as jest.MockedFunction<typeof setOnboardingStep>;

describe('useOnboardingRedirect', () => {
  const navigationReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetToken.mockResolvedValue('session-token');
    mockGetUser.mockResolvedValue({ name: 'João Souza' });
    mockRefreshBackendSession.mockImplementation(async () => {
      await mockSetOnboardingStep({
        data: {
          onboarding: {
            registerCompletedAt: '2026-01-03T00:00:00.000Z',
            objectivesSelectedAt: '2026-01-04T00:00:00.000Z',
            privacyPolicyAcceptedAt: '2026-01-02T00:00:00.000Z',
          },
        },
      });
      return { ok: true, responseBody: {} };
    });
  });

  it('sincroniza com backend e redireciona para Home quando snapshot está completo', async () => {
    mockSetOnboardingStep.mockImplementation(async () => {
      mockGetWelcomeScreenAccessedAt.mockResolvedValue('2026-01-01T00:00:00.000Z');
      mockGetPrivacyPolicyAcceptedAt.mockResolvedValue('2026-01-02T00:00:00.000Z');
      mockGetRegisterCompletedAt.mockResolvedValue('2026-01-03T00:00:00.000Z');
      mockGetObjectivesSelectedAt.mockResolvedValue('2026-01-04T00:00:00.000Z');
    });

    renderHook(() => useOnboardingRedirect(navigationReplace));

    await waitFor(() => {
      expect(mockRefreshBackendSession).toHaveBeenCalledTimes(1);
      expect(navigationReplace).toHaveBeenCalledWith('Home', undefined);
    });
  });

  it('redireciona para InterestCategories quando backend não devolve objectivesSelectedAt', async () => {
    mockSetOnboardingStep.mockImplementation(async () => {
      mockGetWelcomeScreenAccessedAt.mockResolvedValue('2026-01-01T00:00:00.000Z');
      mockGetPrivacyPolicyAcceptedAt.mockResolvedValue('2026-01-02T00:00:00.000Z');
      mockGetRegisterCompletedAt.mockResolvedValue('2026-01-03T00:00:00.000Z');
      mockGetObjectivesSelectedAt.mockResolvedValue(null);
    });

    renderHook(() => useOnboardingRedirect(navigationReplace));

    await waitFor(() => {
      expect(navigationReplace).toHaveBeenCalledWith('InterestCategories', {
        userName: 'João Souza',
        firstName: 'João',
      });
    });
  });

  it('não sincroniza quando não há token', async () => {
    mockGetToken.mockResolvedValue(null);

    renderHook(() => useOnboardingRedirect(navigationReplace));

    await waitFor(() => {
      expect(mockRefreshBackendSession).not.toHaveBeenCalled();
    });
  });
});
