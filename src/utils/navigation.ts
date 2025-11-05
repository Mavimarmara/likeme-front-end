import { CommonActions } from '@react-navigation/native';

export interface ErrorNavigationParams {
  errorMessage?: string;
  onRetry?: () => void;
}

/**
 * Navega para a tela de erro
 * @param navigation - Objeto de navegação do React Navigation
 * @param errorMessage - Mensagem de erro a ser exibida
 * @param onRetry - Função opcional para tentar novamente
 */
export const navigateToError = (
  navigation: any,
  errorMessage?: string,
  onRetry?: () => void
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'Error',
          params: {
            errorMessage: errorMessage || 'Algo deu errado',
            onRetry,
          },
        },
      ],
    })
  );
};

/**
 * Alternativa mais simples usando navigate
 */
export const showError = (
  navigation: any,
  errorMessage?: string,
  onRetry?: () => void
) => {
  navigation.navigate('Error' as never, {
    errorMessage: errorMessage || 'Algo deu errado',
    onRetry,
  } as never);
};

export interface LoadingNavigationParams {
  loadingMessage?: string;
}

/**
 * Navega para a tela de loading
 * @param navigation - Objeto de navegação do React Navigation
 * @param loadingMessage - Mensagem de loading a ser exibida
 */
export const navigateToLoading = (
  navigation: any,
  loadingMessage?: string
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'AppLoading',
          params: {
            loadingMessage: loadingMessage || 'Carregando...',
          },
        },
      ],
    })
  );
};

/**
 * Alternativa mais simples usando navigate
 */
export const showLoading = (
  navigation: any,
  loadingMessage?: string
) => {
  navigation.navigate('AppLoading' as never, {
    loadingMessage: loadingMessage || 'Carregando...',
  } as never);
};

