import type { RootStackParamList } from '@/types/navigation';
import { navigateWithAppLoading } from '@/utils/navigation/appLoadingNavigation';

type Navigation = {
  navigate: (screen: string, params?: unknown) => void;
};

export function navigateToMarketplace(navigation: Navigation): void {
  navigateWithAppLoading(navigation, { name: 'Marketplace' });
}

export function navigateToProviderProfile(navigation: Navigation, params: RootStackParamList['ProviderProfile']): void {
  navigateWithAppLoading(navigation, { name: 'ProviderProfile', params });
}
