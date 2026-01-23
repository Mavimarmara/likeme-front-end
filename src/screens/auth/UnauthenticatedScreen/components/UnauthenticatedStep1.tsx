import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, Image } from 'react-native';
import { PrimaryButton, SecondaryButton, ButtonGroup } from '@/components/ui';
import { GradientSplash2, PartialLogo, PartialLogo2 } from '@/assets';
import { styles } from './UnauthenticatedStep1.styles';

interface UnauthenticatedStep1Props {
  onNext: () => void;
  onLogin: () => void;
  isLoading?: boolean;
}

const UnauthenticatedStep1: React.FC<UnauthenticatedStep1Props> = ({
  onNext,
  onLogin,
  isLoading = false,
}) => {
  const { width } = Dimensions.get('window');
  const slideLeft = useRef(new Animated.Value(0)).current;
  const slideRight = useRef(new Animated.Value(width * 0.5)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideLeft, {
        toValue: -59,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.timing(slideRight, {
        toValue: 89,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsOpacity, {
        toValue: 1,
        duration: 420,
        delay: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideLeft, slideRight, bgOpacity, buttonsOpacity]);
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, { opacity: bgOpacity }]}>
        <Image source={GradientSplash2} />
      </Animated.View>

      <Animated.View style={[styles.buttonContainer, { opacity: buttonsOpacity }]}>
        <ButtonGroup>
          <PrimaryButton label="Next" onPress={onNext} disabled={isLoading} />
          <SecondaryButton label="Login" onPress={onLogin} loading={isLoading} />
        </ButtonGroup>
      </Animated.View>

      <View style={styles.logoContainer}>
        <Animated.View style={[styles.logoOverlay, { transform: [{ translateX: slideLeft }] }]}>
          <PartialLogo width={170} height={54} />
        </Animated.View>
        <Animated.View style={[styles.logoOverlay, { transform: [{ translateX: slideRight }] }]}>
          <PartialLogo2 width={170} height={54} />
        </Animated.View>
      </View>

      <View style={styles.taglineContainer}>
        <Text style={styles.taglineText}>LIKE YOUR LIFE</Text>
      </View>
    </View>
  );
};

export default UnauthenticatedStep1;
