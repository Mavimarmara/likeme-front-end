import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { styles as baseStyles } from './styles';

type BadgeColor = 'blue' | 'orange' | 'lime' | 'beige';

type Props = {
  label: string;
  color?: BadgeColor;
};

const colorMap: Record<BadgeColor, string> = {
  blue: '#D8E4D6B8',
  orange: '#F6DEA9B8',
  lime: '#EDEC80B8',
  beige: '#F0EEE1B8',
};

const Badge: React.FC<Props> = ({ label, color = 'beige' }) => {
  const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

  const dynamicStyles = StyleSheet.create({
    container: {
      ...baseStyles.container,
      backgroundColor: colorMap[color],
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Text style={baseStyles.text}>{formattedLabel}</Text>
    </View>
  );
};

export default Badge;

