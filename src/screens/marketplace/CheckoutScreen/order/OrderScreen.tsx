import React from 'react';
import { View, Text } from 'react-native';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { PrimaryButton } from '@/components/ui/buttons';
import { CheckoutConfirmationIcon, CheckoutErrorIcon } from '@/assets/marketplace';
import { useTranslation } from '@/hooks/i18n';
import { styles } from './styles';

export type OrderScreenStatus = 'success' | 'error';

interface OrderScreenProps {
  status?: OrderScreenStatus;
  onViewOrdersPress: () => void;
}

const ORDER_SCREEN_CONTENT = {
  success: {
    icon: CheckoutConfirmationIcon,
    titleKey: 'checkout.paymentCompleted',
    subtitleKey: 'checkout.paymentCompletedSubtitle',
    buttonKey: 'checkout.viewOrders',
  },
  error: {
    icon: CheckoutErrorIcon,
    titleKey: 'checkout.paymentFailed',
    subtitleKey: 'checkout.paymentFailedSubtitle',
    buttonKey: 'checkout.viewOrders',
  },
} as const;

const OrderScreen: React.FC<OrderScreenProps> = ({ status = 'success', onViewOrdersPress }) => {
  const { t } = useTranslation();
  const content = ORDER_SCREEN_CONTENT[status];

  return (
    <View style={styles.container} testID='order-completion'>
      <CachedImage source={content.icon} style={styles.icon} contentFit='contain' />
      <Text style={styles.title}>{t(content.titleKey)}</Text>
      <Text style={styles.subtitle}>{t(content.subtitleKey)}</Text>
      <PrimaryButton
        label={t(content.buttonKey)}
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
