import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui/layout';
import { Background } from '@/components/ui/layout';
import { SecondaryButton } from '@/components/ui/buttons';
import { Stepper } from '@/components/ui/tabs';
import { storageService, orderService, userService } from '@/services';
import { getShippingQuote } from '@/services/shipping/shippingService';
import { formatZipCodeDisplay } from '@/services/address/cepService';
import { formatPrice, formatAddress, formatBillingAddress } from '@/utils';
import { useTranslation, usePayment } from '@/hooks';
import { logger } from '@/utils/logger';
import { styles } from './styles';
import AddressForm, { AddressData, EMPTY_ADDRESS, isAddressFilled } from './address/AddressForm';
import PaymentForm from './payment/PaymentForm';
import { ProductItemCard } from '@/components/ui/cards';
import OrderSummary from './order/OrderSummary';
import OrderScreen from './order/OrderScreen';
import type { CreateOrderData } from '@/types/order';
import { useAnalyticsScreen } from '@/analytics';
import { useCart } from '@/hooks';

const noop = (): void => undefined;

type PaymentMethod = 'credit_card' | 'pix';
type CheckoutStep = 'address' | 'payment' | 'order';

const PAYMENT_METHOD: PaymentMethod = 'credit_card';

type Props = {
  navigation: any;
  route?: any;
};

const CheckoutScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'Checkout', screenClass: 'CheckoutScreen' });
  const { t } = useTranslation();
  const { cartItems, loadCartItems, increaseQuantity, decreaseQuantity, removeItem, subtotal } = useCart({
    onEmpty: () => navigation.navigate('Cart'),
  });

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [addressData, setAddressData] = useState<AddressData>(EMPTY_ADDRESS);
  const [billingAddressData, setBillingAddressData] = useState<AddressData>(EMPTY_ADDRESS);
  const [deliverySameAsBilling, setDeliverySameAsBilling] = useState(true);
  const [addressLoaded, setAddressLoaded] = useState(false);
  const [addressLoadError, setAddressLoadError] = useState<string | null>(null);
  const [addressSaveError, setAddressSaveError] = useState<string | null>(null);
  const payment = usePayment();
  const [shipping, setShipping] = useState(0);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const effectiveDeliveryAddress = deliverySameAsBilling ? billingAddressData : addressData;
  const deliveryZipCode = (effectiveDeliveryAddress.zipCode || '').replace(/\D/g, '');
  const fallbackZipCode = (addressData.zipCode || '').replace(/\D/g, '');
  const zipCodeForShipping = deliveryZipCode.length === 8 ? deliveryZipCode : fallbackZipCode;

  useEffect(() => {
    loadCartItems();
    loadUserAddress();
  }, []);

  const loadUserAddress = async () => {
    try {
      setAddressLoadError(null);
      const address = await userService.getShippingAddress();
      if (address) {
        setAddressData(address);
      } else {
        const cartZip = route?.params?.zipCode;
        const digits = (cartZip || '').replace(/\D/g, '');
        if (digits.length === 8) {
          setAddressData({ ...EMPTY_ADDRESS, zipCode: formatZipCodeDisplay(cartZip!) });
        }
      }
    } catch (error) {
      console.error('Error loading user address:', error);
      setAddressLoadError(t('checkout.addressLoadError'));
    } finally {
      setAddressLoaded(true);
    }
  };

  useEffect(() => {
    if (zipCodeForShipping.length !== 8) {
      setShipping(0);
      return;
    }
    let cancelled = false;
    setShippingLoading(true);
    getShippingQuote(zipCodeForShipping)
      .then((res) => {
        if (!cancelled) setShipping(res.minValue);
      })
      .catch(() => {
        if (!cancelled) setShipping(0);
      })
      .then(() => {
        if (!cancelled) setShippingLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [zipCodeForShipping, currentStep]);

  useEffect(() => {
    if (currentStep !== 'payment') payment.setPaymentError(null);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 'payment' && !isAddressFilled(billingAddressData) && addressData.addressLine1?.trim()) {
      setBillingAddressData(addressData);
    }
  }, [currentStep]);

  const formatRating = (rating: number): string => {
    if (rating === undefined || rating === null || isNaN(rating)) {
      return '0.000';
    }
    return Number(rating).toFixed(3);
  };

  const isAddressValid = isAddressFilled(addressData);

  const canProceedFromAddress = isAddressValid && (deliverySameAsBilling || isAddressFilled(billingAddressData));

  const isContinueDisabled =
    payment.isProcessing ||
    (currentStep === 'address' && (!canProceedFromAddress || shipping === 0 || shippingLoading)) ||
    (currentStep === 'payment' && (shipping === 0 || shippingLoading));

  const handleContinue = async () => {
    if (currentStep === 'address' && !canProceedFromAddress) {
      return;
    }
    if (currentStep === 'address') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      await handleCompleteOrder();
    }
  };

  const handleCompleteOrder = async () => {
    try {
      payment.setIsProcessing(true);

      if (cartItems.length === 0) {
        Alert.alert(t('errors.error'), t('checkout.orderError'));
        payment.setIsProcessing(false);
        return;
      }

      if (shipping === 0 || shippingLoading) {
        Alert.alert(t('errors.error'), t('checkout.shippingRequired'));
        payment.setIsProcessing(false);
        return;
      }

      if (PAYMENT_METHOD === 'credit_card') {
        const errors = payment.validatePaymentFields(t);
        if (errors) {
          payment.setPaymentFieldErrors(errors);
          payment.setPaymentError(null);
          payment.setIsProcessing(false);
          return;
        }
      }

      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        discount: 0,
      }));

      logger.debug('Produtos do carrinho que serão enviados para o backend:', {
        totalItems: cartItems.length,
        items: cartItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
      });

      const billingAddressObj = formatBillingAddress(billingAddressData);

      const shippingAddressData = deliverySameAsBilling ? billingAddressData : addressData;
      if (!isAddressFilled(billingAddressData)) {
        Alert.alert(t('errors.error'), t('checkout.orderError'));
        payment.setIsProcessing(false);
        return;
      }

      const shippingAddressFormatted = formatAddress(shippingAddressData);
      const cardDataObj = payment.getCardData();

      const orderData: CreateOrderData = {
        items: orderItems,
        status: 'pending',
        shippingCost: shipping,
        tax: 0,
        shippingAddress: shippingAddressFormatted,
        billingAddress: billingAddressObj,
        paymentMethod: PAYMENT_METHOD,
      };

      if (PAYMENT_METHOD === 'credit_card') {
        if (!cardDataObj) {
          Alert.alert(t('errors.error'), t('checkout.orderError'));
          payment.setIsProcessing(false);
          return;
        }
        orderData.cardData = cardDataObj;
      }

      logger.debug('Dados do pedido completos:', orderData);

      const orderResponse = await orderService.createOrder(orderData);

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error('Falha ao criar pedido');
      }

      setOrderId(orderResponse.data.id);
      await storageService.clearCart();
      setCurrentStep('order');
    } catch (error: any) {
      console.error('Error completing order:', error);
      Alert.alert(t('errors.error'), t('checkout.orderError'));
    } finally {
      payment.setIsProcessing(false);
    }
  };

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  const handleProductPress = (itemId: string) => {
    navigation.navigate('ProductDetails', { productId: itemId });
  };

  const handleSaveAddress = async (address: AddressData) => {
    try {
      setAddressSaveError(null);
      await userService.saveShippingAddress(address);
      setAddressData(address);
    } catch (error: any) {
      const message = (error?.message && String(error.message).trim()) || t('checkout.addressSaveError');
      setAddressSaveError(message);
      throw error;
    }
  };

  const handleSaveBillingAddress = (address: AddressData) => {
    setBillingAddressData(address);
    setDeliverySameAsBilling(false);
  };

  const handleDeliverySameAsBillingChange = (value: boolean) => {
    setDeliverySameAsBilling(value);
    if (value) {
      setBillingAddressData(addressData);
    } else {
      setBillingAddressData(EMPTY_ADDRESS);
    }
  };

  const handleApplyCoupon = () => {
    if (!payment.couponCode.trim()) return;
    payment.setCouponError(t('checkout.invalidCoupon'));
  };

  const stepperSteps = useMemo(
    () => [
      { id: 'address', label: t('checkout.address') },
      { id: 'payment', label: t('checkout.payment') },
      { id: 'order', label: t('checkout.order') },
    ],
    [t],
  );

  const orderSummary = (
    <OrderSummary subtotal={subtotal} shipping={shipping} formatPrice={formatPrice} shippingLoading={shippingLoading} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Stepper
          steps={stepperSteps}
          currentStepId={currentStep}
          onStepPress={(stepId) => setCurrentStep(stepId as CheckoutStep)}
        />

        {currentStep === 'address' && (
          <>
            <AddressForm
              addressData={addressData}
              onSaveAddress={handleSaveAddress}
              startWithEditOpen={addressLoaded && !addressData.addressLine1?.trim()}
              addressLoadError={addressLoadError}
              addressSaveError={addressSaveError}
            />

            <Text style={styles.deliveriesTitle}>{t('checkout.yourDeliveries')}</Text>
            <View style={styles.cartItemsList} testID='cart-items-list'>
              {cartItems.map((item) => (
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
                />
              ))}
            </View>

            {orderSummary}
          </>
        )}

        {currentStep === 'payment' && (
          <>
            <PaymentForm
              cardholderName={payment.cardholderName}
              cardNumber={payment.cardNumber}
              expiryDate={payment.expiryDate}
              cvv={payment.cvv}
              cpf={payment.cpf}
              couponCode={payment.couponCode}
              couponError={payment.couponError}
              paymentFieldErrors={payment.paymentFieldErrors}
              billingAddressData={billingAddressData}
              deliverySameAsBilling={deliverySameAsBilling}
              onCardholderNameChange={payment.onCardholderNameChange}
              onCardNumberChange={payment.onCardNumberChange}
              onExpiryDateChange={payment.onExpiryDateChange}
              onCvvChange={payment.onCvvChange}
              onCpfChange={payment.onCpfChange}
              onCouponCodeChange={payment.onCouponCodeChange}
              onApplyCoupon={handleApplyCoupon}
              onSaveBillingAddress={handleSaveBillingAddress}
              onDeliverySameAsBillingChange={handleDeliverySameAsBillingChange}
            />
            {orderSummary}
          </>
        )}

        {currentStep === 'order' && (
          <OrderScreen
            orderId={orderId}
            subtotal={subtotal}
            shipping={shipping}
            addressData={deliverySameAsBilling ? billingAddressData : addressData}
            cartItems={cartItems}
            onViewProgram={handleProductPress}
            onAddToCalendar={handleProductPress}
            onHomePress={handleHomePress}
          />
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {currentStep === 'order' ? (
          <SecondaryButton
            label={t('common.home')}
            onPress={handleHomePress}
            style={styles.completeButton}
            size='large'
          />
        ) : (
          <SecondaryButton
            testID='button-continue'
            label={t('common.continue')}
            onPress={handleContinue}
            style={styles.completeButton}
            size='large'
            loading={payment.isProcessing}
            disabled={isContinueDisabled}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
