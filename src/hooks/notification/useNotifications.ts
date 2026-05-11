import { useEffect, useRef, useCallback } from 'react';
import { Alert, AppState, type AppStateStatus } from 'react-native';
import notificationService, { RemoteMessage } from '@/services/notification/notificationService';
import { storageService } from '@/services';
import { logger } from '@/utils/logger';

interface UseNotificationsOptions {
  activeRouteName?: string;
  onNotificationReceived?: (message: RemoteMessage) => void;
  onNotificationOpened?: (message: RemoteMessage) => void;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { activeRouteName, onNotificationReceived, onNotificationOpened } = options;
  const registered = useRef(false);

  const registerDevice = useCallback(async () => {
    const session = await storageService.getToken();
    if (!session) {
      registered.current = false;
      return;
    }
    if (registered.current) {
      return;
    }

    try {
      const success = await notificationService.registerDevice();
      registered.current = success;

      logger.debug('[useNotifications] registro de dispositivo', { success });
    } catch (error) {
      logger.error('[useNotifications] Erro no registro:', error);
    }
  }, []);

  useEffect(() => {
    if (activeRouteName === 'Unauthenticated') {
      registered.current = false;
      return;
    }
    if (activeRouteName === 'Loading' || activeRouteName == null) {
      return;
    }
    registerDevice().catch(() => undefined);
  }, [activeRouteName, registerDevice]);

  useEffect(() => {
    const onAppState = (next: AppStateStatus) => {
      if (next === 'active') {
        registerDevice().catch(() => undefined);
      }
    };
    const sub = AppState.addEventListener('change', onAppState);
    return () => sub.remove();
  }, [registerDevice]);

  useEffect(() => {
    const unsub = notificationService.onTokenRefresh(async (newToken) => {
      const session = await storageService.getToken();
      if (!session) {
        return;
      }
      const ok = await notificationService.pushTokenToBackend(newToken);
      if (ok) {
        registered.current = true;
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const foregroundUnsub = notificationService.onForegroundMessage((message) => {
      logger.debug('[useNotifications] foreground', message);

      if (onNotificationReceived) {
        onNotificationReceived(message);
      } else if (message.notification) {
        Alert.alert(message.notification.title || 'LikeMe', message.notification.body || '');
      }
    });

    const openedUnsub = notificationService.onNotificationOpened((message) => {
      logger.debug('[useNotifications] opened', message);
      onNotificationOpened?.(message);
    });

    notificationService.getInitialNotification().then((message) => {
      if (message) {
        logger.debug('[useNotifications] initial', message);
        onNotificationOpened?.(message);
      }
    });

    return () => {
      foregroundUnsub();
      openedUnsub();
    };
  }, [onNotificationReceived, onNotificationOpened]);

  return { registerDevice };
}
