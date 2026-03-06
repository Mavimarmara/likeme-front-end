import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui/layout';
import { Background } from '@/components/ui/layout';
import { SecondaryButton } from '@/components/ui/buttons';
import { storageService, orderService, userService } from '@/services';
import { formatPrice, formatAddress, formatBillingAddress } from '@/utils';
import { useTranslation, usePayment } from '@/hooks';
import { logger } from '@/utils/logger';
import { styles } from './styles';
import AddressForm, { AddressData } from './address/AddressForm';
import PaymentForm from './payment/PaymentForm';
import CartItemList from './order/CartItemList';
import OrderSummary from './order/OrderSummary';
import OrderScreen from './order/OrderScreen';
import type { CreateOrderData } from '@/types/order';
import { useAnalyticsScreen } from '@/analytics';

function isAddressFilled(address: AddressData): boolean {
  return (
    address.fullName.trim() !== '' &&
    address.addressLine1.trim() !== '' &&
    address.neighborhood.trim() !== '' &&
    address.city.trim() !== '' &&
    address.state.trim() !== '' &&
    address.zipCode.replace(/\D/g, '').length >= 8 &&
    address.phone.replace(/\D/g, '').length >= 10
  );
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  tags?: string[];
}

type PaymentMethod = 'credit_card' | 'pix';
type CheckoutStep = 'address' | 'payment' | 'order';

type Props = {
  navigation: any;
  route?: any;
};

const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Checkout', screenClass: 'CheckoutScreen' });
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addressData, setAddressData] = useState<AddressData>({
    fullName: '',
    addressLine1: '',
    streetNumber: '',
    addressLine2: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });
  const [billingAddressData, setBillingAddressData] = useState<AddressData>({
    fullName: '',
    addressLine1: '',
    streetNumber: '',
    addressLine2: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });
  const [deliverySameAsBilling, setDeliverySameAsBilling] = useState(true);
  const [addressLoaded, setAddressLoaded] = useState(false);
  const [addressLoadError, setAddressLoadError] = useState<string | null>(null);
  const [addressSaveError, setAddressSaveError] = useState<string | null>(null);
  const [paymentMethod] = useState<PaymentMethod>('credit_card');
  const payment = usePayment();
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, _setShipping] = useState(0);
  const [_total, setTotal] = useState(0);
  const [orderId, setOrderId] = useState('');

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
      }
    } catch (error) {
      console.error('Error loading user address:', error);
      setAddressLoadError(t('checkout.addressLoadError'));
    } finally {
      setAddressLoaded(true);
    }
  };

  useEffect(() => {
    calculateTotals();
  }, [cartItems, shipping]);

  useEffect(() => {
    if (currentStep !== 'payment') payment.setPaymentError(null);
  }, [currentStep]);

  // Ao entrar no passo de pagamento, preencher endereço de cobrança com o de entrega se ainda vazio
  useEffect(() => {
    if (currentStep !== 'payment') return;
    if (!isAddressFilled(billingAddressData) && addressData.addressLine1?.trim()) {
      setBillingAddressData(addressData);
    }
  }, [currentStep]);

  const loadCartItems = async () => {
    try {
      const items = await storageService.getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  };

  const calculateTotals = () => {
    const sub = cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + price * quantity;
    }, 0);
    setSubtotal(sub);
    setTotal(sub + shipping);
  };

  const formatRating = (rating: number): string => {
    if (rating === undefined || rating === null || isNaN(rating)) {
      return '0.000';
    }
    return Number(rating).toFixed(3);
  };

  const isAddressValid = isAddressFilled(addressData);

  const isPaymentStepValid = payment.isPaymentStepValid(isAddressFilled(billingAddressData));

  const canProceedFromAddress = isAddressValid && (deliverySameAsBilling || isAddressFilled(billingAddressData));

  const isContinueDisabled =
    payment.isProcessing ||
    (currentStep === 'address' && !canProceedFromAddress) ||
    (currentStep === 'payment' && !isPaymentStepValid);

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

      // Validar dados necessários
      if (cartItems.length === 0) {
        payment.setPaymentError(t('checkout.emptyCartError'));
        payment.setIsProcessing(false);
        return;
      }

      if (paymentMethod === 'credit_card') {
        const errors = payment.validatePaymentFields(t);
        if (errors) {
          payment.setPaymentFieldErrors(errors);
          payment.setPaymentError(null);
          payment.setIsProcessing(false);
          return;
        }
      }

      // Preparar dados do pedido
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        discount: 0, // Pode ser calculado com base em cupons
      }));

      // Log dos produtos que serão enviados
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

      console.log(
        '📦 Produtos do pedido:',
        JSON.stringify(
          cartItems.map((item) => ({
            productId: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
          null,
          2,
        ),
      );

      // Preparar billingAddress sempre como objeto estruturado (backend sempre exige)
      const billingAddressObj = formatBillingAddress(billingAddressData);

      // Endereço de entrega: mesmo de cobrança se checkbox marcado, senão o do passo de endereço
      const shippingAddressData = deliverySameAsBilling ? billingAddressData : addressData;
      if (!isAddressFilled(billingAddressData)) {
        payment.setPaymentError(t('checkout.billingAddressRequired'));
        payment.setIsProcessing(false);
        return;
      }

      const shippingAddressFormatted = formatAddress(shippingAddressData);

      const cardDataObj = payment.getCardData();

      // Construir orderData - backend sempre exige billingAddress como objeto
      const orderData: CreateOrderData = {
        items: orderItems,
        status: 'pending',
        shippingCost: shipping,
        tax: 0, // Pode ser calculado se necessário
        shippingAddress: shippingAddressFormatted,
        billingAddress: billingAddressObj, // Sempre como objeto estruturado
        paymentMethod: paymentMethod,
        // paymentStatus será sempre 'pending' no backend ao criar a order
      };

      // Incluir cardData quando for cartão de crédito (backend sempre exige quando paymentMethod é credit_card)
      // A validação acima já garante que os dados estão preenchidos e válidos
      if (paymentMethod === 'credit_card') {
        if (!cardDataObj) {
          payment.setPaymentError(t('checkout.invalidCardDataError'));
          payment.setIsProcessing(false);
          return;
        }
        orderData.cardData = cardDataObj;
      }

      console.log('📋 Dados do pedido que serão enviados:', JSON.stringify(orderData, null, 2));
      logger.debug('Dados do pedido completos:', orderData);

      // Criar o pedido
      const orderResponse = await orderService.createOrder(orderData);

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error('Falha ao criar pedido');
      }

      const createdOrder = orderResponse.data;
      setOrderId(createdOrder.id);

      // Order criada com paymentStatus 'pending' por padrão
      // O pagamento será processado separadamente depois, se necessário

      // Limpar carrinho após sucesso
      await storageService.clearCart();

      // Navegar para a tela de Order
      setCurrentStep('order');
    } catch (error: any) {
      console.error('Error completing order:', error);
      const errorMessage = error?.message || error?.error || t('checkout.orderError');
      payment.setPaymentError(errorMessage);
    } finally {
      payment.setIsProcessing(false);
    }
  };

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  const handleViewProgram = (itemId: string) => {
    navigation.navigate('ProductDetails', { productId: itemId });
  };

  const handleAddToCalendar = (itemId: string) => {
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
    setDeliverySameAsBilling(false); // Ao editar cobrança, deixa de ser "igual à entrega"
  };

  const handleDeliverySameAsBillingChange = (value: boolean) => {
    setDeliverySameAsBilling(value);
    if (value) {
      setBillingAddressData(addressData); // Ao marcar, cobrança = entrega
    }
  };

  const handleApplyCoupon = () => {
    if (!payment.couponCode.trim()) return;
    payment.setCouponError(t('checkout.invalidCoupon'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stepper - Address, Payment, Order */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepperItem}>
            <Text style={[currentStep === 'address' ? styles.stepperLabelActive : styles.stepperLabelInactive]}>
              {t('checkout.address')}
            </Text>
            <View
              style={[
                styles.stepperLine,
                currentStep === 'address' ? styles.stepperLineActive : styles.stepperLineInactive,
              ]}
            />
          </View>
          <View style={styles.stepperItem}>
            <Text style={[currentStep === 'payment' ? styles.stepperLabelActive : styles.stepperLabelInactive]}>
              {t('checkout.payment')}
            </Text>
            <View
              style={[
                styles.stepperLine,
                currentStep === 'payment' ? styles.stepperLineActive : styles.stepperLineInactive,
              ]}
            />
          </View>
          <View style={styles.stepperItem}>
            <Text style={[currentStep === 'order' ? styles.stepperLabelActive : styles.stepperLabelInactive]}>
              {t('checkout.order')}
            </Text>
            <View
              style={[
                styles.stepperLine,
                currentStep === 'order' ? styles.stepperLineActive : styles.stepperLineInactive,
              ]}
            />
          </View>
        </View>

        {currentStep === 'address' && (
          <>
            {/* Address Form */}
            <AddressForm
              addressData={addressData}
              onSaveAddress={handleSaveAddress}
              startWithEditOpen={addressLoaded && !addressData.addressLine1?.trim()}
              addressLoadError={addressLoadError}
              addressSaveError={addressSaveError}
            />

            {/* Your Deliveries Section */}
            <Text style={styles.deliveriesTitle}>{t('checkout.yourDeliveries')}</Text>
            <CartItemList items={cartItems} formatPrice={formatPrice} formatRating={formatRating} />

            {/* Order Summary */}
            <OrderSummary subtotal={subtotal} shipping={shipping} formatPrice={formatPrice} />
          </>
        )}

        {currentStep === 'payment' && (
          <>
            {/* Payment Form */}
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
            {payment.paymentError ? <Text style={styles.fieldError}>{payment.paymentError}</Text> : null}

            {/* Order Summary */}
            <OrderSummary subtotal={subtotal} shipping={shipping} formatPrice={formatPrice} />
          </>
        )}

        {currentStep === 'order' && (
          <OrderScreen
            orderId={orderId}
            subtotal={subtotal}
            shipping={shipping}
            addressData={deliverySameAsBilling ? billingAddressData : addressData}
            cartItems={cartItems}
            onViewProgram={handleViewProgram}
            onAddToCalendar={handleAddToCalendar}
            onHomePress={handleHomePress}
          />
        )}
      </ScrollView>

      {/* Continue/Home Button */}
      {currentStep !== 'order' && (
        <View style={styles.buttonContainer}>
          <SecondaryButton
            testID='button-continue'
            label={t('common.continue')}
            onPress={handleContinue}
            style={styles.completeButton}
            size='large'
            loading={payment.isProcessing}
            disabled={isContinueDisabled}
          />
        </View>
      )}

      {currentStep === 'order' && (
        <View style={styles.buttonContainer}>
          <SecondaryButton
            label={t('common.home')}
            onPress={handleHomePress}
            style={styles.completeButton}
            size='large'
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default CheckoutScreen;
