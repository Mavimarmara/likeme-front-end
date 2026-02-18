import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

interface TitleProps {
  title: string;
  variant?: 'large' | 'medium' | 'small';
}

const Title: React.FC<TitleProps> = ({ title, variant = 'large' }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles[variant]]}>{title}</Text>
    </View>
  );
};

export default Title;
