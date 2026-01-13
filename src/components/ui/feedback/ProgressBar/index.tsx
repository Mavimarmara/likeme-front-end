import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  current: number;
  total: number;
  label: string;
  color?: string;
  height?: number;
};

const ProgressBar: React.FC<Props> = ({ 
  current, 
  total, 
  label, 
  color = '#0154f8',
  height = 25,
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label} [ {current}/{total} ]</Text>
      <View style={[styles.progressContainer, { height }]}>
        <View style={[styles.progressBackground, { height }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${clampedPercentage}%`,
                backgroundColor: color,
                height,
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  label: {
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '700',
    color: '#001137',
    lineHeight: 16,
  },
  progressContainer: {
    width: '100%',
    position: 'relative',
  },
  progressBackground: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 12.5,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 12.5,
  },
});

export default ProgressBar;
