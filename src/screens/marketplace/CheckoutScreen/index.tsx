import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '@/components/ui/layout';
import TextInput from '@/components/ui/inputs/TextInput';
import { storageService } from '@/services';
import { styles } from './styles';
import { COLORS, SPACING, FONT_SIZES } from '@/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  tags?: string[];
}

type PaymentMethod = 'credit_card' | 'pix';

type Props = {
  navigation: any;
  route?: any;
};

const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

  useFocusEffect(
    React.useCallback(() => {
      loadCartItems();
    }, [])
  );

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

  const formatCardNumber = (text: string): string => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string): string => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpiryDateChange = (text: string) => {
    setExpiryDate(formatExpiryDate(text));
  };

  const handleCompletePurchase = () => {
    // Lógica para finalizar compra
    console.log('Finalizar compra');
    // Navegar para tela de confirmação ou voltar
    navigation.goBack();
  };

  const handleApplyCoupon = () => {
    // Lógica para aplicar cupom
    console.log('Aplicar cupom:', couponCode);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stepper - Address, Payment, Order */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepperItem}>
            <Text style={styles.stepperLabel}>Adress</Text>
            <View style={[styles.stepperLine, styles.stepperLineActive]} />
          </View>
          <View style={styles.stepperItem}>
            <Text style={[styles.stepperLabel, styles.stepperLabelActive]}>Payment</Text>
            <View style={[styles.stepperLine, styles.stepperLineActive]} />
          </View>
          <View style={styles.stepperItem}>
            <Text style={styles.stepperLabelInactive}>Order</Text>
            <View style={[styles.stepperLine, styles.stepperLineInactive]} />
          </View>
        </View>

        {/* Payment Method Selection */}
        <View style={styles.paymentMethodSection}>
          <Text style={styles.sectionTitle}>Payment method</Text>
          <View style={styles.paymentMethodOptions}>
            <TouchableOpacity
              style={styles.paymentMethodOption}
              onPress={() => setPaymentMethod('credit_card')}
              activeOpacity={0.7}
            >
              <View style={[styles.radioButton, paymentMethod === 'credit_card' && styles.radioButtonSelected]}>
                {paymentMethod === 'credit_card' && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.paymentMethodLabel}>Credit card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paymentMethodOption}
              onPress={() => setPaymentMethod('pix')}
              activeOpacity={0.7}
            >
              <View style={[styles.radioButton, paymentMethod === 'pix' && styles.radioButtonSelected]}>
                {paymentMethod === 'pix' && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.paymentMethodLabel}>Pix</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Credit Card Form */}
        {paymentMethod === 'credit_card' && (
          <View style={styles.cardForm}>
            <TextInput
              label="Cardholder's name"
              placeholder="Complete name"
              value={cardholderName}
              onChangeText={setCardholderName}
            />
            <TextInput
              label="Card number"
              placeholder="1234 5678 9101 1121"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              keyboardType="numeric"
              maxLength={19}
            />
            <View style={styles.cardRow}>
              <View style={styles.cardFieldHalf}>
                <TextInput
                  label="Expiration date"
                  placeholder="mm/yy"
                  value={expiryDate}
                  onChangeText={handleExpiryDateChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <View style={styles.cardFieldHalf}>
                <TextInput
                  label="CVV"
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setSaveCardDetails(!saveCardDetails)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, saveCardDetails && styles.checkboxChecked]}>
                {saveCardDetails && <Icon name="check" size={14} color="#0154f8" />}
              </View>
              <Text style={styles.checkboxLabel}>Save card datails</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Discount Coupon */}
        <View style={styles.couponSection}>
          <Text style={styles.sectionTitle}>Discount coupon</Text>
          <View style={styles.couponRow}>
            <TextInput
              placeholder="PRIMEIRACOMPRA"
              value={couponCode}
              onChangeText={setCouponCode}
              containerStyle={styles.couponInput}
              style={styles.couponInputField}
            />
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyCoupon}
              activeOpacity={0.7}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <View style={styles.separator} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>{formatPrice(shipping)}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.summaryTotalLabel]}>Total</Text>
            <Text style={[styles.summaryValue, styles.summaryTotalValue]}>{formatPrice(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Complete Purchase Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompletePurchase}
          activeOpacity={0.7}
        >
          <Text style={styles.completeButtonText}>Complete purchase</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
