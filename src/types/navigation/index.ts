export type RootStackParamList = {
  Unauthenticated: undefined;
  Register: undefined;
  Anamnese: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Wellness: undefined;
  Activities: undefined;
  Protocol: undefined;
  Marketplace: undefined;
  Community: undefined;
  HealthProvider: undefined;
  Profile: undefined;
};

import type { Post } from '@/components/ui';

export type CommunityStackParamList = {
  CommunityList: undefined;
  PostDetails: { post: Post };
};

export interface ScreenProps<T extends keyof RootStackParamList> {
  navigation: any;
  route: {
    params: RootStackParamList[T];
  };
}

