import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScreenWithHeader } from '@/components/ui/layout';
import { MARKETPLACE_PRODUCT_PLACEHOLDER_IMAGE_URI } from '@/constants';
import { useProductDetails } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import type { RootStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
import { logger } from '@/utils/logger';
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
        type?: string;
        description?: string;
        externalUrl?: string;
      };
    };
  };
};

type TabType = 'goal' | 'description' | 'composition';
const HTTPS_PROTOCOL = 'https:';
const AMAZON_ALLOWED_HOSTS = ['amazon.com', 'amazon.com.br'];

function isAllowedAffiliateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== HTTPS_PROTOCOL) {
      return false;
    }

    const normalizedHost = parsed.hostname.toLowerCase();
    return AMAZON_ALLOWED_HOSTS.some((host) => normalizedHost === host || normalizedHost.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

const AffiliateProductScreen: React.FC<AffiliateProductScreenProps> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'AffiliateProduct', screenClass: 'AffiliateProductScreen' });
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('goal');

  const fallbackProduct = useMemo(() => {
    const p = route.params?.product;
    if (!p) return undefined;
    return {
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.image,
      type: p.type,
      description: p.description,
    };
  }, [
    route.params?.product?.id,
    route.params?.product?.title,
    route.params?.product?.price,
    route.params?.product?.image,
    route.params?.product?.type,
    route.params?.product?.description,
  ]);

  const { product, ad, loading } = useProductDetails({
    productId: route.params?.productId,
    adId: route.params?.adId,
    fallbackProduct,
    navigation,
    skipAmazonRedirect: true,
    supplementalExternalUrl: route.params?.product?.externalUrl,
  });

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleBuyOnAmazon = () => {
    const externalUrl = ad?.product?.externalUrl || product?.externalUrl || route.params?.product?.externalUrl;
    if (!externalUrl) {
      return;
    }

    if (!isAllowedAffiliateUrl(externalUrl)) {
      logger.warn('[AffiliateProductScreen] URL de afiliado bloqueada por domínio/protocolo inválido.', {
        externalUrl,
      });
      return;
    }

    Linking.openURL(externalUrl).catch((error: Error) => {
      logger.error('[AffiliateProductScreen] Falha ao abrir URL de afiliado.', { externalUrl, error });
    });
  };

  const paramsProduct = route.params?.product;
  const displayTitle = ad?.product?.name || product?.name || paramsProduct?.title || 'Product';
  const displayDescription = ad?.product?.description || product?.description || paramsProduct?.description || '';
  const displayImage =
    product?.image || ad?.product?.image || paramsProduct?.image || MARKETPLACE_PRODUCT_PLACEHOLDER_IMAGE_URI;

  const productImages = useMemo(() => {
    const images: string[] = [];
    if (displayImage && displayImage !== MARKETPLACE_PRODUCT_PLACEHOLDER_IMAGE_URI) {
      images.push(displayImage);
    }
    return images;
  }, [displayImage]);

  const productCategory = ad?.product?.type || product?.type || paramsProduct?.type || 'Product';

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
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{ showBackButton: true, onBackPress: handleBackPress }}
      contentContainerStyle={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

        {productImages.length > 1 && (
          <View style={styles.paginationContainer}>
            {productImages.map((_, index) => (
              <View key={index} style={[styles.paginationDot, index === 0 && styles.paginationDotActive]} />
            ))}
          </View>
        )}

        <View style={styles.contentSection}>
          {renderTabs()}
          {renderTabContent()}

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
    </ScreenWithHeader>
  );
};

export default AffiliateProductScreen;
