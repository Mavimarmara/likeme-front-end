export type RootStackParamList = {
  Unauthenticated: undefined;
  Authenticated: undefined;
  Welcome: undefined;
  AppPresentation: { userName?: string };
  Register: { userName?: string };
  Plans: { userName?: string };
  PersonalObjectives: { userName?: string };
  Anamnesis: undefined;
  AnamnesisHome: undefined;
  AnamnesisBody: undefined;
  AnamnesisMind: undefined;
  AnamnesisHabits: { title: string; keyPrefix: string };
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
  AffiliateProduct: {
    productId: string;
    adId?: string;
    product?: {
      id: string;
      title: string;
      price: string;
      image: string;
      category?: string;
      description?: string;
      externalUrl?: string;
    };
  };
  Profile: undefined;
  PrivacyPolicies: { userName?: string };
  Home: undefined;
  Summary: undefined;
  AvatarProgress: undefined;
  MarkerDetails: {
    marker: {
      id: string;
      name: string;
      percentage: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
  };
  Cart: undefined;
  Checkout: undefined;
  CommunityPreview: {
    productId: string;
    productName?: string;
  };
  ProviderProfile: {
    providerId: string;
    provider?: {
      name: string;
      avatar?: string;
      title?: string;
      description?: string;
      rating?: number;
      specialties?: string[];
    };
  };
};

import type { Post } from '@/types';

export type CommunityStackParamList = {
  CommunityList: undefined;
  PostDetails: { post: Post };
  ChatList: { chat?: import('@/components/sections/community').ProviderChat };
  Chat: {
    channelId: string;
    channelName: string;
    channelAvatar?: string;
    channelDescription?: string;
  };
  ChatDetails: {
    channelId: string;
    channelName: string;
    channelAvatar?: string;
  };
};

export interface ScreenProps<T extends keyof RootStackParamList> {
  navigation: any;
  route: {
    params: RootStackParamList[T];
  };
}
