import { Platform } from 'react-native';
import notificationApiService from './notificationApiService';

type FirebaseMessagingModule = {
  (): {
    getToken(): Promise<string>;
    deleteToken(): Promise<void>;
    hasPermission(): Promise<number>;
    requestPermission(): Promise<number>;
    onMessage(listener: (message: RemoteMessage) => void): () => void;
    onNotificationOpenedApp(listener: (message: RemoteMessage) => void): () => void;
    getInitialNotification(): Promise<RemoteMessage | null>;
    setBackgroundMessageHandler(handler: (message: RemoteMessage) => Promise<void>): void;
  };
  AuthorizationStatus: {
    NOT_DETERMINED: -1;
    DENIED: 0;
    AUTHORIZED: 1;
    PROVISIONAL: 2;
  };
};

export interface RemoteMessage {
  messageId?: string;
  notification?: {
    title?: string;
    body?: string;
    imageUrl?: string;
  };
  data?: Record<string, string>;
}

export type NotificationHandler = (message: RemoteMessage) => void;

let messagingModule: FirebaseMessagingModule | null = null;
let initialized = false;

function getMessaging(): FirebaseMessagingModule | null {
  if (initialized) return messagingModule;
  initialized = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@react-native-firebase/messaging').default as FirebaseMessagingModule;
    messagingModule = mod;
    return mod;
  } catch {
    messagingModule = null;
    return null;
  }
}

class NotificationService {
  private foregroundUnsubscribe: (() => void) | null = null;
  private openedAppUnsubscribe: (() => void) | null = null;

  async requestPermission(): Promise<boolean> {
    const messaging = getMessaging();
    if (!messaging) return false;

    try {
      const authStatus = await messaging().requestPermission();
      const AuthorizationStatus = messaging.AuthorizationStatus;

      return authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;
    } catch (error) {
      if (__DEV__) console.warn('[Notification] Erro ao solicitar permissão:', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    const messaging = getMessaging();
    if (!messaging) return null;

    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      if (__DEV__) console.warn('[Notification] Erro ao obter token:', error);
      return null;
    }
  }

  async registerDevice(): Promise<boolean> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      if (__DEV__) console.log('[Notification] Permissão negada');
      return false;
    }

    const token = await this.getToken();
    if (!token) {
      if (__DEV__) console.warn('[Notification] Token FCM não obtido');
      return false;
    }

    try {
      const platform = Platform.OS === 'ios' ? 'ios' : 'android';
      await notificationApiService.registerToken(token, platform);
      if (__DEV__) console.log('[Notification] Dispositivo registrado');
      return true;
    } catch (error) {
      if (__DEV__) console.warn('[Notification] Erro ao registrar dispositivo:', error);
      return false;
    }
  }

  async unregisterDevice(): Promise<void> {
    const token = await this.getToken();
    if (token) {
      try {
        await notificationApiService.unregisterToken(token);
      } catch (error) {
        if (__DEV__) console.warn('[Notification] Erro ao desregistrar dispositivo:', error);
      }
    }

    const messaging = getMessaging();
    if (messaging) {
      try {
        await messaging().deleteToken();
      } catch (error) {
        if (__DEV__) console.warn('[Notification] Erro ao deletar token FCM:', error);
      }
    }
  }

  onForegroundMessage(handler: NotificationHandler): () => void {
    const messaging = getMessaging();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    if (!messaging) return () => {};

    this.foregroundUnsubscribe = messaging().onMessage(handler);
    return this.foregroundUnsubscribe;
  }

  onNotificationOpened(handler: NotificationHandler): () => void {
    const messaging = getMessaging();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    if (!messaging) return () => {};

    this.openedAppUnsubscribe = messaging().onNotificationOpenedApp(handler);
    return this.openedAppUnsubscribe;
  }

  async getInitialNotification(): Promise<RemoteMessage | null> {
    const messaging = getMessaging();
    if (!messaging) return null;

    try {
      return await messaging().getInitialNotification();
    } catch {
      return null;
    }
  }

  cleanup(): void {
    this.foregroundUnsubscribe?.();
    this.openedAppUnsubscribe?.();
    this.foregroundUnsubscribe = null;
    this.openedAppUnsubscribe = null;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
