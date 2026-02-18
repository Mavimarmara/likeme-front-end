import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { CTACard } from '@/components/ui/cards';
import { COLORS } from '@/constants';
import { styles } from './styles';

export type PlanCardProps = {
  title: string;
  slogan: string;
  description: string;
  priceMonthly: string;
  priceAnnual: string;
  primaryButtonLabel: string;
  onPrimaryPress: () => void;
  backgroundColor?: string;
  style?: ViewStyle | ViewStyle[];
};

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  slogan,
  description,
  priceMonthly,
  priceAnnual,
  primaryButtonLabel,
  onPrimaryPress,
  backgroundColor = COLORS.PRIMARY.LIGHT,
  style,
}) => {
  return (
    <CTACard
      backgroundColor={backgroundColor}
      primaryButtonLabel={primaryButtonLabel}
      primaryButtonOnPress={onPrimaryPress}
      style={style}
    >
      <View style={styles.content}>
        <Text style={styles.planTitle}>{title}</Text>
        <Text style={styles.planSlogan}>{slogan}</Text>
        <Text style={styles.planDescription}>{description}</Text>
        <Text style={styles.planPrice}>{priceMonthly}</Text>
        <Text style={styles.planPriceAnnual}>{priceAnnual}</Text>
      </View>
    </CTACard>
  );
};

export default PlanCard;
