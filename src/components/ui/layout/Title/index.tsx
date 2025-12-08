import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

interface TitleProps {
  title: string;
  subtitle?: string | Error | unknown;
  variant?: 'large' | 'medium' | 'small';
  rightAdornment?: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ 
  title, 
  subtitle, 
  variant = 'large',
  rightAdornment,
}) => {
  // Garante que subtitle seja sempre uma string válida
  let subtitleText: string | undefined;
  if (subtitle) {
    if (typeof subtitle === 'string') {
      subtitleText = subtitle;
    } else if (subtitle instanceof Error) {
      subtitleText = subtitle.message || 'Erro desconhecido';
    } else {
      subtitleText = String(subtitle);
    }
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, styles[variant]]}>{title}</Text>
        {rightAdornment && <View style={styles.adornmentWrapper}>{rightAdornment}</View>}
      </View>
      {subtitleText && <Text style={styles.subtitle}>{subtitleText}</Text>}
    </View>
  );
};

export default Title;
