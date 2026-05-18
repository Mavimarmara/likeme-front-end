import React from 'react';
import { StyleSheet } from 'react-native';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { BackgroundWithGradient } from '@/assets/ui';

const Background: React.FC = () => {
  return <CachedImage source={BackgroundWithGradient} style={styles.background} />;
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
