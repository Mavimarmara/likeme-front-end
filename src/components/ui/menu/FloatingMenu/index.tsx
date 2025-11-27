import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MenuButtonBackground } from '@/assets';
import { styles } from './styles';

type MenuItem = {
  id: string;
  icon: string;
  label: string;
  fullLabel?: string;
  onPress: () => void;
};

type Props = {
  items: MenuItem[];
  selectedId?: string;
};

const FloatingMenu: React.FC<Props> = ({ items, selectedId }) => {
  const selectedItem = useMemo(() => {
    return items.find((item) => item.id === selectedId) ?? items[0];
  }, [items, selectedId]);

  return (
    <View style={styles.container}>
      <View style={styles.menuWrapper}>
        <View style={styles.selectedPill}>
          <View style={styles.selectedIconWrapper}>
            <Image source={MenuButtonBackground} style={styles.selectedIcon} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.actionsPill}>
          {items.map((item) => {
            const isSelected = item.id === selectedItem?.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.iconButton, isSelected && styles.iconButtonSelected]}
                onPress={item.onPress}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={item.fullLabel || item.label}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  color={isSelected ? '#0154F8' : '#001137'}
                />
                {isSelected && (
                  <Text style={styles.selectedLabel}>
                    {item.fullLabel || item.label}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default FloatingMenu;

