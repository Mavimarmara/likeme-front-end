import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { ProductRowCard } from '@/components/ui/cards';
import { ProductList } from '@/components/sections/product/ProductList';
import { ToggleTabs } from '@/components/ui/tabs';
import type { ButtonCarouselOption } from '@/components/ui/carousel';
import { StickyFilterCarouselRow } from '@/components/ui/menu';
import { FilterPickerModal } from '@/components/ui/modals';
import { EmptyState } from '@/components/ui/feedback';
import { useCategories } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { handleAdNavigation } from '@/utils';
import type { Ad } from '@/types/ad';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

/** Item no modo lista simples (ex.: ShoppingList da comunidade). */
export type SimpleProductItem = {
  id: string;
  title: string;
  image: string;
  price?: number | null;
  tag?: string;
  tags?: string[];
};

type AdsListProps = {
  navigation?: StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
  ads?: Ad[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  orderOptions?: ButtonCarouselOption<string>[];
  selectedOrder?: string;
  onOrderSelect?: (id: string) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  title?: string;
  /** Modo lista simples: exibe products e usa onProductPress em vez de ads + navigation. */
  products?: SimpleProductItem[];
  onProductPress?: (product: SimpleProductItem) => void;
  /** Modo com abas (ex.: ShoppingList): tabs + listas por aba. professionalsContent é exibido quando a aba "professionals" está selecionada. */
  solutionTabs?: { id: string; label: string }[];
  productsList?: SimpleProductItem[];
  servicesList?: SimpleProductItem[];
  programsList?: SimpleProductItem[];
  professionalsContent?: React.ReactNode;
  tabsContainerStyle?: StyleProp<ViewStyle>;
  /** Modo controlado (ex.: Marketplace): tab selecionada e callback vêm do pai; o conteúdo é a lista ads. */
  selectedTabId?: string;
  onTabChange?: (tabId: string) => void;
  /** Label do botão de ação no empty state (ex.: "Limpar filtros"). */
  emptyActionLabel?: string;
  /** Ação ao clicar no botão do empty state. */
  onEmptyActionPress?: () => void;
  /**
   * Quando true com `selectedTabId` + `onTabChange`: lista controlada pelo pai sem `ToggleTabs`
   * nem fila de ordenação (ex.: Marketplace — filtro de solução e ordenação ficam no header).
   */
  suppressInlineListChrome?: boolean;
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';
const AdsList: React.FC<AdsListProps> = ({
  navigation,
  ads = [],
  loading = false,
  hasMore = false,
  onLoadMore = () => {
    /* no-op when not provided */
  },
  orderOptions = [],
  selectedOrder = '',
  onOrderSelect,
  contentContainerStyle,
  title,
  products: simpleProducts,
  onProductPress,
  solutionTabs,
  productsList = [],
  servicesList = [],
  programsList = [],
  professionalsContent,
  tabsContainerStyle,
  selectedTabId: selectedTabIdProp,
  onTabChange,
  emptyActionLabel,
  onEmptyActionPress,
  suppressInlineListChrome = false,
}) => {
  const { t } = useTranslation();
  const { categories } = useCategories({ enabled: true });
  const hasSolutionTabStrip = solutionTabs != null && solutionTabs.length > 0;
  const isParentTabControlled = selectedTabIdProp != null && onTabChange != null;
  const marketplaceListWithoutInlineChrome = suppressInlineListChrome && isParentTabControlled;
  const isControlledTabbed = isParentTabControlled && (hasSolutionTabStrip || marketplaceListWithoutInlineChrome);
  const [internalTabId, setInternalTabId] = useState<string>(() =>
    hasSolutionTabStrip ? solutionTabs![0].id : 'products',
  );
  const selectedTabId = isControlledTabbed ? selectedTabIdProp! : internalTabId;
  const setSelectedTabId = isControlledTabbed ? onTabChange! : setInternalTabId;

  const isSimpleMode = simpleProducts != null || hasSolutionTabStrip || marketplaceListWithoutInlineChrome;
  const currentListFromTabs = useMemo(() => {
    if (!hasSolutionTabStrip) return [];
    if (selectedTabId === 'products') return productsList;
    if (selectedTabId === 'services') return servicesList;
    if (selectedTabId === 'programs') return programsList;
    return [];
  }, [hasSolutionTabStrip, selectedTabId, productsList, servicesList, programsList]);
  const listToShow = hasSolutionTabStrip ? currentListFromTabs : simpleProducts ?? [];
  const showOrderFilter = !suppressInlineListChrome && (hasSolutionTabStrip ? selectedTabId !== 'professionals' : true);
  const isProfessionalsTab =
    selectedTabId === 'professionals' && (hasSolutionTabStrip || marketplaceListWithoutInlineChrome);
  const showAdsListInTabbedMode = isControlledTabbed && !isProfessionalsTab;
  const showProfessionalsAfterAllTab =
    marketplaceListWithoutInlineChrome && selectedTabId === 'all' && professionalsContent != null;

  const handleAdPress = (ad: Ad) => {
    if (navigation) handleAdNavigation(ad, navigation);
  };

  const sectionTitle = title ?? t('marketplace.allProducts');

  const showControlledTabbedInitialLoad = showAdsListInTabbedMode && loading && ads.length === 0;
  const showUncontrolledInitialLoad = !isSimpleMode && loading && ads.length === 0;
  const showInitialLoadSkeleton = showControlledTabbedInitialLoad || showUncontrolledInitialLoad;

  const listLength = showAdsListInTabbedMode
    ? ads.length
    : hasSolutionTabStrip
    ? listToShow.length
    : simpleProducts != null
    ? simpleProducts.length
    : ads.length;
  const isEmpty = !hasSolutionTabStrip && !marketplaceListWithoutInlineChrome && listLength === 0;
  const isEmptyTab = hasSolutionTabStrip && !isControlledTabbed && !isProfessionalsTab && listToShow.length === 0;
  const isEmptyControlledTabbed = isControlledTabbed && ads.length === 0;

  const productFallbackTitle = t('marketplace.product');
  const outOfStockLabel = t('marketplace.outOfStock');

  const renderEmptyState = () => (
    <View style={styles.emptySection}>
      <EmptyState
        title={t('marketplace.noAdsFound')}
        description={t('marketplace.noAdsFoundDescription')}
        iconName='storefront'
        actionLabel={emptyActionLabel}
        onActionPress={onEmptyActionPress}
      />
    </View>
  );

  const renderAdsProductList = () => (
    <ProductList
      ads={ads}
      categories={categories}
      onAdPress={handleAdPress}
      fallbackTitle={productFallbackTitle}
      outOfStockLabel={outOfStockLabel}
    />
  );

  const renderSimpleProductCard = (product: SimpleProductItem) => (
    <ProductRowCard
      key={product.id}
      image={product.image || DEFAULT_IMAGE}
      title={product.title}
      badges={product.tags?.length ? product.tags : product.tag ? [product.tag] : []}
      price={product.price ?? undefined}
      onPress={() => onProductPress?.(product)}
      showTrailingChevron={!!onProductPress}
    />
  );

  const orderFilterRow =
    orderOptions.length > 0 && showOrderFilter ? (
      <View style={styles.mOrderFilterMenuContainer}>
        <StickyFilterCarouselRow
          filterButtonLabel={t('marketplace.orderBy')}
          filterModalTitle={t('marketplace.orderBy')}
          filterModalContent={({ close, visible }) => (
            <FilterPickerModal
              visible={visible}
              sections={[{ options: orderOptions }]}
              selectedId={selectedOrder}
              confirmLabel={t('filterCategory.filter')}
              onConfirm={(id) => {
                onOrderSelect?.(String(id));
                close();
              }}
            />
          )}
          carouselOptions={orderOptions}
          selectedCarouselId={selectedOrder}
          onCarouselSelect={(id) => onOrderSelect?.(String(id))}
          carouselDisplay='selectedOnly'
        />
      </View>
    ) : null;

  const renderInitialLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size='large' color='#2196F3' />
      <Text style={styles.loadingText}>{t('common.loading')}</Text>
    </View>
  );

  if (showInitialLoadSkeleton) {
    return (
      <View style={[styles.section, styles.sectionMarketplace, contentContainerStyle]}>
        {hasSolutionTabStrip && !suppressInlineListChrome && (
          <ToggleTabs
            tabs={solutionTabs!.map((tab) => ({ id: tab.id, label: tab.label }))}
            selectedId={selectedTabId}
            onSelect={setSelectedTabId}
            containerStyle={[styles.solutionTabsRow, tabsContainerStyle]}
            fixedWidth={false}
          />
        )}
        {orderFilterRow}
        {renderInitialLoading()}
      </View>
    );
  }

  return (
    <View style={[styles.section, styles.sectionMarketplace, contentContainerStyle]}>
      {hasSolutionTabStrip && !suppressInlineListChrome && (
        <ToggleTabs
          tabs={solutionTabs!.map((tab) => ({ id: tab.id, label: tab.label }))}
          selectedId={selectedTabId}
          onSelect={setSelectedTabId}
          containerStyle={[styles.solutionTabsRow, tabsContainerStyle]}
          fixedWidth={false}
        />
      )}
      {orderFilterRow}
      {isProfessionalsTab ? (
        professionalsContent
      ) : hasSolutionTabStrip && isEmptyTab ? (
        renderEmptyState()
      ) : isEmptyControlledTabbed ? (
        showProfessionalsAfterAllTab ? (
          professionalsContent
        ) : (
          renderEmptyState()
        )
      ) : !isEmpty || showAdsListInTabbedMode ? (
        <>
          {!isSimpleMode && !hasSolutionTabStrip && !marketplaceListWithoutInlineChrome && (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{sectionTitle}</Text>
            </View>
          )}
          <View style={styles.mAdsList}>
            {showAdsListInTabbedMode || (!isSimpleMode && !hasSolutionTabStrip && !marketplaceListWithoutInlineChrome)
              ? renderAdsProductList()
              : (hasSolutionTabStrip ? listToShow : simpleProducts ?? []).map(renderSimpleProductCard)}
            {((!isSimpleMode && !hasSolutionTabStrip) || showAdsListInTabbedMode) && loading && (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size='small' color='#2196F3' />
              </View>
            )}
            {((!isSimpleMode && !hasSolutionTabStrip) || showAdsListInTabbedMode) && hasMore && !loading && (
              <TouchableOpacity style={styles.loadMoreButton} onPress={onLoadMore} activeOpacity={0.7}>
                <Text style={styles.loadMoreText}>{t('marketplace.loadMore')}</Text>
              </TouchableOpacity>
            )}
          </View>
          {showProfessionalsAfterAllTab ? professionalsContent : null}
        </>
      ) : null}
    </View>
  );
};

export default AdsList;
