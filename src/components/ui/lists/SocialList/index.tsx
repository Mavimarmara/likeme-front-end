import React from 'react';
import { View, ScrollView } from 'react-native';
import {
  LiveBanner,
  LiveBannerData,
  PostsSection,
  ProviderChat,
  NextEventsSection,
  ProviderChatCard,
  ProductsCarousel,
  PlansCarousel,
  Product,
  Plan,
} from '@/components/ui';
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
  providerChat?: ProviderChat;
  onProviderChatPress?: (chat: ProviderChat) => void;
  products?: Product[];
  onProductPress?: (product: Product) => void;
  onProductLike?: (product: Product) => void;
  plans?: Plan[];
  onPlanPress?: (plan: Plan) => void;
  onPlanLike?: (plan: Plan) => void;
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
  providerChat,
  onProviderChatPress,
  products,
  onProductPress,
  onProductLike,
  plans,
  onPlanPress,
  onPlanLike,
}) => {
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
        />

        {loadingMore && (
          <View style={styles.loadingFooter}>
            {/* Loading indicator será renderizado aqui se necessário */}
          </View>
        )}

        {events && events.length > 0 && (
          <View style={styles.sectionContainer}>
            <NextEventsSection
              events={events}
              onEventPress={onEventPress}
              onEventSave={onEventSave}
            />
          </View>
        )}

        {footerComponent}

        {products && products.length > 0 && (
          <View style={styles.sectionContainer}>
            <ProductsCarousel
              title="Products recommended for your sleep journey by Dr. Peter Valasquez"
              subtitle="Discover our options selected just for you"
              products={products}
              onProductPress={onProductPress}
              onProductLike={onProductLike}
            />
          </View>
        )}

        {plans && plans.length > 0 && (
          <View style={styles.sectionContainer}>
            <PlansCarousel
              title="Plans for you based on the evolution of your markers"
              subtitle="Discover our options selected just for you"
              plans={plans}
              onPlanPress={onPlanPress}
              onPlanLike={onPlanLike}
            />
          </View>
        )}

        {providerChat && (
          <View style={styles.sectionContainer}>
            <ProviderChatCard
              chat={providerChat}
              onPress={onProviderChatPress}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SocialList;

