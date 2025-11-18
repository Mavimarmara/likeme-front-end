import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

type MenuItem = {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
};

type Props = {
  items: MenuItem[];
};

const FloatingMenu: React.FC<Props> = ({ items }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      {isExpanded && (
        <View style={styles.menuItems}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                item.onPress();
                setIsExpanded(false);
              }}
              activeOpacity={0.7}
            >
              <Icon name={item.icon} size={24} color="#000" />
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity
        style={[styles.toggleButton, isExpanded && styles.toggleButtonActive]}
        onPress={toggleMenu}
        activeOpacity={0.8}
      >
        <Icon
          name={isExpanded ? 'close' : 'add'}
          size={28}
          color="#FFF"
        />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingMenu;

