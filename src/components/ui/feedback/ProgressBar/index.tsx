import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants';
import { styles } from './styles';

type Props = {
  current: number;
  total: number;
  label?: string;
  color?: string;
  gradientColors?: readonly [string, string, ...string[]];
  backgroundColor?: string;
  height?: number;
  showRemaining?: boolean;
};

const ProgressBar: React.FC<Props> = ({ 
  current, 
  total, 
  label = "", 
  color = COLORS.PRIMARY.PURE,
  gradientColors,
  backgroundColor = COLORS.NEUTRAL.LOW.LIGHT,
  height = 25,
  showRemaining = true,
}) => {
  const percentage = useMemo(() => {
    if (total <= 0) return 0;
    return Math.min(Math.max((current / total) * 100, 0), 100);
  }, [current, total]);

  const showLabel = useMemo(() => label.trim().length > 0, [label]);
  const useGradient = useMemo(() => 
    gradientColors !== undefined && gradientColors.length > 0, 
    [gradientColors]
  );

  const fillStyle = useMemo(() => ({
    width: `${percentage}%` as const,
    height,
  }), [percentage, height]);

  const renderProgressFill = () => {
    if (useGradient && gradientColors) {
      return (
        <LinearGradient
          colors={[...gradientColors]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.progressFill, fillStyle]}
        />
      );
    }

    return (
      <View 
        style={[
          styles.progressFill, 
          fillStyle,
          { backgroundColor: color }
        ]} 
      />
    );
  };

  return (
    <View style={styles.container}>
      {showLabel && (
      <Text style={styles.label}>{label} [ {current}/{total} ]</Text>
      )}
      <View style={[styles.progressContainer, { height }]}>
        {showRemaining ? (
          <View style={[styles.progressBackground, { height, backgroundColor }]}>
            {renderProgressFill()}
        </View>
        ) : (
          renderProgressFill()
        )}
      </View>
    </View>
  );
};

export default ProgressBar;
