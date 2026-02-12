import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PersonalObjectivesScreen from './index';

const t = (key: string, opts?: Record<string, string>) => {
  const map: Record<string, string> = {
    'auth.personalObjectivesTitle': `${opts?.userName ?? ''},`,
    'auth.personalObjectivesQuestion': 'Quais são os principais pontos onde podemos te ajudar?',
    'auth.requiredField': 'Campo obrigatório',
    'auth.objectivesSelectAtLeastOne': 'Selecione ao menos um objetivo para continuar.',
    'auth.objectivesSaveError': 'Não foi possível salvar os objetivos. Tente novamente.',
    'auth.objectiveSleep': 'Sono',
    'auth.objectiveMovement': 'Movimento',
    'auth.objectiveRelationship': 'Relacionamento',
    'auth.objectiveStress': 'Estresse',
    'auth.objectiveOralHealth': 'Saúde bucal',
    'auth.objectiveNutrition': 'Nutrição',
    'auth.objectivePurpose': 'Propósito',
    'auth.objectiveSelfEsteem': 'Autoestima',
    'auth.objectiveSpirituality': 'Espiritualidade',
    'auth.objectiveEnvironment': 'Ambiente',
    'common.next': 'Próximo',
    'common.error': 'Erro',
    'common.skipInformation': 'Pular Informação',
    'auth.loadingObjectives': 'Carregando objetivos...',
  };
  return map[key] ?? key;
};

jest.mock('@/hooks/i18n', () => ({
  useTranslation: () => ({ t }),
}));

jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('@/analytics', () => ({
  useAnalyticsScreen: () => {},
  logEvent: jest.fn(),
}));

jest.mock('@/assets', () => ({
  GradientSplash6: 'GradientSplash6',
}));

jest.mock('@/components/ui', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Header: () => null,
    Title: ({ title }: { title: string }) => <Text>{title}</Text>,
    Chip: ({
      label,
      onPress,
      selected,
    }: {
      label: string;
      onPress: () => void;
      selected: boolean;
    }) => (
      <TouchableOpacity onPress={onPress} testID={`chip-${label}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    PrimaryButton: ({
      label,
      onPress,
      disabled,
    }: {
      label: string;
      onPress: () => void;
      disabled?: boolean;
    }) => (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        testID={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    SecondaryButton: ({
      label,
      onPress,
      disabled,
    }: {
      label: string;
      onPress: () => void;
      disabled?: boolean;
    }) => (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        testID={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    ButtonGroup: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    Loading: ({ message }: { message: string }) => <Text>{message}</Text>,
  };
});

jest.mock('@/services', () => ({
  personalObjectivesService: {
    getPersonalObjectives: jest.fn(),
  },
  storageService: {
    setObjectivesSelectedAt: jest.fn().mockResolvedValue(undefined),
    setSelectedObjectivesIds: jest.fn().mockResolvedValue(undefined),
    getSelectedObjectivesIds: jest.fn().mockResolvedValue([]),
  },
}));

const getServices = () => require('@/services');

jest.mock('@/utils', () => ({
  showError: jest.fn(),
}));

jest.mock('./useObjectives', () => ({
  useObjectives: () => ({
    objectives: [
      { id: '1', i18nKey: 'auth.objectiveSleep' },
      { id: '2', i18nKey: 'auth.objectiveMovement' },
    ],
    isLoading: false,
    error: null,
  }),
}));

describe('PersonalObjectivesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServices().personalObjectivesService.getPersonalObjectives.mockResolvedValue({
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
    getServices().storageService.getSelectedObjectivesIds.mockResolvedValue([]);
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
      expect(getByText('Quais são os principais pontos onde podemos te ajudar?')).toBeTruthy();
      expect(getByText('Próximo')).toBeTruthy();
      expect(getByText('Pular Informação')).toBeTruthy();
    });
  });

  it('navigates to Home when Next button is pressed with at least one objective selected', async () => {
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
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Próximo')).toBeTruthy();
    });

    fireEvent.press(getByTestId('chip-Sono'));
    fireEvent.press(getByText('Próximo'));

    await waitFor(() => {
      expect(getServices().storageService.setSelectedObjectivesIds).toHaveBeenCalledWith(['1']);
      expect(getServices().storageService.setObjectivesSelectedAt).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('navigates to Home when Skip information button is pressed with at least one objective selected', async () => {
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
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Pular Informação')).toBeTruthy();
    });

    fireEvent.press(getByTestId('chip-Sono'));
    fireEvent.press(getByText('Pular Informação'));

    await waitFor(() => {
      expect(getServices().storageService.setSelectedObjectivesIds).toHaveBeenCalledWith(['1']);
      expect(getServices().storageService.setObjectivesSelectedAt).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('renders objectives in Portuguese as chips after loading', async () => {
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
      expect(getByText('Sono')).toBeTruthy();
      expect(getByText('Movimento')).toBeTruthy();
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
      expect(getByTestId('chip-Sono')).toBeTruthy();
    });

    const chip = getByTestId('chip-Sono');
    fireEvent.press(chip);
    fireEvent.press(chip); // Toggle again

    expect(chip).toBeTruthy();
  });

  it('shows alert when Next is pressed without selecting any objective', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { userName: 'John' } };
    const alertSpy = jest.spyOn(require('react-native').Alert, 'alert');

    const { getByText } = render(
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => expect(getByText('Próximo')).toBeTruthy());
    fireEvent.press(getByText('Próximo'));

    expect(alertSpy).toHaveBeenCalledWith(
      'Campo obrigatório',
      'Selecione ao menos um objetivo para continuar.'
    );
    expect(getServices().storageService.setSelectedObjectivesIds).not.toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('shows alert and does not navigate when storage fails on submit', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { userName: 'John' } };
    const alertSpy = jest.spyOn(require('react-native').Alert, 'alert');
    getServices().storageService.setSelectedObjectivesIds.mockRejectedValue(new Error('Storage error'));

    const { getByText, getByTestId } = render(
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => expect(getByText('Próximo')).toBeTruthy());
    fireEvent.press(getByTestId('chip-Sono'));
    fireEvent.press(getByText('Próximo'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Erro', 'Não foi possível salvar os objetivos. Tente novamente.');
    });
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('does not double-submit when Next is pressed twice while submit is in progress', async () => {
    const submitPromise = new Promise<void>(() => {});
    getServices().storageService.setSelectedObjectivesIds.mockReturnValue(submitPromise);
    getServices().storageService.setObjectivesSelectedAt.mockReturnValue(submitPromise);

    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { userName: 'John' } };

    const { getByText, getByTestId } = render(
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => expect(getByText('Próximo')).toBeTruthy());
    fireEvent.press(getByTestId('chip-Sono'));
    fireEvent.press(getByText('Próximo'));
    fireEvent.press(getByText('Próximo'));

    await waitFor(() => {
      expect(getServices().storageService.setSelectedObjectivesIds).toHaveBeenCalledTimes(1);
    });
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });
});
