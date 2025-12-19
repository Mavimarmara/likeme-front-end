import React from 'react';
import { Text, TouchableOpacity, GestureResponderEvent, ViewStyle, ActivityIndicator, TextStyle } from 'react-native';
import { styles } from './styles';

type Variant = 'dark' | 'light';

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  labelStyle?: TextStyle | TextStyle[];
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
};

const PrimaryButton: React.FC<Props> = ({ 
  label, 
  onPress, 
  style, 
  labelStyle: customLabelStyle,
  loading = false, 
  disabled = false,
  variant = 'dark',
}) => {
  const isDisabled = loading || disabled;
  const buttonStyle = variant === 'light' ? styles.buttonLight : styles.button;
  const defaultLabelStyle = variant === 'light' ? styles.labelLight : styles.label;
  const labelStyle = customLabelStyle ? [defaultLabelStyle, customLabelStyle] : defaultLabelStyle;
  const indicatorColor = variant === 'light' ? '#001137' : '#FFFFFF';

  return (
    <TouchableOpacity 
      style={[buttonStyle, style, isDisabled && styles.buttonDisabled]} 
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={indicatorColor} />
      ) : (
        <Text style={labelStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;


