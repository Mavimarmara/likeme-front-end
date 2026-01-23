import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import RegisterScreen from './index';

jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('@/assets', () => ({
  GradientSplash3: 'GradientSplash3',
}));

jest.mock('@/components/ui', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput: RNTextInput } = require('react-native');
  return {
    Header: () => null,
    Title: ({ title }: { title: string }) => <Text>{title}</Text>,
    TextInput: React.forwardRef(({ label, placeholder, onChangeText, value }: any, ref: any) => (
      <View>
        {label && <Text>{label}</Text>}
        <RNTextInput
          ref={ref}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          testID={`input-${placeholder}`}
        />
      </View>
    )),
    PrimaryButton: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity
        onPress={onPress}
        testID={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    SecondaryButton: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity
        onPress={onPress}
        testID={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    ButtonGroup: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {},
    };

    const { getByText } = render(<RegisterScreen navigation={mockNavigation} route={mockRoute} />);

    expect(getByText("Let's start,")).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
    expect(getByText('Skip information')).toBeTruthy();
  });

  it('navigates to PersonalObjectives when Next button is pressed', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        userName: 'John',
      },
    };

    const { getByText } = render(<RegisterScreen navigation={mockNavigation} route={mockRoute} />);

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('PersonalObjectives', {
      userName: 'John',
    });
  });

  it('navigates to PersonalObjectives with fullName when Next button is pressed and fullName is set', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        userName: 'John',
      },
    };

    const { getByText, getByTestId } = render(
      <RegisterScreen navigation={mockNavigation} route={mockRoute} />
    );

    const fullNameInput = getByTestId('input-Full Name');
    fireEvent.changeText(fullNameInput, 'John Doe');

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('PersonalObjectives', {
      userName: 'John Doe',
    });
  });

  it('navigates to PersonalObjectives when Skip button is pressed', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        userName: 'John',
      },
    };

    const { getByText } = render(<RegisterScreen navigation={mockNavigation} route={mockRoute} />);

    const skipButton = getByText('Skip information');
    fireEvent.press(skipButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('PersonalObjectives', {
      userName: 'John',
    });
  });

  it('shows alert when Next button is pressed without fullName', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {},
    };

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText, getByTestId } = render(
      <RegisterScreen navigation={mockNavigation} route={mockRoute} />
    );

    const fullNameInput = getByTestId('input-Full Name');
    fireEvent.changeText(fullNameInput, '');

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    expect(alertSpy).toHaveBeenCalledWith(
      'Campo obrigatório',
      'Por favor, preencha o nome completo.'
    );
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('shows alert when Next button is pressed with only whitespace in fullName', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {},
    };

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText, getByTestId } = render(
      <RegisterScreen navigation={mockNavigation} route={mockRoute} />
    );

    const fullNameInput = getByTestId('input-Full Name');
    fireEvent.changeText(fullNameInput, '   ');

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    expect(alertSpy).toHaveBeenCalledWith(
      'Campo obrigatório',
      'Por favor, preencha o nome completo.'
    );
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
