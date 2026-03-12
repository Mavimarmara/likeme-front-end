import React from 'react';
import { View, ScrollView } from 'react-native';
import { LiveBanner, LiveBannerData, PostsSection, NextEventsSection } from '@/components/sections/community';
import { CTACard } from '@/components/ui/cards';
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
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {liveBanner && onLivePress && (
        <View style={styles.liveBannerContainer}>
          <LiveBanner live={liveBanner} onPress={onLivePress} />
        </View>
      )}
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
        <View style={styles.ctaCardContainer}>
          <CTACard
            title={t('community.ctaCardTitle')}
            description={t('community.ctaCardDescription')}
            backgroundColor='#F6CFFB'
            titleStyle={{ fontSize: 20 }}
            style={styles.ctaCard}
          />
        </View>
        <PostsSection posts={posts} loading={loading} loadingMore={loadingMore} error={error} onLoadMore={onLoadMore} />

        {loadingMore && (
          <View style={styles.loadingFooter}>{/* Loading indicator será renderizado aqui se necessário */}</View>
        )}

        {events && events.length > 0 && (
          <View style={styles.sectionContainer}>
            <NextEventsSection events={events} onEventPress={onEventPress} onEventSave={onEventSave} />
          </View>
        )}

        {products && products.length > 0 && (
          <View>
            <ProductsCarousel
              title={t('home.productsRecommended', { provider: '' })}
              subtitle={t('home.discoverProducts')}
              products={products}
              onProductPress={onProductPress}
              onProductLike={onProductLike}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SocialList;
