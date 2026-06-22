import { setOnboardingStep } from './setOnboardingStep';
import storageService from './storageService';

jest.mock('./storageService', () => ({
  __esModule: true,
  default: {
    setRegisterCompletedAt: jest.fn(),
    setObjectivesSelectedAt: jest.fn(),
    setPrivacyPolicyAcceptedAt: jest.fn(),
    getWelcomeScreenAccessedAt: jest.fn(),
    setWelcomeScreenAccessedAt: jest.fn(),
  },
}));

const mockStorage = storageService as jest.Mocked<typeof storageService>;

describe('setOnboardingStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.getWelcomeScreenAccessedAt.mockResolvedValue(null);
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

  it('não sobrescreve flags quando backend devolve null (ex.: objectivesSelectedAt ausente)', async () => {
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
    expect(mockStorage.setWelcomeScreenAccessedAt).not.toHaveBeenCalled();
  });

  it('marca welcomeScreenAccessedAt quando onboarding do backend está completo', async () => {
    await setOnboardingStep({
      data: {
        onboarding: {
          registerCompletedAt: '2026-01-03T00:00:00.000Z',
          objectivesSelectedAt: '2026-01-04T00:00:00.000Z',
          privacyPolicyAcceptedAt: '2026-01-02T00:00:00.000Z',
        },
      },
    });

    expect(mockStorage.setWelcomeScreenAccessedAt).toHaveBeenCalledWith(expect.any(String));
  });

  it('não altera welcomeScreenAccessedAt quando já existe localmente', async () => {
    mockStorage.getWelcomeScreenAccessedAt.mockResolvedValue('2026-01-01T00:00:00.000Z');

    await setOnboardingStep({
      data: {
        onboarding: {
          registerCompletedAt: '2026-01-03T00:00:00.000Z',
          objectivesSelectedAt: '2026-01-04T00:00:00.000Z',
          privacyPolicyAcceptedAt: '2026-01-02T00:00:00.000Z',
        },
      },
    });

    expect(mockStorage.setWelcomeScreenAccessedAt).not.toHaveBeenCalled();
  });
});
