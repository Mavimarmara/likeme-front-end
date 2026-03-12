import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DEFAULT_BACKGROUND_GRADIENT } from '@/constants';

const VERTICAL_START = { x: 0.5, y: -0.5 };
const VERTICAL_END = { x: 0.5, y: 1 };

type Props = {
  colors?: readonly [string, string, ...string[]] | null;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
};

const GradientBackground: React.FC<Props> = ({
  colors = DEFAULT_BACKGROUND_GRADIENT,
  start = VERTICAL_START,
  end = VERTICAL_END,
}) => <LinearGradient colors={colors ?? DEFAULT_BACKGROUND_GRADIENT} start={start} end={end} style={styles.gradient} />;

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});

export default GradientBackground;
