import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Header } from '@/components/ui/layout';
import { Background } from '@/components/ui/layout';
import { storageService } from '@/services';
import { styles } from './styles';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import CartItemList from './CartItemList';
import OrderSummary from './OrderSummary';

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

interface AddressData {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sameBillingAddress, setSameBillingAddress] = useState(false);
  const [addressData, setAddressData] = useState<AddressData>({
    fullName: 'Ana Paula do Amaral',
    addressLine1: 'Rua Marselha, 1029 - Apto 94',
    addressLine2: '',
    neighborhood: 'Jaguaré',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '05332-000',
    phone: '+55 11 97979-2016',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCardDetails, setSaveCardDetails] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCartItems();
  }, []);

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
      return sum + (price * quantity);
    }, 0);
    setSubtotal(sub);
    setTotal(sub + shipping);
  };

  const formatPrice = (price: number): string => {
    if (price === undefined || price === null || isNaN(price)) {
      return '$0.00';
    }
    return `$${Number(price).toFixed(2)}`;
  };

  const formatRating = (rating: number): string => {
    if (rating === undefined || rating === null || isNaN(rating)) {
      return '0.000';
    }
    return Number(rating).toFixed(3);
  };


  const handleContinue = () => {
    if (currentStep === 'address') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('order');
    } else {
      // Finalizar compra
      navigation.goBack();
    }
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
            <Text style={[
              currentStep === 'address' ? styles.stepperLabelActive : styles.stepperLabelInactive
            ]}>
              Adress
            </Text>
            <View style={[
              styles.stepperLine,
              currentStep === 'address' ? styles.stepperLineActive : styles.stepperLineInactive
            ]} />
          </View>
          <View style={styles.stepperItem}>
            <Text style={[
              currentStep === 'payment' ? styles.stepperLabelActive : styles.stepperLabelInactive
            ]}>
              Payment
            </Text>
            <View style={[
              styles.stepperLine,
              currentStep === 'payment' ? styles.stepperLineActive : styles.stepperLineInactive
            ]} />
          </View>
          <View style={styles.stepperItem}>
            <Text style={[
              currentStep === 'order' ? styles.stepperLabelActive : styles.stepperLabelInactive
            ]}>
              Order
            </Text>
            <View style={[
              styles.stepperLine,
              currentStep === 'order' ? styles.stepperLineActive : styles.stepperLineInactive
            ]} />
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
            />

            {/* Your Deliveries Section */}
            <Text style={styles.deliveriesTitle}>Your deliveries</Text>
            <CartItemList
              items={cartItems}
              formatPrice={formatPrice}
              formatRating={formatRating}
            />

            {/* Order Summary */}
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              formatPrice={formatPrice}
            />
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
              saveCardDetails={saveCardDetails}
              couponCode={couponCode}
              onPaymentMethodChange={setPaymentMethod}
              onCardholderNameChange={setCardholderName}
              onCardNumberChange={setCardNumber}
              onExpiryDateChange={setExpiryDate}
              onCvvChange={setCvv}
              onSaveCardDetailsChange={setSaveCardDetails}
              onCouponCodeChange={setCouponCode}
              onApplyCoupon={handleApplyCoupon}
            />

            {/* Order Summary */}
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              formatPrice={formatPrice}
            />
          </>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleContinue}
          activeOpacity={0.7}
        >
          <Text style={styles.completeButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
