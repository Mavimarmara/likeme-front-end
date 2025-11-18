import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';
import { Alert } from 'react-native';
import { AUTH0_CONFIG, AUTH_CONFIG, getApiUrl } from '@/config';
import storageService from './storageService';

export interface AuthResult {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
  user: {
    email: string;
    name?: string;
    picture?: string;
  };
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

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

  private getRedirectUri(): string {
    const projectNameForProxy = this.getProjectNameForProxy();

    if (AUTH_CONFIG.useAuthProxy) {
      const proxyOptions: AuthSession.AuthSessionRedirectUriOptions & {
        useProxy?: boolean;
        projectNameForProxy?: string;
      } = {
        useProxy: true,
      };

      if (projectNameForProxy) {
        proxyOptions.projectNameForProxy = projectNameForProxy;
      }

      return AuthSession.makeRedirectUri(proxyOptions as any);
    }

    return AuthSession.makeRedirectUri({
      scheme: AUTH_CONFIG.scheme,
      path: AUTH_CONFIG.redirectPath,
    });
  }

  async login(): Promise<AuthResult> {
    try {
      if (AUTH0_CONFIG.domain === 'your-auth0-domain.auth0.com' || 
          AUTH0_CONFIG.clientId === 'your-auth0-client-id') {
        throw new Error('Configuração do Auth0 não encontrada. Verifique as variáveis de ambiente EXPO_PUBLIC_AUTH0_DOMAIN, EXPO_PUBLIC_AUTH0_CLIENT_ID e EXPO_PUBLIC_AUTH0_AUDIENCE.');
      }

      console.log('Starting login with domain:', AUTH0_CONFIG.domain);
      console.log('Redirect URI:', this.getRedirectUri());
      
      let discovery;
      try {
        discovery = await AuthSession.fetchDiscoveryAsync(`https://${AUTH0_CONFIG.domain}`);
      } catch (error) {
        console.error('Discovery error:', error);
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
      const projectNameForProxy = this.getProjectNameForProxy();
      console.log('Auth config useAuthProxy:', AUTH_CONFIG.useAuthProxy);
      console.log('Auth redirect URI resolved:', redirectUri);
      if (projectNameForProxy) {
        console.log('Auth project name for proxy:', projectNameForProxy);
      }

      const request = new AuthSession.AuthRequest({
        clientId: AUTH0_CONFIG.clientId,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Code,
        redirectUri,
        usePKCE: true,
        extraParams: AUTH0_CONFIG.audience && AUTH0_CONFIG.audience !== 'your-api-identifier' 
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
          const errorDescription = error?.description || error?.error_description || error?.message || 'Erro desconhecido';
          console.error('Auth error details:', errorDescription);
          
          if (errorDescription.includes('Service not found') || errorDescription.includes('your-api-identifier')) {
            throw new Error('Configuração do Auth0 Audience incorreta. Verifique a variável EXPO_PUBLIC_AUTH0_AUDIENCE no arquivo .env e configure com o identifier da sua API no Auth0 Dashboard.');
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
          discovery
        );
        console.log('Token exchange successful');
      } catch (error) {
        console.error('Token exchange error:', error);
        if (error instanceof Error) {
          if (error.message.includes('code_verifier') || error.message.includes('codeVerifier')) {
            throw new Error('Erro PKCE: O code_verifier não foi encontrado. Isso pode acontecer se a sessão foi perdida. Tente fazer login novamente.');
          }
          if (error.message.includes('JSON')) {
            throw new Error('Erro ao processar resposta do Auth0. Verifique a configuração do cliente e do audience.');
          }
          throw new Error(`Erro ao trocar código por token: ${error.message}`);
        }
        throw new Error('Erro ao trocar código por token');
      }

      if (!tokenResponse.idToken) {
        console.error('Token response:', JSON.stringify(tokenResponse, null, 2));
        throw new Error('Erro de configuração: idToken não foi retornado pelo Auth0. Verifique a configuração do audience.');
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
        console.error('UserInfo error response:', errorText);
        throw new Error(`Falha ao obter informações do usuário: ${userInfoResponse.status}`);
      }

      const contentType = userInfoResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await userInfoResponse.text();
        console.error('UserInfo não retornou JSON:', responseText.substring(0, 200));
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
      console.error('Login error:', error);
      console.error('Error details:', {
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

    const expoConfig = Constants.expoConfig;
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
      console.error('Token refresh error:', error);
      throw new Error('Falha ao renovar token.');
    }
  }

  async sendToBackend(authResult: AuthResult): Promise<any> {
    try {
      const url = getApiUrl('/api/auth/login');
      console.log('Sending to backend:', url);
      
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
            console.error('Backend error response:', errorText.substring(0, 200));
            errorMessage = errorText.substring(0, 100) || errorMessage;
          }
        } else {
          const errorText = await response.text();
          console.error('Backend error response (not JSON):', errorText.substring(0, 200));
        }
        
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Backend não retornou JSON:', responseText.substring(0, 200));
        throw new Error('Resposta inválida do servidor');
      }

      const backendResponse = await response.json();
      
      const sessionToken = backendResponse.token 
        || backendResponse.accessToken 
        || backendResponse.data?.token
        || backendResponse.data?.accessToken;
      
      if (sessionToken) {
        await storageService.setToken(sessionToken);
      } else {
        console.warn('Backend não retornou token de sessão. Usando accessToken do Auth0.');
        await storageService.setToken(authResult.accessToken);
      }

      await storageService.setUser(authResult.user);
      
      const registerCompletedAt = backendResponse.registerCompletedAt 
        || backendResponse.data?.registerCompletedAt 
        || null;
      
      const objectivesSelectedAt = backendResponse.objectivesSelectedAt 
        || backendResponse.data?.objectivesSelectedAt 
        || null;
      
      await storageService.setRegisterCompletedAt(registerCompletedAt);
      await storageService.setObjectivesSelectedAt(objectivesSelectedAt);
      
      return backendResponse;
    } catch (error) {
      console.error('Backend communication error:', error);
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
              'Authorization': `Bearer ${token}`,
            },
          }).catch(() => {});
        }
      } catch (error) {
        console.warn('Erro ao fazer logout no backend:', error);
      }
      
      await storageService.clearAll();
    } catch (error) {
      console.error('Logout error:', error);
      await storageService.clearAll();
    }
  }

  async logoutFromBackend(): Promise<void> {
    return this.logout();
  }
}

export default new AuthService();
