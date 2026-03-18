export type RootStackParamList = {
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
  Community: undefined;
  Chat: undefined;
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
  Checkout: { zipCode?: string } | undefined;
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

export type CommunityStackParamList = {
  CommunityList: undefined;
  PostDetail: { post: import('@/types').Post };
};

export type ChatStackParamList = {
  ChatList: { chat?: import('@/types').ProviderChat };
  Chat: {
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
