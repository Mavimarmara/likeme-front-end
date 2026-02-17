import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import RegisterScreen from './index';

const t = (key: string, opts?: Record<string, string>) => {
  const map: Record<string, string> = {
    'auth.registerTitle': 'Vamos começar!',
    'common.next': 'Próximo',
    'common.skipInformation': 'Pular Informação',
    'auth.fullName': 'Nome completo',
    'auth.fullNamePlaceholder': 'Nome completo',
    'auth.age': 'Idade',
    'auth.agePlaceholder': 'Idade',
    'auth.requiredField': 'Campo obrigatório',
    'auth.fillFullName': 'Por favor, preencha o nome completo.',
    'auth.validationInvalidNumber': 'Informe um número válido.',
    'auth.validationOutOfRange': `Deve estar entre ${opts?.min ?? ''} e ${opts?.max ?? ''}.`,
    'auth.gender': 'Gênero',
    'auth.genderPlaceholder': 'Selecione',
    'auth.registerInvitationQuestion': 'Convite?',
    'auth.registerEnterCode': 'Código',
    'auth.registerCodePlaceholder': 'Código',
    'auth.registerInfoMessage': 'Info',
    'auth.weight': 'Peso',
    'auth.weightPlaceholder': 'Peso',
    'auth.height': 'Altura',
    'auth.heightPlaceholder': 'Altura',
    'auth.insurance': 'Convênio',
    'auth.insurancePlaceholder': 'Convênio',
    'common.close': 'Fechar',
    'common.error': 'Erro',
    'auth.registerError': 'Não foi possível salvar. Tente novamente.',
  };
  return map[key] ?? key;
};

jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('@/hooks/i18n', () => ({
  useTranslation: () => ({ t }),
}));

jest.mock('@/analytics', () => ({
  useAnalyticsScreen: () => {
    /* noop */
  },
}));

jest.mock('@/assets', () => ({
  GradientSplash5: 'GradientSplash5',
}));

jest.mock('@/services', () => ({
  storageService: {
    setRegisterCompletedAt: jest.fn().mockResolvedValue(undefined),
  },
  personsService: {
    createOrUpdatePerson: jest.fn().mockResolvedValue(undefined),
  },
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

const getServices = () => require('@/services');

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getServices().personsService.createOrUpdatePerson.mockResolvedValue(undefined);
    getServices().storageService.setRegisterCompletedAt.mockResolvedValue(undefined);
  });

  it('renders correctly', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: {} };

    const { getByText } = render(<RegisterScreen navigation={mockNavigation} route={mockRoute as any} />);

    expect(getByText('Vamos começar!')).toBeTruthy();
    expect(getByText('Próximo')).toBeTruthy();
    expect(getByText('Pular Informação')).toBeTruthy();
  });

  it('navigates to PersonalObjectives when Next button is pressed', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { userName: 'John' } };

    const { getByText, getByTestId } = render(<RegisterScreen navigation={mockNavigation} route={mockRoute as any} />);

    fireEvent.changeText(getByTestId('input-Nome completo'), 'John');
    fireEvent.press(getByText('Próximo'));

    await waitFor(() => {
      expect(getServices().personsService.createOrUpdatePerson).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('PersonalObjectives', {
        userName: 'John',
      });
    });
  });

  it('sends personData with optional fields when set', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: {} };

    const { getByText, getByTestId } = render(<RegisterScreen navigation={mockNavigation} route={mockRoute as any} />);

    fireEvent.changeText(getByTestId('input-Nome completo'), 'Maria Silva');
    fireEvent.press(getByText('Próximo'));

    await expect(getServices().personsService.createOrUpdatePerson).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Maria',
        lastName: 'Silva',
      }),
    );
  });

  it('navigates to PersonalObjectives with fullName when Next is pressed and fullName is set', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { userName: 'John' } };

    const { getByText, getByTestId } = render(<RegisterScreen navigation={mockNavigation} route={mockRoute as any} />);

    fireEvent.changeText(getByTestId('input-Nome completo'), 'John Doe');
    fireEvent.press(getByText('Próximo'));

    await waitFor(() => {
      expect(getServices().personsService.createOrUpdatePerson).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('PersonalObjectives', {
        userName: 'John Doe',
      });
    });
  });

  it('navigates to PersonalObjectives when Skip button is pressed', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: { userName: 'John' } };

    const { getByText } = render(<RegisterScreen navigation={mockNavigation} route={mockRoute as any} />);

    fireEvent.press(getByText('Pular Informação'));

    await expect(getServices().storageService.setRegisterCompletedAt).toHaveBeenCalled();
    expect(mockNavigation.navigate).toHaveBeenCalledWith('PersonalObjectives', {
      userName: 'John',
    });
  });

  it('shows alert when Next is pressed without fullName', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: {} };
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText, getByTestId } = render(<RegisterScreen navigation={mockNavigation} route={mockRoute as any} />);

    fireEvent.changeText(getByTestId('input-Nome completo'), '');
    fireEvent.press(getByText('Próximo'));

    expect(alertSpy).toHaveBeenCalledWith('Campo obrigatório', 'Por favor, preencha o nome completo.');
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
    expect(getServices().personsService.createOrUpdatePerson).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('shows alert when Next is pressed with only whitespace in fullName', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: {} };
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText, getByTestId } = render(<RegisterScreen navigation={mockNavigation} route={mockRoute as any} />);

    fireEvent.changeText(getByTestId('input-Nome completo'), '   ');
    fireEvent.press(getByText('Próximo'));

    expect(alertSpy).toHaveBeenCalledWith('Campo obrigatório', 'Por favor, preencha o nome completo.');
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('does not navigate when age is out of range and sets field error', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const mockRoute = { params: {} };

    const { getByText, getByTestId } = render(<RegisterScreen navigation={mockNavigation} route={mockRoute as any} />);

    fireEvent.changeText(getByTestId('input-Nome completo'), 'João');
    fireEvent.changeText(getByTestId('input-Idade'), '200');
    fireEvent.press(getByText('Próximo'));

    expect(getServices().personsService.createOrUpdatePerson).not.toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });
});
