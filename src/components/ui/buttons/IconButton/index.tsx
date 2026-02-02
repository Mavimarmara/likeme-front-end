import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ImageSourcePropType,
  ImageStyle,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackgroundIconButton } from '@/assets';
import { COLORS } from '@/constants';
import { styles } from './styles';

type Props = {
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  iconImageSource?: ImageSourcePropType;
  iconImageStyle?: ImageStyle;
  onPress: () => void;
  label?: string;
  showBackground?: boolean;
  backgroundSource?: ImageSourcePropType;
  backgroundTintColor?: string;
  backgroundImageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
  iconContainerStyle?: ViewStyle;
};

const IconButton: React.FC<Props> = ({
  icon,
  iconSize = 24,
  iconColor = COLORS.TEXT,
  iconImageSource,
  iconImageStyle,
  onPress,
  label,
  showBackground = true,
  backgroundSource,
  backgroundTintColor,
  backgroundImageStyle,
  containerStyle,
  iconContainerStyle,
}) => {
  const renderIcon = () => {
    const iconElement =
      iconImageSource != null ? (
        <Image source={iconImageSource} style={[styles.iconImage, iconImageStyle]} resizeMode="contain" />
      ) : icon != null ? (
        <Icon name={icon} size={iconSize} color={iconColor} />
      ) : null;

    if (showBackground) {
      const source = backgroundSource ?? BackgroundIconButton;
      return (
        <ImageBackground
          source={source}
          style={[styles.iconBackground, iconContainerStyle]}
          imageStyle={[
            styles.iconBackgroundImage,
            backgroundImageStyle,
            backgroundTintColor && { tintColor: backgroundTintColor },
          ]}
        >
          {iconElement}
        </ImageBackground>
      );
    }

    return <View style={[styles.iconContainer, iconContainerStyle]}>{iconElement}</View>;
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {renderIcon()}
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

export default IconButton;
