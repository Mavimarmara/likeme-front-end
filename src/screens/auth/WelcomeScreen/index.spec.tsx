import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import WelcomeScreen from './index';

jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
  };
});

jest.mock('@/assets', () => ({
  GradientSplash3: 'GradientSplash3',
}));

jest.mock('@/components/ui', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  const RNTextInput = require('react-native').TextInput;
  return {
    Header: () => null,
    Title: ({ title, subtitle }: { title: string; subtitle?: string }) => (
      <View>
        <Text>{title}</Text>
        {subtitle && <Text>{subtitle}</Text>}
      </View>
    ),
    TextInput: React.forwardRef(({ placeholder, onChangeText, value, onSubmitEditing }: any, ref: any) => (
      <RNTextInput
        ref={ref}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        onSubmitEditing={onSubmitEditing}
        testID={`input-${placeholder}`}
      />
    )),
  };
});

describe('WelcomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    const { getByText, getByPlaceholderText } = render(<WelcomeScreen navigation={mockNavigation} />);

    expect(getByText('Welcome!')).toBeTruthy();
    expect(getByText('How can I call you?')).toBeTruthy();
    expect(getByPlaceholderText('Your name')).toBeTruthy();
  });

  it('navega para Intro ao pressionar Enter em qualquer teclado', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    const { getByPlaceholderText } = render(<WelcomeScreen navigation={mockNavigation} />);

    const input = getByPlaceholderText('Your name');
    fireEvent.changeText(input, 'John');
    fireEvent(input, 'submitEditing');

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Intro', { userName: 'John' });
  });

  it('shows alert when trying to continue with empty name', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholderText } = render(<WelcomeScreen navigation={mockNavigation} />);

    const input = getByPlaceholderText('Your name');
    fireEvent.changeText(input, '');
    fireEvent(input, 'submitEditing');

    expect(alertSpy).toHaveBeenCalledWith('Nome obrigatório', 'Por favor, digite seu nome para continuar.');
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('shows alert when trying to continue with only whitespace in name', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholderText } = render(<WelcomeScreen navigation={mockNavigation} />);

    const input = getByPlaceholderText('Your name');
    fireEvent.changeText(input, '   ');
    fireEvent(input, 'submitEditing');

    expect(alertSpy).toHaveBeenCalledWith('Nome obrigatório', 'Por favor, digite seu nome para continuar.');
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
