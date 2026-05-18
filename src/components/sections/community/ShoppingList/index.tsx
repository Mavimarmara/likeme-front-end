import React, { useMemo, useState, type ReactNode } from 'react';
import { ScrollView, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SecondaryButton } from '@/components/ui/buttons';
import { EmptyState } from '@/components/ui/feedback';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { AdsList } from '@/components/sections/marketplace';
import type { ButtonCarouselOption } from '@/components/ui/carousel';
import { DEFAULT_MARKETPLACE_SORT_ORDER, type MarketplaceSortOrderId } from '@/constants/marketplaceSortOrder';
import { getMarketplaceSortOptions } from '@/utils/marketplace/sortOptions';
import { sortAdsByMarketplaceOrder } from '@/utils/marketplace/sorting';
import { useTranslation } from '@/hooks/i18n';
import type { Ad, Advertiser } from '@/types/ad';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/types/navigation';
import { COLORS } from '@/constants';
import { styles } from './styles';

export type ShopTabId = 'products' | 'services' | 'programs' | 'professionals';

type Props = {
  selectedTabId: ShopTabId;
  onTabChange: (tabId: ShopTabId) => void;
  ads: Ad[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  navigation: StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
  professionals?: Advertiser[];
  onProfessionalPress?: (advertiser: Advertiser) => void;
  /** Quando true, não usa ScrollView próprio; o conteúdo é renderizado para ficar dentro do scroll do pai. */
  embedInParentScroll?: boolean;
};

const ShoppingList: React.FC<Props> = ({
  selectedTabId,
  onTabChange,
  ads,
  loading = false,
  hasMore = false,
  onLoadMore,
  navigation,
  professionals = [],
  onProfessionalPress,
  embedInParentScroll = false,
}) => {
  const { t } = useTranslation();
  const [activeOrder, setActiveOrder] = useState<MarketplaceSortOrderId>(DEFAULT_MARKETPLACE_SORT_ORDER);

  const orderedAds = useMemo(() => sortAdsByMarketplaceOrder(ads, activeOrder), [ads, activeOrder]);

  const orderOptions: ButtonCarouselOption<string>[] = useMemo(() => getMarketplaceSortOptions(t), [t]);

  const solutionTabs: { id: string; label: string }[] = useMemo(
    () => [
      { id: 'products', label: t('filterCategory.solutions.products') },
      { id: 'services', label: t('filterCategory.solutions.services') },
      { id: 'professionals', label: t('filterCategory.solutions.professionals') },
      { id: 'programs', label: t('filterCategory.solutions.programs') },
    ],
    [t],
  );

  const professionalsContent: ReactNode = useMemo(() => {
    if (professionals.length === 0) {
      return (
        <View style={styles.emptySection}>
          <EmptyState
            title={t('marketplace.noAdsFound')}
            description={t('marketplace.noAdsFoundDescription')}
            iconName='storefront'
          />
        </View>
      );
    }
    return (
      <View style={styles.list}>
        {professionals.map((advertiser) => (
          <View key={advertiser.id} style={styles.professionalCardWrapper}>
            <View style={styles.professionalCardContent}>
              {advertiser.logo ? (
                <CachedImage source={{ uri: advertiser.logo }} style={styles.professionalAvatar} />
              ) : (
                <View style={styles.professionalAvatarPlaceholder}>
                  <Icon name='person' size={32} color={COLORS.NEUTRAL.LOW.MEDIUM} />
                </View>
              )}
              <View style={styles.professionalInfo}>
                <Text style={styles.professionalName} numberOfLines={1}>
                  {advertiser.name ?? ''}
                </Text>
                {advertiser.description ? (
                  <Text style={styles.professionalProfession}>{advertiser.description}</Text>
                ) : null}
              </View>
              <SecondaryButton
                label={t('community.viewProfile')}
                onPress={() => onProfessionalPress?.(advertiser)}
                size='medium'
                style={styles.professionalViewProfileButton}
              />
            </View>
          </View>
        ))}
      </View>
    );
  }, [professionals, onProfessionalPress, t]);

  const listContent = (
    <AdsList
      navigation={navigation}
      solutionTabs={solutionTabs}
      selectedTabId={selectedTabId}
      onTabChange={(id) => onTabChange(id as ShopTabId)}
      ads={orderedAds}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      professionalsContent={professionalsContent}
      orderOptions={orderOptions}
      selectedOrder={activeOrder}
      onOrderSelect={(id) => setActiveOrder(id as MarketplaceSortOrderId)}
      tabsContainerStyle={styles.solutionsTabsRow}
    />
  );

  if (embedInParentScroll) {
    return <View style={[styles.container, styles.content]}>{listContent}</View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {listContent}
    </ScrollView>
  );
};

export default ShoppingList;
