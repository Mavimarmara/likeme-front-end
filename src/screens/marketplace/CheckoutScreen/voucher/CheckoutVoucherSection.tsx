import React from 'react';
import { View, Text } from 'react-native';
import TextInput from '@/components/ui/inputs/TextInput';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { useTranslation } from '@/hooks/i18n';
import { styles } from '../styles';

export type CheckoutVoucherSectionProps = {
  couponCode: string;
  couponError?: string | null;
  appliedCouponCode?: string | null;
  couponApplying?: boolean;
  applyDisabled?: boolean;
  onCouponCodeChange: (text: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
};

const CheckoutVoucherSection: React.FC<CheckoutVoucherSectionProps> = ({
  couponCode,
  couponError,
  appliedCouponCode = null,
  couponApplying = false,
  applyDisabled = false,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.couponSection}>
      <Text style={styles.sectionTitle}>{t('checkout.discountCoupon', { defaultValue: 'Cupom de desconto' })}</Text>
      {appliedCouponCode ? (
        <View style={styles.couponAppliedBlock}>
          <Text style={styles.couponAppliedText}>
            {t('checkout.couponApplied', { code: appliedCouponCode, defaultValue: 'Cupom {{code}} aplicado' })}
          </Text>
          <SecondaryButton
            label={t('checkout.removeCoupon', { defaultValue: 'Remover cupom' })}
            onPress={onRemoveCoupon}
            size='medium'
            style={styles.removeCouponButton}
          />
        </View>
      ) : (
        <View style={styles.couponRow}>
          <TextInput
            placeholder={t('checkout.couponPlaceholder', { defaultValue: 'Digite o código' })}
            value={couponCode}
            onChangeText={(text) => onCouponCodeChange(text.toUpperCase())}
            containerStyle={styles.couponInput}
            style={styles.couponInputField}
            errorText={couponError ?? undefined}
            editable={!couponApplying}
            autoCapitalize='characters'
          />
          <View style={styles.applyButtonWrap}>
            <PrimaryButton
              label={t('common.apply')}
              onPress={onApplyCoupon}
              size='medium'
              loading={couponApplying}
              disabled={couponApplying || applyDisabled || !couponCode.trim()}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default CheckoutVoucherSection;
