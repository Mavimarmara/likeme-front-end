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
    'common.save': 'Salvar',
    'common.skip': 'Pular',
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
  useAnalyticsScreen: () => {
    /* noop */
  },
  logEvent: jest.fn(),
}));

jest.mock('@/assets', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    GradientSplash6: 'GradientSplash6',
    LogoMini: () => React.createElement(View),
    BackgroundIconButton: 'BackgroundIconButton',
  };
});

jest.mock('@/components/ui', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Header: ({ rightLabel, onRightPress, onBackPress }: { rightLabel?: string; onRightPress?: () => void; onBackPress?: () => void }) => (
      <View>
        <TouchableOpacity onPress={onBackPress}><Text>Back</Text></TouchableOpacity>
        {rightLabel != null && (
          <TouchableOpacity onPress={onRightPress}>
            <Text testID="header-right-label">{rightLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    IconSilhouette: () => <View testID="icon-silhouette" />,
    PrimaryButton: ({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) => (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        testID={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    SelectionButtonQuiz: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    Loading: ({ message }: { message: string }) => <Text>{message}</Text>,
  };
});

jest.mock('@/services', () => ({
  personalObjectivesService: {
    getPersonalObjectives: jest.fn(),
  },
  storageService: {
    setMarkersSelectedAt: jest.fn().mockResolvedValue(undefined),
    setSelectedMarkerIds: jest.fn().mockResolvedValue(undefined),
    getSelectedMarkerIds: jest.fn().mockResolvedValue([]),
  },
}));

const getServices = () => require('@/services');

jest.mock('./useMarkers', () => {
  const actual = jest.requireActual<typeof import('./useMarkers')>('./useMarkers');
  return {
    ...actual,
    useMarkers: () => ({
      markers: [
        { id: 'sleep', i18nKey: 'auth.objectiveSleep' },
        { id: 'activity', i18nKey: 'auth.objectiveMovement' },
      ],
      isLoading: false,
      error: null,
    }),
  };
});

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
    getServices().storageService.getSelectedMarkerIds.mockResolvedValue([]);
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

    const { getByText } = render(<PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByText('John,')).toBeTruthy();
      expect(getByText('Quais são os principais pontos onde podemos te ajudar?')).toBeTruthy();
      expect(getByText('Salvar')).toBeTruthy();
      expect(getByText('Pular')).toBeTruthy();
    });
  });

  it('navigates to Home when Salvar button is pressed with at least one objective selected', async () => {
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
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute as any} />,
    );

    await waitFor(() => {
      expect(getByText('Salvar')).toBeTruthy();
    });

    fireEvent.press(getByText('Sono'));
    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(getServices().storageService.setSelectedMarkerIds).toHaveBeenCalledWith(['sleep']);
      expect(getServices().storageService.setMarkersSelectedAt).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('navigates to Home when Pular is pressed without saving', async () => {
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
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute as any} />,
    );

    await waitFor(() => {
      expect(getByText('Pular')).toBeTruthy();
    });

    fireEvent.press(getByText('Pular'));

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
      expect(getServices().storageService.setSelectedMarkerIds).not.toHaveBeenCalled();
    });
  });

  it('renders markers in Portuguese after loading', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        userName: 'John',
      },
    };

    const { getByText } = render(<PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByText('Sono')).toBeTruthy();
      expect(getByText('Movimento')).toBeTruthy();
    });
  });

  it('toggles marker selection when row is pressed', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        userName: 'John',
      },
    };

    const { getByText } = render(<PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByText('Sono')).toBeTruthy();
    });

    const row = getByText('Sono');
    fireEvent.press(row);
    fireEvent.press(row); // Toggle again

    expect(row).toBeTruthy();
  });

  it('shows alert when Salvar is pressed without selecting any marker', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { userName: 'John' } };
    const alertSpy = jest.spyOn(require('react-native').Alert, 'alert');

    const { getByText } = render(<PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => expect(getByText('Salvar')).toBeTruthy());
    fireEvent.press(getByText('Salvar'));

    expect(alertSpy).toHaveBeenCalledWith('Campo obrigatório', 'Selecione ao menos um objetivo para continuar.');
    expect(getServices().storageService.setSelectedMarkerIds).not.toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('shows alert and does not navigate when storage fails on submit', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { userName: 'John' } };
    const alertSpy = jest.spyOn(require('react-native').Alert, 'alert');
    getServices().storageService.setSelectedMarkerIds.mockRejectedValue(new Error('Storage error'));

    const { getByText } = render(
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute as any} />,
    );

    await waitFor(() => expect(getByText('Salvar')).toBeTruthy());
    fireEvent.press(getByText('Sono'));
    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Erro', 'Não foi possível salvar os objetivos. Tente novamente.');
    });
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('does not double-submit when Salvar is pressed twice while submit is in progress', async () => {
    const submitPromise = new Promise<void>(() => {
      /* noop */
    });
    getServices().storageService.setSelectedMarkerIds.mockReturnValue(submitPromise);
    getServices().storageService.setMarkersSelectedAt.mockReturnValue(submitPromise);

    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { userName: 'John' } };

    const { getByText } = render(
      <PersonalObjectivesScreen navigation={mockNavigation} route={mockRoute as any} />,
    );

    await waitFor(() => expect(getByText('Salvar')).toBeTruthy());
    fireEvent.press(getByText('Sono'));
    fireEvent.press(getByText('Salvar'));
    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(getServices().storageService.setSelectedMarkerIds).toHaveBeenCalledTimes(1);
    });
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });
});
