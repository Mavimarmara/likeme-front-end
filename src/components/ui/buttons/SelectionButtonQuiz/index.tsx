import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, GestureResponderEvent, ViewStyle, TextStyle, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '@/constants';
import { styles } from './styles';

export type SelectionButtonQuizSize = 'small' | 'medium';

export type SelectionButtonQuizProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  selected?: boolean;
  size?: SelectionButtonQuizSize;
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
  icon,
  iconSize = 24,
  iconRight,
  style,
  labelStyle,
  disabled = false,
}) => {
  const iconColor = selected ? COLORS.TEXT : COLORS.NEUTRAL.LOW.DARK;
  const sizeStyle = size === 'small' ? styles.buttonSmall : styles.buttonMedium;
  const labelSizeStyle = size === 'small' ? styles.labelSmall : styles.labelMedium;

  return (
    <TouchableOpacity
      style={[styles.button, sizeStyle, selected ? styles.buttonSelected : styles.buttonDefault, style]}
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
          <Text
            style={[styles.label, labelSizeStyle, selected ? styles.labelSelected : styles.labelDefault, labelStyle]}
            numberOfLines={2}
          >
            {label}
          </Text>
        </View>
        {iconRight != null && <View style={styles.iconRight}>{iconRight}</View>}
      </View>
    </TouchableOpacity>
  );
};

export default SelectionButtonQuiz;
