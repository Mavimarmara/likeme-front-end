import React from 'react';
import { View, Text, TouchableOpacity, ImageSourcePropType, ImageBackground, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

type Props = {
  icon: string;
  iconSize?: number;
  iconColor?: string;
  onPress: () => void;
  label?: string;
  backgroundImage?: ImageSourcePropType;
  backgroundTintColor?: string;
  backgroundColor?: string;
  containerStyle?: ViewStyle;
  iconContainerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
};

const IconButton: React.FC<Props> = ({
  icon,
  iconSize = 24,
  iconColor = '#001137',
  onPress,
  label,
  backgroundImage,
  backgroundTintColor,
  backgroundColor,
  containerStyle,
  iconContainerStyle,
  labelStyle,
  disabled = false,
}) => {
  const renderIcon = () => {
    const iconElement = (
      <Icon name={icon} size={iconSize} color={iconColor} />
    );

    if (backgroundImage) {
      return (
        <ImageBackground
          source={backgroundImage}
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

    if (backgroundColor) {
      return (
        <View style={[styles.iconContainer, { backgroundColor }, iconContainerStyle]}>
          {iconElement}
        </View>
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

