import React from 'react';
import { View } from 'react-native';
import { LiveBanner, LiveBannerData, PostsSection, Post } from '@/components/ui';
import { styles } from './styles';

export interface Community {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  image?: string;
}

type Props = {
  communities: Community[];
  onCommunityPress: (community: Community) => void;
  selectedCommunityId?: string;
  liveBanner?: LiveBannerData | null;
  onLivePress?: (live: LiveBannerData) => void;
  // Props para PostsSection
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  searchQuery: string;
  onPostPress: (post: Post) => void;
  onSearchChange: (text: string) => void;
  onSearchPress?: () => void;
  onLoadMore: () => void;
  onFilterPress?: () => void;
  footerComponent?: React.ReactNode;
};

const SocialList: React.FC<Props> = ({
  communities,
  onCommunityPress,
  selectedCommunityId,
  liveBanner,
  onLivePress,
  posts,
  loading,
  loadingMore,
  error,
  searchQuery,
  onPostPress,
  onSearchChange,
  onSearchPress,
  onLoadMore,
  onFilterPress,
  footerComponent,
}) => {
  return (
    <View style={styles.container}>
      {liveBanner && onLivePress && (
        <View style={styles.liveBannerContainer}>
          <LiveBanner live={liveBanner} onPress={onLivePress} />
        </View>
      )}
      <PostsSection
        posts={posts}
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        searchQuery={searchQuery}
        onPostPress={onPostPress}
        onSearchChange={onSearchChange}
        onSearchPress={onSearchPress}
        onLoadMore={onLoadMore}
        onFilterPress={onFilterPress}
        footerComponent={footerComponent}
      />
    </View>
  );
};

export default SocialList;

