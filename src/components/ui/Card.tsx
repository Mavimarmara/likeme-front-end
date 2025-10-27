import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewProps,
} from 'react-native';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SPACING } from '../../constants';

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

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
  },
  
  // Variants
  default: {
    backgroundColor: COLORS.WHITE,
  },
  elevated: {
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outlined: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  
  // Header
  header: {
    marginBottom: SPACING.SM,
  },
  
  title: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.XS,
  },
  
  subtitle: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_LIGHT,
  },
  
  // Content
  content: {
    flex: 1,
  },
});

export default Card;
