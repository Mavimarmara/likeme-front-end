import React from 'react';
import { View, ViewStyle } from 'react-native';
import { styles } from './styles';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  direction?: 'vertical' | 'horizontal';
};

const ButtonGroup: React.FC<Props> = ({ children, style, direction = 'vertical' }) => {
  const directionStyle = direction === 'horizontal' ? styles.horizontal : styles.vertical;
  return <View style={[styles.container, directionStyle, style]}>{children}</View>;
};

export default ButtonGroup;


