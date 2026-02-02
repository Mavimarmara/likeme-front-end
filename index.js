// i18n deve ser inicializado antes de qualquer componente que use useTranslation
import './src/i18n';

import { LogBox } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './App';

// Desabilitar todos os logs que aparecem na tela do celular
LogBox.ignoreAllLogs(true);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
