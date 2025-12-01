import React from 'react';
import { Text, TouchableOpacity, GestureResponderEvent, ViewStyle, ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  iconPosition?: 'left' | 'right';
};

const SecondaryButton: React.FC<Props> = ({ 
  label, 
  onPress, 
  style, 
  loading = false, 
  disabled = false,
  icon,
  iconSize = 16,
  iconColor = '#001137',
  iconPosition = 'right',
}) => {
  const isDisabled = loading || disabled;

  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <Icon 
        name={icon} 
        size={iconSize} 
        color={iconColor} 
        style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
      />
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.button, style, isDisabled && styles.buttonDisabled]} 
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#001137" />
      ) : (
        <View style={styles.buttonContent}>
          {iconPosition === 'left' && renderIcon()}
          <Text style={styles.label}>{label}</Text>
          {iconPosition === 'right' && renderIcon()}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SecondaryButton;


