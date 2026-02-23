import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType, ImageStyle, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '@/constants';
import { IconSilhouette } from '@/components/ui/layout';
import type { IconSilhouetteSize } from '@/components/ui/layout/IconSilhouette';
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
  backgroundSize?: IconSilhouetteSize;
  backgroundSource?: ImageSourcePropType;
  backgroundTintColor?: string | readonly string[];
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
  backgroundSize = 'medium',
  backgroundSource,
  backgroundTintColor,
  containerStyle,
  iconContainerStyle,
}) => {
  const renderIcon = () => {
    const iconElement =
      iconImageSource != null ? (
        <Image source={iconImageSource} style={[styles.iconImage, iconImageStyle]} resizeMode='contain' />
      ) : icon != null ? (
        <Icon name={icon} size={iconSize} color={iconColor} />
      ) : null;

    if (showBackground) {
      return (
        <IconSilhouette
          source={backgroundSource}
          tintColor={backgroundTintColor ?? COLORS.NEUTRAL.HIGH.PURE}
          size={backgroundSize}
          style={iconContainerStyle}
        >
          {iconElement}
        </IconSilhouette>
      );
    }

    return <View style={[styles.iconContainer, iconContainerStyle]}>{iconElement}</View>;
  };

  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress} activeOpacity={0.7}>
      {renderIcon()}
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

export default IconButton;
