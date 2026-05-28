import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PrimaryButton } from '@/components/ui/buttons';
import { useTranslation } from '@/hooks/i18n';
import { COLORS } from '@/constants';
import { styles } from './styles';

interface OrderScreenProps {
  onViewOrdersPress: () => void;
}

const OrderScreen: React.FC<OrderScreenProps> = ({ onViewOrdersPress }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container} testID='order-completion'>
      <Icon name='mood' size={32} color={COLORS.TEXT} style={styles.icon} />
      <Text style={styles.title}>{t('checkout.paymentCompleted')}</Text>
      <Text style={styles.subtitle}>{t('checkout.paymentCompletedSubtitle')}</Text>
      <PrimaryButton
        label={t('checkout.viewOrders')}
        onPress={onViewOrdersPress}
        icon='chevron-right'
        iconSize={24}
        size='large'
        style={styles.button}
      />
    </View>
  );
};

export default OrderScreen;
