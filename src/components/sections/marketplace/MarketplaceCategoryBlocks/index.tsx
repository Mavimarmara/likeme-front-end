import React, { useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import { CachedImage } from '@/components/ui/media/CachedImage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { JoinCardList } from '@/components/ui/lists/JoinCardList';
import { type JoinCardItem } from '@/components/ui/cards';
import { ProductList } from '@/components/sections/product/ProductList';
import { SecondaryButton } from '@/components/ui/buttons';
import { COLORS } from '@/constants';
import { useTranslation } from '@/hooks/i18n';
import { adToJoinCardItem } from '@/utils/marketplace/adToJoinCardItem';
import { styles as shoppingListStyles } from '@/components/sections/community/ShoppingList/styles';
import type { Ad, Advertiser } from '@/types/ad';
import type { CommunityCategory } from '@/types/community';
import { styles } from './styles';

export type MarketplaceCategoryBlocksLayout = 'categoryFilter' | 'allTab';

type MarketplaceProgramCardsRowProps = {
  ads: readonly Ad[];
  categories: readonly CommunityCategory[];
  onAdPress: (ad: Ad) => void;
  fallbackTitle: string;
};

export function MarketplaceProgramCardsRow({
  ads,
  categories,
  onAdPress,
  fallbackTitle,
}: MarketplaceProgramCardsRowProps) {
  const items = useMemo(
    (): JoinCardItem[] =>
      ads.map((ad) =>
        adToJoinCardItem(ad, {
          categories,
          includePrice: false,
          fallbackTitle,
        }),
      ),
    [ads, categories, fallbackTitle],
  );

  const handleItemPress = useCallback(
    (item: JoinCardItem) => {
      const ad = ads.find((entry) => entry.id === item.id);
      if (ad) {
        onAdPress(ad);
      }
    },
    [ads, onAdPress],
  );

  if (items.length === 0) {
    return null;
  }

  return <JoinCardList layout='list' items={items} onItemPress={handleItemPress} />;
}

type MarketplaceServiceCardsListProps = {
  ads: readonly Ad[];
  categories: readonly CommunityCategory[];
  onAdPress: (ad: Ad) => void;
  fallbackTitle: string;
};

export function MarketplaceServiceCardsList({
  ads,
  categories,
  onAdPress,
  fallbackTitle,
}: MarketplaceServiceCardsListProps) {
  const items = useMemo(
    (): JoinCardItem[] =>
      ads.map((ad) =>
        adToJoinCardItem(ad, {
          categories,
          includePrice: true,
          fallbackTitle,
        }),
      ),
    [ads, categories, fallbackTitle],
  );

  const handleItemPress = useCallback(
    (item: JoinCardItem) => {
      const ad = ads.find((entry) => entry.id === item.id);
      if (ad) {
        onAdPress(ad);
      }
    },
    [ads, onAdPress],
  );

  if (items.length === 0) {
    return null;
  }

  return <JoinCardList layout='list' square items={items} onItemPress={handleItemPress} />;
}

export type MarketplaceProfessionalsBlockProps = {
  professionals: readonly Advertiser[];
  onProfessionalPress: (advertiser: Advertiser) => void;
  viewProfileLabel: string;
};

export function MarketplaceProfessionalsBlock({
  professionals,
  onProfessionalPress,
  viewProfileLabel,
}: MarketplaceProfessionalsBlockProps) {
  if (professionals.length === 0) {
    return null;
  }

  return (
    <View style={shoppingListStyles.list}>
      {professionals.map((advertiser) => (
        <View key={advertiser.id} style={shoppingListStyles.professionalCardWrapper}>
          <View style={shoppingListStyles.professionalCardContent}>
            {advertiser.logo ? (
              <CachedImage source={{ uri: advertiser.logo }} style={shoppingListStyles.professionalAvatar} />
            ) : (
              <View style={shoppingListStyles.professionalAvatarPlaceholder}>
                <Icon name='person' size={32} color={COLORS.NEUTRAL.LOW.MEDIUM} />
              </View>
            )}
            <View style={shoppingListStyles.professionalInfo}>
              <Text style={shoppingListStyles.professionalName} numberOfLines={1}>
                {advertiser.name ?? ''}
              </Text>
              {advertiser.description ? (
                <Text style={shoppingListStyles.professionalProfession}>{advertiser.description}</Text>
              ) : null}
            </View>
            <SecondaryButton
              label={viewProfileLabel}
              onPress={() => onProfessionalPress(advertiser)}
              size='medium'
              style={shoppingListStyles.professionalViewProfileButton}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

export type MarketplaceCategoryBlocksProps = {
  layout?: MarketplaceCategoryBlocksLayout;
  productAds: readonly Ad[];
  serviceAds: readonly Ad[];
  programAds: readonly Ad[];
  professionals: readonly Advertiser[];
  categories: readonly CommunityCategory[];
  onAdPress: (ad: Ad) => void;
  onProfessionalPress: (advertiser: Advertiser) => void;
};

type MarketplaceBlockSection = 'products' | 'professionals' | 'services' | 'programs';

const BLOCK_SECTION_ORDER: Record<MarketplaceCategoryBlocksLayout, readonly MarketplaceBlockSection[]> = {
  categoryFilter: ['products', 'professionals', 'services', 'programs'],
  allTab: ['programs', 'products', 'services'],
};

const MarketplaceCategoryBlocks: React.FC<MarketplaceCategoryBlocksProps> = ({
  layout = 'categoryFilter',
  productAds,
  serviceAds,
  programAds,
  professionals,
  categories,
  onAdPress,
  onProfessionalPress,
}) => {
  const { t } = useTranslation();
  const fallbackTitle = t('marketplace.product', { defaultValue: 'Product' });
  const outOfStockLabel = t('marketplace.outOfStock', { defaultValue: 'Out of stock' });
  const viewProfileLabel = t('community.viewProfile');
  const productsSectionTitle =
    layout === 'allTab' ? t('marketplace.allProducts') : t('filterCategory.solutions.products');

  const renderSection = (section: MarketplaceBlockSection) => {
    switch (section) {
      case 'products':
        if (productAds.length === 0) {
          return null;
        }
        return (
          <View style={styles.section} testID='marketplace-block-products'>
            <Text style={styles.sectionTitle}>{productsSectionTitle}</Text>
            <ProductList
              ads={productAds}
              categories={categories}
              onAdPress={onAdPress}
              fallbackTitle={fallbackTitle}
              outOfStockLabel={outOfStockLabel}
            />
          </View>
        );
      case 'professionals':
        if (professionals.length === 0) {
          return null;
        }
        return (
          <View style={styles.section} testID='marketplace-block-professionals'>
            <Text style={styles.sectionTitle}>{t('filterCategory.solutions.professionals')}</Text>
            <MarketplaceProfessionalsBlock
              professionals={professionals}
              onProfessionalPress={onProfessionalPress}
              viewProfileLabel={viewProfileLabel}
            />
          </View>
        );
      case 'services':
        if (serviceAds.length === 0) {
          return null;
        }
        return (
          <View style={styles.section} testID='marketplace-block-services'>
            <Text style={styles.sectionTitle}>{t('filterCategory.solutions.services')}</Text>
            <MarketplaceServiceCardsList
              ads={serviceAds}
              categories={categories}
              onAdPress={onAdPress}
              fallbackTitle={fallbackTitle}
            />
          </View>
        );
      case 'programs':
        if (programAds.length === 0) {
          return null;
        }
        return (
          <View style={styles.section} testID='marketplace-block-programs'>
            <Text style={styles.sectionTitle}>{t('filterCategory.solutions.programs')}</Text>
            <MarketplaceProgramCardsRow
              ads={programAds}
              categories={categories}
              onAdPress={onAdPress}
              fallbackTitle={fallbackTitle}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return <>{BLOCK_SECTION_ORDER[layout].map((section) => renderSection(section))}</>;
};

export default MarketplaceCategoryBlocks;
