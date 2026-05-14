import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import { HeroImage, ScreenWithHeader } from '@/components/ui/layout';
import { Toggle } from '@/components/ui';
import { SecondaryButton } from '@/components/ui/buttons';
import { ProductsCarousel } from '@/components/sections/product';
import {
  ProductDetailsPriceQuantityRow,
  ProductHeroFooter,
  ProgramParticipationTermsRequiredModal,
} from '@/components/sections/marketplace';
import { Checkbox } from '@/components/ui/inputs';
import { LinkifiedText } from '@/components/ui/text/LinkifiedText';
import { PartnerSection } from '@/components/sections/advertiser';
import { ButtonCarousel, type ButtonCarouselOption } from '@/components/ui/carousel';
import { useMenuItems, useProductDetails, useSuggestedProducts } from '@/hooks';
import { useSetFloatingMenu } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
import { formatPrice, getProductModeTranslationKey } from '@/utils';
import { formatPriceLabel } from '@/utils/formatters/priceFormatter';
import {
  useAnalyticsScreen,
  logButtonClick,
  logTabSelect,
  logAddToCart,
  logSelectContent,
  logError,
} from '@/analytics';
import { MARKETPLACE_PRODUCT_PLACEHOLDER_IMAGE_URI } from '@/constants';
import type { RootStackParamList } from '@/types/navigation';
import { PRODUCT_CATALOG_TYPE, catalogTypeTranslatedBadgeLabels } from '@/types/product';
import { styles } from './styles';

type ProductDetailsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ProductDetails'>;
  route: {
    params: {
      productId: string;
      product?: {
        id: string;
        title: string;
        price: string;
        image: string;
        type?: string;
        tags?: string[];
        description?: string;
        provider?: {
          name: string;
          avatar: string;
        };
      };
    };
  };
};

const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'ProductDetails', screenClass: 'ProductDetailsScreen' });
  const { t } = useTranslation();
  const menuItems = useMenuItems(navigation);
  useSetFloatingMenu(menuItems, 'marketplace');
  const [activeProductTab, setActiveProductTab] = useState<'about' | 'agreements'>('about');
  const [activeSwapperTab, setActiveSwapperTab] = useState<'protocol' | 'shop'>('protocol');
  const [quantity, setQuantity] = useState(1);
  const [isQuantityDropdownOpen, setIsQuantityDropdownOpen] = useState(false);
  const [programParticipationTermsAccepted, setProgramParticipationTermsAccepted] = useState(false);
  const [programTermsModalVisible, setProgramTermsModalVisible] = useState(false);

  const { product, ad, advertiserId, loading, handleAddToCart } = useProductDetails({
    productId: route.params?.productId,
    fallbackProduct: route.params?.product,
    navigation,
  });

  const { products: suggestedProducts, loading: loadingSuggested } = useSuggestedProducts({
    limit: 5,
    categoryId: product?.categoryId ?? undefined,
    enabled: !!product?.id,
  });

  const recommendedProducts = useMemo(
    () => (suggestedProducts || []).filter((p) => p.id !== product?.id).slice(0, 5),
    [suggestedProducts, product?.id],
  );

  const displayData = useMemo(() => {
    if (!product) {
      return null;
    }

    const catalogBadges = catalogTypeTranslatedBadgeLabels(product.type, t);
    const modeTranslationKey = getProductModeTranslationKey(product);
    const modeLabel = modeTranslationKey ? t(`marketplace.productMode.${modeTranslationKey}`).trim() : '';
    const tags = [...catalogBadges, modeLabel].filter(Boolean);

    return {
      title: ad?.product?.name || product.name,
      description: ad?.product?.description || product.description,
      image: product.image || ad?.product?.image,
      price: product.price,
      tags,
      isOutOfStock: product.status === 'out_of_stock' || product.quantity === 0,
    };
  }, [product, ad, t]);

  const isAmazonProduct = useMemo(() => {
    if (!product) return false;
    if (product.type === PRODUCT_CATALOG_TYPE.AMAZON) return true;
    const url = (product.externalUrl ?? '').trim().toLowerCase();
    return url.includes('amazon.');
  }, [product]);

  const productTabContent = useMemo(() => {
    const rawDescription = displayData?.description ?? '';
    const descriptionTrimmed = rawDescription.trim();
    const audience = product?.targetAudience?.trim() ?? '';
    const aboutParts: string[] = [];
    if (descriptionTrimmed.length > 0) aboutParts.push(descriptionTrimmed);
    if (audience.length > 0) aboutParts.push(audience);
    return {
      about: aboutParts.join('\n\n'),
      agreements: product?.technicalSpecifications?.trim() ?? '',
    };
  }, [displayData?.description, product?.targetAudience, product?.technicalSpecifications]);

  const isProgramProduct = product?.type === PRODUCT_CATALOG_TYPE.PROGRAM;

  const productTabOptions: ButtonCarouselOption<'about' | 'agreements'>[] = useMemo(() => {
    const allTabs: ButtonCarouselOption<'about' | 'agreements'>[] = [
      { id: 'about', label: 'Sobre' },
      { id: 'agreements', label: 'Acordos' },
    ];

    if (isProgramProduct) {
      const tabs: ButtonCarouselOption<'about' | 'agreements'>[] = [];
      if (productTabContent.about.length > 0) {
        tabs.push({ id: 'about', label: 'Sobre' });
      }
      tabs.push({ id: 'agreements', label: 'Acordos' });
      return tabs;
    }

    return allTabs.filter((tab) => productTabContent[tab.id].length > 0);
  }, [productTabContent, isProgramProduct]);

  const productCategory = product?.type ?? 'Product';
  const heroBadges = useMemo(() => {
    const extra = displayData?.tags ?? [];
    return [...extra].filter(Boolean);
  }, [displayData?.tags, t]);

  const partnerData = useMemo(() => {
    const source = ad?.advertiser;
    if (source) {
      return {
        id: source.id,
        name: source.name ?? '',
        avatar: source.logo ?? '',
        description: source.description ?? '',
        title: '' as string,
        specialties: [] as string[],
      };
    }
    const productWithProvider = product as {
      provider?: { name?: string; avatar?: string; title?: string; description?: string; specialties?: string[] };
    };
    const fromParams = route.params?.product?.provider as
      | { name?: string; avatar?: string; title?: string; description?: string; specialties?: string[] }
      | undefined;
    const fromProduct = productWithProvider?.provider;
    const p = fromParams || fromProduct;
    return {
      id: advertiserId ?? product?.id ?? route.params?.productId ?? '',
      name: p?.name ?? '',
      avatar: p?.avatar ?? '',
      description: p?.description ?? '',
      title: p?.title ?? '',
      specialties: p?.specialties ?? [],
    };
  }, [ad?.advertiser, advertiserId, product, route.params?.product]);

  const hasSpecialistPartner = useMemo(() => {
    if (ad?.advertiser?.id) return true;
    return Boolean(partnerData.name?.trim());
  }, [ad?.advertiser?.id, partnerData.name]);

  const usesPhysicalProductDetailLayout =
    product?.type === PRODUCT_CATALOG_TYPE.PHYSICAL ||
    product?.type === PRODUCT_CATALOG_TYPE.PROGRAM ||
    product?.type === PRODUCT_CATALOG_TYPE.SERVICE;

  const quantityOptions = useMemo(() => {
    const maxQuantity = Math.max(1, Math.min(product?.quantity ?? 10, 10));
    return Array.from({ length: maxQuantity }, (_, index) => index + 1);
  }, [product?.quantity]);

  const runAddToCartFlow = () => {
    logAddToCart({
      item_id: product?.id ?? route.params?.productId ?? '',
      item_name: displayData?.title,
      item_category: productCategory,
    });
    void handleAddToCart(quantity);
  };

  const handleAddToCartPress = () => {
    if (isProgramProduct && !programParticipationTermsAccepted) {
      setProgramTermsModalVisible(true);
      return;
    }
    runAddToCartFlow();
  };

  const handleProgramTermsModalGoToAgreements = () => {
    logButtonClick({
      screen_name: 'product_details',
      button_label: 'program_terms_modal_view_terms',
      action_name: 'open_agreements_tab',
    });
    setProgramTermsModalVisible(false);
    setActiveProductTab('agreements');
    logTabSelect({ screen_name: 'product_details', tab_id: 'agreements' });
  };

  const handleBackPress = () => {
    logButtonClick({
      screen_name: 'product_details',
      button_label: 'back',
      action_name: 'go_back',
    });
    navigation.goBack();
  };

  const handleSeeProviderProfile = () => {
    const providerId = advertiserId ?? partnerData.id ?? '';

    logButtonClick({
      screen_name: 'product_details',
      button_label: 'see_provider_profile',
      action_name: 'navigate_provider',
      item_id: providerId,
    });

    navigation.navigate('ProviderProfile', {
      providerId,
    });
  };

  useEffect(() => {
    const firstOption = quantityOptions[0] ?? 1;
    const lastOption = quantityOptions[quantityOptions.length - 1] ?? 1;
    if (quantity < firstOption || quantity > lastOption) {
      setQuantity(firstOption);
    }
  }, [quantity, quantityOptions]);

  useEffect(() => {
    if (isProgramProduct) {
      setIsQuantityDropdownOpen(false);
    }
  }, [isProgramProduct]);

  useEffect(() => {
    setProgramParticipationTermsAccepted(false);
    setProgramTermsModalVisible(false);
  }, [product?.id]);

  useEffect(() => {
    if (productTabOptions.length === 0) {
      return;
    }

    if (!productTabOptions.some((tab) => tab.id === activeProductTab)) {
      setActiveProductTab(productTabOptions[0].id);
    }
  }, [activeProductTab, productTabOptions]);

  const backgroundImage = useMemo(() => {
    if (displayData?.image) return displayData.image;
    if (route.params?.product?.image) return route.params.product.image;
    return MARKETPLACE_PRODUCT_PLACEHOLDER_IMAGE_URI;
  }, [displayData?.image, route.params?.product?.image]);

  const productImages = useMemo(() => {
    const images: string[] = [];
    if (backgroundImage && backgroundImage !== MARKETPLACE_PRODUCT_PLACEHOLDER_IMAGE_URI) {
      images.push(backgroundImage);
    }
    return images;
  }, [backgroundImage]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#2196F3' />
          <Text style={styles.loadingText}>{t('marketplace.loadingProduct')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product || !displayData) {
    logError({ screen_name: 'product_details', error_type: 'product_not_found' });
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('marketplace.productNotFound')}</Text>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text>{t('common.goBack')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <ScreenWithHeader
        navigation={navigation}
        headerProps={{ showBackButton: true, onBackPress: handleBackPress }}
        contentContainerStyle={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Section with Image */}
          <HeroImage
            imageUri={backgroundImage}
            name={displayData.title}
            badges={heroBadges}
            footer={
              <ProductHeroFooter
                isOutOfStock={displayData.isOutOfStock}
                price={displayData.price}
                priceSuffix={isProgramProduct ? t('marketplace.programPriceMonthly') : undefined}
                onCartPress={handleAddToCartPress}
              />
            }
          />

          {/* Pagination Dots - Mostrar apenas se houver mais de uma imagem */}
          {productImages && productImages.length > 1 && (
            <View style={styles.paginationContainer}>
              {productImages.map((_, index) => (
                <View key={index} style={[styles.paginationDot, index === 0 && styles.paginationDotActive]} />
              ))}
            </View>
          )}
          <View style={styles.content}>
            {usesPhysicalProductDetailLayout ? (
              <>
                <View style={styles.contentCard}>
                  {isProgramProduct && hasSpecialistPartner ? (
                    <View style={styles.partnerSectionAbovePrice}>
                      <PartnerSection
                        name={partnerData.name}
                        avatar={partnerData.avatar}
                        specialistLabel={partnerData.description?.trim() || t('marketplace.specialistLabel')}
                        profileButtonLabel={t('marketplace.seePartnerProfile')}
                        onPressProfile={handleSeeProviderProfile}
                      />
                    </View>
                  ) : null}
                  {productTabOptions.length > 0 && (
                    <View style={styles.tabsContainerInCard}>
                      <Text style={styles.sectionTitle}>Informações</Text>
                      <ButtonCarousel
                        options={productTabOptions}
                        selectedId={activeProductTab}
                        onSelect={(tabId) => {
                          logTabSelect({ screen_name: 'product_details', tab_id: tabId });
                          setActiveProductTab(tabId);
                        }}
                      />
                    </View>
                  )}
                  {renderProductTabContent()}
                  {!isProgramProduct && hasSpecialistPartner ? (
                    <View style={styles.partnerSectionAbovePrice}>
                      {(displayData.description ?? '').trim().length > 0 ? (
                        <LinkifiedText style={styles.descriptionText} text={displayData.description ?? ''} />
                      ) : null}
                      <PartnerSection
                        name={partnerData.name}
                        avatar={partnerData.avatar}
                        specialistLabel={partnerData.description?.trim() || t('marketplace.specialistLabel')}
                      />
                    </View>
                  ) : null}
                  {!isProgramProduct && displayData.price != null ? (
                    <ProductDetailsPriceQuantityRow
                      formattedPrice={formatPrice(displayData.price * quantity)}
                      quantity={quantity}
                      quantityOptions={quantityOptions}
                      isQuantityDropdownOpen={isQuantityDropdownOpen}
                      onToggleQuantityDropdown={() => setIsQuantityDropdownOpen((open) => !open)}
                      onSelectQuantity={(value) => {
                        setQuantity(value);
                        setIsQuantityDropdownOpen(false);
                      }}
                      paymentLinkLabel={t('marketplace.paymentOptionsText')}
                      onPaymentLinkPress={() => undefined}
                    />
                  ) : null}
                  {displayData.price != null && !displayData.isOutOfStock ? (
                    <SecondaryButton
                      label={t('marketplace.addToCart')}
                      onPress={handleAddToCartPress}
                      style={styles.addToCartSecondaryBelowPrice}
                      size='large'
                      testID='product-details-add-to-cart'
                    />
                  ) : null}
                </View>
                {renderRecommendedProducts()}
              </>
            ) : (
              <>
                {(displayData.description ?? '').trim().length > 0 ? (
                  <LinkifiedText style={styles.productDescription} text={(displayData.description ?? '').trim()} />
                ) : null}
                {renderInfoSection()}
                {displayData.price != null && !displayData.isOutOfStock ? (
                  <View style={styles.addToCartSecondaryWrapper}>
                    <SecondaryButton
                      label={t('marketplace.addToCart')}
                      onPress={handleAddToCartPress}
                      style={styles.addToCartSecondary}
                      size='large'
                      testID='product-details-add-to-cart'
                    />
                  </View>
                ) : null}
              </>
            )}
          </View>
        </ScrollView>
      </ScreenWithHeader>
      <ProgramParticipationTermsRequiredModal
        visible={programTermsModalVisible}
        title={t('marketplace.programTermsRequiredModalTitle')}
        body={t('marketplace.programTermsRequiredModalBody')}
        ctaLabel={t('marketplace.programTermsRequiredModalCta')}
        onClose={() => setProgramTermsModalVisible(false)}
        onPressViewTerms={handleProgramTermsModalGoToAgreements}
      />
    </>
  );

  function renderRecommendedProducts() {
    const providerName = partnerData.name;
    const recommendedTitle = t('marketplace.recommendedProductsForJourney', { provider: providerName });

    if (loadingSuggested && recommendedProducts.length === 0) return null;
    if (recommendedProducts.length === 0) return null;

    return (
      <View style={styles.recommendedSection}>
        <ProductsCarousel
          title={recommendedTitle}
          subtitle={t('marketplace.discoverOptionsForYou')}
          products={recommendedProducts}
          onProductPress={(p) => {
            logSelectContent({
              content_type: 'product',
              item_id: p.id,
              item_name: p.title,
              screen_name: 'product_details',
            });
            navigation.navigate('ProductDetails', {
              productId: p.id,
              product: {
                id: p.id,
                title: p.title,
                price: formatPriceLabel(p.price),
                image: p.image || MARKETPLACE_PRODUCT_PLACEHOLDER_IMAGE_URI,
              },
            });
          }}
        />
      </View>
    );
  }

  function renderInfoSection() {
    return <View style={styles.tabsContainer}>{renderAboutContent()}</View>;
  }

  function renderAboutContent() {
    return (
      <View style={styles.aboutContent}>
        {product.technicalSpecifications && (
          <LinkifiedText style={styles.productDescription} text={product.technicalSpecifications} />
        )}
      </View>
    );
  }

  function renderProductTabContent() {
    const fallbackTabId = productTabOptions[0]?.id ?? 'about';
    const resolvedTab = productTabOptions.some((tab) => tab.id === activeProductTab) ? activeProductTab : fallbackTabId;

    if (isProgramProduct && resolvedTab === 'agreements') {
      const agreementsText = productTabContent.agreements;
      const agreementLines = agreementsText.split('\n').filter((line) => line.trim().length > 0);

      return (
        <View style={styles.tabContent}>
          {agreementLines.length > 0 ? (
            <View style={styles.descriptionContainer}>
              {agreementLines.map((line, index) => (
                <View key={index} style={styles.descriptionItem}>
                  <View style={styles.bulletPoint} />
                  <LinkifiedText style={styles.descriptionText} text={line.trim()} />
                </View>
              ))}
            </View>
          ) : null}
          <View style={styles.programAgreementsCheckboxRow}>
            <Checkbox
              label={t('marketplace.programParticipationTermsCheckbox')}
              checked={programParticipationTermsAccepted}
              onPress={() => setProgramParticipationTermsAccepted((current) => !current)}
            />
          </View>
        </View>
      );
    }

    const tabText = productTabContent[resolvedTab] || productTabContent[fallbackTabId] || '';
    const tabLines = tabText.split('\n').filter((line) => line.trim().length > 0);

    if (tabLines.length === 0) {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.productDescription}>{t('marketplace.noDescriptionAvailable')}</Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.descriptionContainer}>
          {tabLines.map((line, index) => (
            <View key={index} style={styles.descriptionItem}>
              <View style={styles.bulletPoint} />
              <LinkifiedText style={styles.descriptionText} text={line.trim()} />
            </View>
          ))}
        </View>
      </View>
    );
  }
};

export default ProductDetailsScreen;
