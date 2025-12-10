import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UnauthenticatedScreen from './index';

jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
  };
});

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

// Mock SVG components
jest.mock('@/assets', () => ({
  Logo: 'Logo',
}));

jest.mock('@/components/ui', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Header: () => null,
    Title: ({ title }: { title: string }) => <Text>{title}</Text>,
    PrimaryButton: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID={`button-${label.toLowerCase()}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    SecondaryButton: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID={`button-${label.toLowerCase()}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
  };
});

describe('UnauthenticatedScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<UnauthenticatedScreen />);
    
    expect(getByText('LIKE YOUR LIFE')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('handles next button press', () => {
    const { getByText } = render(<UnauthenticatedScreen />);
    
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Welcome');
  });

  it('handles login button press', () => {
    const { getByText } = render(<UnauthenticatedScreen />);
    
    const loginButton = getByText('Login');
    fireEvent.press(loginButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Welcome');
  });
});
