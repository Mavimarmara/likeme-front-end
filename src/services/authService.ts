import Auth0 from 'react-native-auth0';
import { Alert } from 'react-native';
import { AUTH0_CONFIG, getApiUrl } from '@/config';
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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

const auth0 = new Auth0({
  domain: AUTH0_CONFIG.domain,
  clientId: AUTH0_CONFIG.clientId,
});

class AuthService {
  async loginWithEmail(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const result = await auth0.auth.passwordRealm({
        username: credentials.email,
        password: credentials.password,
        realm: 'Username-Password-Authentication',
        scope: 'openid profile email',
        audience: AUTH0_CONFIG.audience,
      });

      if (!result.idToken) {
        throw new Error('Erro de configuração: idToken não foi retornado pelo Auth0. Verifique a configuração do audience.');
      }

      const userInfo = await auth0.auth.userInfo({
        token: result.accessToken,
      });

      return {
        accessToken: result.accessToken,
        idToken: result.idToken,
        refreshToken: result.refreshToken,
        user: {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error && error.message.includes('idToken')) {
        throw error;
      }
      throw new Error('Falha no login. Verifique suas credenciais.');
    }
  }

  async registerWithEmail(credentials: RegisterCredentials): Promise<AuthResult> {
    try {
      await auth0.auth.createUser({
        email: credentials.email,
        password: credentials.password,
        username: credentials.email,
        name: credentials.name,
        connection: 'Username-Password-Authentication',
      });

      return await this.loginWithEmail({
        email: credentials.email,
        password: credentials.password,
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Falha no cadastro. Email já existe ou dados inválidos.');
    }
  }

  async loginWithSocial(provider: 'facebook' | 'google' | 'apple'): Promise<AuthResult> {
    try {
      const result = await auth0.webAuth.authorize({
        scope: 'openid profile email',
        connection: provider,
        audience: AUTH0_CONFIG.audience,
      });

      if (!result.idToken) {
        throw new Error('Erro de configuração: idToken não foi retornado pelo Auth0. Verifique a configuração do audience.');
      }

      const userInfo = await auth0.auth.userInfo({
        token: result.accessToken,
      });

      return {
        accessToken: result.accessToken,
        idToken: result.idToken,
        refreshToken: result.refreshToken,
        user: {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        },
      };
    } catch (error) {
      console.error(`${provider} login error:`, error);
      if (error instanceof Error && error.message.includes('idToken')) {
        throw error;
      }
      throw new Error(`Falha no login com ${provider}.`);
    }
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const result = await auth0.auth.refreshToken({
        refreshToken,
      });
      return result.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Falha ao renovar token.');
    }
  }

  async sendToBackend(authResult: AuthResult): Promise<any> {
    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha na comunicação com o backend');
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
      await auth0.webAuth.clearSession();
      
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
      
      await storageService.removeToken();
    } catch (error) {
      console.error('Logout error:', error);
      await storageService.removeToken();
    }
  }
}

export default new AuthService();
