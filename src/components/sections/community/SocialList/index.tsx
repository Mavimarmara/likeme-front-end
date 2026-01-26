import React, { useState, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import {
  LiveBanner,
  LiveBannerData,
  PostsSection,
  ProviderChat,
  NextEventsSection,
  ProviderChatCard,
} from '@/components/sections/community';
import { ProductsCarousel, PlansCarousel, Product, Plan } from '@/components/sections/product';
import { FilterMenu, type ButtonCarouselOption } from '@/components/ui/menu';
import { CategoryModal } from '@/components/ui/modals';
import { useTranslation } from '@/hooks/i18n';
import type { Post, Event } from '@/types';
import type { Program } from '@/types/program';
import type { FilterType } from '@/components/ui/modals/FilterModal';
import type { CommunityCategory } from '@/types/community';
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
  onFilterSave?: (filters: FilterType) => void;
  selectedFilters?: FilterType;
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
  programs?: Program[];
  selectedProgramId?: string;
  onProgramPress?: (program: Program | null) => void;
  categories?: CommunityCategory[];
  onCategorySelect?: (category: CommunityCategory | null) => void;
  selectedCategoryId?: string;
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
  onFilterSave,
  selectedFilters,
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
  programs,
  selectedProgramId,
  onProgramPress,
  categories = [],
  onCategorySelect,
  selectedCategoryId,
}) => {
  const { t } = useTranslation();
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const handleMarkerPress = () => {
    // Quando clicar no Marker, definir o selectedProgramId como MARKER_ID
    // e abrir o modal de categorias
    onProgramPress?.(null); // Limpar seleção de programa
    setIsCategoryModalVisible(true);
  };

  const handleCategorySelect = (category: CommunityCategory) => {
    onCategorySelect?.(category);
    // Não fechar o modal automaticamente - usuário deve clicar em Save
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalVisible(false);
  };

  const filterOptions: ButtonCarouselOption<string>[] = useMemo(() => {
    const options =
      programs?.map((program) => ({
        id: program.id,
        label: program.name,
      })) || [];

    return [{ id: '__ALL__', label: t('common.all') }, ...options];
  }, [programs, t]);

  const handleSelect = (optionId: string) => {
    if (optionId === '__ALL__') {
      onProgramPress?.(null);
      return;
    }
    const program = programs?.find((p) => p.id === optionId);
    if (program) {
      onProgramPress?.(program);
    }
  };

  const isAllSelected = !selectedProgramId || selectedProgramId === '__ALL__';
  const selectedId = isAllSelected ? '__ALL__' : selectedProgramId;

  return (
    <View style={styles.container}>
      {programs && programs.length > 0 && (
        <View style={styles.programsContainer}>
          <FilterMenu
            filterButtonLabel={t('marketplace.marker')}
            onFilterButtonPress={handleMarkerPress}
            carouselOptions={filterOptions}
            selectedCarouselId={selectedId}
            onCarouselSelect={handleSelect}
          />
        </View>
      )}
      <CategoryModal
        visible={isCategoryModalVisible}
        onClose={handleCategoryModalClose}
        categories={categories}
        onSelectCategory={handleCategorySelect}
        selectedCategoryId={selectedCategoryId}
      />
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
          onFilterSave={onFilterSave}
          selectedFilters={selectedFilters}
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
          <View>
            <ProductsCarousel
              title={t('home.productsRecommended')}
              subtitle={t('home.discoverProducts')}
              products={products}
              onProductPress={onProductPress}
              onProductLike={onProductLike}
            />
          </View>
        )}

        {plans && plans.length > 0 && (
          <View>
            <PlansCarousel
              title={t('activities.plansForYou')}
              subtitle={t('activities.discoverOptions')}
              plans={plans}
              onPlanPress={onPlanPress}
              onPlanLike={onPlanLike}
            />
          </View>
        )}

        {providerChat && (
          <View style={styles.sectionContainer}>
            <ProviderChatCard chat={providerChat} onPress={onProviderChatPress} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SocialList;
