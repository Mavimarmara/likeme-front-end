import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { RightArrow, LogoMini } from '@/assets';
import { styles } from './styles';

interface HeaderProps {
  onBackPress?: () => void;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onBackPress, 
  showBackButton = true 
}) => {
  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <RightArrow width={24} height={24} />
        </TouchableOpacity>
      )}
      <LogoMini width={87} height={16} />
    </View>
  );
};

export default Header;
