import React, { useState } from 'react';
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
  ProgramSelector,
  CategoryModal,
} from '@/components/ui';
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
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const handleMarkerPress = () => {
    // Quando clicar no Marker, definir o selectedProgramId como MARKER_ID
    // e abrir o modal de categorias
    onProgramPress?.(null); // Limpar seleção de programa
    setIsCategoryModalVisible(true);
  };

  const handleCategorySelect = (category: CommunityCategory) => {
    onCategorySelect?.(category);
    setIsCategoryModalVisible(false);
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalVisible(false);
  };

  const MARKER_ID = '__MARKER__';
  // Marker está selecionado se uma categoria foi selecionada
  const isMarkerSelected = !!selectedCategoryId;

  return (
    <View style={styles.container}>
      {programs && programs.length > 0 && (
        <View style={styles.programsContainer}>
          <ProgramSelector
            programs={programs}
            selectedProgramId={isMarkerSelected ? MARKER_ID : selectedProgramId}
            onSelect={(program) => {
              if (program === null) {
                onProgramPress?.(null);
              } else {
                onProgramPress?.(program);
              }
            }}
            onMarkerPress={handleMarkerPress}
            showMarker={true}
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
              title="Products recommended for your sleep journey by Dr. Peter Valasquez"
              subtitle="Discover our options selected just for you"
              products={products}
              onProductPress={onProductPress}
              onProductLike={onProductLike}
            />
          </View>
        )}

        {plans && plans.length > 0 && (
          <View>
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

