import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, Background } from '@/components/ui/layout';
import { adService, productService } from '@/services';
import type { Ad } from '@/types/ad';
import type { Product as ApiProduct } from '@/types/product';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const [activeTab, setActiveTab] = useState<TabType>('goal');
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [otherOptions, setOtherOptions] = useState<ApiProduct[]>([]);

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
            setAd(adResponse.data);
            // Se o ad tem productId, tentar carregar o produto
            if (adResponse.data.productId) {
              try {
                const productResponse = await productService.getProductById(adResponse.data.productId);
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
                  // Se não conseguiu carregar do backend, manter o product dos params
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
                // Se falhar, manter o product dos params que já foi definido
              }
            }
          } else if (route.params?.product) {
            // Se não conseguiu carregar ad, manter o product dos params
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
          // Se falhar ao carregar ad, manter o product dos params que já foi definido
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
      const category = route.params?.product?.category || ad?.product?.category || product?.category;
      if (category) {
        try {
          const relatedResponse = await productService.listProducts({
            limit: 3,
            category: category,
          });
          if (relatedResponse.success && relatedResponse.data) {
            const currentProductId = product?.id || productId;
            setOtherOptions(relatedResponse.data.products.filter(p => p.id !== currentProductId));
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
    // Prioridade: product dos params > ad.product > product carregado
    const externalUrl = route.params?.product?.externalUrl || 
                       ad?.product?.externalUrl || 
                       product?.externalUrl;
    if (externalUrl) {
      Linking.openURL(externalUrl);
    }
  };

  // Usar dados dos params como fallback se não foram carregados
  const paramsProduct = route.params?.product;
  const displayTitle = product?.name || 
                      ad?.product?.name || 
                      paramsProduct?.title || 
                      'Product';
  const displayDescription = product?.description || 
                            ad?.product?.description || 
                            paramsProduct?.description || 
                            '';
  const displayImage = product?.image || 
                      ad?.product?.image || 
                      paramsProduct?.image || 
                      'https://via.placeholder.com/400';
  const productCategory = product?.category || 
                          ad?.product?.category || 
                          paramsProduct?.category || 
                          'Product';

  const tabs = [
    { id: 'goal' as TabType, label: 'Goal' },
    { id: 'description' as TabType, label: 'Description' },
    { id: 'composition' as TabType, label: 'Composition' },
  ];

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.tabActive]}
          onPress={() => setActiveTab(tab.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTabContent = () => {
    if (activeTab === 'goal') {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.descriptionText}>{displayDescription}</Text>
        </View>
      );
    }
    // Para description e composition, podemos mostrar a mesma descrição por enquanto
    return (
      <View style={styles.tabContent}>
        <Text style={styles.descriptionText}>{displayDescription}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Background />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header showBackButton={true} onBackPress={handleBackPress} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, styles.paginationDotActive]} />
          <View style={styles.paginationDot} />
          <View style={styles.paginationDot} />
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {renderTabs()}
          {renderTabContent()}

          {/* Other Options */}
          {otherOptions.length > 0 && (
            <View style={styles.otherOptionsSection}>
              <Text style={styles.sectionTitle}>Other options</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsList}
              >
                {otherOptions.map((option) => (
                  <View key={option.id} style={styles.optionItem}>
                    <Image
                      source={{ uri: option.image || 'https://via.placeholder.com/69x64' }}
                      style={styles.optionImage}
                    />
                    <Text style={styles.optionLabel}>
                      {option.name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Buy on Amazon Button */}
          <View style={styles.buySection}>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={handleBuyOnAmazon}
              activeOpacity={0.7}
            >
              <Text style={styles.buyButtonText}>Buy on Amazon</Text>
              <Icon name="shopping-cart" size={24} color="#001137" />
            </TouchableOpacity>
            <Text style={styles.disclaimerText}>
              The purchase of the selected product will be completed on Amazon.{' '}
              <Text style={styles.learnMoreLink}>Learn More</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AffiliateProductScreen;

