import React, { useCallback, useRef, useState } from 'react';
import { Image, StyleProp, TouchableOpacity, View, ViewStyle, LayoutChangeEvent } from 'react-native';
import { BlurView } from 'expo-blur';
import {
  styles,
  BLUR_INTENSITY,
  extractBottomRadii,
  getBlurStyle,
  getFooterSectionStyle,
  FOOTER_HEIGHT_THRESHOLD,
} from './styles';

export type BlurCardProps = {
  backgroundImage: string;
  topSection?: React.ReactNode;
  footerSection?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const BlurCard: React.FC<BlurCardProps> = ({ backgroundImage, topSection, footerSection, onPress, style }) => {
  const [footerHeight, setFooterHeight] = useState(0);
  const lastFooterHeight = useRef(0);

  const radii = extractBottomRadii(style);

  const handleFooterLayout = useCallback((e: LayoutChangeEvent) => {
    const newHeight = e.nativeEvent.layout.height;
    if (Math.abs(newHeight - lastFooterHeight.current) > FOOTER_HEIGHT_THRESHOLD) {
      lastFooterHeight.current = newHeight;
      setFooterHeight(newHeight);
    }
  }, []);

  const Wrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress ? { activeOpacity: 0.9, onPress } : {};

  return (
    <Wrapper {...wrapperProps} style={[styles.container, style]}>
      <Image source={{ uri: backgroundImage }} style={styles.backgroundImage} resizeMode='cover' />

      <View style={styles.content}>
        {topSection && <View style={styles.topSection}>{topSection}</View>}

        <View style={[styles.footerSection, getFooterSectionStyle(radii)]}>
          <BlurView intensity={BLUR_INTENSITY} style={getBlurStyle(footerHeight, radii)} />
          <View style={styles.footerContent} onLayout={handleFooterLayout}>
            {footerSection}
          </View>
        </View>
      </View>
    </Wrapper>
  );
};

export default BlurCard;
