import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import {
  LiveBanner,
  LiveBannerData,
  PostsSection,
  NextEventsSection,
  CommunityIntroSection,
  SpecialistCard,
} from '@/components/sections/community';
import type { SpecialistCardProps } from '@/components/sections/community/SpecialistCard';
import { CTACard } from '@/components/ui/cards';
import { ProductsCarousel, Product } from '@/components/sections/product';
import { storageService } from '@/services';
import { useTranslation } from '@/hooks/i18n';
import type { Post, Event } from '@/types';
import { styles } from './styles';

export type CommunityIntroData = {
  title: string;
  description: string;
  imageUri?: string | null;
};

type Props = {
  liveBanner?: LiveBannerData | null;
  onLivePress?: (live: LiveBannerData) => void;
  communityIntro?: CommunityIntroData | null;
  onIntroSeeMore?: () => void;
  specialist?: SpecialistCardProps | null;
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
  /** Quando informados, o estado do CTACard de boas-vindas fica controlado pelo pai (ex.: CommunityScreen) */
  welcomeDismissed?: boolean;
  onWelcomeClose?: () => void;
  /** Quando true, não usa ScrollView próprio; o conteúdo é renderizado para ficar dentro do scroll do pai. */
  embedInParentScroll?: boolean;
};

const SocialList: React.FC<Props> = ({
  liveBanner,
  onLivePress,
  communityIntro,
  onIntroSeeMore,
  specialist,
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
  welcomeDismissed: welcomeDismissedProp,
  onWelcomeClose: onWelcomeCloseProp,
  embedInParentScroll = false,
}) => {
  const { t } = useTranslation();
  const [welcomeDismissedLocal, setWelcomeDismissedLocal] = useState(true);

  useEffect(() => {
    if (onWelcomeCloseProp == null) {
      storageService.getCommunityWelcomeDismissed().then(setWelcomeDismissedLocal);
    }
  }, [onWelcomeCloseProp]);

  const handleWelcomeClose = useCallback(() => {
    if (onWelcomeCloseProp) {
      onWelcomeCloseProp();
    } else {
      setWelcomeDismissedLocal(true);
      storageService.setCommunityWelcomeDismissed(true);
    }
  }, [onWelcomeCloseProp]);

  const welcomeDismissed = onWelcomeCloseProp != null ? welcomeDismissedProp ?? true : welcomeDismissedLocal;

  const listContent = (
    <>
      {communityIntro && (
        <View style={styles.communityIntroContainer}>
          <CommunityIntroSection
            title={communityIntro.title}
            description={communityIntro.description}
            imageUri={communityIntro.imageUri}
            onSeeMore={onIntroSeeMore}
            seeMoreLabel={t('community.seeMore')}
            seeLessLabel={t('community.seeLess')}
          />
        </View>
      )}
      <View style={styles.ctaCardContainer}>
        {!welcomeDismissed && (
          <CTACard
            title={t('community.ctaCardTitle')}
            description={t('community.ctaCardDescription')}
            backgroundColor='#F6CFFB'
            titleStyle={{ fontSize: 20 }}
            style={styles.ctaCard}
            onClose={handleWelcomeClose}
          />
        )}
      </View>
      {specialist && (
        <View>
          <SpecialistCard
            name={specialist.name}
            subtitle={specialist.subtitle}
            rating={specialist.rating}
            tags={specialist.tags}
            avatarUri={specialist.avatarUri}
          />
        </View>
      )}
      <PostsSection posts={posts} loading={loading} loadingMore={loadingMore} error={error} onLoadMore={onLoadMore} />

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
