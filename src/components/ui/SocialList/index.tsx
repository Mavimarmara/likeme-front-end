import React from 'react';
import { View } from 'react-native';
import LiveBanner, { LiveBannerData } from '../LiveBanner';
import PostsSection from '../PostsSection';
import { Post } from '../PostCard';
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
  onLoadMore: () => void;
  onFilterPress?: () => void;
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
  onLoadMore,
  onFilterPress,
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
        onLoadMore={onLoadMore}
        onFilterPress={onFilterPress}
      />
    </View>
  );
};

export default SocialList;

