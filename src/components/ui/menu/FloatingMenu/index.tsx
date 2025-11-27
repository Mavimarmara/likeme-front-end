import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation();

  const handleHomePress = () => {
    navigation.navigate('Home' as never);
  };

  const isHomeSelected = selectedId === 'home';

  return (
    <View style={styles.container}>
      <View style={styles.menuWrapper}>
        <TouchableOpacity 
          style={[styles.selectedPill, isHomeSelected && styles.selectedPillWithLabel]}
          onPress={handleHomePress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Ir para Home"
        >
          <View style={styles.selectedIconWrapper}>
            <Image source={MenuButtonBackground} style={styles.selectedIcon} resizeMode="contain" />
          </View>
          {isHomeSelected && (
            <Text style={styles.selectedPillLabel}>Home</Text>
          )}
        </TouchableOpacity>

        <View style={styles.actionsPill}>
          {items.map((item) => {
            const isSelected = item.id === selectedId;
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

