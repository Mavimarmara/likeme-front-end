import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProviderProfileScreen from './index';

jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('@/components/ui/layout', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    Header: ({ onBackPress }: any) => (
      <View>
        <TouchableOpacity onPress={onBackPress} testID="back-button">
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
    ),
    Background: () => null,
  };
});

jest.mock('@/assets', () => ({
  BackgroundIconButton: require('react-native').Image.resolveAssetSource({ uri: 'test' }),
}));

const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
  getParent: jest.fn(() => ({
    navigate: jest.fn(),
  })),
} as any;

const mockRouteWithProvider = {
  params: {
    providerId: 'provider-1',
    provider: {
      name: 'Dr. Avery Parker',
      title: 'Therapist & Wellness Coach',
      description: 'Specialized in mental health and wellness coaching.',
      rating: 4.8,
      specialties: ['Mental Health', 'Wellness Coaching', 'Therapy'],
      avatar: 'https://example.com/avatar.jpg',
    },
  },
} as any;

const mockRouteWithoutProvider = {
  params: {
    providerId: 'provider-1',
  },
} as any;

describe('ProviderProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  it('renders correctly with provider data', () => {
    const { getByText } = render(
      <ProviderProfileScreen navigation={mockNavigation} route={mockRouteWithProvider} />
    );

    expect(getByText('Dr. Avery Parker')).toBeTruthy();
    expect(getByText('Therapist & Wellness Coach')).toBeTruthy();
    expect(getByText('4.8')).toBeTruthy();
    expect(getByText('Specialized in mental health and wellness coaching.')).toBeTruthy();
    expect(getByText('Mental Health')).toBeTruthy();
    expect(getByText('Wellness Coaching')).toBeTruthy();
    expect(getByText('Therapy')).toBeTruthy();
  });

  it('renders correctly with default provider data when not provided', () => {
    const { getByText } = render(
      <ProviderProfileScreen navigation={mockNavigation} route={mockRouteWithoutProvider} />
    );

    expect(getByText('Dr. Avery Parker')).toBeTruthy();
    expect(getByText('Therapist & Wellness Coach')).toBeTruthy();
  });

  it('calls goBack when back button is pressed', () => {
    const { getByTestId } = render(
      <ProviderProfileScreen navigation={mockNavigation} route={mockRouteWithProvider} />
    );

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('handles Book Appointment button press', () => {
    const { getByText } = render(
      <ProviderProfileScreen navigation={mockNavigation} route={mockRouteWithProvider} />
    );

    const bookButton = getByText('Book Appointment');
    fireEvent.press(bookButton);

    expect(console.log).toHaveBeenCalledWith('Book appointment with:', 'provider-1');
  });

  it('handles Send Message button press', () => {
    const { getByText } = render(
      <ProviderProfileScreen navigation={mockNavigation} route={mockRouteWithProvider} />
    );

    const messageButton = getByText('Send Message');
    fireEvent.press(messageButton);

    expect(console.log).toHaveBeenCalledWith('Send message to:', 'provider-1');
  });

  it('displays avatar placeholder when avatar is not provided', () => {
    const routeWithoutAvatar = {
      params: {
        providerId: 'provider-1',
        provider: {
          name: 'Dr. Test',
          title: 'Test Title',
        },
      },
    } as any;

    const { getByText } = render(
      <ProviderProfileScreen navigation={mockNavigation} route={routeWithoutAvatar} />
    );

    // Should render the first letter of the name
    expect(getByText('D')).toBeTruthy();
  });
});
