import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { Alert } from 'react-native';
import { AUTH0_CONFIG, AUTH_CONFIG, getApiUrl } from '@/config';
import storageService from './storageService';
import { logger } from '@/utils/logger';
import type { AuthResult, RegisterCredentials } from '@/types/auth';

class AuthService {
  private getAuthUrl(): string {
    return `https://${AUTH0_CONFIG.domain}/authorize`;
  }

  private getTokenUrl(): string {
    return `https://${AUTH0_CONFIG.domain}/oauth/token`;
  }

  private getUserInfoUrl(): string {
    return `https://${AUTH0_CONFIG.domain}/userinfo`;
  }

  /**
   * Retorna sempre a mesma URL de callback para o Auth0, para que você não precise
   * atualizar Allowed Callback/Logout URLs no Auth0 a cada deploy.
   * - Com proxy: https://auth.expo.dev/@pixelpulselab/likeme-front-end (fixo)
   * - Sem proxy: likeme://auth (fixo, scheme + path do app)
   */
  private getRedirectUri(): string {
    if (AUTH_CONFIG.useAuthProxy && AUTH_CONFIG.proxyUrl) {
      return AUTH_CONFIG.proxyUrl.trim().replace(/\/$/, '');
    }
    const scheme = AUTH_CONFIG.scheme || 'likeme';
    const path = AUTH_CONFIG.redirectPath || 'auth';
    return `${scheme}://${path}`;
  }

  async login(): Promise<AuthResult> {
    try {
      if (AUTH0_CONFIG.domain === 'your-auth0-domain.auth0.com' || AUTH0_CONFIG.clientId === 'your-auth0-client-id') {
        throw new Error(
          'Configuração do Auth0 não encontrada. Verifique as variáveis de ambiente EXPO_PUBLIC_AUTH0_DOMAIN, EXPO_PUBLIC_AUTH0_CLIENT_ID e EXPO_PUBLIC_AUTH0_AUDIENCE.',
        );
      }

      console.log('Starting login with domain:', AUTH0_CONFIG.domain);
      console.log('Redirect URI:', this.getRedirectUri());

      let discovery;
      try {
        discovery = await AuthSession.fetchDiscoveryAsync(`https://${AUTH0_CONFIG.domain}`);
      } catch (error) {
        logger.error('Discovery error:', error);
        if (error instanceof Error && error.message.includes('JSON')) {
          throw new Error(`Erro ao conectar com Auth0. Verifique se o domínio ${AUTH0_CONFIG.domain} está correto.`);
        }
        throw error;
      }

      if (!discovery) {
        throw new Error('Falha ao descobrir endpoints do Auth0');
      }

      console.log('Discovery successful');

      const redirectUri = this.getRedirectUri();
      console.log('Auth config useAuthProxy:', AUTH_CONFIG.useAuthProxy);
      console.log('Auth redirect URI (fixo, não muda entre deploys):', redirectUri);

      const request = new AuthSession.AuthRequest({
        clientId: AUTH0_CONFIG.clientId,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Code,
        redirectUri,
        usePKCE: true,
        extraParams:
          AUTH0_CONFIG.audience && AUTH0_CONFIG.audience !== 'your-api-identifier'
            ? { audience: AUTH0_CONFIG.audience }
            : {},
      });

      console.log('Auth request redirect URI:', request.redirectUri);

      console.log('Prompting for authentication...');
      const result = await request.promptAsync(discovery);
      console.log('Auth result type:', result.type);
      console.log('Auth result:', JSON.stringify(result, null, 2));

      if (result.type !== 'success') {
        if (result.type === 'cancel' || result.type === 'dismiss') {
          throw new Error('Login cancelled');
        }
        if (result.type === 'error') {
          const error = (result as any).error;
          const errorDescription =
            error?.description || error?.error_description || error?.message || 'Erro desconhecido';
          logger.error('Auth error details:', errorDescription);

          if (errorDescription.includes('Service not found') || errorDescription.includes('your-api-identifier')) {
            throw new Error(
              'Configuração do Auth0 Audience incorreta. Verifique a variável EXPO_PUBLIC_AUTH0_AUDIENCE no arquivo .env e configure com o identifier da sua API no Auth0 Dashboard.',
            );
          }

          throw new Error(`Falha na autenticação: ${errorDescription}`);
        }
        throw new Error(`Falha na autenticação. Tipo: ${result.type}`);
      }

      let tokenResponse;
      try {
        console.log('Exchanging code for token...');
        console.log('Request code:', result.params.code);
        console.log('Request state:', result.params.state);

        const codeVerifier = (request as any).codeVerifier;
        if (!codeVerifier) {
          throw new Error('code_verifier não encontrado no request. O PKCE pode não ter sido gerado corretamente.');
        }
        console.log('Code verifier found:', codeVerifier ? 'Yes' : 'No');

        tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: AUTH0_CONFIG.clientId,
            code: result.params.code,
            redirectUri: this.getRedirectUri(),
            extraParams: {
              code_verifier: codeVerifier,
            },
          },
          discovery,
        );
        console.log('Token exchange successful');
      } catch (error) {
        logger.error('Token exchange error:', error);
        if (error instanceof Error) {
          if (error.message.includes('code_verifier') || error.message.includes('codeVerifier')) {
            throw new Error(
              'Erro PKCE: O code_verifier não foi encontrado. Isso pode acontecer se a sessão foi perdida. Tente fazer login novamente.',
            );
          }
          if (error.message.includes('JSON')) {
            throw new Error('Erro ao processar resposta do Auth0. Verifique a configuração do cliente e do audience.');
          }
          throw new Error(`Erro ao trocar código por token: ${error.message}`);
        }
        throw new Error('Erro ao trocar código por token');
      }

      if (!tokenResponse.idToken) {
        logger.debug('Token response:', JSON.stringify(tokenResponse, null, 2));
        throw new Error(
          'Erro de configuração: idToken não foi retornado pelo Auth0. Verifique a configuração do audience.',
        );
      }

      console.log('idToken received, length:', tokenResponse.idToken.length);
      console.log('idToken preview:', tokenResponse.idToken.substring(0, 50) + '...');

      const userInfoResponse = await fetch(this.getUserInfoUrl(), {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
      });

      if (!userInfoResponse.ok) {
        const errorText = await userInfoResponse.text();
        logger.error('UserInfo error response:', errorText);
        throw new Error(`Falha ao obter informações do usuário: ${userInfoResponse.status}`);
      }

      const contentType = userInfoResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await userInfoResponse.text();
        logger.error('UserInfo não retornou JSON:', responseText.substring(0, 200));
        throw new Error('Resposta inválida do servidor Auth0');
      }

      const userInfo = await userInfoResponse.json();

      return {
        accessToken: tokenResponse.accessToken,
        idToken: tokenResponse.idToken,
        refreshToken: tokenResponse.refreshToken,
        user: {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        },
      };
    } catch (error) {
      logger.error('Login error:', error);
      logger.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (error instanceof Error) {
        if (error.message.includes('idToken')) {
          throw error;
        }
        if (error.message.includes('cancelled') || error.message.includes('cancel')) {
          throw error;
        }
        throw error;
      }
      throw new Error('Erro desconhecido durante o login');
    }
  }

  private getProjectNameForProxy(): string | undefined {
    if (AUTH_CONFIG.projectNameForProxy) {
      return AUTH_CONFIG.projectNameForProxy;
    }

    // Lazy import do Constants para evitar problemas durante a inicialização
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires -- dynamic optional dependency
      const Constants = require('expo-constants').default;
      const expoConfig = Constants?.expoConfig;
      if (!expoConfig) {
        return undefined;
      }

      if (expoConfig.originalFullName) {
        return expoConfig.originalFullName;
      }

      if (expoConfig.owner && expoConfig.slug) {
        return `@${expoConfig.owner}/${expoConfig.slug}`;
      }

      if (expoConfig.slug) {
        return expoConfig.slug;
      }
    } catch (error) {
      // Silenciosamente ignora erros se Constants não estiver disponível
    }

    return undefined;
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const response = await fetch(this.getTokenUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          client_id: AUTH0_CONFIG.clientId,
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao renovar token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw new Error('Falha ao renovar token.');
    }
  }

  async validateToken(authResult: AuthResult): Promise<any> {
    try {
      const url = getApiUrl('/api/auth/login');
      console.log('Validating token with backend:', url);
      console.log('Token length:', authResult.idToken.length);
      console.log('Token parts:', authResult.idToken.split('.').length);

      // Decode token header to check for kid
      try {
        const tokenParts = authResult.idToken.split('.');
        if (tokenParts.length >= 2) {
          const header = JSON.parse(
            (globalThis as typeof globalThis & { atob: (s: string) => string }).atob(tokenParts[0]),
          );
          console.log('Token header:', JSON.stringify(header));
          console.log('Token has kid?', !!header.kid);
        }
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: authResult.idToken,
          user: authResult.user,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;

        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            const errorText = await response.text();
            logger.error('Backend error response:', errorText.substring(0, 200));
            errorMessage = errorText.substring(0, 100) || errorMessage;
          }
        } else {
          const errorText = await response.text();
          logger.error('Backend error response (not JSON):', errorText.substring(0, 200));
        }

        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        logger.error('Backend não retornou JSON:', responseText.substring(0, 200));
        throw new Error('Resposta inválida do servidor');
      }

      const backendResponse = await response.json();

      const sessionToken =
        backendResponse.token ||
        backendResponse.accessToken ||
        backendResponse.data?.token ||
        backendResponse.data?.accessToken;

      if (sessionToken) {
        await storageService.setToken(sessionToken);
      } else {
        logger.warn('Backend não retornou token de sessão. Usando accessToken do Auth0.');
        await storageService.setToken(authResult.accessToken);
      }

      await storageService.setUser(authResult.user);

      const registerCompletedAt =
        backendResponse.registerCompletedAt || backendResponse.data?.registerCompletedAt || null;

      const objectivesSelectedAt =
        backendResponse.objectivesSelectedAt || backendResponse.data?.objectivesSelectedAt || null;

      await storageService.setRegisterCompletedAt(registerCompletedAt);
      await storageService.setObjectivesSelectedAt(objectivesSelectedAt);

      return backendResponse;
    } catch (error) {
      logger.error('Backend communication error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha na comunicação com o servidor.');
    }
  }

  async logout(): Promise<void> {
    try {
      try {
        const token = await storageService.getToken();
        if (token) {
          await fetch(getApiUrl('/api/auth/logout'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }).catch(() => {
            /* noop */
          });
        }
      } catch (error) {
        logger.warn('Erro ao fazer logout no backend:', error);
      }

      await storageService.clearAll();
    } catch (error) {
      logger.error('Logout error:', error);
      await storageService.clearAll();
    }
  }

  async logoutFromBackend(): Promise<void> {
    return this.logout();
  }

  /**
   * Registra o aceite da política de privacidade no backend (atualiza privacyPolicyAcceptedAt do usuário).
   */
  async acceptPrivacyPolicy(): Promise<void> {
    const token = await storageService.getToken();
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    const response = await fetch(getApiUrl('/api/auth/accept-privacy-policy'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Não foi possível registrar o aceite da política de privacidade.');
    }
  }
}

export default new AuthService();
