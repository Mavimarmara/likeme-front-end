import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Header } from '@/components/ui/layout';
import { Background } from '@/components/ui/layout';
import { SecondaryButton } from '@/components/ui/buttons';
import { storageService, orderService, userService } from '@/services';
import { formatPrice, formatAddress, formatBillingAddress } from '@/utils';
import { useFormattedInput } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { logger } from '@/utils/logger';
import { styles } from './styles';
import AddressForm, { AddressData } from './address';
import PaymentForm from './payment';
import { CartItemList, OrderSummary, OrderScreen } from './order';
import type { CreateOrderData, CardData } from '@/types/order';
import { useAnalyticsScreen } from '@/analytics';

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
  const [sameBillingAddress, setSameBillingAddress] = useState(false);
  const [addressData, setAddressData] = useState<AddressData>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });
  const [addressLoaded, setAddressLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [saveCardDetails, setSaveCardDetails] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, _setShipping] = useState(0);
  const [_total, setTotal] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCpfChange = useFormattedInput({
    type: 'cpf',
    onChangeText: setCpf,
  });

  const handlePhoneChange = useFormattedInput({
    type: 'phone',
    onChangeText: setPhone,
  });

  useEffect(() => {
    loadCartItems();
    loadUserAddress();
  }, []);

  const loadUserAddress = async () => {
    try {
      const address = await userService.getShippingAddress();
      if (address) {
        setAddressData(address);
      }
    } catch (error) {
      console.error('Error loading user address:', error);
    } finally {
      setAddressLoaded(true);
    }
  };

  useEffect(() => {
    calculateTotals();
  }, [cartItems, shipping]);

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

  const isAddressValid =
    addressData.fullName.trim() !== '' &&
    addressData.addressLine1.trim() !== '' &&
    addressData.neighborhood.trim() !== '' &&
    addressData.city.trim() !== '' &&
    addressData.state.trim() !== '' &&
    addressData.zipCode.replace(/\D/g, '').length >= 8 &&
    addressData.phone.trim() !== '';

  const handleContinue = async () => {
    if (currentStep === 'address' && !isAddressValid) {
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
      setIsProcessing(true);

      // Validar dados necessários
      if (cartItems.length === 0) {
        Alert.alert(t('errors.error'), t('checkout.emptyCartError'));
        return;
      }

      if (paymentMethod === 'credit_card') {
        if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
          Alert.alert(t('errors.error'), t('checkout.fillCardDataError'));
          setIsProcessing(false);
          return;
        }

        // Validar formato da data de expiração (deve ter 4 dígitos)
        const formattedExpiry = expiryDate.replace(/\D/g, '');
        if (formattedExpiry.length !== 4) {
          Alert.alert(t('errors.error'), t('checkout.invalidExpiryError'));
          setIsProcessing(false);
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
      const billingAddressObj = formatBillingAddress(addressData);

      // Preparar cardData quando for cartão de crédito (backend sempre exige quando paymentMethod é credit_card)
      const cardDataObj = formatCardData();

      // Construir orderData - backend sempre exige billingAddress como objeto
      const orderData: CreateOrderData = {
        items: orderItems,
        status: 'pending',
        shippingCost: shipping,
        tax: 0, // Pode ser calculado se necessário
        shippingAddress: formatAddress(addressData),
        billingAddress: billingAddressObj, // Sempre como objeto estruturado
        paymentMethod: paymentMethod,
        // paymentStatus será sempre 'pending' no backend ao criar a order
      };

      // Incluir cardData quando for cartão de crédito (backend sempre exige quando paymentMethod é credit_card)
      // A validação acima já garante que os dados estão preenchidos e válidos
      if (paymentMethod === 'credit_card') {
        if (!cardDataObj) {
          Alert.alert(t('errors.error'), t('checkout.invalidCardDataError'));
          setIsProcessing(false);
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
      // Extrair mensagem de erro (pode estar em error.message ou error.error)
      const errorMessage = error?.message || error?.error || t('checkout.orderError');
      Alert.alert(t('errors.error'), errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Funções de formatação movidas para utils/formatters/addressFormatter.ts

  const formatCardData = (): CardData | undefined => {
    if (paymentMethod !== 'credit_card') {
      return undefined;
    }

    // Formatar data de expiração de MM/YY para MMYY
    const formattedExpiry = expiryDate.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (formattedExpiry.length !== 4) {
      return undefined;
    }

    // Formatar CPF (remover caracteres não numéricos)
    const formattedCpf = cpf.replace(/\D/g, '');

    // Formatar telefone (remover caracteres não numéricos)
    const formattedPhone = phone.replace(/\D/g, '');

    return {
      cardNumber: cardNumber.replace(/\s/g, ''), // Remove espaços
      cardHolderName: cardholderName,
      cardExpirationDate: formattedExpiry,
      cardCvv: cvv,
      cpf: formattedCpf.length === 11 ? formattedCpf : undefined,
      phone: formattedPhone.length >= 10 ? formattedPhone : undefined,
    };
  };

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  const handleViewProgram = (itemId: string) => {
    // Navigate to program details
    console.log('View program:', itemId);
  };

  const handleAddToCalendar = (itemId: string) => {
    // Add to calendar logic
    console.log('Add to calendar:', itemId);
  };

  const handleSaveAddress = (address: AddressData) => {
    setAddressData(address);
  };

  const handleApplyCoupon = () => {
    // Lógica para aplicar cupom
    console.log('Aplicar cupom:', couponCode);
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
              sameBillingAddress={sameBillingAddress}
              onSameBillingAddressChange={setSameBillingAddress}
              addressData={addressData}
              onSaveAddress={handleSaveAddress}
              startWithEditOpen={addressLoaded && !addressData.addressLine1?.trim()}
            />

            {/* Your Deliveries Section */}
            <Text style={styles.deliveriesTitle}>Your deliveries</Text>
            <CartItemList items={cartItems} formatPrice={formatPrice} formatRating={formatRating} />

            {/* Order Summary */}
            <OrderSummary subtotal={subtotal} shipping={shipping} formatPrice={formatPrice} />
          </>
        )}

        {currentStep === 'payment' && (
          <>
            {/* Payment Form */}
            <PaymentForm
              paymentMethod={paymentMethod}
              cardholderName={cardholderName}
              cardNumber={cardNumber}
              expiryDate={expiryDate}
              cvv={cvv}
              cpf={cpf}
              phone={phone}
              saveCardDetails={saveCardDetails}
              couponCode={couponCode}
              onPaymentMethodChange={setPaymentMethod}
              onCardholderNameChange={setCardholderName}
              onCardNumberChange={setCardNumber}
              onExpiryDateChange={setExpiryDate}
              onCvvChange={setCvv}
              onCpfChange={handleCpfChange}
              onPhoneChange={handlePhoneChange}
              onSaveCardDetailsChange={setSaveCardDetails}
              onCouponCodeChange={setCouponCode}
              onApplyCoupon={handleApplyCoupon}
            />

            {/* Order Summary */}
            <OrderSummary subtotal={subtotal} shipping={shipping} formatPrice={formatPrice} />
          </>
        )}

        {currentStep === 'order' && (
          <OrderScreen
            orderId={orderId}
            subtotal={subtotal}
            shipping={shipping}
            addressData={addressData}
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
            label={t('common.continue')}
            onPress={handleContinue}
            style={styles.completeButton}
            size='large'
            loading={isProcessing}
            disabled={isProcessing || (currentStep === 'address' && !isAddressValid)}
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
