import React from 'react';
import { View, Text, TouchableOpacity, ImageSourcePropType, ImageStyle, ViewStyle } from 'react-native';
import { COLORS } from '@/constants';
import { Icon, IconSilhouette } from '@/components/ui/layout';
import type { IconSilhouetteSize } from '@/components/ui/layout/IconSilhouette';
import { styles } from './styles';

type SizeDefaults = { iconSize: number; iconColor: string };

const SIZE_DEFAULTS: Partial<Record<IconSilhouetteSize, SizeDefaults>> = {
  medium: { iconSize: 18, iconColor: '#0F1B33' },
};

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

const IconButton: React.FC<Props> = (props) => {
  const {
    icon,
    iconImageSource,
    iconImageStyle,
    onPress,
    label,
    showBackground = true,
    backgroundSize = 'large',
    backgroundSource,
    backgroundTintColor,
    containerStyle,
    iconContainerStyle,
  } = props;

  const defaults = SIZE_DEFAULTS[backgroundSize];
  const iconSize = props.iconSize ?? defaults?.iconSize;
  const iconColor = props.iconColor ?? defaults?.iconColor ?? COLORS.TEXT;

  const iconElement = (
    <Icon name={icon} size={iconSize} color={iconColor} imageSource={iconImageSource} imageStyle={iconImageStyle} />
  );

  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress} activeOpacity={0.7}>
      {showBackground ? (
        <IconSilhouette
          source={backgroundSource}
          tintColor={backgroundTintColor ?? COLORS.NEUTRAL.HIGH.PURE}
          size={backgroundSize}
          style={iconContainerStyle}
        >
          {iconElement}
        </IconSilhouette>
      ) : (
        <View style={[styles.iconContainer, iconContainerStyle]}>{iconElement}</View>
      )}
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

export default IconButton;
