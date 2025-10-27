import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../../constants';

const { width } = Dimensions.get('window');

interface PresentationPage {
  id: string;
  image: string;
  title: string;
  description: string;
  order: number;
}

interface AppPresentationScreenProps {
  route: {
    params: {
      pages: PresentationPage[];
    };
  };
}

const AppPresentationScreen: React.FC<AppPresentationScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = route.params?.pages || [
    {
      id: '1',
      image: 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=Health+Tracking',
      title: 'So many tips and apps... and self care still feels confusing?',
      description: 'Here, everything that matters is in one place - from health trackers, to wellbeing programs and a curated marketplace.',
      order: 1
    },
    {
      id: '2',
      image: 'https://via.placeholder.com/300x400/FF9800/FFFFFF?text=Wellness+Programs',
      title: 'Personalized wellness programs',
      description: 'Get customized health plans based on your goals, preferences, and medical history.',
      order: 2
    },
    {
      id: '3',
      image: 'https://via.placeholder.com/300x400/2196F3/FFFFFF?text=Health+Community',
      title: 'Connect with health professionals',
      description: 'Access qualified doctors, nutritionists, and wellness coaches in our curated marketplace.',
      order: 3
    }
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigation.navigate('Register' as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Register' as never);
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
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LIKE:ME</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: currentPageData.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.pagination}>
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

        <View style={styles.content}>
          <Text style={styles.title}>{currentPageData.title}</Text>
          <Text style={styles.description}>{currentPageData.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AppPresentationScreen;
