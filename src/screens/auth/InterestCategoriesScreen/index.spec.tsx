import { render, fireEvent, waitFor } from '@testing-library/react-native';
import InterestCategoriesScreen from './index';

const t = (key: string, opts?: Record<string, string>) => {
  const map: Record<string, string> = {
    'auth.personalObjectivesTitle': `${opts?.firstName ?? ''},`,
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
    'auth.personalObjectivesStart': 'Iniciar',
    'auth.personalObjectivesCardTitle': 'Versão beta',
    'auth.personalObjectivesCardHighlightText': 'Destaque do card.',
    'auth.personalObjectivesCardDescription': 'Descrição do card.',
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

jest.mock('@/components/ui/layout', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    ScreenWithHeader: ({ children, headerProps }: any) => {
      const { Header } = require('@/components/ui');
      return (
        <View>
          <Header {...headerProps} />
          {children}
        </View>
      );
    },
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
    Header: ({
      rightLabel,
      onRightPress,
      onBackPress,
    }: {
      rightLabel?: string;
      onRightPress?: () => void;
      onBackPress?: () => void;
    }) => (
      <View>
        <TouchableOpacity onPress={onBackPress}>
          <Text>Back</Text>
        </TouchableOpacity>
        {rightLabel != null && (
          <TouchableOpacity onPress={onRightPress}>
            <Text testID='header-right-label'>{rightLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    IconSilhouette: () => <View testID='icon-silhouette' />,
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
    getMySelectedObjectives: jest.fn().mockResolvedValue([]),
    saveMyObjectivesFromMarkerIds: jest.fn().mockResolvedValue(undefined),
  },
  AuthService: {
    refreshBackendSessionFromStoredCredentials: jest.fn().mockResolvedValue({ ok: true, responseBody: null }),
  },
}));

jest.mock('@/utils', () => ({
  getNextOnboardingScreen: () => 'Home',
}));

const getServices = () => require('@/services');

jest.mock('@/hooks/interestCategories/useInterestCategoryMarkers', () => {
  const actual = jest.requireActual<typeof import('@/hooks/interestCategories/useInterestCategoryMarkers')>(
    '@/hooks/interestCategories/useInterestCategoryMarkers',
  );
  return {
    ...actual,
    useInterestCategoryMarkers: () => ({
      markers: [
        { id: 'sleep', i18nKey: 'auth.objectiveSleep' },
        { id: 'activity', i18nKey: 'auth.objectiveMovement' },
      ],
      isLoading: false,
      error: null,
    }),
  };
});

describe('InterestCategoriesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServices().personalObjectivesService.getMySelectedObjectives.mockResolvedValue([]);
    getServices().personalObjectivesService.saveMyObjectivesFromMarkerIds.mockResolvedValue(undefined);
    getServices().AuthService.refreshBackendSessionFromStoredCredentials.mockResolvedValue({
      ok: true,
      responseBody: null,
    });
  });

  it('renders correctly', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        firstName: 'John',
      },
    };

    const { getByText } = render(<InterestCategoriesScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByText('John,')).toBeTruthy();
      expect(getByText('Quais são os principais pontos onde podemos te ajudar?')).toBeTruthy();
      expect(getByText('Iniciar')).toBeTruthy();
      expect(getByText('Pular')).toBeTruthy();
    });
  });

  it('navega para Home ao tocar Iniciar com ao menos uma categoria selecionada', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        firstName: 'John',
      },
    };

    const { getByText } = render(<InterestCategoriesScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByText('Iniciar')).toBeTruthy();
    });

    fireEvent.press(getByText('Sono'));
    fireEvent.press(getByText('Iniciar'));

    await waitFor(() => {
      expect(getServices().personalObjectivesService.saveMyObjectivesFromMarkerIds).toHaveBeenCalledWith(['sleep']);
      expect(getServices().AuthService.refreshBackendSessionFromStoredCredentials).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('navega para Home ao tocar Pular sem salvar', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        firstName: 'John',
      },
    };

    const { getByText } = render(<InterestCategoriesScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByText('Pular')).toBeTruthy();
    });

    fireEvent.press(getByText('Pular'));

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
      expect(getServices().personalObjectivesService.saveMyObjectivesFromMarkerIds).not.toHaveBeenCalled();
    });
  });

  it('renders markers in Portuguese after loading', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const mockRoute = {
      params: {
        firstName: 'John',
      },
    };

    const { getByText } = render(<InterestCategoriesScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByText('Sono')).toBeTruthy();
      expect(getByText('Movimento')).toBeTruthy();
    });
  });

  it('restaura categorias já selecionadas ao carregar', async () => {
    getServices().personalObjectivesService.getMySelectedObjectives.mockResolvedValue([
      { id: 'obj-sleep', name: 'Improve my sleep' },
    ]);

    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { firstName: 'John' } };

    const { getByText } = render(<InterestCategoriesScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => expect(getByText('Iniciar')).toBeTruthy());
    fireEvent.press(getByText('Iniciar'));

    await waitFor(() => {
      expect(getServices().personalObjectivesService.saveMyObjectivesFromMarkerIds).toHaveBeenCalledWith(['sleep']);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('desmarca categoria ao tocar novamente na linha', async () => {
    getServices().personalObjectivesService.getMySelectedObjectives.mockResolvedValue([
      { id: 'obj-sleep', name: 'Improve my sleep' },
    ]);
    const alertSpy = jest.spyOn(require('react-native').Alert, 'alert');

    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { firstName: 'John' } };

    const { getByText } = render(<InterestCategoriesScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => expect(getByText('Sono')).toBeTruthy());
    fireEvent.press(getByText('Sono'));
    fireEvent.press(getByText('Iniciar'));

    expect(alertSpy).toHaveBeenCalledWith('Campo obrigatório', 'Selecione ao menos um objetivo para continuar.');
    expect(getServices().personalObjectivesService.saveMyObjectivesFromMarkerIds).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('exibe alerta quando Iniciar é pressionado sem selecionar categoria', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { firstName: 'John' } };
    const alertSpy = jest.spyOn(require('react-native').Alert, 'alert');

    const { getByText } = render(<InterestCategoriesScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => expect(getByText('Iniciar')).toBeTruthy());
    fireEvent.press(getByText('Iniciar'));

    expect(alertSpy).toHaveBeenCalledWith('Campo obrigatório', 'Selecione ao menos um objetivo para continuar.');
    expect(getServices().personalObjectivesService.saveMyObjectivesFromMarkerIds).not.toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('mostra alerta e não navega quando a API falha ao salvar', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { firstName: 'John' } };
    const alertSpy = jest.spyOn(require('react-native').Alert, 'alert');
    getServices().personalObjectivesService.saveMyObjectivesFromMarkerIds.mockRejectedValue(new Error('API error'));

    const { getByText } = render(<InterestCategoriesScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => expect(getByText('Iniciar')).toBeTruthy());
    fireEvent.press(getByText('Sono'));
    fireEvent.press(getByText('Iniciar'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Erro', 'Não foi possível salvar os objetivos. Tente novamente.');
    });
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('não submete duas vezes enquanto o salvamento está em andamento', async () => {
    const submitPromise = new Promise<void>(() => {
      /* noop */
    });
    getServices().personalObjectivesService.saveMyObjectivesFromMarkerIds.mockReturnValue(submitPromise);

    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { firstName: 'John' } };

    const { getByText } = render(<InterestCategoriesScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => expect(getByText('Iniciar')).toBeTruthy());
    fireEvent.press(getByText('Sono'));
    fireEvent.press(getByText('Iniciar'));
    fireEvent.press(getByText('Iniciar'));

    await waitFor(() => {
      expect(getServices().personalObjectivesService.saveMyObjectivesFromMarkerIds).toHaveBeenCalledTimes(1);
    });
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });
});
