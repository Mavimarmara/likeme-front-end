import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

type Props = {
  current: number;
  total: number;
  label?: string;
  color?: string;
  backgroundColor?: string;
  height?: number;
  showRemaining?: boolean;
};

const ProgressBar: React.FC<Props> = ({ 
  current, 
  total, 
  label = "", 
  color = '#0154f8',
  backgroundColor = '#D9D9D9',
  height = 25,
  showRemaining = true,
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  const showLabel = label.trim().length > 0;

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={styles.label}>{label} [ {current}/{total} ]</Text>
      )}
      <View style={[styles.progressContainer, { height }]}>
        {showRemaining ? (
          <View style={[styles.progressBackground, { height, backgroundColor }]}>
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
        ) : (
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
        )}
      </View>
    </View>
  );
};

export default ProgressBar;
