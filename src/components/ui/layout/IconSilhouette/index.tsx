import React, { ReactNode } from 'react';
import { ImageBackground, ImageSourcePropType, ViewStyle } from 'react-native';
import { BackgroundIconButton } from '@/assets';
import { styles } from './styles';

export type IconSilhouetteSize = 'small' | 'medium';

export type IconSilhouetteProps = {
  tintColor?: string | readonly string[] | null;
  source?: ImageSourcePropType;
  size?: IconSilhouetteSize;
  style?: ViewStyle;
  children?: ReactNode;
};

const IconSilhouette: React.FC<IconSilhouetteProps> = ({
  tintColor,
  source,
  size = 'medium',
  style,
  children,
}) => {
  const containerSize = size === 'small' ? styles.containerSmall : styles.containerMedium;
  const imageSize = size === 'small' ? styles.imageSmall : styles.imageMedium;
  const singleTint =
    typeof tintColor === 'string'
      ? tintColor
      : Array.isArray(tintColor) && tintColor.length > 0
        ? tintColor[0]
        : undefined;

  return (
    <ImageBackground
      source={source ?? BackgroundIconButton}
      style={[styles.container, containerSize, style]}
      imageStyle={[styles.image, imageSize, singleTint != null && { tintColor: singleTint }]}
    >
      {children}
    </ImageBackground>
  );
};

export default IconSilhouette;
