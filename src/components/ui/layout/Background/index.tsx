import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { BackgroundWithGradient } from '@/assets';

const Background: React.FC = () => {
  return (
    <Image
      source={BackgroundWithGradient}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    />
  );
};

export default Background;

