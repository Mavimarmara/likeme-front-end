import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ColoredTwoDotsIcon } from '@/assets/ui';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

  const handleHomePress = () => {
    navigation.navigate('Home' as never);
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <BlurView intensity={10} tint='light' style={styles.blur} />
      <View style={styles.overlay} />

      <View style={styles.row}>
        <TouchableOpacity
          onPress={handleHomePress}
          activeOpacity={0.8}
          style={[styles.pill, selectedId === 'home' && styles.pillSelected]}
          accessibilityRole='button'
          accessibilityLabel='Home'
        >
          <ColoredTwoDotsIcon width={20} height={20} />
          {selectedId === 'home' && <Text style={styles.pillLabel}>Home</Text>}
        </TouchableOpacity>

        {items.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.pill, isSelected && styles.pillSelected]}
              onPress={item.onPress}
              activeOpacity={0.8}
              accessibilityRole='button'
              accessibilityLabel={item.fullLabel || item.label}
            >
              <Icon name={item.icon} size={20} color={isSelected ? '#0154F8' : '#001137'} />
              {isSelected && <Text style={styles.pillLabel}>{item.fullLabel || item.label}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default FloatingMenu;
