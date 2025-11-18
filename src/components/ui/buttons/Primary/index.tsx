import React from 'react';
import { Text, TouchableOpacity, GestureResponderEvent, ViewStyle, ActivityIndicator } from 'react-native';
import { styles } from './styles';

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  loading?: boolean;
  disabled?: boolean;
};

const PrimaryButton: React.FC<Props> = ({ label, onPress, style, loading = false, disabled = false }) => {
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity 
      style={[styles.button, style, isDisabled && styles.buttonDisabled]} 
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;


