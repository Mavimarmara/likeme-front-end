import React from 'react';
import {
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
  Image,
  type ImageSourcePropType,
  type ImageStyle,
} from 'react-native';
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
  iconImage?: ImageSourcePropType;
  iconImageStyle?: ImageStyle;
  iconSize?: number;
  iconColor?: string;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'dark';
  testID?: string;
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
  iconImage,
  iconImageStyle,
  iconSize = 16,
  iconColor,
  iconPosition = 'right',
  variant = 'default',
  testID,
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
    if (iconImage != null) {
      return (
        <Image
          source={iconImage}
          style={[
            iconPosition === 'left' ? styles.iconLeft : styles.iconRight,
            { width: iconSize, height: iconSize },
            iconImageStyle,
          ]}
          resizeMode='contain'
        />
      );
    }
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
      testID={testID}
      style={[
        styles.button,
        variant === 'dark' && styles.buttonDark,
        getSizeStyle(),
        style,
        isDisabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size='small' color={getTextColor()} />
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
