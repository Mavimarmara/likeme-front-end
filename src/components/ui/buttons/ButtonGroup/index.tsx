import React from 'react';
import { View, ViewStyle } from 'react-native';
import { styles } from './styles';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

const ButtonGroup: React.FC<Props> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export default ButtonGroup;


