import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import InterestCategoriesEditScreen from './index';

const t = (key: string) => {
  const map: Record<string, string> = {
    'auth.objectiveSleep': 'Sono',
    'auth.objectiveMovement': 'Movimento',
    'auth.loadingObjectives': 'Carregando categorias...',
    'profile.interestCategories.title': 'Categorias de interesse',
    'profile.interestCategories.supportText': 'Queremos entender seus interesses para personalizar sua experiência.',
    'profile.interestCategories.instruction': 'Selecione abaixo as opções que fazem sentido para você.',
    'profile.interestCategories.multiSelectNote': '*Pode escolher mais de uma opção.',
    'profile.interestCategories.save': 'Salvar',
    'profile.interestCategories.loadError': 'Não foi possível carregar suas categorias. Tente novamente.',
    'profile.interestCategories.saveError': 'Não foi possível salvar suas categorias. Tente novamente.',
    'common.retry': 'Tentar novamente',
    'common.error': 'Erro',
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
    GradientBackground: () => <View testID='gradient-background' />,
  };
});

jest.mock('@/analytics', () => ({
  useAnalyticsScreen: () => {
    /* noop */
  },
}));

jest.mock('@/components/ui', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Header: ({ onBackPress }: { onBackPress?: () => void }) => (
      <TouchableOpacity onPress={onBackPress}>
        <Text>Back</Text>
      </TouchableOpacity>
    ),
    IconSilhouette: () => <View testID='icon-silhouette' />,
    PrimaryButton: ({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) => (
      <TouchableOpacity onPress={onPress} disabled={disabled} accessibilityState={{ disabled: !!disabled }}>
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
  personCategoryService: {
    getMySelectedMarkerIds: jest.fn().mockResolvedValue([]),
    syncMyCategoriesFromMarkerIds: jest.fn().mockResolvedValue(undefined),
  },
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

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
const mockRoute = { params: undefined };

describe('InterestCategoriesEditScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServices().personCategoryService.getMySelectedMarkerIds.mockResolvedValue(['sleep']);
    getServices().personCategoryService.syncMyCategoriesFromMarkerIds.mockResolvedValue(undefined);
  });

  it('exibe loading enquanto carrega categorias', () => {
    getServices().personCategoryService.getMySelectedMarkerIds.mockReturnValue(new Promise(() => {}));

    const { getByText } = render(<InterestCategoriesEditScreen navigation={mockNavigation} route={mockRoute as any} />);

    expect(getByText('Carregando categorias...')).toBeTruthy();
  });

  it('renderiza copy de perfil sem botão Pular', async () => {
    const { getByText, queryByText } = render(
      <InterestCategoriesEditScreen navigation={mockNavigation} route={mockRoute as any} />,
    );

    await waitFor(() => {
      expect(getByText('Categorias de interesse')).toBeTruthy();
      expect(getByText('Salvar')).toBeTruthy();
      expect(queryByText('Pular')).toBeNull();
    });
  });

  it('exibe erro e recarrega ao tocar Tentar novamente', async () => {
    getServices()
      .personCategoryService.getMySelectedMarkerIds.mockRejectedValueOnce(new Error('API error'))
      .mockResolvedValueOnce(['sleep']);

    const { getByText } = render(<InterestCategoriesEditScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByText('Não foi possível carregar suas categorias. Tente novamente.')).toBeTruthy();
    });

    fireEvent.press(getByText('Tentar novamente'));

    await waitFor(() => {
      expect(getServices().personCategoryService.getMySelectedMarkerIds).toHaveBeenCalledTimes(2);
      expect(getByText('Categorias de interesse')).toBeTruthy();
    });
  });

  it('não salva enquanto não houver alteração na seleção', async () => {
    const { getByText } = render(<InterestCategoriesEditScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => expect(getByText('Salvar')).toBeTruthy());

    fireEvent.press(getByText('Salvar'));
    expect(getServices().personCategoryService.syncMyCategoriesFromMarkerIds).not.toHaveBeenCalled();

    fireEvent.press(getByText('Movimento'));
    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(getServices().personCategoryService.syncMyCategoriesFromMarkerIds).toHaveBeenCalledWith([
        'sleep',
        'activity',
      ]);
    });
  });

  it('volta ao perfil após salvar alterações', async () => {
    const { getByText } = render(<InterestCategoriesEditScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => expect(getByText('Movimento')).toBeTruthy());
    fireEvent.press(getByText('Movimento'));
    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(getServices().personCategoryService.syncMyCategoriesFromMarkerIds).toHaveBeenCalledWith([
        'sleep',
        'activity',
      ]);
      expect(mockNavigation.goBack).toHaveBeenCalled();
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  it('mostra alerta e não volta quando API falha ao salvar', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    getServices().personCategoryService.syncMyCategoriesFromMarkerIds.mockRejectedValue(new Error('API error'));

    const { getByText } = render(<InterestCategoriesEditScreen navigation={mockNavigation} route={mockRoute as any} />);

    await waitFor(() => expect(getByText('Movimento')).toBeTruthy());
    fireEvent.press(getByText('Movimento'));
    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Erro', 'Não foi possível salvar suas categorias. Tente novamente.');
    });
    expect(mockNavigation.goBack).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
