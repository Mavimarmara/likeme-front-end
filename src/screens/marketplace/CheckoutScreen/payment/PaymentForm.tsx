import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextInput from '@/components/ui/inputs/TextInput';
import { useFormattedInput } from '@/hooks';
import { styles } from '../styles';

type PaymentMethod = 'credit_card' | 'pix';

interface PaymentFormProps {
  paymentMethod: PaymentMethod;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveCardDetails: boolean;
  couponCode: string;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onCardholderNameChange: (text: string) => void;
  onCardNumberChange: (text: string) => void;
  onExpiryDateChange: (text: string) => void;
  onCvvChange: (text: string) => void;
  onSaveCardDetailsChange: (value: boolean) => void;
  onCouponCodeChange: (text: string) => void;
  onApplyCoupon: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentMethod,
  cardholderName,
  cardNumber,
  expiryDate,
  cvv,
  saveCardDetails,
  couponCode,
  onPaymentMethodChange,
  onCardholderNameChange,
  onCardNumberChange,
  onExpiryDateChange,
  onCvvChange,
  onSaveCardDetailsChange,
  onCouponCodeChange,
  onApplyCoupon,
}) => {
  const handleCardNumberChange = useFormattedInput({
    type: 'cardNumber',
    onChangeText: onCardNumberChange,
  });

  const handleExpiryDateChange = useFormattedInput({
    type: 'expiryDate',
    onChangeText: onExpiryDateChange,
  });

  return (
    <>
      {/* Payment Method Selection */}
      <View style={styles.paymentMethodSection}>
        <Text style={styles.sectionTitle}>Payment method</Text>
        <View style={styles.paymentMethodOptions}>
          <TouchableOpacity
            style={styles.paymentMethodOption}
            onPress={() => onPaymentMethodChange('credit_card')}
            activeOpacity={0.7}
          >
            <View style={[styles.radioButton, paymentMethod === 'credit_card' && styles.radioButtonSelected]}>
              {paymentMethod === 'credit_card' && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={styles.paymentMethodLabel}>Credit card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.paymentMethodOption}
            onPress={() => onPaymentMethodChange('pix')}
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
            onChangeText={onCardholderNameChange}
          />
          <TextInput
            label="Card number"
            placeholder="1234 5678 9101 1121"
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            keyboardType="numeric"
          />
          <View style={styles.cardRow}>
            <View style={styles.cardFieldHalf}>
              <TextInput
                label="Expiration date"
                placeholder="mm/yy"
                value={expiryDate}
                onChangeText={handleExpiryDateChange}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.cardFieldHalf}>
              <TextInput
                label="CVV"
                placeholder="123"
                value={cvv}
                onChangeText={onCvvChange}
                keyboardType="numeric"
                secureTextEntry
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => onSaveCardDetailsChange(!saveCardDetails)}
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
            onChangeText={onCouponCodeChange}
            containerStyle={styles.couponInput}
            style={styles.couponInputField}
          />
          <TouchableOpacity
            style={styles.applyButton}
            onPress={onApplyCoupon}
            activeOpacity={0.7}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default PaymentForm;
