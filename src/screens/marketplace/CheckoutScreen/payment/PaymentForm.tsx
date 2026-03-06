import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextInput from '@/components/ui/inputs/TextInput';
import { useFormattedInput } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { styles } from '../styles';
import AddressForm from '../address';
import type { AddressData } from '../address';

type PaymentMethod = 'credit_card' | 'pix';

interface PaymentFormProps {
  paymentMethod: PaymentMethod;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cpf: string;
  saveCardDetails: boolean;
  couponCode: string;
  /** Endereço de cobrança (editável neste passo) */
  billingAddressData: AddressData;
  /** Se true, endereço de entrega será o mesmo do endereço de cobrança */
  deliverySameAsBilling: boolean;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onCardholderNameChange: (text: string) => void;
  onCardNumberChange: (text: string) => void;
  onExpiryDateChange: (text: string) => void;
  onCvvChange: (text: string) => void;
  onCpfChange: (text: string) => void;
  onSaveCardDetailsChange: (value: boolean) => void;
  onCouponCodeChange: (text: string) => void;
  onApplyCoupon: () => void;
  onSaveBillingAddress: (address: AddressData) => void | Promise<void>;
  onDeliverySameAsBillingChange: (value: boolean) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentMethod,
  cardholderName,
  cardNumber,
  expiryDate,
  cvv,
  cpf,
  saveCardDetails,
  couponCode,
  billingAddressData,
  deliverySameAsBilling,
  onPaymentMethodChange,
  onCardholderNameChange,
  onCardNumberChange,
  onExpiryDateChange,
  onCvvChange,
  onCpfChange,
  onSaveCardDetailsChange,
  onCouponCodeChange,
  onApplyCoupon,
  onSaveBillingAddress,
  onDeliverySameAsBillingChange,
}) => {
  const { t } = useTranslation();
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
        <Text style={styles.sectionTitle}>{t('checkout.paymentMethod')}</Text>
        <View style={styles.paymentMethodOptions}>
          <TouchableOpacity
            style={styles.paymentMethodOption}
            onPress={() => onPaymentMethodChange('credit_card')}
            activeOpacity={0.7}
          >
            <View style={[styles.radioButton, paymentMethod === 'credit_card' && styles.radioButtonSelected]}>
              {paymentMethod === 'credit_card' && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={styles.paymentMethodLabel}>{t('checkout.creditCard')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.paymentMethodOption}
            onPress={() => onPaymentMethodChange('pix')}
            activeOpacity={0.7}
          >
            <View style={[styles.radioButton, paymentMethod === 'pix' && styles.radioButtonSelected]}>
              {paymentMethod === 'pix' && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={styles.paymentMethodLabel}>{t('checkout.pix')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Credit Card Form */}
      {paymentMethod === 'credit_card' && (
        <View style={styles.cardForm}>
          <TextInput
            label={t('checkout.cardholderName')}
            placeholder={t('checkout.cardholderNamePlaceholder')}
            value={cardholderName}
            onChangeText={onCardholderNameChange}
          />
          <TextInput
            label={t('checkout.cardNumber')}
            placeholder={t('checkout.cardNumberPlaceholder')}
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            keyboardType='numeric'
          />
          <View style={styles.cardRow}>
            <View style={styles.cardFieldHalf}>
              <TextInput
                label={t('checkout.expiryDate')}
                placeholder={t('checkout.expiryDatePlaceholder')}
                value={expiryDate}
                onChangeText={handleExpiryDateChange}
                keyboardType='numeric'
              />
            </View>
            <View style={styles.cardFieldHalf}>
              <TextInput
                label={t('checkout.cvv')}
                placeholder={t('checkout.cvvPlaceholder')}
                value={cvv}
                onChangeText={onCvvChange}
                keyboardType='numeric'
                secureTextEntry
              />
            </View>
          </View>
          <TextInput
            label={t('checkout.cpf')}
            placeholder={t('checkout.cpfPlaceholder')}
            value={cpf}
            onChangeText={onCpfChange}
            keyboardType='numeric'
          />
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => onSaveCardDetailsChange(!saveCardDetails)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, saveCardDetails && styles.checkboxChecked]}>
              {saveCardDetails && <Icon name='check' size={14} color='#0154f8' />}
            </View>
            <Text style={styles.checkboxLabel}>{t('checkout.saveCardDetails')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Discount Coupon */}
      <View style={styles.couponSection}>
        <Text style={styles.sectionTitle}>{t('checkout.discountCoupon')}</Text>
        <View style={styles.couponRow}>
          <TextInput
            placeholder={t('checkout.couponPlaceholder')}
            value={couponCode}
            onChangeText={onCouponCodeChange}
            containerStyle={styles.couponInput}
            style={styles.couponInputField}
          />
          <TouchableOpacity style={styles.applyButton} onPress={onApplyCoupon} activeOpacity={0.7}>
            <Text style={styles.applyButtonText}>{t('common.apply')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Endereço de cobrança (mesmo componente do passo de endereço, com botão editar; checkbox dentro do AddressView) */}
      <AddressForm
        addressData={billingAddressData}
        onSaveAddress={onSaveBillingAddress}
        titleKey='checkout.billingAddress'
        deliverySameAsBilling={deliverySameAsBilling}
        onDeliverySameAsBillingChange={onDeliverySameAsBillingChange}
      />
    </>
  );
};

export default PaymentForm;
