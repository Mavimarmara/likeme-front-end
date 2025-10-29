import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PartialLogo, GradientEffect } from '@/assets';
import { styles } from './styles';

const { height } = Dimensions.get('window');

type Props = { navigation: any };

const LoadingScreen: React.FC<Props> = ({ navigation }) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scrollAnim, {
          toValue: -height / 3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.delay(800),
        Animated.timing(scrollAnim, {
          toValue: (-height * 2) / 3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.delay(800),
        Animated.timing(scrollAnim, {
          toValue: -height,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.navigate('Unauthenticated');
      });
    };

    const timer = setTimeout(startAnimation, 300);
    return () => clearTimeout(timer);
  }, [navigation, scrollAnim, fadeAnim]);

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
                  <Image
                    source={GradientEffect}
                    style={styles.gradientImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={GradientEffect}
                    style={styles.gradientImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={GradientEffect}
                    style={styles.gradientImage}
                    resizeMode="cover"
                  />
          </Animated.View>
        </View>

        <View style={styles.like}>
          <PartialLogo width="100%" height="100%" />
        </View>

        <View style={styles.dots} />

        <View style={styles.taglineContainer}>
          <Text style={styles.taglineText}>YOUR RHYTHM</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LoadingScreen;