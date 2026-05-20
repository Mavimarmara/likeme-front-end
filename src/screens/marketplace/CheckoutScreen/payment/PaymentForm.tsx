import React from 'react';
import { View, Text } from 'react-native';
import TextInput from '@/components/ui/inputs/TextInput';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { useFormattedInput } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { styles } from '../styles';
import AddressForm from '../address/AddressForm';
import type { AddressData } from '../address/AddressForm';

interface PaymentFormProps {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cpf: string;
  couponCode: string;
  couponError?: string | null;
  appliedCouponCode?: string | null;
  couponApplying?: boolean;
  paymentFieldErrors?: Record<string, string>;
  billingAddressData: AddressData;
  deliverySameAsBilling: boolean;
  onCardholderNameChange: (text: string) => void;
  onCardNumberChange: (text: string) => void;
  onExpiryDateChange: (text: string) => void;
  onCvvChange: (text: string) => void;
  onCpfChange: (text: string) => void;
  onCouponCodeChange: (text: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon?: () => void;
  onSaveBillingAddress: (address: AddressData) => void | Promise<void>;
  onDeliverySameAsBillingChange: (value: boolean) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  cardholderName,
  cardNumber,
  expiryDate,
  cvv,
  cpf,
  couponCode,
  couponError,
  appliedCouponCode = null,
  couponApplying = false,
  paymentFieldErrors = {},
  billingAddressData,
  deliverySameAsBilling,
  onCardholderNameChange,
  onCardNumberChange,
  onExpiryDateChange,
  onCvvChange,
  onCpfChange,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
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
      {/* Cartão de crédito (único método implementado) */}
      <View style={styles.cardForm}>
        <TextInput
          label={t('checkout.cardholderName')}
          placeholder={t('checkout.cardholderNamePlaceholder')}
          value={cardholderName}
          onChangeText={onCardholderNameChange}
          errorText={paymentFieldErrors.cardholderName}
          required
        />
        <TextInput
          label={t('checkout.cardNumber')}
          placeholder={t('checkout.cardNumberPlaceholder')}
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          keyboardType='numeric'
          errorText={paymentFieldErrors.cardNumber}
          required
        />
        <View style={styles.cardRow}>
          <View style={styles.cardFieldHalf}>
            <TextInput
              label={t('checkout.expiryDate')}
              placeholder={t('checkout.expiryDatePlaceholder')}
              value={expiryDate}
              onChangeText={handleExpiryDateChange}
              keyboardType='numeric'
              errorText={paymentFieldErrors.expiryDate}
              required
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
              errorText={paymentFieldErrors.cvv}
              required
            />
          </View>
        </View>
        <TextInput
          label={t('checkout.cpf')}
          placeholder={t('checkout.cpfPlaceholder')}
          value={cpf}
          onChangeText={onCpfChange}
          keyboardType='numeric'
          errorText={paymentFieldErrors.cpf}
          required
        />
      </View>

      {/* Discount Coupon */}
      <View style={styles.couponSection}>
        <Text style={styles.sectionTitle}>{t('checkout.discountCoupon')}</Text>
        {appliedCouponCode ? (
          <View style={styles.couponAppliedBlock}>
            <Text style={styles.couponAppliedText}>{t('checkout.couponApplied', { code: appliedCouponCode })}</Text>
            {onRemoveCoupon ? (
              <SecondaryButton
                label={t('checkout.removeCoupon')}
                onPress={onRemoveCoupon}
                size='medium'
                style={styles.removeCouponButton}
              />
            ) : null}
          </View>
        ) : (
          <View style={styles.couponRow}>
            <TextInput
              placeholder={t('checkout.couponPlaceholder')}
              value={couponCode}
              onChangeText={onCouponCodeChange}
              containerStyle={styles.couponInput}
              style={styles.couponInputField}
              errorText={couponError ?? undefined}
              editable={!couponApplying}
            />
            <View style={styles.applyButtonWrap}>
              <PrimaryButton
                label={t('common.apply')}
                onPress={onApplyCoupon}
                size='medium'
                loading={couponApplying}
                disabled={couponApplying || !couponCode.trim()}
              />
            </View>
          </View>
        )}
      </View>

      {/* Endereço de cobrança */}
      <AddressForm
        addressData={billingAddressData}
        onSaveAddress={onSaveBillingAddress}
        titleKey='checkout.billingAddress'
        deliverySameAsBilling={deliverySameAsBilling}
        onDeliverySameAsBillingChange={onDeliverySameAsBillingChange}
        startWithEditOpen={!deliverySameAsBilling}
      />
    </>
  );
};

export default PaymentForm;
