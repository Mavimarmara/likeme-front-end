import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '@/components/ui/layout';
import { useTranslation } from '@/hooks/i18n';
import { adService, productService } from '@/services';
import type { Ad } from '@/types/ad';
import type { Product as ApiProduct } from '@/types/product';
import type { RootStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type AffiliateProductScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AffiliateProduct'>;
  route: {
    params: {
      productId: string;
      adId?: string;
      product?: {
        id: string;
        title: string;
        price: string;
        image: string;
        category?: string;
        description?: string;
        externalUrl?: string;
      };
    };
  };
};

type TabType = 'goal' | 'description' | 'composition';

const AffiliateProductScreen: React.FC<AffiliateProductScreenProps> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'AffiliateProduct', screenClass: 'AffiliateProductScreen' });
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('goal');
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [_otherOptions, setOtherOptions] = useState<ApiProduct[]>([]);

  const productId = route.params?.productId;
  const adId = route.params?.adId;

  useEffect(() => {
    if (productId || adId || route.params?.product) {
      loadData();
    } else {
      // Se não tem nenhum parâmetro, usar dados do produto fornecido
      if (route.params?.product) {
        const fallbackProduct = route.params.product;
        setProduct({
          id: fallbackProduct.id,
          name: fallbackProduct.title,
          description: fallbackProduct.description,
          price: parseFloat(fallbackProduct.price.replace('$', '').replace(',', '')) || 0,
          image: fallbackProduct.image,
          category: fallbackProduct.category,
          quantity: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [productId, adId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Se tem product nos params, usar como fallback inicial
      if (route.params?.product) {
        const fallbackProduct = route.params.product;
        const productData: ApiProduct = {
          id: fallbackProduct.id,
          name: fallbackProduct.title,
          description: fallbackProduct.description || '',
          price: parseFloat(fallbackProduct.price.replace('$', '').replace(',', '')) || 0,
          image: fallbackProduct.image,
          category: fallbackProduct.category,
          quantity: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...(fallbackProduct.externalUrl && { externalUrl: fallbackProduct.externalUrl }),
        };
        setProduct(productData);
      }

      // Primeiro, tentar carregar o ad (prioridade)
      if (adId) {
        try {
          const adResponse = await adService.getAdById(adId);
          if (adResponse.success && adResponse.data) {
            const loadedAd = adResponse.data;
            setAd(loadedAd);

            // Se o ad tem product diretamente (produtos afiliados), usar esse produto
            if (loadedAd.product) {
              const adProduct = loadedAd.product;
              setProduct({
                id: adProduct.id || productId || adId,
                name: adProduct.name || '',
                description: adProduct.description || '',
                price: adProduct.price ? Number(adProduct.price) : 0,
                image: adProduct.image || '',
                category: adProduct.category || '',
                externalUrl: adProduct.externalUrl || route.params?.product?.externalUrl,
                quantity: adProduct.quantity || 0,
                status: adProduct.status || 'active',
                createdAt: adProduct.createdAt || new Date().toISOString(),
                updatedAt: adProduct.updatedAt || new Date().toISOString(),
              });
            } else if (loadedAd.productId) {
              // Se o ad tem productId, tentar carregar o produto do backend
              try {
                const productResponse = await productService.getProductById(loadedAd.productId);
                if (productResponse.success && productResponse.data) {
                  const loadedProduct = productResponse.data;
                  // Preservar externalUrl dos params se o produto carregado não tiver
                  if (route.params?.product?.externalUrl && !loadedProduct.externalUrl) {
                    setProduct({
                      ...loadedProduct,
                      externalUrl: route.params.product.externalUrl,
                    });
                  } else {
                    setProduct(loadedProduct);
                  }
                } else if (route.params?.product) {
                  // Se não conseguiu carregar do backend, usar o product dos params
                  const fallbackProduct = route.params.product;
                  setProduct({
                    id: fallbackProduct.id,
                    name: fallbackProduct.title,
                    description: fallbackProduct.description || '',
                    price: parseFloat(fallbackProduct.price.replace('$', '').replace(',', '')) || 0,
                    image: fallbackProduct.image,
                    category: fallbackProduct.category,
                    quantity: 0,
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    ...(fallbackProduct.externalUrl && {
                      externalUrl: fallbackProduct.externalUrl,
                    }),
                  });
                }
              } catch (error) {
                console.error('Error loading product by productId:', error);
                // Se falhar, usar o product dos params se disponível
                if (route.params?.product && !product) {
                  const fallbackProduct = route.params.product;
                  setProduct({
                    id: fallbackProduct.id,
                    name: fallbackProduct.title,
                    description: fallbackProduct.description || '',
                    price: parseFloat(fallbackProduct.price.replace('$', '').replace(',', '')) || 0,
                    image: fallbackProduct.image,
                    category: fallbackProduct.category,
                    quantity: 0,
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    ...(fallbackProduct.externalUrl && {
                      externalUrl: fallbackProduct.externalUrl,
                    }),
                  });
                }
              }
            } else if (route.params?.product) {
              // Se o ad não tem product nem productId, usar o product dos params
              const fallbackProduct = route.params.product;
              setProduct({
                id: fallbackProduct.id,
                name: fallbackProduct.title,
                description: fallbackProduct.description || '',
                price: parseFloat(fallbackProduct.price.replace('$', '').replace(',', '')) || 0,
                image: fallbackProduct.image,
                category: fallbackProduct.category,
                quantity: 0,
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ...(fallbackProduct.externalUrl && { externalUrl: fallbackProduct.externalUrl }),
              });
            }
          } else if (route.params?.product) {
            // Se não conseguiu carregar ad, usar o product dos params
            const fallbackProduct = route.params.product;
            setProduct({
              id: fallbackProduct.id,
              name: fallbackProduct.title,
              description: fallbackProduct.description || '',
              price: parseFloat(fallbackProduct.price.replace('$', '').replace(',', '')) || 0,
              image: fallbackProduct.image,
              category: fallbackProduct.category,
              quantity: 0,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...(fallbackProduct.externalUrl && { externalUrl: fallbackProduct.externalUrl }),
            });
          }
        } catch (error) {
          console.error('Error loading ad:', error);
          // Se falhar ao carregar ad, usar o product dos params se disponível
          if (route.params?.product && !product) {
            const fallbackProduct = route.params.product;
            setProduct({
              id: fallbackProduct.id,
              name: fallbackProduct.title,
              description: fallbackProduct.description || '',
              price: parseFloat(fallbackProduct.price.replace('$', '').replace(',', '')) || 0,
              image: fallbackProduct.image,
              category: fallbackProduct.category,
              quantity: 0,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...(fallbackProduct.externalUrl && { externalUrl: fallbackProduct.externalUrl }),
            });
          }
        }
      } else if (productId && productId !== route.params?.product?.id) {
        // Se não tem adId mas tem productId válido, buscar ad relacionado
        try {
          const adsResponse = await adService.listAds({
            productId: productId,
            activeOnly: true,
            limit: 1,
          });
          if (adsResponse.success && adsResponse.data && adsResponse.data.ads.length > 0) {
            setAd(adsResponse.data.ads[0]);
          }
        } catch (error) {
          // Se falhar, manter o product dos params
        }
      }

      // Carregar produto se productId for válido (e não for apenas o ad.id usado como fallback)
      if (productId && productId !== adId) {
        try {
          const productResponse = await productService.getProductById(productId);
          if (productResponse.success && productResponse.data) {
            const loadedProduct = productResponse.data;
            // Preservar externalUrl dos params se o produto carregado não tiver
            if (route.params?.product?.externalUrl && !loadedProduct.externalUrl) {
              setProduct({
                ...loadedProduct,
                externalUrl: route.params.product.externalUrl,
              });
            } else {
              setProduct(loadedProduct);
            }
          } else if (route.params?.product && !product) {
            // Se não conseguiu carregar e ainda não tem product, usar dos params
            const fallbackProduct = route.params.product;
            setProduct({
              id: fallbackProduct.id,
              name: fallbackProduct.title,
              description: fallbackProduct.description || '',
              price: parseFloat(fallbackProduct.price.replace('$', '').replace(',', '')) || 0,
              image: fallbackProduct.image,
              category: fallbackProduct.category,
              quantity: 0,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...(fallbackProduct.externalUrl && { externalUrl: fallbackProduct.externalUrl }),
            });
          }
        } catch (error) {
          // Se falhar e ainda não tem product, usar dos params
          if (route.params?.product && !product) {
            const fallbackProduct = route.params.product;
            setProduct({
              id: fallbackProduct.id,
              name: fallbackProduct.title,
              description: fallbackProduct.description || '',
              price: parseFloat(fallbackProduct.price.replace('$', '').replace(',', '')) || 0,
              image: fallbackProduct.image,
              category: fallbackProduct.category,
              quantity: 0,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...(fallbackProduct.externalUrl && { externalUrl: fallbackProduct.externalUrl }),
            });
          }
        }
      }

      // Carregar outras opções relacionadas
      // Prioridade: ad.product > product carregado > params.product
      const category = ad?.product?.category || product?.category || route.params?.product?.category;
      if (category) {
        try {
          const relatedResponse = await productService.listProducts({
            limit: 3,
            category: category,
          });
          if (relatedResponse.success && relatedResponse.data) {
            const currentProductId = ad?.product?.id || product?.id || productId || adId;
            setOtherOptions(relatedResponse.data.products.filter((p) => p.id !== currentProductId));
          }
        } catch (error) {
          console.warn('Could not load related products:', error);
        }
      }
    } catch (error) {
      console.error('Error loading affiliate product data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleBuyOnAmazon = () => {
    // Prioridade: ad.product > product carregado > product dos params
    const externalUrl = ad?.product?.externalUrl || product?.externalUrl || route.params?.product?.externalUrl;
    if (externalUrl) {
      Linking.openURL(externalUrl);
    }
  };

  // Prioridade: ad.product > product carregado > params.product
  const paramsProduct = route.params?.product;
  const displayTitle = ad?.product?.name || product?.name || paramsProduct?.title || 'Product';
  const displayDescription = ad?.product?.description || product?.description || paramsProduct?.description || '';
  const displayImage =
    ad?.product?.image ||
    product?.image ||
    paramsProduct?.image ||
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';

  // Array de imagens do produto
  // Por enquanto, produtos têm apenas uma imagem, mas o código está preparado para múltiplas
  const productImages = useMemo(() => {
    const images: string[] = [];
    // Adicionar imagem principal se existir e não for placeholder
    if (displayImage && displayImage !== 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400') {
      images.push(displayImage);
    }
    // Se no futuro houver um campo images[] no produto, adicionar aqui:
    // if (product?.images && Array.isArray(product.images)) {
    //   images.push(...product.images.filter(img => img && img !== 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'));
    // }
    return images;
  }, [displayImage]);

  const productCategory = ad?.product?.category || product?.category || paramsProduct?.category || 'Product';

  const tabs = useMemo(
    () => [
      { id: 'goal' as TabType, label: t('marketplace.goal') },
      { id: 'description' as TabType, label: t('marketplace.description') },
      { id: 'composition' as TabType, label: t('marketplace.composition') },
    ],
    [t],
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.tabActive]}
          onPress={() => setActiveTab(tab.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTabContent = () => {
    // Dividir a descrição em linhas para criar bullet points
    const descriptionLines = displayDescription
      ? displayDescription.split('\n').filter((line) => line.trim().length > 0)
      : [];

    const renderDescriptionWithBullets = () => {
      if (descriptionLines.length === 0) {
        return <Text style={styles.descriptionText}>{t('marketplace.noDescriptionAvailable')}</Text>;
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

    if (activeTab === 'goal') {
      return <View style={styles.tabContent}>{renderDescriptionWithBullets()}</View>;
    }
    // Para description e composition, mostrar a mesma descrição por enquanto
    return <View style={styles.tabContent}>{renderDescriptionWithBullets()}</View>;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('marketplace.loadingProduct')}</Text>
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
          <ImageBackground source={{ uri: displayImage }} style={styles.heroImage} imageStyle={styles.heroImageStyle}>
            <View style={styles.heroOverlay}>
              <LinearGradient
                colors={['rgba(48, 48, 48, 0)', 'rgba(41, 41, 41, 1)']}
                locations={[0.64, 1]}
                style={styles.heroGradient}
              />
              <View style={styles.heroContent}>
                <View style={styles.badgesContainer}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Product</Text>
                  </View>
                  {productCategory && productCategory !== 'Product' && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{productCategory}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.heroTitle}>{displayTitle}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Pagination Dots - Mostrar apenas se houver mais de uma imagem */}
        {productImages.length > 1 && (
          <View style={styles.paginationContainer}>
            {productImages.map((_, index) => (
              <View key={index} style={[styles.paginationDot, index === 0 && styles.paginationDotActive]} />
            ))}
          </View>
        )}

        {/* Content Section */}
        <View style={styles.contentSection}>
          {renderTabs()}
          {renderTabContent()}

          {/* Other Options */}
          {/*otherOptions.length > 0 && (
            <View style={styles.otherOptionsSection}>
              <Text style={styles.sectionTitle}>{t('marketplace.otherOptions')}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsList}
              >
                {otherOptions.map((option) => (
                  <View key={option.id} style={styles.optionItem}>
                    <Image
                      source={{ uri: option.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100' }}
                      style={styles.optionImage}
                    />
                    <Text style={styles.optionLabel}>
                      {option.name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )*/}

          {/* Buy on Amazon Button */}
          <View style={styles.buySection}>
            <TouchableOpacity style={styles.buyButton} onPress={handleBuyOnAmazon} activeOpacity={0.7}>
              <Text style={styles.buyButtonText}>{t('marketplace.buyOnAmazon')}</Text>
              <Icon name='shopping-cart' size={24} color='#001137' />
            </TouchableOpacity>
            <Text style={styles.disclaimerText}>
              {t('marketplace.amazonDisclaimer')} <Text style={styles.learnMoreLink}>{t('marketplace.learnMore')}</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AffiliateProductScreen;
