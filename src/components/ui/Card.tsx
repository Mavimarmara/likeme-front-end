import React from 'react';
import {
  View,
  Text,
  ViewProps,
} from 'react-native';
import { styles } from './Card.styles';

interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  variant = 'default',
  style,
  ...props
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    style,
  ];

  return (
    <View style={cardStyle} {...props}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
};


export default Card;
