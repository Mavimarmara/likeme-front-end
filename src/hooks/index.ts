// Auth hooks
export { useAuthLogin } from './auth/useAuthLogin';
export { useLogout } from './auth/useLogout';

// Community hooks
export { useUserFeed } from './community/useUserFeed';
export { useCommunities } from './community/useCommunities';

// Wellness hooks
export { useActivities } from './wellness/useActivities';

// Marketplace hooks
export { useProductDetails } from './marketplace/useProductDetails';
export { useMarketplaceAds } from './marketplace/useMarketplaceAds';

// Formatted input hook
export { useFormattedInput } from './useFormattedInput';
export type { FormattedInputType } from './useFormattedInput';

// Types
export type { ActivityItem, UseActivitiesOptions, UseActivitiesReturn } from '@/types/activity/hooks';

