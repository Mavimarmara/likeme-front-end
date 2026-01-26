import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '@/hooks/i18n';
import { AddressData } from './AddressForm';
import { styles } from '../styles';

interface AddressViewProps {
  address: AddressData;
  onEditPress: () => void;
}

const AddressView: React.FC<AddressViewProps> = ({ address, onEditPress }) => {
  const { t } = useTranslation();
  const formatAddressText = (address: AddressData) => {
    const addressParts = [
      address.fullName,
      address.addressLine1,
      address.addressLine2,
      '',
      `${address.neighborhood} - ${address.city} - ${address.state}`,
      address.zipCode,
      address.phone,
    ].filter((part) => part !== '');

    return addressParts.join('\n');
  };

  return (
    <View style={styles.addressCard}>
      <View style={styles.addressCardHeader}>
        <Text style={styles.addressCardTitle}>{t('checkout.deliveryAddress')}</Text>
        <TouchableOpacity onPress={onEditPress} activeOpacity={0.7}>
          <Icon name="edit" size={24} color="#001137" />
        </TouchableOpacity>
      </View>
      <View style={styles.addressCardContent}>
        <Text style={styles.addressText}>{formatAddressText(address)}</Text>
      </View>
    </View>
  );
};

export default AddressView;
