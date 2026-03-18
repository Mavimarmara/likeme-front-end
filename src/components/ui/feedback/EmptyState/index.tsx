import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SecondaryButton from '@/components/ui/buttons/Secondary';
import { styles } from './styles';
import { COLORS } from '@/constants';

export type EmptyStateProps = {
  title: string;
  description?: string;
  /** Nome do ícone MaterialIcons (ex: "search-off", "inbox"). Exibido no topo quando informado. */
  iconName?: string;
  /** Label do botão de ação (ex: "Limpar filtros"). Opcional. */
  actionLabel?: string;
  /** Callback ao pressionar o botão de ação. */
  onActionPress?: () => void;
};

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, iconName, actionLabel, onActionPress }) => {
  return (
    <View style={styles.container}>
      {iconName ? (
        <View style={styles.iconWrapper}>
          <Icon name={iconName as any} size={64} color={COLORS.NEUTRAL.LOW.MEDIUM} style={styles.icon} />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onActionPress ? (
        <SecondaryButton label={actionLabel} onPress={onActionPress} style={styles.actionButton} size='medium' />
      ) : null}
    </View>
  );
};

export default EmptyState;
