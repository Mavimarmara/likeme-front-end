import React from 'react';
import { View, Text } from 'react-native';
import { styles as cartStyles } from '../../CartScreen/styles';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  formatPrice: (price: number) => string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, shipping, formatPrice }) => {
  const total = subtotal + shipping;

  return (
    <View style={cartStyles.orderSummary}>
      <View style={cartStyles.separator} />
      <View style={cartStyles.summaryRow}>
        <Text style={cartStyles.summaryLabel}>Subtotal</Text>
        <Text style={cartStyles.summaryValue}>{formatPrice(subtotal)}</Text>
      </View>
      <View style={cartStyles.summaryRow}>
        <Text style={cartStyles.summaryLabel}>Shipping</Text>
        <Text style={cartStyles.summaryValue}>{formatPrice(shipping)}</Text>
      </View>
      <View style={cartStyles.separator} />
      <View style={cartStyles.totalRow}>
        <Text style={cartStyles.totalLabel}>Total</Text>
        <Text style={cartStyles.totalValue}>{formatPrice(total)}</Text>
      </View>
    </View>
  );
};

export default OrderSummary;
