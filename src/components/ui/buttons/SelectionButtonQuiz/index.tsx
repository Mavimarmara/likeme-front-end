import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, GestureResponderEvent, ViewStyle, TextStyle, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '@/constants';
import { styles } from './styles';

export type SelectionButtonQuizSize = 'small' | 'medium';
export type SelectionButtonQuizVariant = 'default' | 'profile';

export type SelectionButtonQuizProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  selected?: boolean;
  size?: SelectionButtonQuizSize;
  variant?: SelectionButtonQuizVariant;
  icon?: string;
  iconSize?: number;
  iconRight?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  labelStyle?: TextStyle | TextStyle[];
  disabled?: boolean;
};

const SelectionButtonQuiz: React.FC<SelectionButtonQuizProps> = ({
  label,
  onPress,
  selected = false,
  size = 'medium',
  variant = 'default',
  icon,
  iconSize = 24,
  iconRight,
  style,
  labelStyle,
  disabled = false,
}) => {
  const isProfileVariant = variant === 'profile';
  const iconColor = selected ? COLORS.TEXT : isProfileVariant ? COLORS.PRIMARY.MEDIUM : COLORS.NEUTRAL.LOW.DARK;
  const sizeStyle = isProfileVariant
    ? styles.buttonProfile
    : size === 'small'
    ? styles.buttonSmall
    : styles.buttonMedium;
  const labelSizeStyle = isProfileVariant
    ? styles.labelProfile
    : size === 'small'
    ? styles.labelSmall
    : styles.labelMedium;
  const stateStyle = isProfileVariant
    ? selected
      ? styles.buttonProfileSelected
      : styles.buttonProfileDefault
    : selected
    ? styles.buttonSelected
    : styles.buttonDefault;
  const labelStateStyle = isProfileVariant
    ? selected
      ? styles.labelProfileSelected
      : styles.labelProfileDefault
    : selected
    ? styles.labelSelected
    : styles.labelDefault;

  return (
    <TouchableOpacity
      style={[styles.button, sizeStyle, stateStyle, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole='button'
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <View style={styles.buttonContent}>
        <View style={styles.buttonContentLeft}>
          {icon != null && <Icon name={icon} size={iconSize} color={iconColor} style={styles.iconLeft} />}
          <Text style={[styles.label, labelSizeStyle, labelStateStyle, labelStyle]} numberOfLines={2}>
            {label}
          </Text>
        </View>
        {iconRight != null && <View style={styles.iconRight}>{iconRight}</View>}
      </View>
    </TouchableOpacity>
  );
};

export default SelectionButtonQuiz;
