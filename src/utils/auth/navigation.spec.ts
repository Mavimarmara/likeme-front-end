import { getNextOnboardingDestination } from './navigation';

const WELCOME_AT = '2026-01-01T10:00:00.000Z';
const PRIVACY_AT = '2026-01-02T10:00:00.000Z';
const REGISTER_AT = '2026-01-03T10:00:00.000Z';
const OBJECTIVES_AT = '2026-01-04T10:00:00.000Z';

describe('getNextOnboardingDestination', () => {
  it('redireciona para Welcome quando welcomeScreenAccessedAt é null', () => {
    expect(getNextOnboardingDestination(null, PRIVACY_AT, REGISTER_AT, OBJECTIVES_AT)).toEqual({
      screen: 'Welcome',
    });
  });

  it('redireciona para PrivacyPolicies quando privacidade não foi aceita', () => {
    expect(getNextOnboardingDestination(WELCOME_AT, null, REGISTER_AT, OBJECTIVES_AT)).toEqual({
      screen: 'PrivacyPolicies',
      params: { userName: 'Usuário' },
    });
  });

  it('redireciona para Register quando registro não foi concluído', () => {
    expect(getNextOnboardingDestination(WELCOME_AT, PRIVACY_AT, null, OBJECTIVES_AT)).toEqual({
      screen: 'Register',
      params: { userName: 'Usuário' },
    });
  });

  it('redireciona para PersonalObjectives quando objetivos não foram selecionados', () => {
    expect(getNextOnboardingDestination(WELCOME_AT, PRIVACY_AT, REGISTER_AT, null)).toEqual({
      screen: 'PersonalObjectives',
      params: { userName: 'Usuário', firstName: 'Usuário' },
    });
  });

  it('redireciona para Home quando onboarding está completo no storage', () => {
    expect(getNextOnboardingDestination(WELCOME_AT, PRIVACY_AT, REGISTER_AT, OBJECTIVES_AT)).toEqual({
      screen: 'Home',
    });
  });

  it('usa userDisplayName nas params quando informado', () => {
    expect(getNextOnboardingDestination(WELCOME_AT, PRIVACY_AT, REGISTER_AT, null, 'Maria Silva')).toEqual({
      screen: 'PersonalObjectives',
      params: { userName: 'Maria Silva', firstName: 'Maria' },
    });
  });

  describe('regressão APP-334 (pós-logout + login)', () => {
    it('não manda para PersonalObjectives quando backend hidratou objectivesSelectedAt após storage limpo', () => {
      const afterBackendSync = getNextOnboardingDestination(
        WELCOME_AT,
        PRIVACY_AT,
        REGISTER_AT,
        OBJECTIVES_AT,
        'João Souza',
      );

      expect(afterBackendSync).toEqual({ screen: 'Home' });
    });

    it('reproduz o bug antigo quando só registro e privacidade vêm do backend (sem objetivos)', () => {
      const buggyDestination = getNextOnboardingDestination(WELCOME_AT, PRIVACY_AT, REGISTER_AT, null, 'João Souza');

      expect(buggyDestination).toEqual({
        screen: 'PersonalObjectives',
        params: { userName: 'João Souza', firstName: 'João' },
      });
    });
  });
});
