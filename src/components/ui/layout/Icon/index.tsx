import React from 'react';
import { Image, ImageSourcePropType, ImageStyle } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

const DEFAULT_SIZE = 24;

type Props = {
  name?: string;
  size?: number;
  color?: string;
  imageSource?: ImageSourcePropType;
  imageStyle?: ImageStyle;
};

const Icon: React.FC<Props> = ({ name, size = DEFAULT_SIZE, color, imageSource, imageStyle }) => {
  if (imageSource != null) {
    return <Image source={imageSource} style={[styles.image, { width: size, height: size }, imageStyle]} />;
  }
  if (name != null) {
    return <MaterialIcon name={name} size={size} color={color} />;
  }
  return null;
};

export default Icon;
