import React from 'react';
import { View, Text, TouchableOpacity, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onPress,
  disabled = false,
  containerStyle,
  labelStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Icon name='check' size={12} color='#0154f8' />}
      </View>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Checkbox;
