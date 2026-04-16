import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CTACard } from '@/components/ui/cards';
import { SecondaryButton } from '@/components/ui/buttons';
import { EmptyState } from '@/components/ui/feedback';
import { CommunityIntroSection, SpecialistCard } from '@/components/sections/community';
import { AdsList } from '@/components/sections/marketplace';
import type { ButtonCarouselOption } from '@/components/ui/carousel';
import { DEFAULT_MARKETPLACE_SORT_ORDER, type MarketplaceSortOrderId } from '@/constants/marketplaceSortOrder';
import { getMarketplaceSortOptions } from '@/utils/marketplace/sortOptions';
import { sortShopProductsByMarketplaceOrder } from '@/utils/marketplace/sorting';
import type { SpecialistCardProps } from '@/components/sections/community/SpecialistCard';
import { useTranslation } from '@/hooks/i18n';
import { storageService } from '@/services';
import type { Product } from '@/components/sections/product/ProductCard';
import type { Advertiser } from '@/types/ad';
import { COLORS } from '@/constants';
import { styles } from './styles';

export type CommunityIntroData = {
  title: string;
  description: string;
  imageUri?: string | null;
};

type Props = {
  products: Product[];
  services?: Product[];
  programs?: Product[];
  professionals?: Advertiser[];
  onProductPress?: (product: Product) => void;
  onProductLike?: (product: Product) => void;
  onProfessionalPress?: (advertiser: Advertiser) => void;
  communityIntro?: CommunityIntroData | null;
  onIntroSeeMore?: () => void;
  specialist?: SpecialistCardProps | null;
  /** Quando true, não usa ScrollView próprio; o conteúdo é renderizado para ficar dentro do scroll do pai. */
  embedInParentScroll?: boolean;
};

const ShoppingList: React.FC<Props> = ({
  products,
  services = [],
  programs = [],
  professionals = [],
  onProductPress,
  onProductLike: _onProductLike,
  onProfessionalPress,
  communityIntro,
  onIntroSeeMore,
  specialist,
  embedInParentScroll = false,
}) => {
  const { t } = useTranslation();
  const [activeOrder, setActiveOrder] = useState<MarketplaceSortOrderId>(DEFAULT_MARKETPLACE_SORT_ORDER);
  const [shoppingTipDismissed, setShoppingTipDismissed] = useState(true);

  useEffect(() => {
    storageService.getCommunityShoppingTipDismissed().then(setShoppingTipDismissed);
  }, []);

  const handleShoppingTipClose = useCallback(() => {
    setShoppingTipDismissed(true);
    storageService.setCommunityShoppingTipDismissed(true);
  }, []);

  const mergeTags = useCallback((primaryTag: string, product: Product): string[] => {
    const combinedTags = [primaryTag, ...(product.tags ?? []), product.tag].filter(Boolean);
    return combinedTags.filter((tag, index) => combinedTags.indexOf(tag) === index);
  }, []);

  const productsWithTag = useMemo(
    () =>
      (products ?? []).map((p) => ({
        ...p,
        tag: t('filterCategory.solutions.products'),
        tags: mergeTags(t('filterCategory.solutions.products'), p),
      })),
    [mergeTags, products, t],
  );
  const servicesWithTag = useMemo(
    () =>
      (services ?? []).map((p) => ({
        ...p,
        tag: t('filterCategory.solutions.services'),
        tags: mergeTags(t('filterCategory.solutions.services'), p),
      })),
    [mergeTags, services, t],
  );
  const programsWithTag = useMemo(
    () =>
      (programs ?? []).map((p) => ({
        ...p,
        tag: t('filterCategory.solutions.programs'),
        tags: mergeTags(t('filterCategory.solutions.programs'), p),
      })),
    [mergeTags, programs, t],
  );

  const orderedProducts = useMemo(
    () => sortShopProductsByMarketplaceOrder(productsWithTag, activeOrder),
    [productsWithTag, activeOrder],
  );
  const orderedServices = useMemo(
    () => sortShopProductsByMarketplaceOrder(servicesWithTag, activeOrder),
    [servicesWithTag, activeOrder],
  );
  const orderedPrograms = useMemo(
    () => sortShopProductsByMarketplaceOrder(programsWithTag, activeOrder),
    [programsWithTag, activeOrder],
  );

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

  const professionalsContent = useMemo(() => {
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
                <Image source={{ uri: advertiser.logo }} style={styles.professionalAvatar} resizeMode='cover' />
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
                  <Text style={styles.professionalProfession} numberOfLines={1}>
                    Especialista
                  </Text>
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
    <>
      {!shoppingTipDismissed && (
        <View style={styles.shoppingTipContainer}>
          <CTACard backgroundColor={COLORS.HIGHLIGHT.LIGHT} style={styles.shoppingTip} onClose={handleShoppingTipClose}>
            <Text style={styles.shoppingTipTitle}>{t('community.shoppingTipTitle')}</Text>
            <Text style={styles.shoppingTipDescription}>{t('community.shoppingTipIntro')}</Text>
            <Text style={styles.shoppingTipDescription}>{t('community.shoppingTipBullet1')}</Text>
            <Text style={styles.shoppingTipDescription}>{t('community.shoppingTipBullet2')}</Text>
            <Text style={styles.shoppingTipDescription}>{t('community.shoppingTipBullet3')}</Text>
            <Text style={styles.shoppingTipDescription}>{t('community.shoppingTipBullet4')}</Text>
            <Text style={styles.shoppingTipDescription}>{t('community.shoppingTipBullet5')}</Text>
            <Text style={[styles.shoppingTipDescription, styles.shoppingTipDescriptionBold]}>
              {t('community.shoppingTipOutro')}
            </Text>
          </CTACard>
        </View>
      )}
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

      {specialist && (
        <View style={styles.specialistBlock}>
          <SpecialistCard
            name={specialist.name}
            subtitle={specialist.subtitle}
            rating={specialist.rating}
            tags={specialist.tags}
            avatarUri={specialist.avatarUri}
          />
        </View>
      )}

      <AdsList
        solutionTabs={solutionTabs}
        productsList={orderedProducts}
        servicesList={orderedServices}
        programsList={orderedPrograms}
        professionalsContent={professionalsContent}
        onProductPress={onProductPress}
        orderOptions={orderOptions}
        selectedOrder={activeOrder}
        onOrderSelect={(id) => setActiveOrder(id as MarketplaceSortOrderId)}
        tabsContainerStyle={styles.solutionsTabsRow}
      />
    </>
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
