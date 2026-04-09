import { FEATURE_FLAG_DEFAULTS, type FeatureFlagKey } from '@/constants';

type RemoteConfigInstance = {
  setConfigSettings(settings: { fetchTimeMillis?: number; minimumFetchIntervalMillis?: number }): Promise<void>;
  setDefaults(defaults: Record<string, string | number | boolean>): Promise<void>;
  fetchAndActivate(): Promise<boolean>;
  getBoolean(key: string): boolean;
  getValue(key: string): {
    asBoolean(): boolean;
    getSource?(): 'static' | 'default' | 'remote';
    source?: 'static' | 'default' | 'remote';
  };
};

type FirebaseRemoteConfigModule = () => RemoteConfigInstance;

function getRemoteConfigInstance(): RemoteConfigInstance | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- dependency opcional em runtime
    const remoteConfigModule = require('@react-native-firebase/remote-config').default as FirebaseRemoteConfigModule;
    return remoteConfigModule();
  } catch {
    return null;
  }
}

class FeatureFlagService {
  private initializationPromise: Promise<void> | null = null;

  private async ensureInitialized(remoteConfig: RemoteConfigInstance): Promise<void> {
    if (!this.initializationPromise) {
      this.initializationPromise = (async () => {
        try {
          await remoteConfig.setConfigSettings({
            fetchTimeMillis: 10_000,
            minimumFetchIntervalMillis: __DEV__ ? 0 : 3_600_000,
          });
        } catch (error) {
          console.warn('[FeatureFlags] Erro ao configurar Remote Config:', error);
        }

        try {
          await remoteConfig.setDefaults(FEATURE_FLAG_DEFAULTS);
        } catch (error) {
          console.warn('[FeatureFlags] Erro ao aplicar defaults locais:', error);
        }

        try {
          await remoteConfig.fetchAndActivate();
        } catch (error) {
          console.warn('[FeatureFlags] Erro ao inicializar Remote Config:', error);
        }
      })();
    }

    await this.initializationPromise;
  }

  async initialize(): Promise<void> {
    const remoteConfig = getRemoteConfigInstance();
    if (!remoteConfig) {
      return;
    }

    await this.ensureInitialized(remoteConfig);
  }

  async refresh(): Promise<void> {
    const remoteConfig = getRemoteConfigInstance();
    if (!remoteConfig) {
      return;
    }

    await this.ensureInitialized(remoteConfig);

    try {
      await remoteConfig.fetchAndActivate();
    } catch (error) {
      console.warn('[FeatureFlags] Erro ao atualizar flags:', error);
    }
  }

  async getBoolean(flagKey: FeatureFlagKey): Promise<boolean> {
    const defaultValue = FEATURE_FLAG_DEFAULTS[flagKey];
    const remoteConfig = getRemoteConfigInstance();

    if (!remoteConfig) {
      return defaultValue;
    }

    await this.ensureInitialized(remoteConfig);

    try {
      const value = remoteConfig.getValue(flagKey);
      const source = value.getSource?.() ?? value.source;

      if (source === 'static') {
        return defaultValue;
      }

      return value.asBoolean();
    } catch (error) {
      console.warn(`[FeatureFlags] Erro ao ler flag "${flagKey}":`, error);
      return defaultValue;
    }
  }

  async getBooleans(flagKeys: FeatureFlagKey[]): Promise<Record<FeatureFlagKey, boolean>> {
    const entries = await Promise.all(
      flagKeys.map(async (flagKey) => [flagKey, await this.getBoolean(flagKey)] as const),
    );
    return entries.reduce((acc, [flagKey, value]) => {
      acc[flagKey] = value;
      return acc;
    }, {} as Record<FeatureFlagKey, boolean>);
  }
}

export const featureFlagService = new FeatureFlagService();
export default featureFlagService;
