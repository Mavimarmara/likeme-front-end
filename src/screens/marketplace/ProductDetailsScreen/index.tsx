import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, type ImageStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '@/components/ui/layout';
import { Toggle } from '@/components/ui';
import { SecondaryButton } from '@/components/ui/buttons';
import { ProductsCarousel, type Product } from '@/components/sections/product';
import { PostCard } from '@/components/sections/community';
import { ButtonCarousel, type ButtonCarouselOption } from '@/components/ui/carousel';
import { useProductDetails } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { formatPrice } from '@/utils';
import { useUserFeed } from '@/hooks';
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

const USER_REVIEWS = [
  {
    id: '1',
    userName: 'Caio César',
    comment: 'Helped me a lot',
    date: '20 Jun 2023',
    rating: 5,
  },
  {
    id: '2',
    userName: 'Maria Fernandes',
    comment: 'Really nice!',
    date: '19 Jun 2023',
    rating: 4,
  },
  {
    id: '3',
    userName: 'Carla Junqueira',
    comment: "I'd recommend it to everyone!",
    date: '19 Jun 2023',
    rating: 4,
  },
] as const;

const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'ProductDetails', screenClass: 'ProductDetailsScreen' });
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'info' | 'preview'>('info');
  const [activeInfoTab, setActiveInfoTab] = useState<'about' | 'objectives' | 'communities'>('about');
  const [activeProductTab, setActiveProductTab] = useState<'goal' | 'description' | 'composition' | 'review'>('goal');
  const [quantity, setQuantity] = useState(1);

  const { product, ad, advertiserId, loading, handleAddToCart, relatedProducts, loadAd } = useProductDetails({
    productId: route.params?.productId,
    fallbackProduct: route.params?.product,
    navigation,
  });

  const displayData = useMemo(() => {
    if (!product) {
      return null;
    }

    return {
      title: ad?.product?.name || product.name,
      description: ad?.product?.description || product.description,
      image: ad?.product?.image || product.image,
      price: product.price,
      tags: product.type ? [product.type] : [],
      isOutOfStock: product.status === 'out_of_stock' || product.quantity === 0,
    };
  }, [product, ad]);

  const infoTabOptions: ButtonCarouselOption<'about' | 'objectives' | 'communities'>[] = useMemo(
    () => [
      { id: 'about', label: t('marketplace.about') },
      { id: 'objectives', label: t('marketplace.objectives') },
      { id: 'communities', label: t('marketplace.communities') },
    ],
    [t],
  );

  const productTabOptions: ButtonCarouselOption<'goal' | 'description' | 'composition' | 'review'>[] = useMemo(
    () => [
      { id: 'goal', label: t('marketplace.goal') },
      { id: 'description', label: t('marketplace.description') },
      { id: 'composition', label: t('marketplace.composition') },
      { id: 'review', label: t('marketplace.review') },
    ],
    [t],
  );

  // Categoria do produto para badges
  const productCategory = displayData?.tags?.[0] || product?.type || route.params?.product?.type || 'Product';

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

  const isProductType = productCategory == 'physical product';

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

  // Carregar posts quando a aba preview estiver ativa
  const {
    posts: communityPosts,
    loading: loadingPosts,
    loadPosts: loadCommunityPosts,
  } = useUserFeed({
    enabled: false, // Não carregar automaticamente
    pageSize: 10,
  });

  useEffect(() => {
    if (activeTab === 'preview') {
      loadCommunityPosts(1);
    }
  }, [activeTab, loadCommunityPosts]);

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
    <SafeAreaView style={styles.container}>
      <Header showBackButton={true} onBackPress={handleBackPress} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Image */}
        <View style={styles.heroSection}>
          <Image source={{ uri: backgroundImage }} style={styles.backgroundImage as ImageStyle} resizeMode='cover' />
          <View style={styles.heroOverlay}>
            <LinearGradient
              colors={['rgba(48, 48, 48, 0)', 'rgba(41, 41, 41, 1)']}
              locations={[0.64, 1]}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroContentLeft}>
                <View style={styles.badgesContainer}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{t('marketplace.product')}</Text>
                  </View>
                  {productCategory && productCategory !== 'Product' && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{productCategory}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.heroTitle}>{displayData.title}</Text>
                {displayData.price && <Text style={styles.heroPrice}>{formatPrice(displayData.price)}</Text>}
              </View>
              {!displayData.isOutOfStock && (
                <TouchableOpacity
                  style={styles.heroCartButton}
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
                  <Icon name='shopping-cart' size={24} color='#001137' />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

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
                <View style={styles.ratingRow}>
                  <View style={styles.contentBadge}>
                    <Text style={styles.contentBadgeText}>{productCategory}</Text>
                  </View>
                  <View style={styles.ratingBlock}>
                    <Text style={styles.ratingCount}>
                      {((product as { reviewCount?: number })?.reviewCount ?? 2657).toLocaleString('pt-BR')}
                    </Text>
                    <Icon name='star' size={18} color='#FFB800' />
                  </View>
                </View>
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
              <View style={styles.tabsContainer}>
                <Toggle
                  options={['Program info', 'Community preview'] as const}
                  selected={activeTab === 'info' ? 'Program info' : 'Community preview'}
                  onSelect={(option) => {
                    const tabId = option === 'Program info' ? 'info' : 'preview';
                    logTabSelect({ screen_name: 'product_details', tab_id: tabId });
                    setActiveTab(tabId);
                  }}
                />
              </View>
              {activeTab === 'info' && (
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
                  {renderUserFeedback()}
                </>
              )}

              {activeTab === 'preview' && (
                <View style={styles.communityPreviewContainer}>
                  {loadingPosts ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size='large' color='#001137' />
                    </View>
                  ) : !communityPosts || communityPosts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>{t('marketplace.noCommunityPostsFound')}</Text>
                    </View>
                  ) : (
                    communityPosts.map((post) => <PostCard key={post.id} post={post} />)
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
      {renderAddToCartButton()}
    </SafeAreaView>
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
    const recommendedProducts: Product[] = (relatedProducts || [])
      .filter((p) => p.id !== product?.id)
      .map((p) => ({
        id: p.id,
        title: p.name,
        price: p.price ?? 0,
        tag: productCategory || p.type || 'Produto',
        image: p.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        likes: 0,
      }));

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
    return (
      <View style={styles.tabsContainer}>
        <ButtonCarousel
          options={infoTabOptions}
          selectedId={activeInfoTab}
          onSelect={(tabId) => {
            logTabSelect({ screen_name: 'product_details', tab_id: tabId });
            setActiveInfoTab(tabId);
          }}
        />
        {renderAboutContent()}
      </View>
    );
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

  function renderUserFeedback() {
    return (
      <View style={styles.feedbackSection}>
        <View style={styles.feedbackHeader}>
          <Text style={styles.feedbackTitle}>{t('marketplace.userFeedback')}</Text>
          <View style={styles.feedbackRating}>
            <Text style={styles.feedbackRatingText}>5</Text>
            <Icon name='star' size={16} color='#FFB800' />
          </View>
        </View>
        <View style={styles.reviewsList}>
          {USER_REVIEWS.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <Text style={styles.reviewUserName}>{review.userName}</Text>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <View style={styles.reviewFooter}>
                <Text style={styles.reviewDate}>{review.date}</Text>
                <View style={styles.reviewRating}>
                  <Text style={styles.reviewRatingText}>{review.rating}</Text>
                  <Icon name='star' size={14} color='#FFB800' />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  function renderProductTabContent() {
    const description = displayData?.description || product?.description || '';
    const descriptionLines = description ? description.split('\n').filter((line) => line.trim().length > 0) : [];

    const renderDescriptionWithBullets = () => {
      if (descriptionLines.length === 0) {
        return <Text style={styles.productDescription}>{t('marketplace.noDescriptionAvailable')}</Text>;
      }

      return (
        <View style={styles.descriptionContainer}>
          {descriptionLines.map((line, index) => (
            <View key={index} style={styles.descriptionItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.descriptionText}>{line.trim()}</Text>
            </View>
          ))}
        </View>
      );
    };

    switch (activeProductTab) {
      case 'goal':
      case 'description':
      case 'composition':
        return <View style={styles.tabContent}>{renderDescriptionWithBullets()}</View>;
      case 'review':
        return <>{renderUserFeedback()}</>;
      default:
        return null;
    }
  }
};

export default ProductDetailsScreen;
