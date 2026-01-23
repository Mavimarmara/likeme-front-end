import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackgroundIconButton } from '@/assets';
import { COLORS } from '@/constants';
import { styles } from './styles';

type Props = {
  icon: string;
  iconSize?: number;
  iconColor?: string;
  onPress: () => void;
  label?: string;
  showBackground?: boolean;
  backgroundTintColor?: string;
  containerStyle?: ViewStyle;
  iconContainerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
};

const IconButton: React.FC<Props> = ({
  icon,
  iconSize = 24,
  iconColor = COLORS.TEXT,
  onPress,
  label,
  showBackground = true,
  backgroundTintColor,
  containerStyle,
  iconContainerStyle,
  labelStyle,
  disabled = false,
}) => {
  const renderIcon = () => {
    const iconElement = (
      <Icon name={icon} size={iconSize} color={iconColor} />
    );

    if (showBackground) {
      return (
        <ImageBackground
          source={BackgroundIconButton}
          style={[styles.iconBackground, iconContainerStyle]}
          imageStyle={[
            styles.iconBackgroundImage,
            backgroundTintColor && { tintColor: backgroundTintColor },
          ]}
        >
          {iconElement}
        </ImageBackground>
      );
    }

    return (
      <View style={[styles.iconContainer, iconContainerStyle]}>
        {iconElement}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {renderIcon()}
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default IconButton;

