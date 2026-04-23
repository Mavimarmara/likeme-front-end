// Auth hooks
export { useAuthLogin } from './auth/useAuthLogin';
export { useLogout } from './auth/useLogout';
export { useOnboardingRedirect } from './auth/useOnboardingRedirect';

// Community hooks
export { useUserFeed } from './community/useUserFeed';
export { useCommunities } from './community/useCommunities';
export { useCommunity } from './community/useCommunity';
export type { UseCommunityOptions, UseCommunityReturn } from './community/useCommunity';
export { usePostReplies } from './community/usePostReplies';
export type { PostLikeEngagement } from './community/usePostReplies';
export { usePost } from './community/usePost';

// Category hooks
export { useCategories, useCategoryDisplayLabel, getMarkerIdForCategory } from './category';
export type {
  UseCategoriesOptions,
  UseCategoriesReturn,
  UseCategoryDisplayLabelOptions,
  UseCategoryDisplayLabelReturn,
} from './category';

// Activities hooks
export { useActivities } from './activities/useActivities';

// Marketplace hooks
export { useProductDetails } from './marketplace/useProductDetails';
export { useAdvertisers } from './marketplace/useAdvertisers';
export { useAdvertiser } from './marketplace/useAdvertiser';
export { useMarketplaceAds } from './marketplace/useMarketplaceAds';
export { useProducts } from './marketplace/useProducts';
export { useProviderAds } from './marketplace/useProviderAds';
export { useSuggestedProducts, SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS } from './marketplace/useSuggestedProducts';
export { usePayment } from './marketplace/usePayment';
export { useCart } from './marketplace/useCart';
export type { UseCartOptions, UseCartReturn } from './marketplace/useCart';

// Layout
export { useKeyboardInset } from './useKeyboardInset';

// Formatted input hook
export { useFormattedInput } from './useFormattedInput';
export type { FormattedInputType } from './useFormattedInput';

export { useAnamnesisQuestionnaire } from './anamnesis/useAnamnesisQuestionnaire';
export { useAnamnesisProgress } from './anamnesis/useAnamnesisProgress';
export { useAnamnesisScores } from './anamnesis/useAnamnesisScores';
export type { AnamnesisProgress, CategoryProgress } from './anamnesis/useAnamnesisProgress';

// Chat hooks
export { useChat } from './chat/useChat';
export type { ChatConversation } from './chat/useChat';
export { useBlockedUser } from './chat/useBlockedUser';

// User hooks
export { useUserAvatar } from './auth/useUserAvatar';

// Person hooks
export { useLoadPersonalData } from './person/useLoadPersonalData';
export type { PersonFormData } from './person/useLoadPersonalData';

// Notification hooks
export { useNotifications } from './notification/useNotifications';
export { useFeatureFlag } from './featureFlags/useFeatureFlag';
export { useFeatureFlags } from './featureFlags/useFeatureFlags';
export { useSolutions } from './solution/useSolutions';

// Navigation hooks
export { useMenuItems } from './navigation/useMenuItems';

// i18n hooks
export { useTranslation } from './i18n';

// Types
export type { ActivityItem, UseActivitiesOptions, UseActivitiesReturn } from '@/types/activity/hooks';
