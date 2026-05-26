import type { NavigatorScreenParams } from '@react-navigation/native';

export type CommunityStackParamList = {
  CommunityList: { openFeedFromMenu?: true } | undefined;
  PostDetail: { post: import('@/types').Post };
};

type RootStackParamListCore = {
  ForcedUpdate: { storeUrl: string; message?: string };
  Unauthenticated: undefined;
  Authenticated: undefined;
  Welcome: undefined;
  AppPresentation: { userName?: string };
  Register: { userName?: string };
  Plans: { userName?: string };
  PersonalObjectives: { firstName?: string };
  Anamnesis: undefined;
  AnamnesisHome: undefined;
  AnamnesisBody: undefined;
  AnamnesisMind: undefined;
  AnamnesisHabits: { title: string; keyPrefix: string };
  Community: NavigatorScreenParams<CommunityStackParamList>;
  Chat: undefined;
  Activities:
    | {
        initialTab?: 'actives' | 'history';
        initialFilter?: 'all' | 'activities' | 'appointments' | 'orders';
      }
    | undefined;
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
      provider?: {
        name: string;
        avatar: string;
        description?: string;
      };
    };
  };
  Profile: undefined;
  SubscriptionList: undefined;
  ProtocolDetail: {
    protocol: {
      id: string;
      name: string;
      image?: string;
      badges?: string[];
      rating?: number;
      shortDescription?: string;
      description?: string;
      agreements?: string;
      providerName?: string;
      nextSessionDate?: string;
      modules?: import('@/types/program').ProgramModule[];
    };
  };
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
  Checkout: { zipCode?: string } | undefined;
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

export type AppLoadingNavigateTarget =
  | { name: 'ProductDetails'; params: RootStackParamListCore['ProductDetails'] }
  | { name: 'AffiliateProduct'; params: RootStackParamListCore['AffiliateProduct'] }
  | { name: 'Community'; params?: RootStackParamListCore['Community'] }
  | { name: 'Marketplace' }
  | { name: 'ProviderProfile'; params: RootStackParamListCore['ProviderProfile'] };

export type RootStackParamList = RootStackParamListCore & {
  AppLoading: {
    target: AppLoadingNavigateTarget;
    loadingMessage?: string;
  };
};

export type ChatStackParamList = {
  ChatList: { chat?: import('@/types').ProviderChat };
  ChatConversation: {
    channelId?: string;
    channelName: string;
    channelAvatar?: string;
    channelDescription?: string;
    /** Modo “nova conversa”: ID do parceiro (advertiser). Ao enviar, cria o canal e envia a mensagem. */
    targetAdvertiserId?: string;
    initialMessage?: string;
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
