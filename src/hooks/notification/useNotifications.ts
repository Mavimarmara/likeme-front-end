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

      logger.debug('[useNotifications] registro de dispositivo', { success });
    } catch (error) {
      logger.error('[useNotifications] Erro no registro:', error);
    }
  }, []);

  useEffect(() => {
    registerDevice();

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
  }, [registerDevice, onNotificationReceived, onNotificationOpened]);

  return { registerDevice };
}
