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

  it('redireciona para InterestCategories quando categorias não foram selecionadas', () => {
    expect(getNextOnboardingDestination(WELCOME_AT, PRIVACY_AT, REGISTER_AT, null)).toEqual({
      screen: 'InterestCategories',
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
      screen: 'InterestCategories',
      params: { userName: 'Maria Silva', firstName: 'Maria' },
    });
  });

  describe('regressão APP-334 (pós-logout + login via snapshot do backend)', () => {
    it('vai para Home quando storage foi hidratado com objectivesSelectedAt do backend', () => {
      expect(getNextOnboardingDestination(WELCOME_AT, PRIVACY_AT, REGISTER_AT, OBJECTIVES_AT, 'João Souza')).toEqual({
        screen: 'Home',
      });
    });

    it('vai para InterestCategories quando backend não devolve objectivesSelectedAt', () => {
      expect(getNextOnboardingDestination(WELCOME_AT, PRIVACY_AT, REGISTER_AT, null, 'João Souza')).toEqual({
        screen: 'InterestCategories',
        params: { userName: 'João Souza', firstName: 'João' },
      });
    });
  });
});
