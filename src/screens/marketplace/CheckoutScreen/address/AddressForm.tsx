import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import AddressView from './AddressView';
import AddressEdit from './AddressEdit';

export interface AddressData {
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
  sameBillingAddress?: boolean;
  onSameBillingAddressChange?: (value: boolean) => void;
  addressData?: AddressData;
  onSaveAddress?: (address: AddressData) => void;
  /** Quando true, abre direto no modo edição (ex.: endereço vindo vazio da API) */
  startWithEditOpen?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  sameBillingAddress = false,
  onSameBillingAddressChange,
  addressData,
  onSaveAddress,
  startWithEditOpen = false,
}) => {
  const defaultAddress: AddressData = {
    fullName: 'Ana Paula do Amaral',
    addressLine1: 'Rua Marselha, 1029 - Apto 94',
    addressLine2: '',
    neighborhood: 'Jaguaré',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '',
    phone: '+55 11 97979-2016',
  };

  const [isEditing, setIsEditing] = useState(false);
  const currentAddress = addressData || defaultAddress;

  useEffect(() => {
    if (startWithEditOpen) {
      setIsEditing(true);
    }
  }, [startWithEditOpen]);

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSave = (address: AddressData) => {
    if (onSaveAddress) {
      onSaveAddress(address);
    }
    setIsEditing(false);
  };

  return (
    <View>
      {!isEditing ? (
        <AddressView address={currentAddress} onEditPress={handleEditPress} />
      ) : (
        <AddressEdit
          initialData={currentAddress}
          sameBillingAddress={sameBillingAddress}
          onSave={handleSave}
          onSameBillingAddressChange={onSameBillingAddressChange}
        />
      )}
    </View>
  );
};

export default AddressForm;
