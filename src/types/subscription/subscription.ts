export type SubscriptionKind = 'protocol' | 'service';

export interface SubscriptionListItem {
  id: string;
  kind: SubscriptionKind;
  productId: string;
  title: string;
  image: string;
  badges: string[];
  acquiredAt: string;
  subscriptionId?: string;
  communityId?: string;
  description?: string | null;
  agreements?: string | null;
}
