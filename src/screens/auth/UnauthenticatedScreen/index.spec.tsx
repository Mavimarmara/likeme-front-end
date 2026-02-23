import { render, fireEvent } from '@testing-library/react-native';
import UnauthenticatedScreen from './index';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

jest.mock('@/hooks', () => ({
  useAuthLogin: (navigation: any) => ({
    handleLogin: () => navigation.navigate('Welcome'),
    isLoading: false,
  }),
}));

jest.mock('@/analytics', () => ({
  useAnalyticsScreen: jest.fn(),
  logButtonClick: jest.fn(),
  logNavigation: jest.fn(),
}));

jest.mock('./components', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  const { useTranslation } = require('@/hooks/i18n');
  return {
    UnauthenticatedStep1: ({ onNext, onLogin }: any) => {
      const { t } = useTranslation();
      return (
        <View>
          <Text>{t('auth.tagline')}</Text>
          <TouchableOpacity onPress={onNext}>
            <Text>{t('common.next')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogin}>
            <Text>{t('auth.login')}</Text>
          </TouchableOpacity>
        </View>
      );
    },
  };
});

describe('UnauthenticatedScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRoute = { key: 'Unauthenticated', name: 'Unauthenticated' as const, params: {} };

  it('renders correctly', () => {
    const { getByText } = render(<UnauthenticatedScreen navigation={mockNavigation} route={mockRoute} />);

    expect(getByText('auth.tagline')).toBeTruthy();
    expect(getByText('common.next')).toBeTruthy();
    expect(getByText('auth.login')).toBeTruthy();
  });

  it('handles next button press', () => {
    const { getByText } = render(<UnauthenticatedScreen navigation={mockNavigation} route={mockRoute} />);

    const nextButton = getByText('common.next');
    fireEvent.press(nextButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Welcome');
  });

  it('handles login button press', () => {
    const { getByText } = render(<UnauthenticatedScreen navigation={mockNavigation} route={mockRoute} />);

    const loginButton = getByText('auth.login');
    fireEvent.press(loginButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Welcome');
  });
});
