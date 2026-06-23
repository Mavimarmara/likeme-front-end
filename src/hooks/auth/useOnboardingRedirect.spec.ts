import { renderHook, waitFor } from '@testing-library/react-native';
import { useOnboardingRedirect } from './useOnboardingRedirect';
import { setOnboardingStep } from '@/services/auth/setOnboardingStep';

const mockGetToken = jest.fn();
const mockGetWelcomeScreenAccessedAt = jest.fn();
const mockGetPrivacyPolicyAcceptedAt = jest.fn();
const mockGetRegisterCompletedAt = jest.fn();
const mockGetObjectivesSelectedAt = jest.fn();
const mockGetUser = jest.fn();
const mockSetObjectivesSelectedAt = jest.fn();
const mockRefreshBackendSession = jest.fn();
const mockBackfill = jest.fn();
const mockGetMySelectedObjectives = jest.fn();

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
    setObjectivesSelectedAt: (...args: unknown[]) => mockSetObjectivesSelectedAt(...args),
    clearAll: jest.fn(),
  },
  AuthService: {
    refreshBackendSessionFromStoredCredentials: (...args: unknown[]) => mockRefreshBackendSession(...args),
  },
  personalObjectivesService: {
    backfillMyObjectivesFromLocalStorageIfNeeded: (...args: unknown[]) => mockBackfill(...args),
    getMySelectedObjectives: (...args: unknown[]) => mockGetMySelectedObjectives(...args),
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
    mockBackfill.mockResolvedValue(undefined);
    mockGetMySelectedObjectives.mockResolvedValue([]);
    mockSetObjectivesSelectedAt.mockImplementation(async (date: string) => {
      mockGetObjectivesSelectedAt.mockResolvedValue(date);
    });
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

  it('marca objetivos como concluídos quando o backend tem seleção mas não devolve objectivesSelectedAt', async () => {
    mockGetMySelectedObjectives.mockResolvedValue([{ id: 'obj-sleep', name: 'Improve my sleep' }]);
    mockSetOnboardingStep.mockImplementation(async () => {
      mockGetWelcomeScreenAccessedAt.mockResolvedValue('2026-01-01T00:00:00.000Z');
      mockGetPrivacyPolicyAcceptedAt.mockResolvedValue('2026-01-02T00:00:00.000Z');
      mockGetRegisterCompletedAt.mockResolvedValue('2026-01-03T00:00:00.000Z');
      mockGetObjectivesSelectedAt.mockResolvedValue(null);
    });

    renderHook(() => useOnboardingRedirect(navigationReplace));

    await waitFor(() => {
      expect(mockGetMySelectedObjectives).toHaveBeenCalledTimes(1);
      expect(mockSetObjectivesSelectedAt).toHaveBeenCalledWith(expect.any(String));
      expect(navigationReplace).toHaveBeenCalledWith('Home', undefined);
    });
  });

  it('sincroniza com backend, faz backfill e redireciona para Home após login (regressão APP-334)', async () => {
    mockSetOnboardingStep.mockImplementation(async () => {
      mockGetWelcomeScreenAccessedAt.mockResolvedValue('2026-01-01T00:00:00.000Z');
      mockGetPrivacyPolicyAcceptedAt.mockResolvedValue('2026-01-02T00:00:00.000Z');
      mockGetRegisterCompletedAt.mockResolvedValue('2026-01-03T00:00:00.000Z');
      mockGetObjectivesSelectedAt.mockResolvedValue('2026-01-04T00:00:00.000Z');
    });

    renderHook(() => useOnboardingRedirect(navigationReplace));

    await waitFor(() => {
      expect(mockRefreshBackendSession).toHaveBeenCalledTimes(2);
      expect(mockBackfill).toHaveBeenCalledTimes(1);
      expect(navigationReplace).toHaveBeenCalledWith('Home', undefined);
    });
  });

  it('redireciona para PersonalObjectives quando backend não devolve objectivesSelectedAt', async () => {
    mockSetOnboardingStep.mockImplementation(async () => {
      mockGetWelcomeScreenAccessedAt.mockResolvedValue('2026-01-01T00:00:00.000Z');
      mockGetPrivacyPolicyAcceptedAt.mockResolvedValue('2026-01-02T00:00:00.000Z');
      mockGetRegisterCompletedAt.mockResolvedValue('2026-01-03T00:00:00.000Z');
      mockGetObjectivesSelectedAt.mockResolvedValue(null);
    });

    renderHook(() => useOnboardingRedirect(navigationReplace));

    await waitFor(() => {
      expect(navigationReplace).toHaveBeenCalledWith('PersonalObjectives', {
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
      expect(mockBackfill).not.toHaveBeenCalled();
    });
  });
});
