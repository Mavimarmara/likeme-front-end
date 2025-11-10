import React from 'react';
import { View, TouchableOpacity, ImageBackground } from 'react-native';
import { LogoMini, BackgroundIconButton } from '@/assets';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
          <ImageBackground
            source={BackgroundIconButton}
            style={styles.backButtonBackground}
            imageStyle={styles.backButtonImage}
          >
            <Icon name="chevron-left" size={18} color="#0F1B33" />
          </ImageBackground>
        </TouchableOpacity>
      )}
      <LogoMini width={87} height={16} />
    </View>
  );
};

export default Header;
