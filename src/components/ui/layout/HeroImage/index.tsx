import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const DEFAULT_IMAGE_URI = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400';

export type HeroImageProps = {
  imageUri: string;
  name: string;
  title?: string;
  badges?: string[];
  footer?: React.ReactNode;
};

const HeroImage: React.FC<HeroImageProps> = ({ imageUri, name, title, badges = [], footer }) => {
  const source = { uri: imageUri || DEFAULT_IMAGE_URI };

  return (
    <View style={styles.section}>
      <ImageBackground source={source} style={styles.image} imageStyle={styles.imageStyle}>
        <View style={styles.overlay}>
          <LinearGradient
            colors={['rgba(48, 48, 48, 0)', 'rgba(41, 41, 41, 1)']}
            locations={[0.64, 1]}
            style={styles.gradient}
          />
          <View style={styles.content}>
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
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default HeroImage;
