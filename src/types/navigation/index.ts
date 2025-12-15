export type RootStackParamList = {
  Unauthenticated: undefined;
  Register: undefined;
  Anamnese: undefined;
  Community: undefined;
  Activities: undefined;
  Marketplace: undefined;
  ProductDetails: {
    productId: string;
    product?: {
      id: string;
      title: string;
      price: string;
      image: string;
      category?: string;
      tags?: string[];
      description?: string;
      provider?: {
        name: string;
        avatar: string;
      };
      rating?: number;
    };
  };
  Profile: undefined;
  Home: undefined;
  Summary: undefined;
  Cart: undefined;
  Checkout: undefined;
};

import type { Post } from '@/types';

export type CommunityStackParamList = {
  CommunityList: undefined;
  PostDetails: { post: Post };
  ChatScreen: { chat?: import('@/components/ui/community').ProviderChat };
};

export interface ScreenProps<T extends keyof RootStackParamList> {
  navigation: any;
  route: {
    params: RootStackParamList[T];
  };
}

