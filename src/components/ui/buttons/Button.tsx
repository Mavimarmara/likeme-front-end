import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { styles } from './Button.styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  style,
  ...props
}) => {
  const buttonStyle = [styles.base, styles[variant], styles[size], fullWidth && styles.fullWidth, style];

  const textStyle = [styles.text, styles[`${variant}Text`], styles[`${size}Text`]];

  return (
    <TouchableOpacity style={buttonStyle} {...props}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
