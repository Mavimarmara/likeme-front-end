import React from 'react';
import { View } from 'react-native';
import { LiveBanner, LiveBannerData, PostsSection } from '@/components/ui';
import type { Post } from '@/types';
import { styles } from './styles';

type Props = {
  liveBanner?: LiveBannerData | null;
  onLivePress?: (live: LiveBannerData) => void;
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearchPress?: () => void;
  onLoadMore: () => void;
  onFilterPress?: () => void;
  footerComponent?: React.ReactNode;
};

const SocialList: React.FC<Props> = ({
  liveBanner,
  onLivePress,
  posts,
  loading,
  loadingMore,
  error,
  searchQuery,
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

