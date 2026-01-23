import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

type SubmitButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({ label, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
};
