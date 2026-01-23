import React from 'react';
import { Text, TouchableOpacity, GestureResponderEvent, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '@/constants';
import { styles } from './styles';

type Size = 'medium' | 'large';

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  labelStyle?: TextStyle | TextStyle[];
  loading?: boolean;
  disabled?: boolean;
  size?: Size;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'dark';
};

const SecondaryButton: React.FC<Props> = ({ 
  label, 
  onPress, 
  style, 
  labelStyle,
  loading = false, 
  disabled = false,
  size = 'medium',
  icon,
  iconSize = 16,
  iconColor,
  iconPosition = 'right',
  variant = 'default',
}) => {
  const isDisabled = loading || disabled;

  const getIconColor = () => {
    if (iconColor) return iconColor;
    return variant === 'dark' ? COLORS.TEXT_LIGHT : COLORS.TEXT;
  };

  const getTextColor = () => {
    return variant === 'dark' ? COLORS.TEXT_LIGHT : COLORS.TEXT;
  };

  const getSizeStyle = () => {
    return size === 'medium' ? styles.buttonSmall : styles.buttonMedium;
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <Icon 
        name={icon} 
        size={iconSize} 
        color={getIconColor()} 
        style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
      />
    );
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        variant === 'dark' && styles.buttonDark,
        getSizeStyle(),
        style, 
        isDisabled && styles.buttonDisabled
      ]} 
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.buttonContent}>
          {iconPosition === 'left' && renderIcon()}
          <Text style={[styles.label, variant === 'dark' && styles.labelDark, labelStyle]}>{label}</Text>
          {iconPosition === 'right' && renderIcon()}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SecondaryButton;


