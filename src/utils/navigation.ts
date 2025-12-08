import { CommonActions } from '@react-navigation/routers';

export interface ErrorNavigationParams {
  errorMessage?: string | Error | unknown;
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
  errorMessage?: string | Error | unknown,
  onRetry?: () => void
) => {
  // Garante que errorMessage seja sempre uma string válida
  let message = 'Algo deu errado';
  if (errorMessage) {
    if (typeof errorMessage === 'string') {
      message = errorMessage;
    } else if (errorMessage instanceof Error) {
      message = errorMessage.message || 'Erro desconhecido';
    } else {
      message = String(errorMessage);
    }
  }
  
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'Error',
          params: {
            errorMessage: message,
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
  errorMessage?: string | Error | unknown,
  onRetry?: () => void
) => {
  // Garante que errorMessage seja sempre uma string válida
  let message = 'Algo deu errado';
  if (errorMessage) {
    if (typeof errorMessage === 'string') {
      message = errorMessage;
    } else if (errorMessage instanceof Error) {
      message = errorMessage.message || 'Erro desconhecido';
    } else {
      message = String(errorMessage);
    }
  }
  
  navigation.navigate('Error' as never, {
    errorMessage: message,
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

