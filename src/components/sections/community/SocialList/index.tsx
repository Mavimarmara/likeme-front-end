import React, { type ReactNode } from 'react';
import { View, ScrollView } from 'react-native';
import { LiveBanner, LiveBannerData, PostsSection, NextEventsSection } from '@/components/sections/community';
import { ProductsCarousel, Product } from '@/components/sections/product';
import { useTranslation } from '@/hooks/i18n';
import type { Post, Event } from '@/types';
import { styles } from './styles';

type Props = {
  liveBanner?: LiveBannerData | null;
  onLivePress?: (live: LiveBannerData) => void;
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  onLoadMore: () => void;
  events?: Event[];
  onEventPress?: (event: Event) => void;
  onEventSave?: (event: Event) => void;
  products?: Product[];
  onProductPress?: (product: Product) => void;
  onProductLike?: (product: Product) => void;
  /** Quando true, não usa ScrollView próprio; o conteúdo é renderizado para ficar dentro do scroll do pai. */
  embedInParentScroll?: boolean;
  /** Renderizado antes do feed de posts (ex.: menu Informações), após CommunityDescriptionSection no pai. */
  betweenSpecialistAndPosts?: ReactNode;
  /** Quando false, omite PostsSection, eventos e carrossel de produtos. */
  renderPostsFeed?: boolean;
};

const SocialList: React.FC<Props> = ({
  liveBanner,
  onLivePress,
  posts,
  loading,
  loadingMore,
  error,
  onLoadMore,
  events,
  onEventPress,
  onEventSave,
  products,
  onProductPress,
  onProductLike,
  embedInParentScroll = false,
  betweenSpecialistAndPosts,
  renderPostsFeed = true,
}) => {
  const { t } = useTranslation();

  const listContent = (
    <>
      {betweenSpecialistAndPosts}
      {renderPostsFeed ? (
        <>
          <PostsSection
            posts={posts}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            onLoadMore={onLoadMore}
          />

          {events && events.length > 0 && (
            <View style={styles.sectionContainer}>
              <NextEventsSection events={events} onEventPress={onEventPress} onEventSave={onEventSave} />
            </View>
          )}

          {products && products.length > 0 && (
            <View style={styles.recommendedSection}>
              <ProductsCarousel
                title={t('home.productsRecommended', { provider: '' })}
                subtitle={t('home.discoverProducts')}
                products={products}
                onProductPress={onProductPress}
                onProductLike={onProductLike}
              />
            </View>
          )}
        </>
      ) : null}
    </>
  );

  return (
    <View style={styles.container}>
      {liveBanner && onLivePress && (
        <View style={styles.liveBannerContainer}>
          <LiveBanner live={liveBanner} onPress={onLivePress} />
        </View>
      )}
      {embedInParentScroll ? (
        <View style={styles.scrollContent}>{listContent}</View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
            const paddingToBottom = 20;
            if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
              onLoadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          {listContent}
        </ScrollView>
      )}
    </View>
  );
};

export default SocialList;
