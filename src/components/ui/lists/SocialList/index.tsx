import React from 'react';
import { View } from 'react-native';
import { LiveBanner, LiveBannerData, PostsSection } from '@/components/ui';
import type { Post, Event } from '@/types';
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
  events?: Event[];
  onEventPress?: (event: Event) => void;
  onEventSave?: (event: Event) => void;
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
  events,
  onEventPress,
  onEventSave,
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
        events={events}
        onEventPress={onEventPress}
        onEventSave={onEventSave}
      />
    </View>
  );
};

export default SocialList;

