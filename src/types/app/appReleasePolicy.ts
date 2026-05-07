export interface AppReleasePolicy {
  forceUpdateEnabled: boolean;
  minVersionIos: string;
  minVersionAndroid: string;
  recommendedVersionIos: string | null;
  recommendedVersionAndroid: string | null;
  storeUrlIos: string;
  storeUrlAndroid: string;
  message: string | null;
}
