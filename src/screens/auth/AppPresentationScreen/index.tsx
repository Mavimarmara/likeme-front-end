import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui';
import { PRESENTATION_PAGES } from '@/constants/presentation';
import { styles } from './styles';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { AuthService } from '@/services';

const { width } = Dimensions.get('window');

type Props = { navigation: any };

const AppPresentationScreen: React.FC<Props> = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const pages = useMemo(() => PRESENTATION_PAGES, []);

  const startAuthFlow = useCallback(async () => {
    if (isAuthenticating) {
      return;
    }
    setIsAuthenticating(true);
    try {
      await AuthService.login();
    } catch (error) {
      console.error('Presentation login error:', error);
      setIsAuthenticating(false);
    }
  }, [isAuthenticating]);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      startAuthFlow();
    }
  };

  const handleSkip = () => {
    startAuthFlow();
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      navigation.goBack();
    }
  };

  const currentPageData = pages[currentPage];

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={handleBack} />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={currentPageData.image}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={[styles.pagination, styles.paginationAligned]}>
            {pages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentPage ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{currentPageData.title}</Text>
          <Text style={styles.description}>{currentPageData.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
          <View style={styles.footerActions}>
            <TouchableOpacity 
              style={[
                styles.skipButton,
                isAuthenticating && styles.skipButtonDisabled,
              ]}
              onPress={handleSkip}
              disabled={isAuthenticating}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.nextButton,
                isAuthenticating && styles.nextButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={isAuthenticating}
            >
              <Text style={styles.nextButtonText}>›</Text>
            </TouchableOpacity>
          </View>
      </View>
    </SafeAreaView>
  );
};

export default AppPresentationScreen;
