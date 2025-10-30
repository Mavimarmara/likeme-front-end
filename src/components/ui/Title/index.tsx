import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

interface TitleProps {
  title: string;
  subtitle?: string;
  variant?: 'large' | 'medium' | 'small';
  rightAdornment?: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ 
  title, 
  subtitle, 
  variant = 'large',
  rightAdornment,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, styles[variant]]}>{title}</Text>
        {rightAdornment && <View style={styles.adornmentWrapper}>{rightAdornment}</View>}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

export default Title;
