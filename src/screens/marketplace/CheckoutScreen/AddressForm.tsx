import React from 'react';
import { View } from 'react-native';
import EditableAddressCard, { AddressData } from './EditableAddressCard';

interface AddressFormProps {
  sameBillingAddress?: boolean;
  onSameBillingAddressChange?: (value: boolean) => void;
  addressData?: AddressData;
  onSaveAddress?: (address: AddressData) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  sameBillingAddress = false,
  onSameBillingAddressChange,
  addressData,
  onSaveAddress,
}) => {
  return (
    <View>
      <EditableAddressCard
        title="Endereço de entrega"
        initialData={addressData}
        onSave={onSaveAddress}
        sameBillingAddress={sameBillingAddress}
        onSameBillingAddressChange={onSameBillingAddressChange}
      />
    </View>
  );
};

export default AddressForm;
