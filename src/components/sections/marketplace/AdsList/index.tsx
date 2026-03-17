import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { ProductItemCard } from '@/components/ui/cards';
import { ToggleTabs } from '@/components/ui/tabs';
import { FilterMenu, type ButtonCarouselOption } from '@/components/ui/menu';
import { EmptyState } from '@/components/ui/feedback';
import { useCategories } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { formatPrice, handleAdNavigation, mapProductToCartItem } from '@/utils';
import { storageService } from '@/services';
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
}) => {
  const { t } = useTranslation();
  const { categories } = useCategories({ enabled: true });
  const hasTabbedMode = solutionTabs != null && solutionTabs.length > 0;
  const isControlledTabbed = hasTabbedMode && selectedTabIdProp != null && onTabChange != null;
  const [internalTabId, setInternalTabId] = useState<string>(() => (hasTabbedMode ? solutionTabs![0].id : 'products'));
  const selectedTabId = isControlledTabbed ? selectedTabIdProp! : internalTabId;
  const setSelectedTabId = isControlledTabbed ? onTabChange! : setInternalTabId;

  const isSimpleMode = simpleProducts != null || hasTabbedMode;
  const currentListFromTabs = useMemo(() => {
    if (!hasTabbedMode) return [];
    if (selectedTabId === 'products') return productsList;
    if (selectedTabId === 'services') return servicesList;
    if (selectedTabId === 'programs') return programsList;
    return [];
  }, [hasTabbedMode, selectedTabId, productsList, servicesList, programsList]);
  const listToShow = hasTabbedMode ? currentListFromTabs : simpleProducts ?? [];
  const showOrderFilter = hasTabbedMode ? selectedTabId !== 'professionals' : true;
  const isProfessionalsTab = hasTabbedMode && selectedTabId === 'professionals';
  const showAdsListInTabbedMode = isControlledTabbed && !isProfessionalsTab;

  const handleAdPress = (ad: Ad) => {
    if (navigation) handleAdNavigation(ad, navigation);
  };

  const handleAddToCart = async (ad: Ad) => {
    if (!ad.product || !navigation) return;
    try {
      const cartItem = mapProductToCartItem(ad.product);
      await storageService.addToCart(cartItem);
      navigation.navigate('Cart');
    } catch {}
  };

  const sectionTitle = title ?? t('marketplace.allProducts');

  if (!isSimpleMode && loading && ads.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#2196F3' />
        <Text style={styles.loadingText}>{t('marketplace.loadingAds')}</Text>
      </View>
    );
  }

  const listLength = showAdsListInTabbedMode
    ? ads.length
    : hasTabbedMode
    ? listToShow.length
    : isSimpleMode
    ? simpleProducts?.length ?? 0
    : ads.length;
  const isEmpty = !hasTabbedMode && listLength === 0;
  const isEmptyTab = hasTabbedMode && !isControlledTabbed && !isProfessionalsTab && listToShow.length === 0;
  const isEmptyControlledTabbed = hasTabbedMode && isControlledTabbed && ads.length === 0;

  const renderEmptyState = () => (
    <View style={styles.emptySection}>
      <EmptyState
        title={t('marketplace.noAdsFound')}
        description={t('marketplace.noAdsFoundDescription')}
        iconName='storefront'
      />
    </View>
  );

  const renderAdCard = (ad: Ad) => {
    const product = ad.product;
    const displayName = product?.name || t('marketplace.product', { defaultValue: 'Product' });
    const displayImage = product?.image || DEFAULT_IMAGE;
    const displayCategory = product?.categoryId
      ? categories.find((c) => c.categoryId === product.categoryId)?.name
      : undefined;
    const productPrice = product?.price;

    return (
      <ProductItemCard
        key={ad.id}
        image={displayImage}
        title={displayName}
        badges={[displayCategory]}
        price={productPrice}
        outOfStock={product?.status === 'out_of_stock'}
        outOfStockLabel={t('marketplace.outOfStock', {
          defaultValue: 'Out of stock',
        })}
        onPress={() => handleAdPress(ad)}
        onAddPress={product && !product.externalUrl ? () => handleAddToCart(ad) : undefined}
        showAddButton={!!(product && !product.externalUrl)}
        formatPrice={formatPrice}
      />
    );
  };

  const renderSimpleProductCard = (product: SimpleProductItem) => (
    <ProductItemCard
      key={product.id}
      image={product.image || DEFAULT_IMAGE}
      title={product.title}
      badges={product.tag ? [product.tag] : []}
      price={product.price ?? undefined}
      onPress={() => onProductPress?.(product)}
      onAddPress={undefined}
      showAddButton={false}
      formatPrice={formatPrice}
    />
  );

  return (
    <View style={[styles.section, styles.sectionMarketplace, contentContainerStyle]}>
      {hasTabbedMode && (
        <ToggleTabs
          tabs={solutionTabs!.map((tab) => ({ id: tab.id, label: tab.label }))}
          selectedId={selectedTabId}
          onSelect={setSelectedTabId}
          containerStyle={[styles.solutionTabsRow, tabsContainerStyle]}
          fixedWidth={false}
        />
      )}
      {hasTabbedMode && isProfessionalsTab ? (
        professionalsContent
      ) : hasTabbedMode && isEmptyTab ? (
        renderEmptyState()
      ) : hasTabbedMode && isEmptyControlledTabbed ? (
        renderEmptyState()
      ) : !isEmpty || showAdsListInTabbedMode ? (
        <>
          {!isSimpleMode && !hasTabbedMode && (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{sectionTitle}</Text>
            </View>
          )}
          {orderOptions.length > 0 && showOrderFilter && (
            <View style={styles.mOrderFilterMenuContainer}>
              <FilterMenu
                filterButtonLabel={t('marketplace.orderBy')}
                onFilterButtonPress={() => undefined}
                carouselOptions={orderOptions}
                selectedCarouselId={selectedOrder}
                onCarouselSelect={onOrderSelect ?? (() => undefined)}
              />
            </View>
          )}
          <View style={styles.mAdsList}>
            {showAdsListInTabbedMode
              ? ads.map(renderAdCard)
              : hasTabbedMode || (isSimpleMode && simpleProducts)
              ? (hasTabbedMode ? listToShow : simpleProducts ?? []).map(renderSimpleProductCard)
              : ads.map(renderAdCard)}
            {((!isSimpleMode && !hasTabbedMode) || showAdsListInTabbedMode) && loading && (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size='small' color='#2196F3' />
              </View>
            )}
            {((!isSimpleMode && !hasTabbedMode) || showAdsListInTabbedMode) && hasMore && !loading && (
              <TouchableOpacity style={styles.loadMoreButton} onPress={onLoadMore} activeOpacity={0.7}>
                <Text style={styles.loadMoreText}>{t('marketplace.loadMore')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : null}
    </View>
  );
};

export default AdsList;
