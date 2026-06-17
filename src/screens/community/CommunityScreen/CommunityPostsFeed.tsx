import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, FlatList, Text, View, type ListRenderItem } from 'react-native';
import { EmptyState } from '@/components/ui';
import PostCard from '@/components/sections/community/PostCard';
import type { Post } from '@/types';
import { useTranslation } from '@/hooks/i18n';
import { styles } from './styles';

type Props = {
  feedPosts: Post[];
  loadingMore: boolean;
  feedHasMore: boolean;
  feedLoading: boolean;
  error: string | null;
  onLoadMore: () => boolean;
  onPostPress: (post: Post) => void;
  listHeader: React.ReactElement;
  recommendationsFooter: React.ReactNode;
};

const FeedPostRow = React.memo(
  ({ post, onPostPress }: { post: Post; onPostPress: (post: Post) => void }) => (
    <View style={styles.feedItemWrapper}>
      <PostCard post={post} onPress={onPostPress} />
    </View>
  ),
  (prev, next) => prev.post === next.post && prev.onPostPress === next.onPostPress,
);

FeedPostRow.displayName = 'FeedPostRow';

const FeedRecommendationsFooter = React.memo(({ children }: { children: React.ReactNode }) => (
  <View style={styles.feedListFooter}>{children}</View>
));

FeedRecommendationsFooter.displayName = 'FeedRecommendationsFooter';

const CommunityPostsFeed: React.FC<Props> = ({
  feedPosts,
  loadingMore,
  feedHasMore,
  feedLoading,
  error,
  onLoadMore,
  onPostPress,
  listHeader,
  recommendationsFooter,
}) => {
  const { t } = useTranslation();
  const loadMoreLockRef = useRef(false);
  const paginationRef = useRef({
    feedHasMore,
    feedLoading,
    loadingMore,
    postsCount: feedPosts.length,
  });
  paginationRef.current = {
    feedHasMore,
    feedLoading,
    loadingMore,
    postsCount: feedPosts.length,
  };

  useEffect(() => {
    if (!loadingMore) {
      loadMoreLockRef.current = false;
    }
  }, [loadingMore]);

  const requestLoadMore = useCallback(() => {
    const { feedHasMore: hasMore, feedLoading: isLoading, loadingMore: isLoadingMore } = paginationRef.current;
    if (loadMoreLockRef.current || !hasMore || isLoading || isLoadingMore) {
      return;
    }
    loadMoreLockRef.current = true;
    const started = onLoadMore();
    if (!started) {
      loadMoreLockRef.current = false;
    }
  }, [onLoadMore]);

  const feedViewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;
  const handleFeedViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      const {
        feedHasMore: hasMore,
        feedLoading: isLoading,
        loadingMore: isLoadingMore,
        postsCount,
      } = paginationRef.current;
      if (!hasMore || isLoading || isLoadingMore) {
        return;
      }
      const lastIndex = postsCount - 1;
      if (lastIndex < 0) {
        return;
      }
      if (viewableItems.some((entry) => entry.index === lastIndex)) {
        requestLoadMore();
      }
    },
    [requestLoadMore],
  );

  const handleMomentumScrollBegin = useCallback(() => {
    loadMoreLockRef.current = false;
  }, []);

  const renderPostItem = useCallback<ListRenderItem<Post>>(
    ({ item }) => <FeedPostRow post={item} onPostPress={onPostPress} />,
    [onPostPress],
  );

  const renderPostSeparator = useCallback(() => <View style={styles.feedItemSeparator} />, []);
  const postKeyExtractor = useCallback((post: Post) => post.id, []);
  const renderListHeader = useCallback(() => listHeader, [listHeader]);

  const loadingFooter = useMemo(() => {
    if (!loadingMore || feedPosts.length === 0) {
      return null;
    }
    return (
      <View
        style={styles.feedLoadingFooter}
        accessibilityRole='progressbar'
        accessibilityLabel={t('community.loadingMorePosts')}
      >
        <ActivityIndicator size='small' color='#4CAF50' />
        <Text style={styles.feedLoadingFooterLabel}>{t('community.loadingMorePosts')}</Text>
      </View>
    );
  }, [loadingMore, feedPosts.length, t]);

  const listFooter = useMemo(() => {
    if (feedHasMore) {
      return loadingFooter;
    }
    if (!recommendationsFooter) {
      return loadingFooter;
    }
    return (
      <FeedRecommendationsFooter>
        {loadingFooter}
        {recommendationsFooter}
      </FeedRecommendationsFooter>
    );
  }, [feedHasMore, loadingFooter, recommendationsFooter]);

  const listEmpty = useMemo(() => {
    if (error) {
      return (
        <View style={styles.feedEmptyContainer}>
          <Text style={styles.feedEmptyText}>{`Erro: ${error}`}</Text>
        </View>
      );
    }
    return <EmptyState title={t('community.noPostsFound')} description={t('community.noPostsFoundDescription')} />;
  }, [error, t]);

  return (
    <FlatList
      style={[{ flex: 1 }, { zIndex: 1 }]}
      contentContainerStyle={styles.feedContentContainer}
      showsVerticalScrollIndicator={false}
      data={feedPosts}
      keyExtractor={postKeyExtractor}
      renderItem={renderPostItem}
      ItemSeparatorComponent={renderPostSeparator}
      ListHeaderComponent={renderListHeader}
      ListFooterComponent={listFooter}
      ListEmptyComponent={listEmpty}
      onEndReached={requestLoadMore}
      onEndReachedThreshold={0.35}
      onViewableItemsChanged={handleFeedViewableItemsChanged}
      viewabilityConfig={feedViewabilityConfig}
      onMomentumScrollBegin={handleMomentumScrollBegin}
      removeClippedSubviews
      initialNumToRender={4}
      maxToRenderPerBatch={2}
      windowSize={5}
      updateCellsBatchingPeriod={100}
    />
  );
};

export default React.memo(CommunityPostsFeed);
