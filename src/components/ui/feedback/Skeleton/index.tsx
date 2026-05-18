import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import { COLORS } from '@/constants';

type Props = {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  /** Duracao de um ciclo pulse, em ms. Padrao 1200. */
  durationMs?: number;
};

/**
 * Bloco animado para placeholder de conteudo enquanto a UI carrega.
 * Pulse via opacity em useNativeDriver — performance equivalente a `Animated.Value`
 * com transform, mas sem repaint do layout.
 */
const Skeleton: React.FC<Props> = ({ width = '100%', height = 16, borderRadius = 8, style, durationMs = 1200 }) => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: durationMs / 2, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: durationMs / 2, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim, durationMs]);

  return <Animated.View style={[styles.block, { width, height, borderRadius, opacity: pulseAnim }, style]} />;
};

const styles = StyleSheet.create({
  block: {
    backgroundColor: COLORS.NEUTRAL.LOW.LIGHT,
  },
});

export default Skeleton;
