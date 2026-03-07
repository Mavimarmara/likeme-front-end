import React, { useCallback, useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { StackNavigationProp } from '@react-navigation/stack';
import { LogoMini } from '@/assets';
import { Background } from '@/components/ui/layout';
import { BackgroundIconButton } from '@/assets';
import type { RootStackParamList } from '@/types/navigation';
import { formatPrice } from '@/utils';
import { Alert } from 'react-native';
import { SecondaryButton } from '@/components/ui/buttons';
import { ProductItemCard } from '@/components/ui/cards';
import { useTranslation, useCart, useFormattedInput } from '@/hooks';
import { useAnalyticsScreen } from '@/analytics';
import { isValidZipCodeFormat, formatZipCodeDisplay } from '@/services/address/cepService';
import { getShippingQuote } from '@/services/shipping/shippingService';
import { styles } from './styles';
import type { CartItem } from '@/types/cart';

type CartScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Cart'>;
  route?: any;
};

const CORREIOS_CEP_URL = 'https://buscacepinter.correios.com.br/app/endereco/index.php';

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Cart', screenClass: 'CartScreen' });
  const { t } = useTranslation();
  const { cartItems, loading, loadAndValidateCartItems, increaseQuantity, decreaseQuantity, removeItem, subtotal } =
    useCart();

  const [zipCode, setZipCode] = useState('');
  const [shipping, setShipping] = useState(0.0);
  const [shippingLoading, setShippingLoading] = useState(false);

  const handleZipCodeChange = useFormattedInput({ type: 'zipCode', onChangeText: setZipCode });

  const loadCartRef = useRef(() => {
    loadAndValidateCartItems((removedNames) => {
      if (removedNames.length > 0) {
        Alert.alert(t('cart.cartUpdated'), `${t('cart.productsRemoved')}\n\n${removedNames.join('\n')}`);
      }
    });
  });
  loadCartRef.current = () => {
    loadAndValidateCartItems((removedNames) => {
      if (removedNames.length > 0) {
        Alert.alert(t('cart.cartUpdated'), `${t('cart.productsRemoved')}\n\n${removedNames.join('\n')}`);
      }
    });
  };

  useEffect(() => {
    loadCartRef.current();

    const unsubscribe = navigation.addListener('focus', () => {
      loadCartRef.current();
    });

    return unsubscribe;
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleApplyShipping = async () => {
    const trimmed = zipCode.trim();
    if (!trimmed) {
      Alert.alert(t('errors.error'), t('cart.invalidZipCode'));
      return;
    }
    if (!isValidZipCodeFormat(trimmed)) {
      Alert.alert(t('errors.error'), t('cart.invalidZipCode'));
      return;
    }
    setShippingLoading(true);
    try {
      const result = await getShippingQuote(trimmed);
      setZipCode(formatZipCodeDisplay(trimmed));
      setShipping(result.minValue);
    } catch (err: any) {
      const status = err?.status;
      const isUnavailable = status === 502 || status === 504 || status === 503;
      const message = isUnavailable ? t('cart.shippingUnavailable') : err?.message || t('cart.invalidZipCode');
      Alert.alert(t('errors.error'), message);
    } finally {
      setShippingLoading(false);
    }
  };

  const handleBuy = () => {
    const zipParam =
      zipCode.trim().replace(/\D/g, '').length === 8 ? { zipCode: formatZipCodeDisplay(zipCode.trim()) } : undefined;
    navigation.navigate('Checkout', zipParam);
  };

  const calculateTotal = () => subtotal + shipping;

  const formatRating = (rating: number | undefined | null) => {
    if (rating === undefined || rating === null || isNaN(Number(rating))) {
      return '0.000';
    }
    return Number(rating).toFixed(3);
  };

  const noop = useCallback((): void => undefined, []);

  const renderCartItem = (item: CartItem) => (
    <ProductItemCard
      key={item.id}
      image={item.image}
      title={item.title}
      price={item.price}
      formatPrice={formatPrice}
      onPress={noop}
      showAddButton={false}
      badges={item.tags}
      subtitle={
        item.subtitle
          ? item.date
            ? `${item.subtitle} · ${t('cart.date')}: ${item.date}`
            : item.subtitle
          : item.date
          ? `${t('cart.date')}: ${item.date}`
          : undefined
      }
      rating={item.rating}
      formatRating={formatRating}
      quantity={item.quantity}
      showDelete={true}
      onRemove={() => removeItem(item.id)}
      onIncreaseQuantity={() => increaseQuantity(item.id)}
      onDecreaseQuantity={() => decreaseQuantity(item.id)}
      deleteButtonTestID={`delete-item-${item.id}`}
      increaseQuantityTestID={`increase-quantity-${item.id}`}
      decreaseQuantityTestID={`decrease-quantity-${item.id}`}
    />
  );
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress} activeOpacity={0.7} testID='back-button'>
        <ImageBackground
          source={BackgroundIconButton}
          style={styles.iconButtonBackground}
          imageStyle={styles.iconButtonImage}
        >
          <Icon name='arrow-back' size={20} color='#001137' />
        </ImageBackground>
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <LogoMini width={87} height={16} />
      </View>
      <View style={styles.placeholderButton} />
    </View>
  );

  const renderWarningBanner = () => (
    <View style={styles.warningBanner}>
      <Text style={styles.warningText}>{t('cart.warningMessage')}</Text>
    </View>
  );

  const renderShippingSection = () => (
    <View style={styles.shippingSection}>
      <Text style={styles.shippingTitle}>{t('cart.calculateShipping')}</Text>
      <View style={styles.shippingInputRow}>
        <TextInput
          style={styles.zipCodeInput}
          value={zipCode}
          onChangeText={handleZipCodeChange}
          placeholder={t('cart.zipCodePlaceholder')}
          placeholderTextColor='#6e6a6a'
          keyboardType='numeric'
        />
        <TouchableOpacity
          style={[styles.applyButton, shippingLoading && { opacity: 0.6 }]}
          onPress={handleApplyShipping}
          activeOpacity={0.8}
          disabled={shippingLoading}
        >
          <Text style={styles.applyButtonText}>{shippingLoading ? t('common.loading') : t('common.apply')}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.dontKnowZipButton}
        activeOpacity={0.7}
        onPress={() =>
          Linking.openURL(CORREIOS_CEP_URL).catch(() =>
            Alert.alert(t('errors.error'), t('cart.dontKnowZipCodeOpenError')),
          )
        }
      >
        <Text style={styles.dontKnowZipText}>{t('cart.dontKnowZipCode')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderSummary = () => {
    const total = calculateTotal();

    return (
      <View style={styles.orderSummary}>
        <View style={styles.separator} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('cart.shipping')}</Text>
          <Text style={styles.summaryValue}>{formatPrice(shipping)}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('cart.total')}</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Background />
      {renderHeader()}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>{t('cart.yourCart')}</Text>
        {renderWarningBanner()}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{t('cart.loadingCart')}</Text>
          </View>
        ) : cartItems.length > 0 ? (
          <>
            <Text style={styles.productsTitle}>{t('cart.yourProducts')}</Text>
            <View style={styles.cartItemsList}>{cartItems.map((item) => renderCartItem(item))}</View>
            {renderShippingSection()}
            {renderOrderSummary()}
            <SecondaryButton label={t('common.buy')} onPress={handleBuy} style={styles.buyButton} size='large' />
          </>
        ) : (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>{t('cart.emptyCart')}</Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('Marketplace')}
              activeOpacity={0.8}
            >
              <Text style={styles.shopButtonText}>{t('cart.startShopping')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartScreen;
