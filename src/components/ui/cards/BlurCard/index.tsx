import React, { useState, useMemo } from 'react';
import { View, Image, TouchableOpacity, LayoutChangeEvent, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { styles, getBlurStyle, getFooterSectionStyle } from './styles';

type FooterSection = {
  component: React.ReactNode;
  height?: number;
};

type BlurCardStyle = ViewStyle & {
  blurIntensity?: number;
  blurTint?: 'light' | 'dark' | 'default';
};

type Props = {
  backgroundImage: string;
  topSection?: React.ReactNode;
  footerSection: FooterSection;
  onPress?: () => void;
  style?: StyleProp<BlurCardStyle>;
};

const DEFAULT_BORDER_RADIUS = 22;
const DEFAULT_BLUR_INTENSITY = 30;
const DEFAULT_BLUR_TINT: 'light' | 'dark' | 'default' = 'dark';

const BlurCard: React.FC<Props> = ({
  backgroundImage,
  topSection,
  footerSection,
  onPress,
  style,
}) => {
  const [footerHeight, setFooterHeight] = useState(footerSection.height || 0);

  const handleFooterLayout = (event: LayoutChangeEvent) => {
    const { height: measuredHeight } = event.nativeEvent.layout;
    if (measuredHeight > 0 && measuredHeight !== footerHeight) {
      setFooterHeight(measuredHeight);
    }
  };

  // Extrai propriedades do style de forma segura
  const styleProps = useMemo(() => {
    if (!style) {
      return {
        borderRadius: DEFAULT_BORDER_RADIUS,
        blurIntensity: DEFAULT_BLUR_INTENSITY,
        blurTint: DEFAULT_BLUR_TINT,
      };
    }
    
    const styleObj = Array.isArray(style) 
      ? Object.assign({}, ...style.filter(Boolean))
      : style;
    
    const blurStyle = styleObj as BlurCardStyle;
    
    return {
      borderRadius: blurStyle.borderRadius || DEFAULT_BORDER_RADIUS,
      blurIntensity: blurStyle.blurIntensity || DEFAULT_BLUR_INTENSITY,
      blurTint: blurStyle.blurTint || DEFAULT_BLUR_TINT,
    };
  }, [style]);

  const { borderRadius, blurIntensity, blurTint } = styleProps;

  const blurStyle = useMemo(() => 
    getBlurStyle(footerHeight, borderRadius), 
    [footerHeight, borderRadius]
  );

  // Remove propriedades customizadas do style antes de aplicar
  const containerStyle = useMemo(() => {
    if (!style) return styles.container;
    
    const styleObj = Array.isArray(style) 
      ? Object.assign({}, ...style.filter(Boolean))
      : style;
    
    const { blurIntensity: _, blurTint: __, ...restStyle } = styleObj as BlurCardStyle;
    
    return [styles.container, restStyle];
  }, [style]);

  const footerSectionStyle = useMemo(() => 
    getFooterSectionStyle(borderRadius), 
    [borderRadius]
  );

  const content = (
    <View style={containerStyle}>
      <Image
        source={{ uri: backgroundImage }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        {topSection && (
          <View style={styles.topSection}>
            {topSection}
          </View>
        )}

        <BlurView 
          intensity={blurIntensity} 
          tint={blurTint} 
          style={blurStyle}
        />
        
        <View 
          style={[styles.footerSection, footerSectionStyle]}
          onLayout={handleFooterLayout}
        >
          <View style={styles.footerContent}>
            {footerSection.component}
          </View>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default BlurCard;
export type { FooterSection, Props as BlurCardProps };

