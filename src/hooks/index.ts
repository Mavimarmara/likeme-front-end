// Auth hooks
export { useAuthLogin } from './auth/useAuthLogin';
export { useLogout } from './auth/useLogout';
export { useOnboardingRedirect } from './auth/useOnboardingRedirect';

// Community hooks
export { useUserFeed } from './community/useUserFeed';
export { useCommunities } from './community/useCommunities';

// Activities hooks
export { useActivities } from './activities/useActivities';

// Marketplace hooks
export { useProductDetails } from './marketplace/useProductDetails';
export { useMarketplaceAds } from './marketplace/useMarketplaceAds';
export { useSuggestedProducts } from './marketplace/useSuggestedProducts';

// Formatted input hook
export { useFormattedInput } from './useFormattedInput';
export type { FormattedInputType } from './useFormattedInput';

export { useAnamnesisQuestionnaire } from './anamnesis/useAnamnesisQuestionnaire';
export { useAnamnesisProgress } from './anamnesis/useAnamnesisProgress';
export { useAnamnesisScores } from './anamnesis/useAnamnesisScores';
export type { AnamnesisProgress, CategoryProgress } from './anamnesis/useAnamnesisProgress';

// Navigation hooks
export { useMenuItems } from './navigation/useMenuItems';

// i18n hooks
export { useTranslation } from './i18n';

// Types
export type {
  ActivityItem,
  UseActivitiesOptions,
  UseActivitiesReturn,
} from '@/types/activity/hooks';
