import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import TextInput from '@/components/ui/inputs/TextInput';
import { Checkbox } from '@/components/ui/inputs';
import { SecondaryButton } from '@/components/ui/buttons';
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
  const [editData, setEditData] = useState<AddressData>(initialData);

  useEffect(() => {
    setEditData(initialData);
  }, [initialData]);

  const handleSave = () => {
    onSave(editData);
  };

  return (
    <View style={styles.addressCard}>
      <View style={styles.addressCardHeader}>
        <Text style={styles.addressCardTitle}>Endereço de entrega</Text>
      </View>
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
        {onSameBillingAddressChange && (
          <Checkbox
            label="Endereço de cobrança será o mesmo de entrega"
            checked={sameBillingAddress}
            onPress={() => onSameBillingAddressChange(!sameBillingAddress)}
          />
        )}
        <View style={styles.editAddressActions}>
          <SecondaryButton label="Save" onPress={handleSave} />
        </View>
      </View>
    </View>
  );
};

export default AddressEdit;

