import React from 'react';
import { Platform, View, TouchableOpacity, Text, Image, type ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ColoredTwoDotsIcon } from '@/assets/ui';
import { BlurView } from 'expo-blur';
import { styles } from './styles';

type MenuItem = {
  id: string;
  icon?: string;
  iconImage?: ImageSourcePropType;
  label: string;
  fullLabel?: string;
  onPress: () => void;
};

type Props = {
  items: MenuItem[];
  selectedId?: string;
};

const HOME_MARK_SIZE = 32;
const MENU_VECTOR_SIZE = 20;
const BLUR_INTENSITY = 24;

const FloatingMenu: React.FC<Props> = ({ items, selectedId }) => {
  const navigation = useNavigation();

  const handleHomePress = () => {
    navigation.navigate('Home' as never);
  };

  return (
    <View style={[styles.container]}>
      <BlurView
        intensity={BLUR_INTENSITY}
        tint='light'
        style={styles.blur}
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
      />
      <View style={styles.overlay} />

      <View style={styles.row}>
        <TouchableOpacity
          onPress={handleHomePress}
          activeOpacity={0.8}
          style={[styles.pill, selectedId === 'home' && styles.pillSelected]}
          accessibilityRole='button'
          accessibilityLabel='Home'
        >
          <ColoredTwoDotsIcon width={HOME_MARK_SIZE} height={HOME_MARK_SIZE} />
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
              {item.iconImage != null ? (
                <Image source={item.iconImage} style={styles.menuIconImage} resizeMode='contain' />
              ) : (
                <Icon
                  name={item.icon ?? 'help-outline'}
                  size={MENU_VECTOR_SIZE}
                  color={isSelected ? '#0154F8' : '#001137'}
                />
              )}
              {isSelected && <Text style={styles.pillLabel}>{item.fullLabel || item.label}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default FloatingMenu;
