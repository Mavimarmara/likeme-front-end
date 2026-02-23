import React, { useState, useMemo } from 'react';
import { View, Image, TouchableOpacity, LayoutChangeEvent, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { styles, getBlurStyle, getFooterSectionStyle, extractBorderRadius, BLUR_INTENSITY } from './styles';

type FooterSection = {
  component: React.ReactNode;
};

type Props = {
  backgroundImage: string;
  topSection?: React.ReactNode;
  footerSection: FooterSection;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const BlurCard: React.FC<Props> = ({ backgroundImage, topSection, footerSection, onPress, style }) => {
  const [footerHeight, setFooterHeight] = useState(0);

  const handleFooterLayout = (event: LayoutChangeEvent) => {
    const { height: measuredHeight } = event.nativeEvent.layout;
    if (measuredHeight > 0 && measuredHeight !== footerHeight) {
      setFooterHeight(measuredHeight);
    }
  };

  const borderRadius = useMemo(() => extractBorderRadius(style), [style]);

  const blurStyle = useMemo(() => getBlurStyle(footerHeight, borderRadius), [footerHeight, borderRadius]);

  const containerStyle = useMemo(() => {
    if (!style) {
      return styles.container;
    }
    return [styles.container, style];
  }, [style]);

  const footerSectionStyle = useMemo(() => getFooterSectionStyle(borderRadius), [borderRadius]);

  const content = (
    <View style={containerStyle}>
      <Image source={{ uri: backgroundImage }} style={styles.backgroundImage} resizeMode='cover' />

      <View style={styles.content}>
        {topSection && <View style={styles.topSection}>{topSection}</View>}

        <BlurView intensity={BLUR_INTENSITY} style={blurStyle} />

        <View style={[styles.footerSection, footerSectionStyle]} onLayout={handleFooterLayout}>
          <View style={styles.footerContent}>{footerSection.component}</View>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default BlurCard;
export type { FooterSection, Props as BlurCardProps };
