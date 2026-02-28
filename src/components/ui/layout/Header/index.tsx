import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LogoMini } from '@/assets';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IconButton } from '@/components/ui/buttons';
import { styles } from './styles';

const noop = () => undefined;

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
  /** Texto do botão à direita (ex. "Pular"). Quando definido, exibe em vez dos botões de ícone. */
  rightLabel?: string;
  onRightPress?: () => void;
  /** Menu + avatar à esquerda (home). Quando true, exibe pill com ícone de menu e foto do usuário. */
  showMenuWithAvatar?: boolean;
  onMenuPress?: () => void;
  userAvatarUri?: string | null;
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
  rightLabel,
  onRightPress,
  showMenuWithAvatar = false,
  onMenuPress,
  userAvatarUri,
}) => {
  const hasRightLabel = Boolean(rightLabel && onRightPress);
  return (
    <View style={styles.header}>
      {showMenuWithAvatar && onMenuPress && (
        <TouchableOpacity style={styles.menuWithAvatarPill} onPress={onMenuPress} activeOpacity={0.7}>
          <Icon name='menu' size={22} color='#0F1B33' style={styles.menuIcon} />
          {userAvatarUri ? (
            <Image source={{ uri: userAvatarUri }} style={styles.headerAvatar} />
          ) : (
            <View style={styles.headerAvatarPlaceholder}>
              <Icon name='person' size={18} color='#0F1B33' />
            </View>
          )}
        </TouchableOpacity>
      )}
      {!showMenuWithAvatar && showBackButton && (
        <IconButton
          icon='chevron-left'
          onPress={onBackPress ?? noop}
          backgroundSize='medium'
          containerStyle={styles.leftButton}
        />
      )}
      {customLogo || <LogoMini width={87} height={16} />}
      {hasRightLabel && (
        <TouchableOpacity
          style={styles.rightLabelButton}
          onPress={onRightPress}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.rightLabelText}>{rightLabel}</Text>
        </TouchableOpacity>
      )}
      {!hasRightLabel && showBellButton && (
        <IconButton
          icon='notifications'
          onPress={onBellPress ?? noop}
          backgroundSize='medium'
          containerStyle={styles.rightButton}
        />
      )}
      {!hasRightLabel && showCartButton && onCartPress && (
        <IconButton
          icon='shopping-cart'
          onPress={onCartPress}
          backgroundSize='medium'
          containerStyle={styles.rightButton}
        />
      )}
      {!hasRightLabel && showLogoutButton && onLogoutPress && (
        <IconButton icon='logout' onPress={onLogoutPress} backgroundSize='medium' containerStyle={styles.rightButton} />
      )}
      {!hasRightLabel && showRating && (
        <IconButton
          icon='star'
          onPress={onRatingPress ?? noop}
          backgroundSize='medium'
          containerStyle={styles.rightButton}
        />
      )}
    </View>
  );
};

export default Header;
