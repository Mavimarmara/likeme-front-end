import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PartialLogo, GradientSplash } from '@/assets';
import { styles } from './styles';

const { height } = Dimensions.get('window');

type Props = { navigation: any };

const LoadingScreen: React.FC<Props> = ({ navigation }) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(1)).current;
  const [step, setStep] = useState(0);

  const TAGLINES = ['YOUR RHYTHM', 'YOUR JOURNEY', 'YOUR ROUTINE'];

  useEffect(() => {
    const run = async () => {
      const timing = (anim: Animated.Value, toValue: number, duration: number) =>
        new Promise<void>((resolve) => {
          Animated.timing(anim, { toValue, duration, useNativeDriver: true }).start(() => resolve());
        });
      const delay = (ms: number) => new Promise<void>((r) => setTimeout(() => r(), ms));
      const fadeTagToStep = (next: number, fadeOutMs = 180, fadeInMs = 900) =>
        new Promise<void>((resolve) => {
          Animated.timing(taglineOpacity, { toValue: 0, duration: fadeOutMs, useNativeDriver: true }).start(() => {
            setStep(next);
            Animated.timing(taglineOpacity, { toValue: 1, duration: fadeInMs, useNativeDriver: true }).start(() => resolve());
          });
        });

      await timing(fadeAnim, 1, 300);
      await delay(300);

      await Promise.all([
        timing(scrollAnim, -height / 3, 1200),
        fadeTagToStep(1, 160, 1040),
      ]);
      await delay(240);

      await Promise.all([
        timing(scrollAnim, (-height * 2) / 3, 1200),
        fadeTagToStep(2, 160, 1040),
      ]);

      await delay(360);
      navigation.replace('Unauthenticated');
    };

    const timer = setTimeout(run, 300);
    return () => clearTimeout(timer);
  }, [navigation, scrollAnim, fadeAnim, taglineOpacity]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>        
        <View style={styles.gradientEffect}>
          <Animated.View
            style={[
              styles.scrollContainer,
              {
                transform: [{ translateY: scrollAnim }],
              },
            ]}
          >
                  <GradientSplash style={styles.gradientImage} />
                  <GradientSplash style={styles.gradientImage} />
                  <GradientSplash style={styles.gradientImage} />
          </Animated.View>
        </View>

        <View style={styles.like}>
          <PartialLogo width="100%" height="100%" />
        </View>

        <Animated.View style={[styles.taglineContainer, { opacity: taglineOpacity }]}>
          <Text style={styles.taglineText}>{TAGLINES[step]}</Text>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LoadingScreen;