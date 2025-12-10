import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PersonalObjectivesScreen from './index';

jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
  };
});

jest.mock('@/assets', () => ({
  GradientSplash6: 'GradientSplash6',
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
    Loading: ({ message }: { message: string }) => <Text>{message}</Text>,
  };
});

const mockPersonalObjectivesService = {
  getPersonalObjectives: jest.fn(),
};

const mockStorageService = {
  setObjectivesSelectedAt: jest.fn(),
};

jest.mock('@/services', () => ({
  personalObjectivesService: mockPersonalObjectivesService,
  storageService: mockStorageService,
}));

jest.mock('@/utils', () => ({
  showError: jest.fn(),
}));

describe('PersonalObjectivesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPersonalObjectivesService.getPersonalObjectives.mockResolvedValue({
      data: {
        objectives: [
          { id: '1', name: 'Get to know me better' },
          { id: '2', name: 'Improve my habits' },
        ],
        pagination: {
          totalPages: 1,
        },
      },
    });
    mockStorageService.setObjectivesSelectedAt.mockResolvedValue(undefined);
  });

  it('renders correctly', async () => {
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

    await waitFor(() => {
      expect(getByText('John,')).toBeTruthy();
      expect(getByText('What are the main things we can help you with?')).toBeTruthy();
      expect(getByText('Next')).toBeTruthy();
      expect(getByText('Skip information')).toBeTruthy();
    });
  });

  it('navigates to Home when Next button is pressed', async () => {
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

    await waitFor(() => {
      expect(getByText('Next')).toBeTruthy();
    });

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(mockStorageService.setObjectivesSelectedAt).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('navigates to Home when Skip information button is pressed', async () => {
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

    await waitFor(() => {
      expect(getByText('Skip information')).toBeTruthy();
    });

    const skipButton = getByText('Skip information');
    fireEvent.press(skipButton);

    await waitFor(() => {
      expect(mockStorageService.setObjectivesSelectedAt).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('renders objectives as chips after loading', async () => {
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

    await waitFor(() => {
      expect(getByText('Get to know me better')).toBeTruthy();
      expect(getByText('Improve my habits')).toBeTruthy();
    });
  });

  it('toggles objective selection when chip is pressed', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        userName: 'John',
      },
    };

    const { getByTestId } = render(
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByTestId('chip-Get to know me better')).toBeTruthy();
    });

    const chip = getByTestId('chip-Get to know me better');
    fireEvent.press(chip);
    fireEvent.press(chip); // Toggle again

    // Should not throw errors
    expect(chip).toBeTruthy();
  });
});

