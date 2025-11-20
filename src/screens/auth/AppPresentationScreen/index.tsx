import React, { useMemo, useState } from 'react';
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
import { useAuthLogin } from '@/hooks';
import { styles } from './styles';

const { width } = Dimensions.get('window');

type Props = { navigation: any };

const AppPresentationScreen: React.FC<Props> = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { handleLogin, isLoading } = useAuthLogin(navigation);

  const pages = useMemo(() => PRESENTATION_PAGES, []);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      handleLogin();
    }
  };

  const handleSkip = () => {
    handleLogin();
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
                isLoading && styles.skipButtonDisabled,
              ]}
              onPress={handleSkip}
              disabled={isLoading}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.nextButton,
                isLoading && styles.nextButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={isLoading}
            >
              <Text style={styles.nextButtonText}>›</Text>
            </TouchableOpacity>
          </View>
      </View>
    </SafeAreaView>
  );
};

export default AppPresentationScreen;
