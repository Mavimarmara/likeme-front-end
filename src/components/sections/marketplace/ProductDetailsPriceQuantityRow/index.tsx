import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

type ProductDetailsPriceQuantityRowProps = {
  formattedPrice: string;
  quantity: number;
  quantityOptions: number[];
  isQuantityDropdownOpen: boolean;
  onToggleQuantityDropdown: () => void;
  onSelectQuantity: (value: number) => void;
  paymentLinkLabel: string;
  onPaymentLinkPress?: () => void;
};

export function ProductDetailsPriceQuantityRow({
  formattedPrice,
  quantity,
  quantityOptions,
  isQuantityDropdownOpen,
  onToggleQuantityDropdown,
  onSelectQuantity,
  paymentLinkLabel,
  onPaymentLinkPress,
}: ProductDetailsPriceQuantityRowProps) {
  return (
    <>
      <View style={styles.row}>
        <Text style={styles.price}>{formattedPrice}</Text>
        <View style={styles.quantitySelectorWrapper}>
          <View style={styles.quantitySelector}>
            <Text style={styles.quantityLabel}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={onToggleQuantityDropdown} activeOpacity={0.8}>
              <Icon
                name={isQuantityDropdownOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={20}
                color='#FDFBEE'
              />
            </TouchableOpacity>
          </View>
          {isQuantityDropdownOpen ? (
            <View style={styles.quantityDropdown}>
              {quantityOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.quantityDropdownOption}
                  onPress={() => {
                    onSelectQuantity(option);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quantityDropdownOptionLabel}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      </View>
      <TouchableOpacity style={styles.paymentLinkRow} onPress={() => onPaymentLinkPress?.()} activeOpacity={0.7}>
        <Text style={styles.paymentLinkText}>{paymentLinkLabel}</Text>
      </TouchableOpacity>
    </>
  );
}
