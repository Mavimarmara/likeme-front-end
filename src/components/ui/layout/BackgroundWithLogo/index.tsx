import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import { FirstStepBackground, Logo2 } from '@/assets/auth';
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
  logoImage = Logo2,
}) => {
  const containerStyle = [
    styles.container,
    width !== undefined && { width },
    height !== undefined && { height },
    style,
  ];

  return (
    <View style={containerStyle}>
      <Image source={backgroundImage} style={styles.backgroundImage} resizeMode='cover' />
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logo} resizeMode='contain' />
      </View>
    </View>
  );
};

export default BackgroundWithLogo;
