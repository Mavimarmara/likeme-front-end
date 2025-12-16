import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextInput from '@/components/ui/inputs/TextInput';
import { styles } from './styles';

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

interface AddressFormProps {
  onEditPress?: () => void;
  sameBillingAddress?: boolean;
  onSameBillingAddressChange?: (value: boolean) => void;
  addressData?: AddressData;
  onSaveAddress?: (address: AddressData) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  onEditPress,
  sameBillingAddress = false,
  onSameBillingAddressChange,
  addressData,
  onSaveAddress,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<AddressData>(
    addressData || {
      fullName: 'Ana Paula do Amaral',
      addressLine1: 'Rua Marselha, 1029 - Apto 94',
      addressLine2: '',
      neighborhood: 'Jaguaré',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05332-000',
      phone: '+55 11 97979-2016',
    }
  );

  const formatAddressText = () => {
    if (!addressData) {
      return 'Ana Paula do Amaral\nRua Marselha, 1029 - Apto 94\n\nJaguaré - São Paulo - SP\n05332-000\n+55 11 97979-2016';
    }

    const addressParts = [
      addressData.fullName,
      addressData.addressLine1,
      addressData.addressLine2,
      '',
      `${addressData.neighborhood} - ${addressData.city} - ${addressData.state}`,
      addressData.zipCode,
      addressData.phone,
    ].filter(part => part !== '');

    return addressParts.join('\n');
  };

  const handleEditPress = () => {
    setIsEditing(true);
    if (addressData) {
      setEditData(addressData);
    }
    onEditPress?.();
  };

  const handleSave = () => {
    if (onSaveAddress) {
      onSaveAddress(editData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (addressData) {
      setEditData(addressData);
    }
  };

  return (
    <View>
      <View style={styles.addressCard}>
        <View style={styles.addressCardHeader}>
          <Text style={styles.addressCardTitle}>Endereço de entrega</Text>
          {!isEditing && (
            <TouchableOpacity onPress={handleEditPress} activeOpacity={0.7}>
              <Icon name="edit" size={24} color="#001137" />
            </TouchableOpacity>
          )}
        </View>
        {!isEditing && (
          <>
            <View style={styles.addressCardContent}>
              <Text style={styles.addressText}>
                {formatAddressText()}
              </Text>
            </View>
            {onSameBillingAddressChange && (
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => onSameBillingAddressChange(!sameBillingAddress)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, sameBillingAddress && styles.checkboxChecked]}>
                  {sameBillingAddress && <Icon name="check" size={14} color="#0154f8" />}
                </View>
                <Text style={styles.checkboxLabel}>
                  Endereço de cobrança será o mesmo de entrega
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

      {isEditing && (
        <View style={styles.editAddressContainer}>
            <TextInput
              label="Full name"
              placeholder="Full name"
              value={editData.fullName}
              onChangeText={(text) => setEditData({ ...editData, fullName: text })}
            />
            <TextInput
              label="Address line 1"
              placeholder="Street name and number"
              value={editData.addressLine1}
              onChangeText={(text) => setEditData({ ...editData, addressLine1: text })}
            />
            <TextInput
              label="Address line 2"
              placeholder="Apartment, suite, etc. (optional)"
              value={editData.addressLine2}
              onChangeText={(text) => setEditData({ ...editData, addressLine2: text })}
            />
            <TextInput
              label="Neighborhood"
              placeholder="Neighborhood"
              value={editData.neighborhood}
              onChangeText={(text) => setEditData({ ...editData, neighborhood: text })}
            />
            <View style={styles.addressRow}>
              <View style={styles.addressFieldHalf}>
                <TextInput
                  label="City"
                  placeholder="City"
                  value={editData.city}
                  onChangeText={(text) => setEditData({ ...editData, city: text })}
                />
              </View>
              <View style={styles.addressFieldHalf}>
                <TextInput
                  label="State"
                  placeholder="State"
                  value={editData.state}
                  onChangeText={(text) => setEditData({ ...editData, state: text })}
                />
              </View>
            </View>
            <View style={styles.addressRow}>
              <View style={styles.addressFieldHalf}>
                <TextInput
                  label="ZIP code"
                  placeholder="00000-000"
                  value={editData.zipCode}
                  onChangeText={(text) => setEditData({ ...editData, zipCode: text })}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.addressFieldHalf}>
                <TextInput
                  label="Phone"
                  placeholder="+55 11 97979-2016"
                  value={editData.phone}
                  onChangeText={(text) => setEditData({ ...editData, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          <View style={styles.editAddressActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      </View>
    </View>
  );
};

export default AddressForm;
