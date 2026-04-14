import 'expo/src/Expo.fx';

// i18n deve ser inicializado antes de qualquer componente que use useTranslation
import './src/i18n';

import { registerRootComponent } from 'expo';
import App from './App';

// FCM background message handler — deve ser registrado no entry point, fora de componentes React
try {
  const messaging = require('@react-native-firebase/messaging').default;
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    if (__DEV__) {
      console.log('[FCM] Background message:', remoteMessage);
    }
  });
} catch {
  // Firebase Messaging não disponível (ex: web ou Expo Go)
}

registerRootComponent(App);
