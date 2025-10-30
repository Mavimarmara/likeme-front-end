import React from 'react';
import { Text, TouchableOpacity, GestureResponderEvent, ViewStyle } from 'react-native';
import { styles } from './styles';

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
};

const PrimaryButton: React.FC<Props> = ({ label, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;


