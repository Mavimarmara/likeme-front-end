import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ProfileFloatingMenu from './index';
import { AuthService } from '@/services';

jest.mock('@/components/ui/buttons', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return {
    SecondaryButton: ({ label, onPress, testID, disabled, loading }: any) => (
      <Pressable testID={testID} onPress={onPress} disabled={disabled || loading}>
        <Text>{label}</Text>
      </Pressable>
    ),
  };
});

jest.mock('@/components/ui/media/CachedImage', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    CachedImage: (props: any) => <View {...props} />,
  };
});

jest.mock('@/config/environment', () => ({
  ACCOUNT_CONFIG: {
    deletionWebUrl: null,
  },
}));

jest.mock('@/utils/navigation/activitiesNavigation', () => ({
  navigateToActivitiesOrders: jest.fn(),
}));

jest.mock('@/utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock('@/services', () => ({
  AuthService: {
    logout: jest.fn(),
  },
  storageService: {
    getUser: jest.fn().mockResolvedValue({
      name: 'Ana Silva',
      email: 'ana@example.com',
    }),
  },
  userService: {
    deleteMyAccount: jest.fn(),
  },
}));

const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;

describe('ProfileFloatingMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthService.logout.mockResolvedValue(undefined);
  });

  it('limpa a sessão antes de resetar a navegação no logout', async () => {
    const rootNavigation = {
      reset: jest.fn(),
      navigate: jest.fn(),
    };
    const navigation = {
      getParent: () => rootNavigation,
      navigate: jest.fn(),
    };

    const { getByTestId } = render(
      <ProfileFloatingMenu visible navigation={navigation as any} onClose={jest.fn()} />,
    );

    fireEvent.press(getByTestId('profile-logout'));

    await waitFor(() => {
      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });
    expect(rootNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Unauthenticated' }],
    });
  });
});
