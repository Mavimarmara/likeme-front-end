import React, { ReactNode } from 'react';
import { View, TouchableOpacity, ImageBackground } from 'react-native';
import { LogoMini, BackgroundIconButton } from '@/assets';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

interface HeaderProps {
  onBackPress?: () => void;
  showBackButton?: boolean;
  onLogoutPress?: () => void;
  showLogoutButton?: boolean;
  onCartPress?: () => void;
  showCartButton?: boolean;
  onBellPress?: () => void;
  showBellButton?: boolean;
  onRatingPress?: () => void;
  showRating?: boolean;
  customLogo?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  onBackPress,
  showBackButton = true,
  onLogoutPress,
  showLogoutButton = false,
  onCartPress,
  showCartButton = false,
  onBellPress,
  showBellButton = false,
  onRatingPress,
  showRating = false,
  customLogo,
}) => {
  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress} activeOpacity={0.7}>
          <ImageBackground
            source={BackgroundIconButton}
            style={styles.backButtonBackground}
            imageStyle={styles.backButtonImage}
          >
            <Icon name='chevron-left' size={18} color='#0F1B33' />
          </ImageBackground>
        </TouchableOpacity>
      )}
      {customLogo || <LogoMini width={87} height={16} />}
      {showBellButton && (
        <TouchableOpacity style={styles.bellButton} onPress={onBellPress} activeOpacity={0.7}>
          <ImageBackground
            source={BackgroundIconButton}
            style={styles.bellButtonBackground}
            imageStyle={styles.bellButtonImage}
          >
            <Icon name='notifications' size={18} color='#0F1B33' />
          </ImageBackground>
        </TouchableOpacity>
      )}
      {showCartButton && onCartPress && (
        <TouchableOpacity style={styles.cartButton} onPress={onCartPress} activeOpacity={0.7}>
          <ImageBackground
            source={BackgroundIconButton}
            style={styles.cartButtonBackground}
            imageStyle={styles.cartButtonImage}
          >
            <Icon name='shopping-cart' size={18} color='#0F1B33' />
          </ImageBackground>
        </TouchableOpacity>
      )}
      {showLogoutButton && onLogoutPress && (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress} activeOpacity={0.7}>
          <ImageBackground
            source={BackgroundIconButton}
            style={styles.logoutButtonBackground}
            imageStyle={styles.logoutButtonImage}
          >
            <Icon name='logout' size={18} color='#0F1B33' />
          </ImageBackground>
        </TouchableOpacity>
      )}
      {showRating && (
        <TouchableOpacity style={styles.ratingButton} onPress={onRatingPress} activeOpacity={0.7}>
          <ImageBackground
            source={BackgroundIconButton}
            style={styles.ratingButtonBackground}
            imageStyle={styles.ratingButtonImage}
          >
            <Icon name='star' size={18} color='#0F1B33' />
          </ImageBackground>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
