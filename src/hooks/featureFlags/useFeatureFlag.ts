import type { FeatureFlagKey } from '@/constants';
import { useFeatureFlags } from './useFeatureFlags';

type UseFeatureFlagReturn = {
  isEnabled: boolean;
  isLoading: boolean;
};

export function useFeatureFlag(flagKey: FeatureFlagKey): UseFeatureFlagReturn {
  const { flags, isLoading } = useFeatureFlags([flagKey]);
  const isEnabled = flags[flagKey] ?? false;

  return { isEnabled, isLoading };
}

export default useFeatureFlag;
