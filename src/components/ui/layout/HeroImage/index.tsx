import React from 'react';
import { View, Text, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { styles } from './styles';

const DEFAULT_IMAGE_URI = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type HeroImageProps = {
  /** URI da imagem de fundo (hero) */
  imageUri: string;
  /** Modo perfil: nome exibido no overlay (usado em ProviderProfile) */
  name?: string;
  /** Modo perfil: subtítulo opcional */
  title?: string;
  /** Modo perfil: badges no overlay */
  badges?: string[];
  /** Modo perfil: rodapé opcional */
  footer?: React.ReactNode;
  /** Conteúdo customizado no overlay (gradiente + children). Usado em ProductDetails e CommunityScreen. */
  children?: React.ReactNode;
  /** Conteúdo em card no canto inferior direito (ex.: ProductHeroSection). Ignora gradient e overlay de perfil. */
  cardContent?: React.ReactNode;
  /** Altura da seção como fração da tela (0–1). Default 0.6 */
  heightRatio?: number;
  /** Quando informado, a altura é (tela - offsetTop) * heightRatio. Use a altura do header para o hero não ignorar o header. */
  offsetTop?: number;
};

const HeroImage: React.FC<HeroImageProps> = ({
  imageUri,
  name,
  title,
  badges = [],
  footer,
  children,
  cardContent,
  heightRatio = 0.5,
  offsetTop = 0,
}) => {
  const source = { uri: imageUri || DEFAULT_IMAGE_URI };
  const useProfileMode = !children && !cardContent && name != null;
  const useCustomOverlay = Boolean(children);
  const useCardContent = Boolean(cardContent);
  const availableHeight = SCREEN_HEIGHT - offsetTop;
  const sectionHeight = Math.max(0, availableHeight * heightRatio);

  return (
    <View style={[styles.section, { height: sectionHeight }]}>
      <ImageBackground source={source} style={styles.image} imageStyle={styles.imageStyle}>
        {useCardContent ? (
          <View style={styles.cardContainer}>{cardContent}</View>
        ) : (
          <View style={styles.overlay}>
            {(useProfileMode || useCustomOverlay) && (
              <>
                <BlurView intensity={10} tint='dark' style={styles.blur} />
                <LinearGradient
                  colors={['rgba(48, 48, 48, 0)', 'rgba(41, 41, 41, 1)']}
                  locations={[0.64, 1]}
                  style={styles.gradient}
                />
              </>
            )}
            <View style={styles.content}>
              {useProfileMode && (
                <>
                  {badges.length > 0 && (
                    <View style={styles.badgesContainer}>
                      {badges.map((badge, index) => (
                        <View key={index} style={styles.badge}>
                          <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {title ? <Text style={styles.title}>{title}</Text> : null}
                  <Text style={styles.name}>{name}</Text>
                  {footer != null ? <View style={styles.footer}>{footer}</View> : <View style={styles.footer} />}
                </>
              )}
              {useCustomOverlay && children}
            </View>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

export default HeroImage;
