import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, type ImageStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HeroImage, ScreenWithHeader } from '@/components/ui/layout';
import { SecondaryButton } from '@/components/ui/buttons';
import { ProductsCarousel, type Product } from '@/components/sections/product';
import { ProductHeroFooter } from '@/components/sections/marketplace';
import { ButtonCarousel, type ButtonCarouselOption } from '@/components/ui/carousel';
import { useProductDetails, useSuggestedProducts, useCategories } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { formatPrice } from '@/utils';
import {
  useAnalyticsScreen,
  logButtonClick,
  logTabSelect,
  logAddToCart,
  logSelectContent,
  logError,
} from '@/analytics';
import type { RootStackParamList } from '@/types/navigation';
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
        rating?: number;
      };
    };
  };
};

const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'ProductDetails', screenClass: 'ProductDetailsScreen' });
  const { t } = useTranslation();
  const [activeProductTab, setActiveProductTab] = useState<'goal' | 'description' | 'composition'>('goal');
  const [quantity, setQuantity] = useState(1);

  const { product, ad, advertiserId, loading, handleAddToCart, loadAd } = useProductDetails({
    productId: route.params?.productId,
    fallbackProduct: route.params?.product,
    navigation,
  });

  const { products: suggestedProducts, loading: loadingSuggested } = useSuggestedProducts({
    limit: 5,
    categoryId: product?.categoryId ?? undefined,
    enabled: !!product?.id,
  });

  const { categories } = useCategories({ enabled: true });

  const displayData = useMemo(() => {
    if (!product) {
      return null;
    }

    const categoryName = product.categoryId
      ? categories.find((c) => c.categoryId === product.categoryId)?.name
      : undefined;

    return {
      title: ad?.product?.name || product.name,
      description: ad?.product?.description || product.description,
      image: ad?.product?.image || product.image,
      price: product.price,
      tags: categoryName ? [categoryName] : [],
      isOutOfStock: product.status === 'out_of_stock' || product.quantity === 0,
    };
  }, [product, ad, categories]);

  const productTabOptions: ButtonCarouselOption<'goal' | 'description' | 'composition'>[] = useMemo(
    () => [
      { id: 'goal', label: t('marketplace.goal') },
      { id: 'description', label: t('marketplace.description') },
      { id: 'composition', label: t('marketplace.composition') },
    ],
    [t],
  );

  // Categoria do produto para badges/tags (nome da categoria); tipo do produto para layout
  const productCategory = displayData?.tags?.[0] || 'Product';
  const heroBadges = useMemo(() => {
    const baseBadges = [t('marketplace.product')];
    if (productCategory && productCategory !== 'Product') {
      baseBadges.push(productCategory);
    }
    return baseBadges;
  }, [productCategory, t]);

  // Parceiro = dono do anúncio (advertiser). Dados vêm do ad quando a API retorna advertiser; senão de params. ProviderProfile carrega os dados na própria tela.
  const partnerData = useMemo(() => {
    const source = ad?.advertiser;
    if (source) {
      return {
        id: source.id,
        name: source.name ?? '',
        avatar: source.logo ?? '',
        description: source.description ?? '',
        title: '' as string,
        rating: undefined as number | undefined,
        specialties: [] as string[],
      };
    }
    const productWithProvider = product as {
      provider?: { name?: string; avatar?: string; title?: string; description?: string; specialties?: string[] };
      rating?: number;
    };
    const fromParams = route.params?.product?.provider as
      | { name?: string; avatar?: string; title?: string; description?: string; specialties?: string[] }
      | undefined;
    const fromProduct = productWithProvider?.provider;
    const p = fromParams || fromProduct;
    const rating = route.params?.product?.rating ?? productWithProvider?.rating;
    return {
      id: advertiserId ?? product?.id ?? route.params?.productId ?? '',
      name: p?.name ?? '',
      avatar: p?.avatar ?? '',
      description: p?.description ?? '',
      title: p?.title ?? '',
      rating,
      specialties: p?.specialties ?? [],
    };
  }, [ad?.advertiser, advertiserId, product, route.params?.product]);

  const isProductType = product?.type === 'physical product';

  const handleHeroCartPress = () => {
    logAddToCart({
      item_id: product?.id ?? route.params?.productId ?? '',
      item_name: displayData?.title,
      item_category: productCategory,
    });
    handleAddToCart();
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
    if (product?.id && route.params?.productId) {
      loadAd();
    }
  }, [product?.id, route.params?.productId, loadAd]);

  // Obter imagem do produto para o background e hero section
  const backgroundImage = useMemo(() => {
    if (displayData?.image) return displayData.image;
    if (ad?.product?.image) return ad.product.image;
    if (product?.image) return product.image;
    if (route.params?.product?.image) return route.params.product.image;
    return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';
  }, [displayData, ad, product, route.params?.product]);

  // Array de imagens do produto (por enquanto apenas uma)
  const productImages = useMemo(() => {
    const images: string[] = [];
    if (backgroundImage && backgroundImage !== 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400') {
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
              onCartPress={handleHeroCartPress}
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
          {isProductType ? (
            <>
              <View style={styles.contentCard}>
                <View style={styles.tabsContainerInCard}>
                  <ButtonCarousel
                    options={productTabOptions}
                    selectedId={activeProductTab}
                    onSelect={(tabId) => {
                      logTabSelect({ screen_name: 'product_details', tab_id: tabId });
                      setActiveProductTab(tabId);
                    }}
                  />
                </View>
                {renderProductTabContent()}
                <View style={styles.priceQuantityRow}>
                  <Text style={styles.contentPrice}>
                    {displayData.price != null ? formatPrice(displayData.price * quantity) : ''}
                  </Text>
                  <View style={styles.quantitySelector}>
                    <Text style={styles.quantityLabel}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Icon name='keyboard-arrow-down' size={20} color='#FDFBEE' />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity((q) => q + 1)}>
                      <Icon name='keyboard-arrow-up' size={20} color='#FDFBEE' />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={styles.paymentLinkRow} onPress={() => undefined} activeOpacity={0.7}>
                  <Text style={styles.paymentLinkText}>{t('marketplace.paymentOptionsText')} </Text>
                  <Text style={styles.paymentLinkAnchor}>{t('marketplace.learnMore')}</Text>
                </TouchableOpacity>
                {renderPartnerSection()}
              </View>
              {renderRecommendedProducts()}
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>{displayData.title}</Text>
              <Text style={styles.productDescription}>
                {displayData.description || t('marketplace.noDescriptionAvailable')}
              </Text>
              <View style={styles.productImageContainer}>
                <Image
                  source={{ uri: backgroundImage }}
                  style={styles.productImage as ImageStyle}
                  resizeMode='contain'
                />
              </View>
              {renderInfoSection()}
            </>
          )}
        </View>
      </ScrollView>
      {renderAddToCartButton()}
    </ScreenWithHeader>
  );

  function renderAddToCartButton() {
    return (
      <View style={styles.floatingButtonContainer}>
        {!displayData.isOutOfStock && (
          <TouchableOpacity
            style={styles.floatingAddToCartButton}
            onPress={() => {
              logAddToCart({
                item_id: product?.id ?? route.params?.productId ?? '',
                item_name: displayData?.title,
                item_category: productCategory,
              });
              handleAddToCart();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.floatingAddToCartText}>{t('marketplace.addToCart')}</Text>
            <View style={styles.floatingCartIconContainer}>
              <Icon name='shopping-cart' size={20} color='#FFFFFF' />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function renderPartnerSection() {
    const providerName = partnerData.name;
    const providerAvatar = partnerData.avatar;
    const providerRating = partnerData.rating;

    return (
      <View style={styles.partnerSection}>
        <View style={styles.partnerRow}>
          {providerAvatar ? (
            <Image source={{ uri: providerAvatar }} style={styles.partnerAvatar as ImageStyle} />
          ) : (
            <View style={[styles.partnerAvatar, styles.partnerAvatarPlaceholder]} />
          )}
          <View style={styles.partnerInfo}>
            <Text style={styles.partnerName}>{providerName}</Text>
            <Text style={styles.partnerTitle}>{t('marketplace.specialistLabel')}</Text>
          </View>
          {providerRating != null && (
            <View style={styles.partnerRating}>
              <Icon name='star' size={24} color='#FFB800' />
              <Text style={styles.partnerRatingText}>{String(providerRating)}</Text>
            </View>
          )}
        </View>
        <SecondaryButton
          label={t('marketplace.seePartnerProfile')}
          onPress={handleSeeProviderProfile}
          style={styles.partnerProfileButton}
          size='large'
        />
      </View>
    );
  }

  function renderRecommendedProducts() {
    const providerName = partnerData.name;
    const recommendedTitle = t('marketplace.recommendedProductsForJourney', { provider: providerName });
    const recommendedProducts: Product[] = (suggestedProducts || []).filter((p) => p.id !== product?.id).slice(0, 5);

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
                price: formatPrice(p.price ?? 0),
                image: p.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
              },
            });
          }}
          onProductLike={(p) =>
            logSelectContent({ content_type: 'product_like', item_id: p.id, screen_name: 'product_details' })
          }
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
          <Text style={styles.productDescription}>{product.technicalSpecifications}</Text>
        )}
      </View>
    );
  }

  function renderProductTabContent() {
    let tabText = '';
    switch (activeProductTab) {
      case 'goal':
        tabText = product.targetAudience ?? '';
        break;
      case 'description':
        tabText = displayData?.description ?? product.description ?? '';
        break;
      case 'composition':
        tabText = product.technicalSpecifications ?? '';
        break;
      default:
        tabText = '';
        break;
    }

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
              <Text style={styles.descriptionText}>{line.trim()}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
};

export default ProductDetailsScreen;
