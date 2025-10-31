import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PersonalObjectivesScreen from './index';

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
  return {
    Header: () => null,
    Title: ({ title }: { title: string }) => <Text>{title}</Text>,
    Chip: ({ label, onPress, selected }: { label: string; onPress: () => void; selected: boolean }) => (
      <TouchableOpacity onPress={onPress} testID={`chip-${label}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    PrimaryButton: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    SecondaryButton: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    ButtonGroup: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

describe('PersonalObjectivesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        userName: 'John',
      },
    };

    const { getByText } = render(
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('John,')).toBeTruthy();
    expect(getByText('What are the main things we can help you with?')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
    expect(getByText('Skip information')).toBeTruthy();
  });

  it('navigates to SelfAwarenessIntro when Next button is pressed', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        userName: 'John',
      },
    };

    const { getByText } = render(
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute} />
    );

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('SelfAwarenessIntro');
  });

  it('navigates to SelfAwarenessIntro when Skip information button is pressed', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        userName: 'John',
      },
    };

    const { getByText } = render(
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute} />
    );

    const skipButton = getByText('Skip information');
    fireEvent.press(skipButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('SelfAwarenessIntro');
  });

  it('renders all objectives as chips', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        userName: 'John',
      },
    };

    const { getByText } = render(
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Get to know me better')).toBeTruthy();
    expect(getByText('Improve my habits')).toBeTruthy();
    expect(getByText('Find wellbeing programs')).toBeTruthy();
    expect(getByText('Improve my sleep')).toBeTruthy();
    expect(getByText('Gain insights on my wellbeing')).toBeTruthy();
    expect(getByText('Eat better')).toBeTruthy();
    expect(getByText('Buy health products')).toBeTruthy();
    expect(getByText('Find a community')).toBeTruthy();
    expect(getByText('Track my treatment/program')).toBeTruthy();
    expect(getByText('Move more')).toBeTruthy();
    expect(getByText('Track my mood')).toBeTruthy();
  });
});

