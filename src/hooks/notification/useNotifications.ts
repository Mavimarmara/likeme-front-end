import { useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import notificationService, { RemoteMessage } from '@/services/notification/notificationService';
import { logger } from '@/utils/logger';

interface UseNotificationsOptions {
  onNotificationReceived?: (message: RemoteMessage) => void;
  onNotificationOpened?: (message: RemoteMessage) => void;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { onNotificationReceived, onNotificationOpened } = options;
  const registered = useRef(false);

  const registerDevice = useCallback(async () => {
    if (registered.current) return;

    try {
      const success = await notificationService.registerDevice();
      registered.current = success;

      if (__DEV__) {
        console.log(`[useNotifications] Registro: ${success ? 'OK' : 'falhou'}`);
      }
    } catch (error) {
      logger.error('[useNotifications] Erro no registro:', error);
    }
  }, []);

  useEffect(() => {
    registerDevice();

    const foregroundUnsub = notificationService.onForegroundMessage((message) => {
      if (__DEV__) console.log('[useNotifications] Foreground:', message);

      if (onNotificationReceived) {
        onNotificationReceived(message);
      } else if (message.notification) {
        Alert.alert(message.notification.title || 'LikeMe', message.notification.body || '');
      }
    });

    const openedUnsub = notificationService.onNotificationOpened((message) => {
      if (__DEV__) console.log('[useNotifications] Opened:', message);
      onNotificationOpened?.(message);
    });

    notificationService.getInitialNotification().then((message) => {
      if (message) {
        if (__DEV__) console.log('[useNotifications] Initial:', message);
        onNotificationOpened?.(message);
      }
    });

    return () => {
      foregroundUnsub();
      openedUnsub();
    };
  }, [registerDevice, onNotificationReceived, onNotificationOpened]);

  return { registerDevice };
}
