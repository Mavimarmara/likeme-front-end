import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { styles } from './styles';

export type PlanDescriptionProps = {
  title: string;
  items: string[];
  style?: ViewStyle | ViewStyle[];
};

const PlanDescription: React.FC<PlanDescriptionProps> = ({ title, items, style }) => {
  return (
    <View style={[styles.section, style]}>
      <Text style={styles.title}>{title}</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

export default PlanDescription;
