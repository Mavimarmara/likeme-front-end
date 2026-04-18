import 'expo/src/Expo.fx';
import './splashPreventAutoHide';
import 'react-native-gesture-handler';
import './nativeScreensEnable';

// i18n deve ser inicializado antes de qualquer componente que use useTranslation
import './src/i18n';

import { registerRootComponent } from 'expo';
import App from './App';

// FCM: setBackgroundMessageHandler só em release. Em __DEV__, reload (R no Metro) destrói o JS antes do
// teardown nativo do Firebase e pode derrubar o app (invertase/react-native-firebase#5225 e similares).
if (!__DEV__) {
  try {
    const messaging = require('@react-native-firebase/messaging').default;
    messaging().setBackgroundMessageHandler(async () => undefined);
  } catch {
    // Firebase Messaging não disponível (ex: web)
  }
}

registerRootComponent(App);
