import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

type Props = {
  label: string;
};

const Badge: React.FC<Props> = ({ label }) => {
  const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formattedLabel}</Text>
    </View>
  );
};

export default Badge;

