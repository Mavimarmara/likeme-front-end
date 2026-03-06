import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { styles } from './styles';

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  /** Opcional: ícone à esquerda do label (ex.: IconSilhouette) */
  icon?: ReactNode;
  style?: ViewStyle | ViewStyle[];
};

const FilterModalButton: React.FC<Props> = ({ label, selected = false, onPress, icon, style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, selected && styles.buttonSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content} pointerEvents='box-none'>
        {icon != null && (
          <View style={styles.iconWrapper} pointerEvents='none'>
            {icon}
          </View>
        )}
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FilterModalButton;
