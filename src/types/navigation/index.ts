export type RootStackParamList = {
  Unauthenticated: undefined;
  Register: undefined;
  Anamnese: undefined;
  Community: undefined;
  Activities: undefined;
  Marketplace: undefined;
  Profile: undefined;
  Home: undefined;
  Summary: undefined;
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

