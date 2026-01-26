import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from '@/hooks/i18n';
import { styles as cartStyles } from '../../CartScreen/styles';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  formatPrice: (price: number) => string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, shipping, formatPrice }) => {
  const { t } = useTranslation();
  const total = subtotal + shipping;

  return (
    <View style={cartStyles.orderSummary}>
      <View style={cartStyles.separator} />
      <View style={cartStyles.summaryRow}>
        <Text style={cartStyles.summaryLabel}>{t('cart.subtotal')}</Text>
        <Text style={cartStyles.summaryValue}>{formatPrice(subtotal)}</Text>
      </View>
      <View style={cartStyles.summaryRow}>
        <Text style={cartStyles.summaryLabel}>{t('cart.shipping')}</Text>
        <Text style={cartStyles.summaryValue}>{formatPrice(shipping)}</Text>
      </View>
      <View style={cartStyles.separator} />
      <View style={cartStyles.totalRow}>
        <Text style={cartStyles.totalLabel}>{t('cart.total')}</Text>
        <Text style={cartStyles.totalValue}>{formatPrice(total)}</Text>
      </View>
    </View>
  );
};

export default OrderSummary;
