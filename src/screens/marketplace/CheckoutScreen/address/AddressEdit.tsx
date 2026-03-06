import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import TextInput from '@/components/ui/inputs/TextInput';
import { Checkbox } from '@/components/ui/inputs';
import { SecondaryButton } from '@/components/ui/buttons';
import { useTranslation } from '@/hooks/i18n';
import { useFormattedInput } from '@/hooks';
import { AddressData } from './AddressForm';
import { styles } from '../styles';

interface AddressEditProps {
  initialData: AddressData;
  sameBillingAddress?: boolean;
  onSave: (address: AddressData) => void;
  onSameBillingAddressChange?: (value: boolean) => void;
}

const AddressEdit: React.FC<AddressEditProps> = ({
  initialData,
  sameBillingAddress = false,
  onSave,
  onSameBillingAddressChange,
}) => {
  const { t } = useTranslation();
  const [editData, setEditData] = useState<AddressData>(initialData);

  const handleZipCodeChange = useFormattedInput({
    type: 'zipCode',
    onChangeText: (text) => setEditData((prev) => ({ ...prev, zipCode: text })),
  });

  useEffect(() => {
    setEditData(initialData);
  }, [initialData]);

  const handleSave = () => {
    onSave(editData);
  };

  const isAddressValid =
    editData.fullName.trim() !== '' &&
    editData.addressLine1.trim() !== '' &&
    editData.neighborhood.trim() !== '' &&
    editData.city.trim() !== '' &&
    editData.state.trim() !== '' &&
    editData.zipCode.replace(/\D/g, '').length >= 8 &&
    editData.phone.trim() !== '';

  return (
    <View style={styles.addressCard}>
      <View style={styles.addressCardHeader}>
        <Text style={styles.addressCardTitle}>{t('checkout.deliveryAddress')}</Text>
      </View>
      <View style={styles.editAddressContainer}>
        <TextInput
          label={t('checkout.fullName')}
          placeholder={t('checkout.fullNamePlaceholder')}
          value={editData.fullName}
          onChangeText={(text) => setEditData({ ...editData, fullName: text })}
        />
        <TextInput
          label={t('checkout.addressLine1')}
          placeholder={t('checkout.addressLine1Placeholder')}
          value={editData.addressLine1}
          onChangeText={(text) => setEditData({ ...editData, addressLine1: text })}
        />
        <TextInput
          label={t('checkout.addressLine2')}
          placeholder={t('checkout.addressLine2Placeholder')}
          value={editData.addressLine2}
          onChangeText={(text) => setEditData({ ...editData, addressLine2: text })}
        />
        <TextInput
          label={t('checkout.neighborhood')}
          placeholder={t('checkout.neighborhoodPlaceholder')}
          value={editData.neighborhood}
          onChangeText={(text) => setEditData({ ...editData, neighborhood: text })}
        />
        <View style={styles.addressRow}>
          <View style={styles.addressFieldHalf}>
            <TextInput
              label={t('checkout.city')}
              placeholder={t('checkout.cityPlaceholder')}
              value={editData.city}
              onChangeText={(text) => setEditData({ ...editData, city: text })}
            />
          </View>
          <View style={styles.addressFieldHalf}>
            <TextInput
              label={t('checkout.state')}
              placeholder={t('checkout.statePlaceholder')}
              value={editData.state}
              onChangeText={(text) => setEditData({ ...editData, state: text })}
            />
          </View>
        </View>
        <View style={styles.addressRow}>
          <View style={styles.addressFieldHalf}>
            <TextInput
              label={t('checkout.zipCode')}
              placeholder={t('cart.zipCodePlaceholder')}
              value={editData.zipCode}
              onChangeText={handleZipCodeChange}
              keyboardType='numeric'
            />
          </View>
          <View style={styles.addressFieldHalf}>
            <TextInput
              label={t('checkout.phone')}
              placeholder={t('checkout.phonePlaceholder')}
              value={editData.phone}
              onChangeText={(text) => setEditData({ ...editData, phone: text })}
              keyboardType='phone-pad'
            />
          </View>
        </View>
        {onSameBillingAddressChange && (
          <Checkbox
            label={t('checkout.sameBillingAddress')}
            checked={sameBillingAddress}
            onPress={() => onSameBillingAddressChange(!sameBillingAddress)}
          />
        )}
        <View style={styles.editAddressActions}>
          <SecondaryButton label={t('common.save')} onPress={handleSave} disabled={!isAddressValid} />
        </View>
      </View>
    </View>
  );
};

export default AddressEdit;
