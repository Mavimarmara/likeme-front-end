import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { BackgroundWithGradient } from '@/assets';

const Background: React.FC = () => {
  return <Image source={BackgroundWithGradient} style={styles.background} resizeMode="cover" />;
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});

export default Background;
