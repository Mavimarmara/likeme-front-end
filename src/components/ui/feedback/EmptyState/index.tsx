import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export type EmptyStateProps = {
  title: string;
  description?: string;
  /** Nome do ícone MaterialIcons (ex: "search-off", "inbox"). Opcional. */
  iconName?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, iconName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
};

export default EmptyState;
