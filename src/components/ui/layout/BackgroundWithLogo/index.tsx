import React from 'react';
import { View, type ImageSourcePropType } from 'react-native';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { FirstStepBackground, LogoFull } from '@/assets/auth';
import { styles } from './styles';

type Props = {
  width?: number;
  height?: number;
  style?: object;
  backgroundImage?: ImageSourcePropType;
  logoImage?: ImageSourcePropType;
};

const BackgroundWithLogo: React.FC<Props> = ({
  width,
  height,
  style,
  backgroundImage = FirstStepBackground,
  logoImage = LogoFull,
}) => {
  const containerStyle = [
    styles.container,
    width !== undefined && { width },
    height !== undefined && { height },
    style,
  ];

  return (
    <View style={containerStyle}>
      <CachedImage source={backgroundImage} style={styles.backgroundImage} />
      <View style={styles.logoContainer}>
        <CachedImage source={logoImage} style={styles.logo} contentFit='contain' />
      </View>
    </View>
  );
};

export default BackgroundWithLogo;
