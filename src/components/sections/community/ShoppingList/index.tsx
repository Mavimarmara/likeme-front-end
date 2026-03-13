import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CTACard } from '@/components/ui/cards';
import ProductItemCard from '@/components/ui/cards/ProductItemCard';
import { SecondaryButton } from '@/components/ui/buttons';
import { ToggleTabs } from '@/components/ui/tabs';
import { FilterMenu, type ButtonCarouselOption } from '@/components/ui/menu';
import { EmptyState } from '@/components/ui/feedback';
import { CommunityIntroSection, SpecialistCard } from '@/components/sections/community';
import type { SpecialistCardProps } from '@/components/sections/community/SpecialistCard';
import { useTranslation } from '@/hooks/i18n';
import { formatPrice } from '@/utils';
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

type SolutionTab = 'products' | 'services' | 'professionals' | 'programs';
type OrderTab = 'best' | 'above100';

const applyOrder = <T extends Product>(list: T[], order: OrderTab): T[] => {
  let result = [...list];
  if (order === 'above100') {
    result = result.filter((p) => (p.price ?? 0) >= 100) as T[];
  }
  if (order === 'best') {
    result = result.slice().sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0)) as T[];
  }
  return result;
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
}) => {
  const { t } = useTranslation();
  const [activeSolution, setActiveSolution] = useState<SolutionTab>('products');
  const [activeOrder, setActiveOrder] = useState<OrderTab>('best');
  const [shoppingTipDismissed, setShoppingTipDismissed] = useState(true);

  useEffect(() => {
    storageService.getCommunityShoppingTipDismissed().then(setShoppingTipDismissed);
  }, []);

  const handleShoppingTipClose = useCallback(() => {
    setShoppingTipDismissed(true);
    storageService.setCommunityShoppingTipDismissed(true);
  }, []);

  const productsWithTag = useMemo(
    () =>
      (products ?? []).map((p) => ({
        ...p,
        tag: t('filterCategory.solutions.products'),
      })),
    [products, t],
  );
  const servicesWithTag = useMemo(
    () =>
      (services ?? []).map((p) => ({
        ...p,
        tag: t('filterCategory.solutions.services'),
      })),
    [services, t],
  );
  const programsWithTag = useMemo(
    () =>
      (programs ?? []).map((p) => ({
        ...p,
        tag: t('filterCategory.solutions.programs'),
      })),
    [programs, t],
  );

  const orderedProducts = useMemo(() => applyOrder(productsWithTag, activeOrder), [productsWithTag, activeOrder]);
  const orderedServices = useMemo(() => applyOrder(servicesWithTag, activeOrder), [servicesWithTag, activeOrder]);
  const orderedPrograms = useMemo(() => applyOrder(programsWithTag, activeOrder), [programsWithTag, activeOrder]);

  const orderOptions: ButtonCarouselOption<OrderTab>[] = useMemo(
    () => [
      { id: 'best', label: t('marketplace.bestRated') },
      { id: 'above100', label: t('marketplace.above100') },
    ],
    [t],
  );

  const solutionTabs: { id: SolutionTab; label: string }[] = useMemo(
    () => [
      { id: 'products', label: t('filterCategory.solutions.products') },
      { id: 'services', label: t('filterCategory.solutions.services') },
      { id: 'professionals', label: t('filterCategory.solutions.professionals') },
      { id: 'programs', label: t('filterCategory.solutions.programs') },
    ],
    [t],
  );

  const currentList =
    activeSolution === 'products'
      ? orderedProducts
      : activeSolution === 'services'
      ? orderedServices
      : activeSolution === 'programs'
      ? orderedPrograms
      : [];

  const showOrderFilter = activeSolution !== 'professionals';

  const isEmptySection = activeSolution === 'professionals' ? professionals.length === 0 : currentList.length === 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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

      <ToggleTabs
        tabs={solutionTabs.map((tab) => ({ id: tab.id, label: tab.label }))}
        selectedId={activeSolution}
        onSelect={(id) => setActiveSolution(id as SolutionTab)}
        containerStyle={styles.solutionsTabsRow}
        fixedWidth={false}
      />

      {isEmptySection ? (
        <View style={styles.emptySection}>
          <EmptyState
            title={t('marketplace.noAdsFound')}
            description={t('marketplace.noAdsFoundDescription')}
            iconName='storefront'
          />
        </View>
      ) : (
        <>
          {showOrderFilter && (
            <View style={styles.orderRow}>
              <FilterMenu
                filterButtonLabel={t('marketplace.orderBy')}
                onFilterButtonPress={() => undefined}
                carouselOptions={orderOptions}
                selectedCarouselId={activeOrder}
                onCarouselSelect={(id) => setActiveOrder(id)}
              />
            </View>
          )}
          <View style={styles.list}>
            {activeSolution === 'professionals'
              ? professionals.map((advertiser) => (
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
                ))
              : currentList.map((product) => (
                  <View key={product.id} style={styles.cardWrapper}>
                    <ProductItemCard
                      image={product.image}
                      title={product.title}
                      badges={[product.tag]}
                      price={product.price ?? undefined}
                      onPress={() => onProductPress?.(product)}
                      onAddPress={() => onProductPress?.(product)}
                      showAddButton={false}
                      formatPrice={formatPrice}
                      subtitle={undefined}
                    />
                  </View>
                ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default ShoppingList;
