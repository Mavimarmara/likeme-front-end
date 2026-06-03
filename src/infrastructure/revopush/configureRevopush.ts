import type { ComponentType } from 'react';
import { Platform } from 'react-native';
import codePush, { type CodePushOptions } from '@revopush/react-native-code-push';

export const REVOPUSH_SERVER_URL = 'https://api.revopush.org';

function buildRevopushSyncOptions(): CodePushOptions {
  if (!codePush?.CheckFrequency || !codePush?.InstallMode) {
    throw new Error(
      '[Revopush] Módulo nativo CodePush indisponível. Rode prebuild e reinstale o dev client, ou use build com Revopush habilitado.',
    );
  }

  return {
    checkFrequency: codePush.CheckFrequency.ON_APP_START,
    installMode: codePush.InstallMode.ON_NEXT_RESTART,
    mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
  };
}

export function wrapAppWithRevopush<P extends object>(RootComponent: ComponentType<P>): ComponentType<P> {
  if (__DEV__) {
    return RootComponent;
  }

  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return RootComponent;
  }

  return codePush(buildRevopushSyncOptions())(RootComponent);
}
