import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

interface TitleProps {
  title: string;
  subtitle?: string;
  variant?: 'large' | 'medium' | 'small';
}

const Title: React.FC<TitleProps> = ({ 
  title, 
  subtitle, 
  variant = 'large' 
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles[variant]]}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

export default Title;
