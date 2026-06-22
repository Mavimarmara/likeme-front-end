import { setOnboardingStep } from './setOnboardingStep';
import storageService from './storageService';

jest.mock('./storageService', () => ({
  __esModule: true,
  default: {
    setRegisterCompletedAt: jest.fn(),
    setObjectivesSelectedAt: jest.fn(),
    setPrivacyPolicyAcceptedAt: jest.fn(),
  },
}));

const mockStorage = storageService as jest.Mocked<typeof storageService>;

describe('setOnboardingStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ignora envelope inválido', async () => {
    await setOnboardingStep(null);
    await setOnboardingStep('texto');
    await setOnboardingStep([]);

    expect(mockStorage.setRegisterCompletedAt).not.toHaveBeenCalled();
    expect(mockStorage.setObjectivesSelectedAt).not.toHaveBeenCalled();
    expect(mockStorage.setPrivacyPolicyAcceptedAt).not.toHaveBeenCalled();
  });

  it('hidrata flags do formato GET /api/auth/token (onboarding aninhado)', async () => {
    await setOnboardingStep({
      data: {
        token: 'jwt',
        onboarding: {
          registerCompletedAt: '2026-01-03T00:00:00.000Z',
          objectivesSelectedAt: '2026-01-04T00:00:00.000Z',
          privacyPolicyAcceptedAt: '2026-01-02T00:00:00.000Z',
        },
      },
    });

    expect(mockStorage.setRegisterCompletedAt).toHaveBeenCalledWith('2026-01-03T00:00:00.000Z');
    expect(mockStorage.setObjectivesSelectedAt).toHaveBeenCalledWith('2026-01-04T00:00:00.000Z');
    expect(mockStorage.setPrivacyPolicyAcceptedAt).toHaveBeenCalledWith('2026-01-02T00:00:00.000Z');
  });

  it('hidrata flags do formato POST /api/auth/login (campos no mesmo nível de data)', async () => {
    await setOnboardingStep({
      data: {
        token: 'jwt',
        registerCompletedAt: '2026-01-03T00:00:00.000Z',
        objectivesSelectedAt: '2026-01-04T00:00:00.000Z',
        privacyPolicyAcceptedAt: '2026-01-02T00:00:00.000Z',
      },
    });

    expect(mockStorage.setRegisterCompletedAt).toHaveBeenCalledWith('2026-01-03T00:00:00.000Z');
    expect(mockStorage.setObjectivesSelectedAt).toHaveBeenCalledWith('2026-01-04T00:00:00.000Z');
    expect(mockStorage.setPrivacyPolicyAcceptedAt).toHaveBeenCalledWith('2026-01-02T00:00:00.000Z');
  });

  it('não sobrescreve objectivesSelectedAt quando backend devolve null', async () => {
    await setOnboardingStep({
      data: {
        onboarding: {
          registerCompletedAt: '2026-01-03T00:00:00.000Z',
          objectivesSelectedAt: null,
          privacyPolicyAcceptedAt: '2026-01-02T00:00:00.000Z',
        },
      },
    });

    expect(mockStorage.setRegisterCompletedAt).toHaveBeenCalled();
    expect(mockStorage.setObjectivesSelectedAt).not.toHaveBeenCalled();
    expect(mockStorage.setPrivacyPolicyAcceptedAt).toHaveBeenCalled();
  });
});
