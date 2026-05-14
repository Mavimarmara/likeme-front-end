import React, { useMemo } from 'react';
import { View, Text, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlatformBlurView } from '@/components/ui/PlatformBlurView';
import { styles } from './styles';

const DEFAULT_IMAGE_URI = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type HeroImageProps = {
  imageUri: string;
  name?: string;
  title?: string;
  badges?: string[];
  footer?: React.ReactNode;
  children?: React.ReactNode;
  cardContent?: React.ReactNode;
  heightRatio?: number;
  offsetTop?: number;
};

const HeroImage = ({
  imageUri,
  name,
  title,
  badges = [],
  footer,
  children,
  cardContent,
  heightRatio = 0.5,
  offsetTop = 0,
}: HeroImageProps) => {
  const source = useMemo(() => ({ uri: imageUri || DEFAULT_IMAGE_URI }), [imageUri]);

  const profileMode = !children && !cardContent;
  const customOverlay = Boolean(children);
  const cardMode = Boolean(cardContent);

  const shouldRenderOverlay = profileMode || customOverlay;
  const shouldRenderCard = cardMode;

  const availableHeight = SCREEN_HEIGHT - offsetTop;
  const sectionHeight = Math.max(0, availableHeight * heightRatio);
  const sectionStyle = { height: sectionHeight };

  return (
    <View style={[styles.section, sectionStyle]}>
      <ImageBackground source={source} style={styles.image} imageStyle={styles.imageStyle}>
        {shouldRenderCard ? (
          <View style={styles.cardContainer}>{cardContent}</View>
        ) : (
          <View style={styles.overlay}>
            <View style={styles.bottomBlock}>
              {shouldRenderOverlay && (
                <View style={styles.effectsContainer}>
                  <PlatformBlurView intensity={10} tint='dark' style={styles.blur} />
                  <LinearGradient
                    colors={['rgba(48, 48, 48, 0)', 'rgba(41, 41, 41, 1)']}
                    locations={[0.64, 1]}
                    style={styles.gradient}
                  />
                </View>
              )}
              <View style={styles.content}>
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
                {customOverlay && children}
              </View>
            </View>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

export default HeroImage;
